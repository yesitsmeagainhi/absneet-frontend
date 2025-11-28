// src/screens/Content/VideoPlayerScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';

import { RootStackParamList } from '../../navigation/RootNavigator';
// 🔥 React-Native-Firebase Firestore instance
import { db } from '../../services/firebase.native';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

// ── helpers ─────────────────────────────────────────────────────────

function getDriveId(input?: string | null): string {
    try {
        if (!input) return '';
        let s = input.trim();
        if (!/^https?:\/\//i.test(s)) s = `https://${s}`;

        const u: any = new (URL as any)(s);
        const m = u.pathname.match(/\/file\/d\/([^/]+)/);
        return (m && m[1]) || u.searchParams.get('id') || '';
    } catch {
        return '';
    }
}

type Playable =
    | {
        mode: 'drive';
        direct: string;
        preview: string;
        baseUrl: string;
    }
    | {
        mode: 'yt';
        url: string;
        baseUrl: string;
    }
    | {
        mode: 'page';
        url: string;
        baseUrl: string;
    }
    | {
        mode: 'unknown';
        url: string;
        baseUrl: string;
    };

function toPlayable(raw?: string | null): Playable {
    if (!raw) return { mode: 'unknown', url: '', baseUrl: 'https://localhost' };

    let s = raw.trim();
    if (!/^https?:\/\//i.test(s)) s = `https://${s}`;

    try {
        const u: any = new (URL as any)(s);
        const host = (u.hostname || '').toLowerCase();

        // Google Drive
        if (host.includes('drive.google.com') || host.includes('docs.google.com')) {
            const id = getDriveId(s);
            if (id) {
                return {
                    mode: 'drive',
                    direct: `https://drive.google.com/uc?export=download&id=${id}`,
                    preview: `https://drive.google.com/file/d/${id}/preview?autoplay=1&mute=1`,
                    baseUrl: 'https://drive.google.com',
                };
            }
        }

        // YouTube
        if (host.includes('youtube.com') || host.includes('youtu.be')) {
            let vid = '';
            const pathname: string = u.pathname || '';
            if (host.includes('youtu.be')) vid = pathname.slice(1);
            else if (pathname.startsWith('/shorts/')) vid = pathname.split('/')[2] || '';
            else if (pathname.startsWith('/embed/')) vid = pathname.split('/')[2] || '';
            else vid = u.searchParams.get('v') || '';

            if (vid) {
                return {
                    mode: 'yt',
                    url: `https://www.youtube-nocookie.com/embed/${vid}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`,
                    baseUrl: 'https://www.youtube-nocookie.com',
                };
            }
        }

        // Other URLs – open as-is
        return { mode: 'page', url: s, baseUrl: u.origin || 'https://localhost' };
    } catch {
        return { mode: 'page', url: s, baseUrl: 'https://localhost' };
    }
}

function htmlIframe(src: string): string {
    return `<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<style>
  html,body{margin:0;height:100%;background:#000}
  #wrap{position:fixed;inset:0}
  iframe{width:100%;height:100%;border:0;background:#000}
</style></head>
<body><div id="wrap">
<iframe src="${src}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>
</div></body></html>`;
}

function htmlVideo(src: string): string {
    return `<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<style>
  html,body{margin:0;height:100%;background:#000}
  #wrap{position:fixed;inset:0;display:flex;align-items:center;justify-content:center}
  video{width:100%;height:100%;background:#000}
  #loader{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-family:system-ui, Arial}
</style></head>
<body>
  <div id="wrap">
    <div id="loader">Loading…</div>
    <video id="v" controls playsinline autoplay muted>
      <source src="${src}">
    </video>
  </div>
  <script>
    const v = document.getElementById('v');
    const loader = document.getElementById('loader');
    const show = () => { if (loader) loader.style.display='flex'; };
    const hide = () => { if (loader) loader.style.display='none'; };
    v.addEventListener('canplay', () => { hide(); });
    v.addEventListener('waiting', show);
    v.addEventListener('playing', hide);
  </script>
</body></html>`;
}

// ── component ───────────────────────────────────────────────────────

export default function VideoPlayerScreen({ route }: Props) {
    /**
     * Params:
     * - url       → optional direct URL (old behaviour)
     * - chapterId → Firestore `nodes` doc id for the chapter
     * - videoId   → optional id inside chapter.videos[] to pick specific video
     */
    const { url: initialUrl, chapterId, videoId, title: initialTitle } = route.params as any;

    if (__DEV__) {
        console.log('[VideoPlayer] route params =', route.params);
    }

    const [resolvedUrl, setResolvedUrl] = useState<string | null>(initialUrl ?? null);
    const [videoTitle, setVideoTitle] = useState<string>(initialTitle ?? '');
    const [metaLoading, setMetaLoading] = useState<boolean>(!initialUrl && !!chapterId);
    const [metaError, setMetaError] = useState<string | null>(null);

    // 🔥 Fetch video URL from Firestore when only chapterId/videoId is provided
    useEffect(() => {
        const fetchFromChapter = async () => {
            if (initialUrl || !chapterId) {
                if (__DEV__) {
                    console.log(
                        '[VideoPlayer] Skipping Firestore fetch. initialUrl =',
                        initialUrl,
                        'chapterId =',
                        chapterId,
                    );
                }
                return;
            }

            try {
                setMetaLoading(true);
                setMetaError(null);

                if (__DEV__) {
                    console.log('[VideoPlayer] Fetching chapter doc from Firestore. chapterId =', chapterId);
                }

                const snap = await db.collection('nodes').doc(chapterId).get();

                if (!snap.exists) {
                    if (__DEV__) {
                        console.log('[VideoPlayer] Chapter doc does NOT exist for id:', chapterId);
                    }
                    setMetaError('Chapter not found in cloud.');
                    return;
                }

                const data = snap.data() as any;
                if (__DEV__) {
                    console.log('[VideoPlayer] Chapter doc data =', data);
                }

                const videos =
                    (data?.videos ?? []) as Array<{ id?: string; title?: string; url?: string }>;

                if (__DEV__) {
                    console.log('[VideoPlayer] videos array length =', videos.length, 'videos =', videos);
                }

                if (!videos.length) {
                    setMetaError('No videos attached to this chapter.');
                    return;
                }

                // If videoId is given, pick that; else first
                const chosen =
                    (videoId && videos.find(v => v.id === videoId)) ||
                    videos[0];

                if (__DEV__) {
                    console.log('[VideoPlayer] videoId param =', videoId, 'chosen video =', chosen);
                }

                if (!chosen?.url) {
                    setMetaError('This video has no URL.');
                    return;
                }

                setResolvedUrl(chosen.url);
                if (!videoTitle && chosen.title) {
                    setVideoTitle(chosen.title);
                }
            } catch (err) {
                console.error('[VideoPlayer] Failed to load chapter video', err);
                setMetaError('Failed to load video details from cloud.');
            } finally {
                setMetaLoading(false);
            }
        };

        fetchFromChapter();
    }, [initialUrl, chapterId, videoId, videoTitle]);

    useEffect(() => {
        if (__DEV__) {
            console.log('[VideoPlayer] resolvedUrl =', resolvedUrl);
            console.log('[VideoPlayer] metaError =', metaError);
        }
    }, [resolvedUrl, metaError]);

    // While we’re still figuring out which URL to play
    if (metaLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={{ marginTop: 8, color: '#fff' }}>Loading video…</Text>
                {__DEV__ && (
                    <Text style={styles.debugText}>
                        (chapterId: {chapterId || 'none'}, videoId: {videoId || 'none'})
                    </Text>
                )}
            </View>
        );
    }

    if (!resolvedUrl && metaError) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{ color: '#fff', textAlign: 'center', paddingHorizontal: 16 }}>
                    {metaError}
                </Text>
                {__DEV__ && (
                    <Text style={styles.debugText}>
                        chapterId: {chapterId || 'none'}
                        {'\n'}
                        videoId: {videoId || 'none'}
                    </Text>
                )}
            </View>
        );
    }

    if (!resolvedUrl) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{ color: '#fff' }}>No video URL available.</Text>
                {__DEV__ && (
                    <Text style={styles.debugText}>
                        (No URL & no metaError. chapterId: {chapterId || 'none'}, videoId:{' '}
                        {videoId || 'none'})
                    </Text>
                )}
            </View>
        );
    }

    const playable = useMemo(() => toPlayable(resolvedUrl), [resolvedUrl]);

    return (
        <View style={styles.container}>
            {/* Optional: show title if available */}
            {!!videoTitle && (
                <View style={styles.titleBar}>
                    <Text style={styles.titleText} numberOfLines={1}>
                        {videoTitle}
                    </Text>
                </View>
            )}

            {playable.mode === 'yt' && (
                <WebView
                    source={{ html: htmlIframe(playable.url), baseUrl: playable.baseUrl }}
                    startInLoadingState
                    renderLoading={() => (
                        <View style={styles.loader}>
                            <ActivityIndicator />
                        </View>
                    )}
                    javaScriptEnabled
                    domStorageEnabled
                    allowsFullscreenVideo
                    setSupportMultipleWindows={false}
                />
            )}

            {playable.mode === 'drive' && (
                <WebView
                    source={{ html: htmlVideo(playable.direct), baseUrl: playable.baseUrl }}
                    startInLoadingState
                    renderLoading={() => (
                        <View style={styles.loader}>
                            <ActivityIndicator />
                        </View>
                    )}
                    javaScriptEnabled
                    domStorageEnabled
                    allowsFullscreenVideo
                    setSupportMultipleWindows={false}
                />
            )}

            {playable.mode === 'page' && (
                <WebView
                    source={{ uri: playable.url }}
                    startInLoadingState
                    renderLoading={() => (
                        <View style={styles.loader}>
                            <ActivityIndicator />
                        </View>
                    )}
                    javaScriptEnabled
                    domStorageEnabled
                    allowsFullscreenVideo
                />
            )}

            {playable.mode === 'unknown' && (
                <View style={styles.errorContainer}>
                    <Text style={{ color: '#fff' }}>Unable to play this video link.</Text>
                    {__DEV__ && (
                        <Text style={styles.debugText}>
                            final url: {resolvedUrl}
                            {'\n'}
                            mode: unknown
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleBar: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#111',
    },
    titleText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    debugText: {
        marginTop: 8,
        color: '#9CA3AF',
        fontSize: 11,
        textAlign: 'center',
    },
});
