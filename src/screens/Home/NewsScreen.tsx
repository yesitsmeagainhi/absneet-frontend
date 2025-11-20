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
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { db } from '../../services/firebase.native';

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
        docs.map((d) => {
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
        setItems((prev) => [...prev, ...rows]);
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
        const filtered = allRows.filter((r) => r.published);
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
        const filtered = allRows.filter((r) => r.published);
        setItems((prev) => [...prev, ...filtered.slice(0, PAGE)]);
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
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const renderItem: ListRenderItem<NewsItem> = ({ item }) => {
        // const img = item.coverUrl || item.bannerUrl;
        // treat empty strings / "null" / spaces as no image
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

        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => toggleExpand(item.id)}>
                <View style={[styles.card, isExpanded && styles.cardExpanded]}>
                    {!!img && <Image source={{ uri: img }} style={styles.cover} />}
                    <View style={styles.cardBody}>
                        <View style={styles.cardMetaRow}>
                            {!!when && <Text style={styles.metaChip}>{when}</Text>}
                            {isNew && <Text style={styles.metaChipNew}>NEW</Text>}
                        </View>

                        <Text style={styles.title} numberOfLines={2}>
                            {item.title}
                        </Text>

                        {!!item.subtitle && (
                            <Text style={styles.subtitle} numberOfLines={2}>
                                {item.subtitle}
                            </Text>
                        )}

                        {!!(item.excerpt ?? item.summary) && !isExpanded && (
                            <Text style={styles.excerpt} numberOfLines={3}>
                                {item.excerpt ?? item.summary}
                            </Text>
                        )}

                        {isExpanded && !!fullText && (
                            <View style={styles.expandedBlock}>
                                <Text style={styles.expandedLabel}>Full update</Text>
                                <Text style={styles.expandedText}>{fullText}</Text>
                            </View>
                        )}

                        <View style={styles.bottomRow}>
                            <Text style={styles.metaBottom}>
                                {item.author ? `By ${item.author}` : 'ABS Team'}
                            </Text>
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
                <Text style={styles.headerBadge}>ABS News</Text>
                {items.length > 0 && (
                    <Text style={styles.headerCount}>{items.length} posts</Text>
                )}
            </View>
            <Text style={styles.heading}>News & Updates</Text>
            <Text style={styles.subheading}>
                Stay updated with important announcements, mock tests and exam tips.
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
                    <ActivityIndicator color="#E5E7EB" />
                    <Text style={{ marginTop: 8, color: '#9CA3AF' }}>Loading more…</Text>
                </View>
            );
        }
        if (endReached && items.length > 0) {
            return (
                <View style={styles.footer}>
                    <Text style={{ color: '#6B7280' }}>You’re all caught up.</Text>
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

    if (loading && items.length === 0) {
        return (
            <View style={styles.fullCenter}>
                <ActivityIndicator color="#E5E7EB" />
                <Text style={{ marginTop: 8, color: '#9CA3AF' }}>Loading news…</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {items.length === 0 ? (
                <View style={styles.fullCenter}>
                    {error ? (
                        <Text
                            style={{
                                color: '#FCA5A5',
                                textAlign: 'center',
                                paddingHorizontal: 16,
                            }}
                        >
                            {error}
                        </Text>
                    ) : (
                        <Text style={{ color: '#9CA3AF' }}>
                            No news yet. Check again soon.
                        </Text>
                    )}
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={(it) => it.id}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 24,
                        paddingTop: 12,
                    }}
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
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#020617' }, // dark like Home
    fullCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#020617',
    },

    headerContainer: {
        marginBottom: 14,
    },
    headerBadgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    headerBadge: {
        fontSize: 11,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#111827',
        color: ACCENT,
        fontWeight: '600',
    },
    headerCount: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        color: '#F9FAFB',
    },
    subheading: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 4,
    },

    card: {
        backgroundColor: '#020617',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    cardExpanded: {
        borderColor: ACCENT,
        backgroundColor: '#020617',
    },
    cover: { width: '100%', height: 170, backgroundColor: '#111827' },
    cardBody: { padding: 12 },
    cardMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    metaChip: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: '#111827',
        color: '#E5E7EB',
        fontSize: 11,
    },
    metaChipNew: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: '#064E3B',
        color: '#6EE7B7',
        fontSize: 11,
        fontWeight: '600',
    },
    title: { fontSize: 16, fontWeight: '700', color: '#F9FAFB' },
    subtitle: {
        fontSize: 14,
        color: '#E5E7EB',
        marginTop: 4,
    },
    excerpt: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 6,
    },

    expandedBlock: {
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#1F2937',
    },
    expandedLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 2,
        fontWeight: '600',
    },
    expandedText: {
        fontSize: 13,
        color: '#E5E7EB',
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
        color: '#6B7280',
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
    moreBtn: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#4B5563',
        backgroundColor: '#020617',
    },
    moreBtnText: {
        color: '#F9FAFB',
        fontWeight: '600',
        fontSize: 13,
    },

    banner: {
        padding: 8,
        borderRadius: 10,
        marginTop: 10,
    },
    bannerError: { backgroundColor: '#7F1D1D' },
    bannerWarn: { backgroundColor: '#78350F' },
    bannerText: {
        fontSize: 11,
        color: '#F9FAFB',
    },
});
