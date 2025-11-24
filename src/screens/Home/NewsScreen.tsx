// src/screens/NewsScreen.tsx
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ListRenderItem,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ NEW
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { db } from '../../services/firebase.native';
import { useTheme } from '../../theme/ThemeContext';

type NewsItem = {
    id: string;
    title: string;
    subtitle?: string;
    excerpt?: string;
    summary?: string;
    content?: string;
    coverUrl?: string;
    bannerUrl?: string;
    author?: string;
    createdAt?: FirebaseFirestoreTypes.Timestamp | null;
    published?: boolean;
};

const PAGE = 10;
const ACCENT = '#6D28D9';

function isIndexMissing(err: any) {
    const msg = String(err?.message || '').toLowerCase();
    const code = String(err?.code || '').toLowerCase();
    return code.includes('failed-precondition') || msg.includes('index');
}

export default function NewsScreen() {
    // 🔹 state hooks
    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [endReached, setEndReached] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usingFallback, setUsingFallback] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const lastDocRef = useRef<FirebaseFirestoreTypes.DocumentSnapshot | null>(
        null,
    );

    // 🔹 theme
    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    // 🔹 base Firestore query
    const baseQuery = useMemo(
        () =>
            db
                .collection('news')
                .where('published', '==', true)
                .orderBy('createdAt', 'desc'),
        [],
    );

    const mapDocs = (
        docs: FirebaseFirestoreTypes.DocumentSnapshot[],
    ): NewsItem[] =>
        docs.map(d => {
            const data = (d.data() || {}) as any;
            return {
                id: d.id,
                title: data.title ?? '',
                subtitle: data.subtitle ?? '',
                excerpt: data.excerpt ?? data.summary ?? '',
                summary: data.summary ?? '',
                content: data.content ?? '',
                coverUrl: data.coverUrl ?? data.bannerUrl ?? '',
                bannerUrl: data.bannerUrl ?? '',
                author: data.author ?? '',
                createdAt: data.createdAt ?? null,
                published: !!data.published,
            };
        });

    // --- Primary fetchers (indexed) ---
    const fetchFirstPageIndexed = useCallback(async () => {
        const snap = await baseQuery.limit(PAGE).get();
        const rows = mapDocs(snap.docs);
        setItems(rows);
        lastDocRef.current = snap.docs.length
            ? snap.docs[snap.docs.length - 1]
            : null;
        setEndReached(snap.docs.length < PAGE);
    }, [baseQuery]);

    const fetchNextPageIndexed = useCallback(async () => {
        if (!lastDocRef.current) return;
        const snap = await baseQuery
            .startAfter(lastDocRef.current)
            .limit(PAGE)
            .get();
        const rows = mapDocs(snap.docs);
        setItems(prev => [...prev, ...rows]);
        lastDocRef.current = snap.docs.length
            ? snap.docs[snap.docs.length - 1]
            : lastDocRef.current;
        if (snap.docs.length < PAGE) setEndReached(true);
    }, [baseQuery]);

    // --- Fallback (no index) ---
    const fetchFirstPageFallback = useCallback(async () => {
        const q = db.collection('news').orderBy('createdAt', 'desc');
        const snap = await q.limit(Math.max(PAGE * 3, 30)).get();
        const allRows = mapDocs(snap.docs);
        const filtered = allRows.filter(r => r.published);
        setItems(filtered.slice(0, PAGE));
        lastDocRef.current = snap.docs.length
            ? snap.docs[snap.docs.length - 1]
            : null;
        setEndReached(
            filtered.length < PAGE && snap.docs.length < Math.max(PAGE * 3, 30),
        );
    }, []);

    const fetchNextPageFallback = useCallback(async () => {
        if (!lastDocRef.current) return;
        const q = db
            .collection('news')
            .orderBy('createdAt', 'desc')
            .startAfter(lastDocRef.current);
        const snap = await q.limit(Math.max(PAGE * 3, 30)).get();
        const allRows = mapDocs(snap.docs);
        const filtered = allRows.filter(r => r.published);
        setItems(prev => [...prev, ...filtered.slice(0, PAGE)]);
        lastDocRef.current = snap.docs.length
            ? snap.docs[snap.docs.length - 1]
            : lastDocRef.current;
        if (filtered.length < PAGE && snap.docs.length < Math.max(PAGE * 3, 30))
            setEndReached(true);
    }, []);

    // --- Orchestration ---
    const loadFirstPage = useCallback(async () => {
        setLoading(true);
        setError(null);
        setEndReached(false);
        setUsingFallback(false);
        lastDocRef.current = null;
        setExpandedId(null);

        try {
            await fetchFirstPageIndexed();
        } catch (e: any) {
            console.warn('[news] first page error:', e);
            if (isIndexMissing(e)) {
                setUsingFallback(true);
                setError(
                    'Composite index missing for (published, createdAt). Using temporary fallback.',
                );
                try {
                    await fetchFirstPageFallback();
                } catch (e2: any) {
                    console.warn('[news] fallback first page error:', e2);
                    setError(e2?.message || 'Failed to load news.');
                    setItems([]);
                    setEndReached(true);
                }
            } else {
                setError(e?.message || 'Failed to load news.');
                setItems([]);
                setEndReached(true);
            }
        } finally {
            setLoading(false);
        }
    }, [fetchFirstPageIndexed, fetchFirstPageFallback]);

    const loadNextPage = useCallback(async () => {
        if (loadingMore || endReached) return;
        setLoadingMore(true);
        setError(null);
        try {
            if (usingFallback) {
                await fetchNextPageFallback();
            } else {
                await fetchNextPageIndexed();
            }
        } catch (e: any) {
            console.warn('[news] next page error:', e);
            setError(e?.message || 'Failed to load more.');
            setEndReached(true);
        } finally {
            setLoadingMore(false);
        }
    }, [
        loadingMore,
        endReached,
        usingFallback,
        fetchNextPageFallback,
        fetchNextPageIndexed,
    ]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadFirstPage();
        setRefreshing(false);
    }, [loadFirstPage]);

    useEffect(() => {
        loadFirstPage();
    }, [loadFirstPage]);

    // --- UI helpers ---
    const toggleExpand = (id: string) => {
        setExpandedId(prev => (prev === id ? null : id));
    };

    const renderItem: ListRenderItem<NewsItem> = ({ item }) => {
        const rawImg = (item.coverUrl || item.bannerUrl || '').trim();
        const hasImage = rawImg.length > 5 && rawImg.startsWith('http');
        const img = hasImage ? rawImg : null;

        const when =
            item.createdAt && 'toDate' in item.createdAt
                ? item.createdAt.toDate().toLocaleDateString()
                : '';

        const isNew =
            item.createdAt &&
            'toDate' in item.createdAt &&
            Date.now() - item.createdAt.toDate().getTime() <
            3 * 24 * 60 * 60 * 1000;

        const isExpanded = expandedId === item.id;
        const fullText = item.content || item.summary || item.excerpt || '';

        const authorName = item.author || 'ABS Team';
        const authorInitial =
            authorName.trim().length > 0
                ? authorName.trim().charAt(0).toUpperCase()
                : 'A';

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => toggleExpand(item.id)}
            >
                <View style={[styles.card, isExpanded && styles.cardExpanded]}>
                    {/* Cover image with overlay */}
                    <View style={styles.coverWrapper}>
                        {img ? (
                            <Image source={{ uri: img }} style={styles.cover} />
                        ) : (
                            <View style={styles.coverPlaceholder}>
                                <Text style={styles.coverPlaceholderText}>ABS NEWS</Text>
                            </View>
                        )}

                        <View style={styles.coverOverlay}>
                            {!!when && (
                                <Text style={styles.coverDateChip}>{when}</Text>
                            )}
                            {isNew && <Text style={styles.coverNewChip}>NEW</Text>}
                        </View>
                    </View>

                    {/* Card body */}
                    <View style={styles.cardBody}>
                        {/* Author row */}
                        <View style={styles.authorRow}>
                            <View style={styles.avatarCircle}>
                                <Text style={styles.avatarText}>{authorInitial}</Text>
                            </View>
                            <View style={styles.authorTextBlock}>
                                <Text style={styles.authorName}>{authorName}</Text>
                                {!!when && (
                                    <Text style={styles.authorDate}>Updated • {when}</Text>
                                )}
                            </View>
                        </View>

                        {/* Title & subtitle */}
                        <Text style={styles.title} numberOfLines={2}>
                            {item.title}
                        </Text>

                        {!!item.subtitle && (
                            <Text style={styles.subtitle} numberOfLines={2}>
                                {item.subtitle}
                            </Text>
                        )}

                        {/* Short preview */}
                        {!!(item.excerpt ?? item.summary) && !isExpanded && (
                            <Text style={styles.excerpt} numberOfLines={3}>
                                {item.excerpt ?? item.summary}
                            </Text>
                        )}

                        {/* Expanded content */}
                        {isExpanded && !!fullText && (
                            <View style={styles.expandedBlock}>
                                <Text style={styles.expandedLabel}>Full update</Text>
                                <Text style={styles.expandedText}>{fullText}</Text>
                            </View>
                        )}

                        {/* Bottom row */}
                        <View style={styles.bottomRow}>
                            <Text style={styles.metaBottom}>ABS Newsroom</Text>
                            <Text style={styles.readMore}>
                                {isExpanded ? 'Tap to hide ▲' : 'Tap to read more ▼'}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerBadgeRow}>
                <Text style={styles.headerBadge}>ABS Newsroom</Text>
                {items.length > 0 && (
                    <Text style={styles.headerCount}>{items.length} posts</Text>
                )}
            </View>

            <Text style={styles.heading}>News & Updates</Text>
            <View style={styles.headerAccentBar} />
            <Text style={styles.subheading}>
                Stay updated with important announcements, mock tests and exam tips from
                ABS.
            </Text>

            {(error || usingFallback) && (
                <View
                    style={[
                        styles.banner,
                        error ? styles.bannerError : styles.bannerWarn,
                    ]}
                >
                    <Text style={styles.bannerText}>
                        {error
                            ? error
                            : 'Using fallback (no index). Create composite index on published ASC, createdAt DESC in Firestore.'}
                    </Text>
                </View>
            )}
        </View>
    );

    const ListFooter = () => {
        if (loadingMore) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator color={styles.footerSpinner.color as string} />
                    <Text style={styles.footerLoadingText}>Loading more…</Text>
                </View>
            );
        }
        if (endReached && items.length > 0) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.footerDoneText}>You’re all caught up.</Text>
                </View>
            );
        }
        if (items.length === 0) return null;

        return (
            <View style={styles.footer}>
                <TouchableOpacity style={styles.moreBtn} onPress={loadNextPage}>
                    <Text style={styles.moreBtnText}>Load more</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // ✅ Root now uses SafeAreaView so content plays nicely with notches
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            {loading && items.length === 0 ? (
                <View style={styles.fullCenter}>
                    <ActivityIndicator color={styles.footerSpinner.color as string} />
                    <Text style={styles.fullCenterText}>Loading news…</Text>
                </View>
            ) : (
                <View style={styles.screen}>
                    {items.length === 0 ? (
                        <View style={styles.fullCenter}>
                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : (
                                <Text style={styles.emptyMainText}>
                                    No news yet. Check again soon.
                                </Text>
                            )}
                        </View>
                    ) : (
                        <FlatList
                            data={items}
                            keyExtractor={it => it.id}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContent}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            onEndReachedThreshold={0.35}
                            onEndReached={loadNextPage}
                            ListHeaderComponent={ListHeader}
                            ListFooterComponent={ListFooter}
                            removeClippedSubviews={false}
                        />
                    )}
                </View>
            )}
        </SafeAreaView>
    );
}

