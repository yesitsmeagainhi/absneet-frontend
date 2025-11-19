// src/screens/NewsTestScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore';

type NewsItem = {
    id: string;
    title?: string;
    summary?: string;
};

export default function NewsTestScreen() {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('[NewsTest] fetching from collection "news"...');

                const snap = await firestore()
                    .collection('news')
                    .get(); // no where/orderBy – just raw fetch

                const rows: NewsItem[] = snap.docs.map(d => {
                    const data = d.data() as any;
                    return {
                        id: d.id,
                        title: data.title,
                        summary: data.summary,
                    };
                });

                console.log('[NewsTest] docs count =', rows.length);
                rows.forEach(r =>
                    console.log(
                        `[NewsTest] doc: ${r.id} | title="${r.title}" | summary="${r.summary}"`,
                    ),
                );

                setItems(rows);
            } catch (e: any) {
                console.log('[NewsTest] ERROR:', e);
                setError(String(e?.message || e));
            } finally {
                setLoading(false);
            }
        };

        run();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading from Firestore…</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={{ color: 'red', marginBottom: 8 }}>Error:</Text>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>NewsTest – Firestore "news" collection</Text>
            <Text style={{ marginBottom: 12 }}>Found {items.length} documents.</Text>
            {items.map(item => (
                <View key={item.id} style={styles.card}>
                    <Text style={styles.id}>{item.id}</Text>
                    <Text style={styles.title}>{item.title || '(no title)'}</Text>
                    {!!item.summary && <Text style={styles.summary}>{item.summary}</Text>}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    container: { padding: 16 },
    heading: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 8,
        borderRadius: 6,
        marginBottom: 8,
    },
    id: { fontSize: 10, color: '#999', marginBottom: 2 },
    title: { fontSize: 14, fontWeight: '600' },
    summary: { fontSize: 12, color: '#555', marginTop: 2 },
});
