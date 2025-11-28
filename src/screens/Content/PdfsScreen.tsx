// // src/screens/Content/PdfsScreen.tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import type { RootStackParamList } from '../../navigation/RootNavigator';

// import { db } from '../../firebase';
// import { doc, getDoc } from 'firebase/firestore';

// type Pdf = {
//     id: string;
//     title: string;
//     url: string;
// };

// type ChapterDoc = {
//     name: string;
//     pdfs?: Pdf[];
// };

// export default function PdfsScreen() {
//     const { params }: any = useRoute();
//     const { subjectId, unitId, chapterId } = params || {};

//     const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//     const [chapter, setChapter] = useState<ChapterDoc | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const load = async () => {
//             try {
//                 if (!chapterId) {
//                     setError('No chapter selected.');
//                     setLoading(false);
//                     return;
//                 }
//                 const ref = doc(db, 'nodes', chapterId);
//                 const snap = await getDoc(ref);
//                 if (!snap.exists()) {
//                     setError('Chapter not found.');
//                 } else {
//                     setChapter(snap.data() as ChapterDoc);
//                 }
//             } catch (e: any) {
//                 console.error('[PdfsScreen] load error', e);
//                 setError('Failed to load PDFs.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         load();
//     }, [chapterId]);

//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator />
//                 <Text style={{ marginTop: 8 }}>Loading PDFs…</Text>
//             </View>
//         );
//     }

//     if (error || !subjectId || !unitId || !chapterId) {
//         return (
//             <View style={styles.center}>
//                 <Text>{error || 'Missing chapter selection.'}</Text>
//             </View>
//         );
//     }

//     const pdfs = chapter?.pdfs || [];

//     return (
//         <View style={{ flex: 1, padding: 16 }}>
//             <FlatList
//                 data={pdfs}
//                 keyExtractor={p => p.id}
//                 ListEmptyComponent={<Text>No PDFs available for this chapter.</Text>}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity
//                         style={styles.row}
//                         onPress={() => {
//                             console.log('[PdfsScreen] open PDF', item.url);
//                             const parent = (rootNav as any).getParent?.();
//                             (parent || rootNav).navigate('PDFViewer', {
//                                 title: item.title || 'PDF',
//                                 url: item.url,
//                             });
//                         }}
//                     >
//                         <Text>{item.title}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//         </View>
//     );
// }

// const styles = {
//     row: {
//         padding: 10,
//         borderWidth: 1,
//         borderColor: '#eee',
//         borderRadius: 10,
//         marginBottom: 10,
//     },
//     center: {
//         flex: 1,
//         padding: 16,
//         alignItems: 'center' as const,
//         justifyContent: 'center' as const,
//     },
// };

// src/screens/Content/PdfsScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../../theme/ThemeContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type FirestorePdf = {
    id: string;
    title: string;
    url: string; // Google Drive or any URL
    provider?: 'drive' | 'other';
};

type ChapterDoc = {
    type: 'chapter';
    name?: string;
    subjectId: string;
    unitId: string;
    pdfs?: FirestorePdf[];
};

