// // import React from 'react';
// // import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// // import { SUBJECTS } from '../../data/demo';
// // import { NativeStackScreenProps } from '@react-navigation/native-stack';
// // import { RootStackParamList } from '../../navigation/RootNavigator';


// // export default function ChaptersScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Chapters'>) {
// //     const { subjectId, unitId } = route.params;
// //     const subject = SUBJECTS.find(s => s.id === subjectId)!;
// //     const unit = subject.units.find(u => u.id === unitId)!;


// //     return (
// //         <View style={styles.c}>
// //             <FlatList
// //                 data={unit.chapters}
// //                 keyExtractor={c => c.id}
// //                 renderItem={({ item }) => (
// //                     <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ContentTabs', { subjectId, unitId, chapterId: item.id })}>
// //                         <Text>{item.name}</Text>
// //                     </TouchableOpacity>
// //                 )}
// //             />
// //         </View>
// //     );
// // }
// // const styles = StyleSheet.create({ c: { flex: 1, padding: 16 }, row: { padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginBottom: 10 } });

// //Firestore
// // src/screens/subject/ChaptersScreen.tsx (path as in your project)
// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     TouchableOpacity,
//     ActivityIndicator,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// import { db } from '../../firebase'; // ⬅️ adjust path if needed
// import {
//     collection,
//     query,
//     where,
//     orderBy,
//     getDocs,
// } from 'firebase/firestore';

// type Props = NativeStackScreenProps<RootStackParamList, 'Chapters'>;

// type ChapterNode = {
//     id: string;
//     name: string;
//     parentId: string;
//     type: string;
//     order?: number;
// };

// export default function ChaptersScreen({ route, navigation }: Props) {
//     const { subjectId, unitId } = route.params;

//     const [chapters, setChapters] = useState<ChapterNode[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchChapters = async () => {
//             try {
//                 setLoading(true);
//                 setError(null);

//                 // 🔹 nodes where parentId = unitId AND type = 'chapter'
//                 const q = query(
//                     collection(db, 'nodes'),
//                     where('parentId', '==', unitId),
//                     where('type', '==', 'chapter'),
//                     orderBy('order', 'asc') // make sure 'order' exists, or remove if not using
//                 );

//                 const snap = await getDocs(q);
//                 const list: ChapterNode[] = snap.docs.map(d => ({
//                     id: d.id,
//                     ...(d.data() as any),
//                 }));

//                 setChapters(list);
//             } catch (e: any) {
//                 console.error('[ChaptersScreen] Failed to load chapters', e);
//                 setError('Failed to load chapters. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchChapters();
//     }, [unitId]);

//     const handlePressChapter = (chapter: ChapterNode) => {
//         navigation.navigate('ContentTabs', {
//             subjectId,
//             unitId,
//             chapterId: chapter.id,
//         });
//     };

//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator />
//                 <Text style={{ marginTop: 8 }}>Loading chapters...</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.center}>
//                 <Text>{error}</Text>
//             </View>
//         );
//     }

//     if (!chapters.length) {
//         return (
//             <View style={styles.center}>
//                 <Text>No chapters found for this unit.</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.c}>
//             <FlatList
//                 data={chapters}
//                 keyExtractor={c => c.id}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity
//                         style={styles.row}
//                         onPress={() => handlePressChapter(item)}
//                     >
//                         <Text>{item.name}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     c: { flex: 1, padding: 16 },
//     row: {
//         padding: 16,
//         borderWidth: 1,
//         borderColor: '#eee',
//         borderRadius: 10,
//         marginBottom: 10,
//     },
//     center: {
//         flex: 1,
//         padding: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

// // src/screens/subject/ChaptersScreen.tsx
// // import React, { useEffect, useState, useMemo } from 'react';
// // import {
// //     View,
// //     Text,
// //     StyleSheet,
// //     FlatList,
// //     TouchableOpacity,
// //     ActivityIndicator,
// // } from 'react-native';
// // import { NativeStackScreenProps } from '@react-navigation/native-stack';
// // import { RootStackParamList } from '../../navigation/RootNavigator';

// // // 🔹 Static data instead of Firestore
// // import { SUBJECTS, Subject, Unit, Chapter as DemoChapter } from '../../data/demo';
// // import { useTheme } from '../../theme/ThemeContext';  // ✅ global theme

// // type Props = NativeStackScreenProps<RootStackParamList, 'Chapters'>;

// // export default function ChaptersScreen({ route, navigation }: Props) {
// //     const { subjectId, unitId } = route.params;

// //     const { isDark } = useTheme();                                 // ✅ read theme
// //     const styles = useMemo(() => createStyles(isDark), [isDark]);  // ✅ themed styles

// //     const [chapters, setChapters] = useState<DemoChapter[]>([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState<string | null>(null);

