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

// 🔹 Static data instead of Firestore
import {
    SUBJECTS,
    Subject,
    Unit,
    Chapter,
} from '../../data/demo';

import { useTheme } from '../../theme/ThemeContext';   // ✅ global theme

type Nav = NativeStackNavigationProp<RootStackParamList>;

type DemoPdf = {
    id: string;
    title: string;
    url: string; // can be Google Drive, normal URL, etc.
    provider?: 'drive' | 'other';
};

export default function PdfsScreen() {
    const route = useRoute<any>();
    const { subjectId, unitId, chapterId } = route.params ?? {};

    const rootNav = useNavigation<Nav>();

    const { isDark } = useTheme();                                  // ✅ read theme
    const styles = useMemo(() => createStyles(isDark), [isDark]);   // ✅ themed styles

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            setLoading(true);
            setError(null);

            if (!subjectId || !unitId || !chapterId) {
                setError('Missing chapter selection.');
                setChapter(null);
                return;
            }

            // 1️⃣ Find subject
            const subject: Subject | undefined = SUBJECTS.find(
                s => s.id === subjectId,
            );
            if (!subject) {
                setError('Subject not found in demo data.');
                setChapter(null);
                return;
            }

            // 2️⃣ Find unit inside subject
            const unit: Unit | undefined = subject.units.find(
                u => u.id === unitId,
            );
            if (!unit) {
                setError('Unit not found in demo data.');
                setChapter(null);
                return;
            }

            // 3️⃣ Find chapter inside unit
            const ch: Chapter | undefined = unit.chapters.find(
                c => c.id === chapterId,
            );
            if (!ch) {
                setError('Chapter not found in demo data.');
                setChapter(null);
                return;
            }

            setChapter(ch);
        } catch (e: any) {
            console.error('[PdfsScreen] error loading from demo.ts', e);
            setError('Failed to load PDFs.');
            setChapter(null);
        } finally {
            setLoading(false);
        }
    }, [subjectId, unitId, chapterId]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color="#4F46E5" />
                <Text style={styles.centerText}>Loading PDFs…</Text>
            </View>
        );
    }

    if (error || !subjectId || !unitId || !chapterId) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error || 'Missing chapter selection.'}</Text>
            </View>
        );
    }

    const pdfs: DemoPdf[] = (chapter?.pdfs || []) as DemoPdf[];

    return (
        <View style={styles.screen}>
            {pdfs.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Text style={styles.emptyTitle}>No PDFs available</Text>
                    <Text style={styles.emptyText}>
                        This chapter doesn’t have any PDFs in the demo data yet.
                    </Text>
                    <Text style={styles.emptyHint}>
                        Add Google Drive or other PDF links in{' '}
                        <Text style={{ fontWeight: '700' }}>chapter.pdfs</Text> inside{' '}
                        <Text style={{ fontWeight: '700' }}>src/data/demo.ts</Text>.
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
                                    console.log('[PdfsScreen] open PDF', item.url);

                                    // 🧭 Navigate to stack-level PDF viewer
                                    const parent = (rootNav as any).getParent?.();
                                    (parent || rootNav).navigate('PDFViewer', {
                                        title: item.title || `PDF ${index + 1}`,
                                        url: item.url, // Drive link will open in Drive viewer inside PDFViewer WebView
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

/**
 * Theme-aware styles – dark by default, flip when isDark=false
 */
const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        // main wrapper
        screen: {
            flex: 1,
            backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
            padding: 16,
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
            backgroundColor: isDark ? '#064E3B' : '#ECFDF3', // darker green chip in dark mode
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