export default function PdfsScreen() {
    const route = useRoute<any>();
    const { subjectId, unitId, chapterId } = route.params ?? {};

    const rootNav = useNavigation<Nav>();

    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const [chapterName, setChapterName] = useState<string>('Chapter PDFs');
    const [pdfs, setPdfs] = useState<FirestorePdf[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔥 Load chapter + PDFs from Firestore
    useEffect(() => {
        const load = async () => {
            console.log('[PdfsScreen] route params =', {
                subjectId,
                unitId,
                chapterId,
            });

            if (!subjectId || !unitId || !chapterId) {
                setError('Missing chapter selection.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const docRef = firestore().collection('nodes').doc(chapterId);
                console.log('[PdfsScreen] fetching chapter doc =', docRef.path);

                const snap = await docRef.get();

                if (!snap.exists) {
                    console.log('[PdfsScreen] chapter doc NOT found for id =', chapterId);
                    setError('Chapter not found. Please try again later.');
                    setPdfs([]);
                    return;
                }

                const data = snap.data() as ChapterDoc;
                console.log('[PdfsScreen] chapter doc data =', data);

                if (data.type !== 'chapter') {
                    console.warn(
                        '[PdfsScreen] Document type is not "chapter". type =',
                        data.type,
                    );
                }

                if (data.subjectId !== subjectId || data.unitId !== unitId) {
                    console.warn('[PdfsScreen] subject/unit mismatch:', {
                        expectedSubjectId: subjectId,
                        expectedUnitId: unitId,
                        docSubjectId: data.subjectId,
                        docUnitId: data.unitId,
                    });
                }

                const arr = Array.isArray(data.pdfs) ? data.pdfs : [];
                console.log('[PdfsScreen] pdfs array length =', arr.length, 'pdfs =', arr);

                setChapterName(data.name || 'Chapter PDFs');
                setPdfs(arr);
            } catch (e: any) {
                console.error('[PdfsScreen] Firestore load error', e);
                setError('Failed to load PDFs from cloud.');
                setPdfs([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [subjectId, unitId, chapterId]);

    // ─── UI states ────────────────────────────────────────────────

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#4F46E5" />
                <Text style={styles.centerText}>Loading PDFs…</Text>
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
        <View style={styles.screen}>
            <Text style={styles.headerTitle}>{chapterName}</Text>
            <Text style={styles.headerSub}>Tap a PDF to open the viewer</Text>

            {pdfs.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyTitle}>No PDFs available</Text>
                    <Text style={styles.emptyText}>
                        This chapter doesn’t have any PDFs added yet.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={pdfs}
                    keyExtractor={p => p.id}
                    contentContainerStyle={{ paddingBottom: 12 }}
                    renderItem={({ item, index }) => {
                        const isDrive =
                            item.provider === 'drive' ||
                            (item.url && item.url.includes('drive.google.com'));

                        return (
                            <TouchableOpacity
                                style={styles.row}
                                activeOpacity={0.85}
                                onPress={() => {
                                    console.log('[PdfsScreen] open PDF', item);
                                    // 🧭 Navigate to stack-level PDF viewer
                                    const parent = (rootNav as any).getParent?.();
                                    (parent || rootNav).navigate('PDFViewer', {
                                        title: item.title || `PDF ${index + 1}`,
                                        url: item.url,
                                    });
                                }}
                            >
                                <Text style={styles.pdfIndex}>PDF {index + 1}</Text>
                                <Text style={styles.pdfTitle} numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <Text style={styles.pdfUrl} numberOfLines={1}>
                                    {item.url}
                                </Text>
                                <Text style={styles.providerTag}>
                                    {isDrive ? 'Google Drive' : 'PDF link'}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
}

/** Theme-aware styles – dark by default, flip when isDark=false */
const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        // main wrapper
        screen: {
            flex: 1,
            backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
            padding: 16,
        },

        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
            marginBottom: 2,
        },
        headerSub: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 10,
        },

        // pdf card
        row: {
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 12,
            marginBottom: 10,
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        pdfIndex: {
            fontSize: 11,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 2,
            fontWeight: '500',
        },
        pdfTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#111827',
            marginBottom: 4,
        },
        pdfUrl: {
            fontSize: 11,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 6,
        },
        providerTag: {
            alignSelf: 'flex-start',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 999,
            fontSize: 10,
            fontWeight: '600',
            backgroundColor: isDark ? '#064E3B' : '#ECFDF3',
            color: isDark ? '#BBF7D0' : '#15803D',
        },

        // loading / error states
        center: {
            flex: 1,
            padding: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
        },
        centerText: {
            marginTop: 8,
            fontSize: 13,
            color: isDark ? '#E5E7EB' : '#4B5563',
            textAlign: 'center',
        },
        errorText: {
            marginTop: 8,
            fontSize: 13,
            color: '#F97373',
            textAlign: 'center',
        },

        // empty state
        emptyCard: {
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderRadius: 14,
            paddingVertical: 18,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        emptyTitle: {
            fontSize: 15,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
            marginBottom: 4,
        },
        emptyText: {
            fontSize: 13,
            color: isDark ? '#E5E7EB' : '#4B5563',
            marginBottom: 6,
        },
        emptyHint: {
            fontSize: 11,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
    });
