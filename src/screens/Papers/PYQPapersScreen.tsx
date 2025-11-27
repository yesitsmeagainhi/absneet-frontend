// src/screens/PYQ/PYQPapersScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { useTheme } from '../../theme/ThemeContext'; // ✅ theme
import { db } from '../../firebase';                 // ✅ Firestore
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
} from 'firebase/firestore';

// type Props = NativeStackScreenProps<RootStackParamList, 'PYQPdfPapers'>;
type Props = NativeStackScreenProps<RootStackParamList, 'PYQPapers'>;

// Shape of each Firestore document in pyqPdfPapers
type PyqPaperDoc = {
    id: string;
    subjectId: string;
    subjectName?: string;
    exam: string;
    year: number;
    title: string;
    pdfUrl?: string;
};

export default function PYQPapersScreen({ route, navigation }: Props) {
    const { subjectId, subjectName } = route.params;

    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const [papers, setPapers] = useState<PyqPaperDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!subjectId) {
                    setError('No subject selected.');
                    setPapers([]);
                    return;
                }

                const col = collection(db, 'pyqPdfPapers');
                const q = query(
                    col,
                    where('subjectId', '==', subjectId),
                    orderBy('year', 'desc')
                );

                const snap = await getDocs(q);
                const list: PyqPaperDoc[] = snap.docs.map(d => {
                    const data = d.data() as any;
                    return {
                        id: d.id,
                        subjectId: data.subjectId,
                        subjectName: data.subjectName,
                        exam: data.exam ?? 'NEET',
                        year: data.year ?? 0,
                        title:
                            data.title ??
                            `${data.exam ?? 'NEET'} ${data.year ?? ''} – Full Paper`,
                        pdfUrl: data.pdfUrl,
                    };
                });

                setPapers(list);
            } catch (e: any) {
                console.error('[PYQPapersScreen] load error', e);
                setError('Failed to load PYQ papers. Please try again.');
                setPapers([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [subjectId]);

    const openPdf = (url?: string) => {
        if (!url) return;
        Linking.openURL(url).catch(err =>
            console.warn('Failed to open PDF URL:', err),
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={isDark ? '#E5E7EB' : '#4B5563'} />
                <Text style={styles.loadingText}>Loading PYQ papers…</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.c}>
            <Text style={styles.heading}>
                {subjectName} – Previous Year Question Papers (PDF)
            </Text>
            <Text style={styles.subheading}>
                View and download full previous year question papers as PDF, year-wise.
            </Text>

            {papers.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Text style={styles.emptyText}>
                        No previous year papers added yet for this subject.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={papers}
                    keyExtractor={p => p.id}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    renderItem={({ item }) => (
                        <View style={styles.paperCard}>
                            {/* Top row: year + exam */}
                            <View style={styles.topRow}>
                                <View>
                                    <Text style={styles.yearText}>{item.year}</Text>
                                    <Text style={styles.examText}>
                                        {item.exam} · Question Paper (PDF)
                                    </Text>
                                </View>
                            </View>

                            {/* Title */}
                            <Text style={styles.paperTitle}>{item.title}</Text>

                            {/* PDF action */}
                            <View style={styles.footerRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.solveBtn,
                                        !item.pdfUrl && { opacity: 0.4 },
                                    ]}
                                    disabled={!item.pdfUrl}
                                    onPress={() => openPdf(item.pdfUrl)}
                                >
                                    <Text style={styles.solveBtnText}>
                                        {item.pdfUrl ? 'Open PDF' : 'PDF not available'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

/** Theme-aware styles */
const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        c: {
            flex: 1,
            padding: 16,
            backgroundColor: isDark ? '#020617' : '#F9FAFB',
        },
        center: {
            flex: 1,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#020617' : '#F9FAFB',
        },
        loadingText: {
            marginTop: 8,
            fontSize: 13,
            color: isDark ? '#E5E7EB' : '#4B5563',
        },
        errorText: {
            fontSize: 13,
            color: '#F97373',
            textAlign: 'center',
        },
        heading: {
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
            marginBottom: 4,
        },
        subheading: {
            fontSize: 13,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 12,
        },
        emptyWrap: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyText: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
        },
        paperCard: {
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
            marginBottom: 12,
        },
        topRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
        },
        yearText: {
            fontSize: 16,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
        },
        examText: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 2,
        },
        paperTitle: {
            fontSize: 14,
            color: isDark ? '#E5E7EB' : '#111827',
            marginTop: 6,
            marginBottom: 10,
        },
        footerRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        solveBtn: {
            backgroundColor: '#6D28D9',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 999,
        },
        solveBtnText: {
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '600',
        },
    });