// //     useEffect(() => {
// //         const loadChaptersFromDemo = () => {
// //             try {
// //                 setLoading(true);
// //                 setError(null);

// //                 // 1️⃣ Find subject
// //                 const subject: Subject | undefined = SUBJECTS.find(
// //                     s => s.id === subjectId,
// //                 );
// //                 if (!subject) {
// //                     setError('Subject not found in demo data.');
// //                     setChapters([]);
// //                     return;
// //                 }

// //                 // 2️⃣ Find unit inside that subject
// //                 const unit: Unit | undefined = subject.units.find(
// //                     u => u.id === unitId,
// //                 );
// //                 if (!unit) {
// //                     setError('Unit not found in demo data.');
// //                     setChapters([]);
// //                     return;
// //                 }

// //                 // 3️⃣ Use its chapters
// //                 setChapters(unit.chapters || []);
// //             } catch (e: any) {
// //                 console.error('[ChaptersScreen] Failed to load chapters from demo.ts', e);
// //                 setError('Failed to load chapters. Please try again.');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };

// //         loadChaptersFromDemo();
// //     }, [subjectId, unitId]);

// //     const handlePressChapter = (chapter: DemoChapter) => {
// //         navigation.navigate('ContentTabs', {
// //             subjectId,
// //             unitId,
// //             chapterId: chapter.id,
// //         });
// //     };

// //     if (loading) {
// //         return (
// //             <View style={styles.center}>
// //                 <ActivityIndicator />
// //                 <Text style={styles.centerText}>Loading chapters...</Text>
// //             </View>
// //         );
// //     }

// //     if (error) {
// //         return (
// //             <View style={styles.center}>
// //                 <Text style={styles.errorText}>{error}</Text>
// //             </View>
// //         );
// //     }

// //     if (!chapters.length) {
// //         return (
// //             <View style={styles.center}>
// //                 <Text style={styles.centerText}>
// //                     No chapters found for this unit in demo data.
// //                 </Text>
// //             </View>
// //         );
// //     }

// //     return (
// //         <View style={styles.c}>
// //             <FlatList
// //                 data={chapters}
// //                 keyExtractor={c => c.id}
// //                 contentContainerStyle={{ paddingBottom: 80 }} // space so FAB doesn't cover last item
// //                 renderItem={({ item, index }) => (
// //                     <TouchableOpacity
// //                         style={styles.row}
// //                         activeOpacity={0.8}
// //                         onPress={() => handlePressChapter(item)}
// //                     >
// //                         <Text style={styles.chapterIndex}>Chapter {index + 1}</Text>
// //                         <Text style={styles.chapterName}>{item.name}</Text>
// //                     </TouchableOpacity>
// //                 )}
// //             />

// //             {/* 🔹 Floating Home button (bottom-right) */}
// //             <TouchableOpacity
// //                 style={styles.fab}
// //                 activeOpacity={0.85}
// //                 onPress={() => navigation.navigate('HomeTabs')}
// //             >
// //                 <Text style={styles.fabText}>Home</Text>
// //             </TouchableOpacity>
// //         </View>
// //     );
// // }

// // /**
// //  * Themed styles – dark by default, switches when isDark = false
// //  */
// // const createStyles = (isDark: boolean) =>
// //     StyleSheet.create({
// //         // main screen wrapper
// //         c: {
// //             flex: 1,
// //             padding: 16,
// //             backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
// //         },

// //         // chapter card
// //         row: {
// //             paddingVertical: 14,
// //             paddingHorizontal: 12,
// //             borderRadius: 12,
// //             marginBottom: 10,
// //             backgroundColor: isDark ? '#020617' : '#FFFFFF',
// //             borderWidth: 1,
// //             borderColor: isDark ? '#1F2937' : '#E5E7EB',
// //         },
// //         chapterIndex: {
// //             fontSize: 12,
// //             color: isDark ? '#9CA3AF' : '#6B7280',
// //             marginBottom: 2,
// //             fontWeight: '500',
// //         },
// //         chapterName: {
// //             fontSize: 15,
// //             color: isDark ? '#F9FAFB' : '#111827',
// //             fontWeight: '600',
// //         },

// //         // loading / error / empty states
// //         center: {
// //             flex: 1,
// //             padding: 16,
// //             alignItems: 'center',
// //             justifyContent: 'center',
// //             backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
// //         },
// //         centerText: {
// //             marginTop: 8,
// //             fontSize: 13,
// //             color: isDark ? '#E5E7EB' : '#4B5563',
// //             textAlign: 'center',
// //         },
// //         errorText: {
// //             marginTop: 8,
// //             fontSize: 13,
// //             color: '#F97373', // bright red both themes
// //             textAlign: 'center',
// //         },