/** 🔹 Theme-aware + SafeArea-aware styles */
const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: isDark ? '#020617' : '#F3F4F6',
        },
        screen: {
            flex: 1,
            backgroundColor: isDark ? '#020617' : '#F3F4F6',
        },
        fullCenter: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#020617' : '#F3F4F6',
        },
        fullCenterText: {
            marginTop: 8,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        errorText: {
            color: '#FCA5A5',
            textAlign: 'center',
            paddingHorizontal: 16,
        },
        emptyMainText: {
            color: isDark ? '#9CA3AF' : '#6B7280',
        },

        headerContainer: {
            marginBottom: 16,
        },
        headerBadgeRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        headerBadge: {
            fontSize: 11,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: isDark ? '#111827' : '#E5E7EB',
            color: ACCENT,
            fontWeight: '600',
        },
        headerCount: {
            fontSize: 11,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        heading: {
            fontSize: 22,
            fontWeight: '800',
            color: isDark ? '#F9FAFB' : '#111827',
        },
        headerAccentBar: {
            marginTop: 6,
            width: 64,
            height: 3,
            borderRadius: 999,
            backgroundColor: ACCENT,
        },
        subheading: {
            fontSize: 13,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 8,
            lineHeight: 18,
        },

        card: {
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderRadius: 18,
            overflow: 'hidden',
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
        },
        cardExpanded: {
            borderColor: ACCENT,
            backgroundColor: isDark ? '#020617' : '#EEF2FF',
        },

        coverWrapper: {
            position: 'relative',
            width: '100%',
            height: 170,
            backgroundColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        cover: {
            width: '100%',
            height: '100%',
        },
        coverPlaceholder: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        coverPlaceholderText: {
            fontSize: 16,
            letterSpacing: 1,
            fontWeight: '700',
            color: isDark ? '#4B5563' : '#6B7280',
        },
        coverOverlay: {
            position: 'absolute',
            bottom: 10,
            left: 12,
            right: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        coverDateChip: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: '#E5E7EB',
            fontSize: 11,
        },
        coverNewChip: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: '#22C55E',
            color: '#022C22',
            fontSize: 11,
            fontWeight: '700',
        },

        cardBody: {
            padding: 12,
            paddingBottom: 14,
        },

        // Author / meta row
        authorRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        avatarCircle: {
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#111827' : '#EEF2FF',
            marginRight: 8,
        },
        avatarText: {
            fontSize: 15,
            fontWeight: '700',
            color: ACCENT,
        },
        authorTextBlock: {
            flex: 1,
        },
        authorName: {
            fontSize: 13,
            fontWeight: '600',
            color: isDark ? '#E5E7EB' : '#111827',
        },
        authorDate: {
            fontSize: 11,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 1,
        },

        title: {
            fontSize: 16,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
            marginBottom: 4,
        },
        subtitle: {
            fontSize: 13,
            color: isDark ? '#E5E7EB' : '#4B5563',
            marginBottom: 4,
        },
        excerpt: {
            fontSize: 13,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 4,
        },

        expandedBlock: {
            marginTop: 10,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        expandedLabel: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 2,
            fontWeight: '600',
        },
        expandedText: {
            fontSize: 13,
            color: isDark ? '#E5E7EB' : '#374151',
            lineHeight: 18,
        },

        bottomRow: {
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        metaBottom: {
            fontSize: 12,
            color: isDark ? '#6B7280' : '#6B7280',
        },
        readMore: {
            fontSize: 12,
            color: ACCENT,
            fontWeight: '600',
        },

        footer: {
            paddingVertical: 18,
            alignItems: 'center',
            justifyContent: 'center',
        },
        footerSpinner: {
            color: isDark ? '#E5E7EB' : '#9CA3AF',
        } as any,
        footerLoadingText: {
            marginTop: 8,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        footerDoneText: {
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        moreBtn: {
            paddingHorizontal: 18,
            paddingVertical: 9,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: isDark ? '#4B5563' : '#D1D5DB',
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
        },
        moreBtnText: {
            color: isDark ? '#F9FAFB' : '#111827',
            fontWeight: '600',
            fontSize: 13,
        },

        banner: {
            padding: 8,
            borderRadius: 10,
            marginTop: 10,
        },
        bannerError: {
            backgroundColor: '#7F1D1D',
        },
        bannerWarn: {
            backgroundColor: '#78350F',
        },
        bannerText: {
            fontSize: 11,
            color: '#F9FAFB',
        },

        listContent: {
            paddingHorizontal: 16,
            paddingBottom: 24,
            paddingTop: 12,
        },
    });
