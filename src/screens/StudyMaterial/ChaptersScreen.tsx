// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import { SUBJECTS } from '../../data/demo';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';


// export default function ChaptersScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Chapters'>) {
//     const { subjectId, unitId } = route.params;
//     const subject = SUBJECTS.find(s => s.id === subjectId)!;
//     const unit = subject.units.find(u => u.id === unitId)!;


//     return (
//         <View style={styles.c}>
//             <FlatList
//                 data={unit.chapters}
//                 keyExtractor={c => c.id}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ContentTabs', { subjectId, unitId, chapterId: item.id })}>
//                         <Text>{item.name}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//         </View>
//     );
// }
// const styles = StyleSheet.create({ c: { flex: 1, padding: 16 }, row: { padding: 16, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginBottom: 10 } });

//Firestore
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



// src/screens/subject/ChaptersScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

// 🔹 Static data instead of Firestore
import { SUBJECTS, Subject, Unit, Chapter as DemoChapter } from '../../data/demo';

type Props = NativeStackScreenProps<RootStackParamList, 'Chapters'>;

export default function ChaptersScreen({ route, navigation }: Props) {
    const { subjectId, unitId } = route.params;

    const [chapters, setChapters] = useState<DemoChapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadChaptersFromDemo = () => {
            try {
                setLoading(true);
                setError(null);

                // 1️⃣ Find subject
                const subject: Subject | undefined = SUBJECTS.find(
                    s => s.id === subjectId,
                );
                if (!subject) {
                    setError('Subject not found in demo data.');
                    setChapters([]);
                    return;
                }

                // 2️⃣ Find unit inside that subject
                const unit: Unit | undefined = subject.units.find(
                    u => u.id === unitId,
                );
                if (!unit) {
                    setError('Unit not found in demo data.');
                    setChapters([]);
                    return;
                }

                // 3️⃣ Use its chapters
                setChapters(unit.chapters || []);
            } catch (e: any) {
                console.error('[ChaptersScreen] Failed to load chapters from demo.ts', e);
                setError('Failed to load chapters. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadChaptersFromDemo();
    }, [subjectId, unitId]);

    const handlePressChapter = (chapter: DemoChapter) => {
        navigation.navigate('ContentTabs', {
            subjectId,
            unitId,
            chapterId: chapter.id,
        });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8 }}>Loading chapters...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text>{error}</Text>
            </View>
        );
    }

    if (!chapters.length) {
        return (
            <View style={styles.center}>
                <Text>No chapters found for this unit in demo data.</Text>
            </View>
        );
    }

    return (
        <View style={styles.c}>
            <FlatList
                data={chapters}
                keyExtractor={c => c.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => handlePressChapter(item)}
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    c: { flex: 1, padding: 16 },
    row: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        marginBottom: 10,
    },
    center: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