// //         // Floating Home button
// //         fab: {
// //             position: 'absolute',
// //             bottom: 24,
// //             right: 24,
// //             backgroundColor: '#4F46E5',
// //             paddingVertical: 10,
// //             paddingHorizontal: 18,
// //             borderRadius: 999,
// //             elevation: 4,
// //             shadowColor: '#000',
// //             shadowOffset: { width: 0, height: 2 },
// //             shadowOpacity: 0.25,
// //             shadowRadius: 3.5,
// //         },
// //         fabText: {
// //             color: '#F9FAFB',
// //             fontWeight: '700',
// //             fontSize: 13,
// //         },
// //     });



// src/screens/subject/ChaptersScreen.tsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { db } from '../../firebase'; // ⬅️ web SDK db (your existing setup)
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
} from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';

import { useTheme, Colors } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Chapters'>;

type ChapterNode = {
    id: string;
    name: string;
    parentId: string;
    type: string;
    order?: number;
};

export default function ChaptersScreen({ route, navigation }: Props) {
    const { subjectId, unitId } = route.params;

    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    // Set blue StatusBar when this screen is focused
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(isDark ? '#0F172A' : Colors.primary);
                StatusBar.setTranslucent(false);
            }
        }, [isDark])
    );

    const [chapters, setChapters] = useState<ChapterNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [subjectName, setSubjectName] = useState<string>('');
    const [unitName, setUnitName] = useState<string>('');

    useEffect(() => {
        if (!unitId) return;

        setLoading(true);
        setError(null);

        const qRef = firestore()
            .collection('nodes')
            .where('parentId', '==', unitId)
            .where('type', '==', 'chapter')
            .orderBy('order', 'asc'); // remove if 'order' not present

        const unsubscribe = qRef.onSnapshot(
            snapshot => {
                const list: ChapterNode[] = snapshot.docs.map(d => ({
                    id: d.id,
                    ...(d.data() as any),
                }));
                setChapters(list);
                setLoading(false);
            },
            err => {
                console.log('[ChaptersScreen] onSnapshot error', err);
                setError('Failed to load chapters. Please try again.');
                setLoading(false);
            },
        );

        // 🔁 Cleanup listener when unitId changes / screen unmounts
        return () => unsubscribe();
    }, [unitId]);


    const handlePressChapter = (chapter: ChapterNode) => {
        navigation.navigate('ContentTabs', {
            subjectId,
            unitId,
            chapterId: chapter.id,
        });
    };
    useEffect(() => {
        const loadMeta = async () => {
            try {
                if (!subjectId || !unitId) return;

                const subjectSnap = await firestore()
                    .collection('nodes')
                    .doc(subjectId)
                    .get();
                const unitSnap = await firestore()
                    .collection('nodes')
                    .doc(unitId)
                    .get();

                setSubjectName((subjectSnap.data() as any)?.name ?? '');
                setUnitName((unitSnap.data() as any)?.name ?? '');
            } catch (e) {
                console.log('[ChaptersScreen] meta load error', e);
            }
        };

        loadMeta();
    }, [subjectId, unitId]);
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={styles.centerText}>Loading chapters...</Text>
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

    if (!chapters.length) {
        return (
            <View style={styles.center}>
                <Text style={styles.centerText}>
                    No chapters found for this unit.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.c}>
            <FlatList
                data={chapters}
                keyExtractor={c => c.id}
                contentContainerStyle={{ paddingBottom: 80 }} // so FAB doesn't cover last row
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.row}
                        activeOpacity={0.8}
                        onPress={() => handlePressChapter(item)}
                    >
                        <Text style={styles.chapterIndex}>
                            {subjectName
                                ? `${subjectName} • ${unitName || 'Unit'}`
                                : unitName || 'Unit'}
                        </Text>

                        <Text style={styles.chapterName}>{item.name}</Text>

                    </TouchableOpacity>
                )}
            />

            {/* 🔹 Floating Home button (bottom-right) */}
            <TouchableOpacity
                style={styles.fab}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('HomeTabs')}
            >
                <Text style={styles.fabText}>Home</Text>
            </TouchableOpacity>
        </View>
    );
}

/**
 * Themed styles – dark by default, switches when isDark = false
 */
const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        // main screen wrapper
        c: {
            flex: 1,
            padding: 16,
            backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
        },

        // chapter card
        row: {
            paddingVertical: 14,
            paddingHorizontal: 12,
            borderRadius: 12,
            marginBottom: 10,
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        chapterIndex: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 2,
            fontWeight: '500',
        },
        chapterName: {
            fontSize: 15,
            color: isDark ? '#F9FAFB' : '#111827',
            fontWeight: '600',
        },

        // loading / error / empty states
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
            color: '#F97373', // bright red
            textAlign: 'center',
        },

        // Floating Home button
        fab: {
            position: 'absolute',
            bottom: 24,
            right: 24,
            backgroundColor: '#074e87',
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 999,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.5,
        },
        fabText: {
            color: '#F9FAFB',
            fontWeight: '700',
            fontSize: 13,
        },
    });
