// src/screens/Content/VideoPlayerScreen.tsx
import React, { useMemo } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { WebView } from 'react-native-webview';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

// ── helpers ─────────────────────────────────────────────────────────

function getDriveId(input?: string | null): string {
    try {
        if (!input) return '';
        let s = input.trim();
        if (!/^https?:\/\//i.test(s)) s = `https://${s}`;

        // 👇 TS workaround: treat URL instance as any
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
        // 👇 TS workaround: cast URL to any
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
    const { url } = route.params;

    const playable = useMemo(() => toPlayable(url), [url]);

    if (!url) {
        return (
            <View style={styles.errorContainer}>
                <Text style={{ color: '#fff' }}>No video URL provided.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
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
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
