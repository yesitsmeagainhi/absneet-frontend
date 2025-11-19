// src/screens/NewsScreen.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { db } from '../../services/firebase.native'; // <-- adjust if needed

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

function isIndexMissing(err: any) {
    const msg = String(err?.message || '').toLowerCase();
    const code = String(err?.code || '').toLowerCase();
    // RNFB often surfaces the Firestore code as 'failed-precondition'
    return code.includes('failed-precondition') || msg.includes('index');
}

export default function NewsScreen() {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [endReached, setEndReached] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usingFallback, setUsingFallback] = useState(false); // true when index is missing

    const lastDocRef = useRef<FirebaseFirestoreTypes.DocumentSnapshot | null>(null);

    const baseQuery = useMemo(
        () =>
            db
                .collection('news')
                .where('published', '==', true)
                .orderBy('createdAt', 'desc'),
        []
    );

    const mapDocs = (docs: FirebaseFirestoreTypes.DocumentSnapshot[]): NewsItem[] =>
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

    // --- Primary (indexed) fetchers -------------------------------------------------
    const fetchFirstPageIndexed = useCallback(async () => {
        const snap = await baseQuery.limit(PAGE).get();
        const rows = mapDocs(snap.docs);
        setItems(rows);
        lastDocRef.current = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
        setEndReached(snap.docs.length < PAGE);
    }, [baseQuery]);

    const fetchNextPageIndexed = useCallback(async () => {
        if (!lastDocRef.current) return;
        const snap = await baseQuery.startAfter(lastDocRef.current).limit(PAGE).get();
        const rows = mapDocs(snap.docs);
        setItems(prev => [...prev, ...rows]);
        lastDocRef.current = snap.docs.length ? snap.docs[snap.docs.length - 1] : lastDocRef.current;
        if (snap.docs.length < PAGE) setEndReached(true);
    }, [baseQuery]);

    // --- Fallback (no index): order by createdAt, then filter published on client ---
    const fetchFirstPageFallback = useCallback(async () => {
        const q = db.collection('news').orderBy('createdAt', 'desc');
        // Pull a larger batch so we likely fill PAGE after client-side filtering
        const snap = await q.limit(Math.max(PAGE * 3, 30)).get();
        const allRows = mapDocs(snap.docs);
        const filtered = allRows.filter(r => r.published);
        setItems(filtered.slice(0, PAGE));
        lastDocRef.current = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
        setEndReached(filtered.length < PAGE && snap.docs.length < Math.max(PAGE * 3, 30));
    }, []);

    const fetchNextPageFallback = useCallback(async () => {
        if (!lastDocRef.current) return;
        const q = db.collection('news').orderBy('createdAt', 'desc').startAfter(lastDocRef.current);
        const snap = await q.limit(Math.max(PAGE * 3, 30)).get();
        const allRows = mapDocs(snap.docs);
        const filtered = allRows.filter(r => r.published);
        setItems(prev => [...prev, ...filtered.slice(0, PAGE)]);
        lastDocRef.current = snap.docs.length ? snap.docs[snap.docs.length - 1] : lastDocRef.current;
        if (filtered.length < PAGE && snap.docs.length < Math.max(PAGE * 3, 30)) setEndReached(true);
    }, []);

    // --- Orchestration --------------------------------------------------------------
    const loadFirstPage = useCallback(async () => {
        setLoading(true);
        setError(null);
        setEndReached(false);
        setUsingFallback(false);
        lastDocRef.current = null;

        try {
            await fetchFirstPageIndexed();
        } catch (e: any) {
            console.warn('[news] first page error:', e);
            if (isIndexMissing(e)) {
                setUsingFallback(true);
                setError(
                    'Composite index missing for (published, createdAt). Using a temporary fallback. Create the index in Firebase to remove this warning.'
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
    }, [loadingMore, endReached, usingFallback, fetchNextPageFallback, fetchNextPageIndexed]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadFirstPage();
        setRefreshing(false);
    }, [loadFirstPage]);

    useEffect(() => {
        loadFirstPage();
    }, [loadFirstPage]);

    // --- UI ------------------------------------------------------------------------
    const renderItem: ListRenderItem<NewsItem> = ({ item }) => {
        const img = item.coverUrl || item.bannerUrl;
        const when =
            item.createdAt && 'toDate' in item.createdAt
                ? item.createdAt.toDate().toLocaleDateString()
                : '';

        return (
            <View style={styles.card}>
                {!!img && <Image source={{ uri: img }} style={styles.cover} />}
                <View style={styles.body}>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.title}
                    </Text>
                    {!!item.subtitle && (
                        <Text style={styles.subtitle} numberOfLines={2}>
                            {item.subtitle}
                        </Text>
                    )}
                    {!!(item.excerpt ?? item.summary) && (
                        <Text style={styles.excerpt} numberOfLines={3}>
                            {item.excerpt ?? item.summary}
                        </Text>
                    )}
                    <Text style={styles.meta}>
                        {(item.author ? `By ${item.author}` : '')}
                        {when ? ` · ${when}` : ''}
                    </Text>
                </View>
            </View>
        );
    };

    const ListHeader = () => {
        if (!error && !usingFallback) return null;
        return (
            <View style={[styles.banner, error ? styles.bannerError : styles.bannerWarn]}>
                {!!error && <Text style={styles.bannerText}>{error}</Text>}
                {usingFallback && !error && (
                    <Text style={styles.bannerText}>
                        Using fallback (no index). Create composite index on published ASC, createdAt DESC.
                    </Text>
                )}
            </View>
        );
    };

    const ListFooter = () => {
        if (loadingMore) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text style={{ marginTop: 8, color: '#777' }}>Loading more…</Text>
                </View>
            );
        }
        if (endReached && items.length > 0) {
            return (
                <View style={styles.footer}>
                    <Text style={{ color: '#888' }}>You’re all caught up.</Text>
                </View>
            );
        }
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
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8, color: '#777' }}>Loading news…</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {items.length === 0 ? (
                <View style={styles.center}>
                    {!!error ? (
                        <Text style={{ color: 'crimson', textAlign: 'center', paddingHorizontal: 16 }}>
                            {error}
                        </Text>
                    ) : (
                        <Text style={{ color: '#666' }}>No news yet.</Text>
                    )}
                </View>
            ) : (
                <FlatList
                    data={items}
                    keyExtractor={it => it.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
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
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    cover: { width: '100%', height: 160, backgroundColor: '#f2f2f2' },
    body: { padding: 12 },
    title: { fontSize: 16, fontWeight: '700', color: '#111' },
    subtitle: { fontSize: 14, color: '#555', marginTop: 4 },
    excerpt: { fontSize: 13, color: '#666', marginTop: 6 },
    meta: { fontSize: 12, color: '#888', marginTop: 8 },
    footer: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
    moreBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
    moreBtnText: { color: '#333', fontWeight: '600' },
    banner: { padding: 10, borderRadius: 8, marginHorizontal: 16, marginTop: 12 },
    bannerError: { backgroundColor: '#ffe8ec' },
    bannerWarn: { backgroundColor: '#fff6e5' },
    bannerText: { color: '#333', fontSize: 12 },
});
