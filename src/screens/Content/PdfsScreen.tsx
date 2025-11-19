// src/screens/Content/PdfsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';

import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

type Pdf = {
    id: string;
    title: string;
    url: string;
};

type ChapterDoc = {
    name: string;
    pdfs?: Pdf[];
};

export default function PdfsScreen() {
    const { params }: any = useRoute();
    const { subjectId, unitId, chapterId } = params || {};

    const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [chapter, setChapter] = useState<ChapterDoc | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                if (!chapterId) {
                    setError('No chapter selected.');
                    setLoading(false);
                    return;
                }
                const ref = doc(db, 'nodes', chapterId);
                const snap = await getDoc(ref);
                if (!snap.exists()) {
                    setError('Chapter not found.');
                } else {
                    setChapter(snap.data() as ChapterDoc);
                }
            } catch (e: any) {
                console.error('[PdfsScreen] load error', e);
                setError('Failed to load PDFs.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [chapterId]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8 }}>Loading PDFs…</Text>
            </View>
        );
    }

    if (error || !subjectId || !unitId || !chapterId) {
        return (
            <View style={styles.center}>
                <Text>{error || 'Missing chapter selection.'}</Text>
            </View>
        );
    }

    const pdfs = chapter?.pdfs || [];

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={pdfs}
                keyExtractor={p => p.id}
                ListEmptyComponent={<Text>No PDFs available for this chapter.</Text>}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => {
                            console.log('[PdfsScreen] open PDF', item.url);
                            const parent = (rootNav as any).getParent?.();
                            (parent || rootNav).navigate('PDFViewer', {
                                title: item.title || 'PDF',
                                url: item.url,
                            });
                        }}
                    >
                        <Text>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = {
    row: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        marginBottom: 10,
    },
    center: {
        flex: 1,
        padding: 16,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
};
