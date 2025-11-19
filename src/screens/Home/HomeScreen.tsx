// import React from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
// import Banner from '../../components/Banner';
// import SubjectChip from '../../components/SubjectChip';
// import { SUBJECTS } from '../../data/demo';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/rootnavigator';


// export default function HomeScreen() {
//     const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


//     return (
//         <ScrollView contentContainerStyle={styles.c}>
//             <Banner title="Banners" />


//             <Text style={styles.h}>Subjects</Text>
//             <FlatList
//                 data={SUBJECTS}
//                 keyExtractor={s => s.id}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={{ paddingRight: 16 }}
//                 renderItem={({ item }) => (
//                     <SubjectChip label={item.name} onPress={() => nav.navigate('SubjectDetail', { subjectId: item.id })} />
//                 )}
//             />


//             <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('SelectUnitsOrChapters', { subjectId: SUBJECTS[0].id })}>
//                 <Text>Customize MCQ As Per Subject</Text>
//             </TouchableOpacity>


//             <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('PYQSubjects')}>
//                 <Text>Solve Previous Year MCQ</Text>
//             </TouchableOpacity>


//             <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('PYQSubjects')}>
//                 <Text>Previous Year MCQ Papers</Text>
//             </TouchableOpacity>
//         </ScrollView>
//     );
// }
// const styles = StyleSheet.create({
//     c: { padding: 16, gap: 12 },
//     h: { fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 8 },
//     btn: { borderWidth: 1, borderColor: '#ddd', padding: 14, borderRadius: 12, marginVertical: 6 },
// });


// src/screens/Home/HomeScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Banner from '../../components/Banner';
import SubjectChip from '../../components/SubjectChip';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/rootnavigator';

// 🔗 compat Firestore instance (from your earlier setup)
import { db } from '../../services/firebase.native';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type SubjectDoc = {
    id: string;
    name: string;      // expected field in your docs
    order?: number;    // optional for sorting
    slug?: string;
    active?: boolean;
};

export default function HomeScreen() {
    const nav = useNavigation<Nav>();

    const [subjects, setSubjects] = useState<SubjectDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    // live subscribe to subjects (nodes where type === 'subject')
    useEffect(() => {
        try {
            const q = db
                .collection('nodes')
                .where('type', '==', 'subject')
                // If you have an 'order' field, this sorts them nicely. If not, remove.
                .orderBy('order', 'asc');

            const unsub = q.onSnapshot(
                (snap) => {
                    const rows: SubjectDoc[] = snap.docs.map((d) => {
                        const data: any = d.data() || {};
                        return {
                            id: d.id,
                            name: data.name ?? data.title ?? 'Untitled',
                            order: data.order,
                            slug: data.slug,
                            active: data.active,
                        };
                    });
                    setSubjects(rows);
                    setLoading(false);
                },
                (e) => {
                    console.log('[Home] subjects onSnapshot error:', e);
                    setErr(e?.message || 'Failed to load subjects');
                    setLoading(false);
                }
            );

            return unsub;
        } catch (e: any) {
            console.log('[Home] subjects subscribe error:', e);
            setErr(e?.message || 'Failed to load subjects');
            setLoading(false);
        }
    }, []);

    const firstSubjectId = useMemo(() => subjects[0]?.id, [subjects]);

    return (
        <ScrollView contentContainerStyle={styles.c}>
            {/* Top banner (you can swap to a Firestore-backed banner later) */}
            <Banner title="Banners" />

            {err ? (
                <View style={styles.warn}>
                    <Text style={{ color: '#7a271a' }}>{err}</Text>
                </View>
            ) : null}

            <Text style={styles.h}>Subjects</Text>

            {loading ? (
                <View style={{ paddingVertical: 24 }}>
                    <ActivityIndicator />
                </View>
            ) : subjects.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={{ color: '#666' }}>No subjects found.</Text>
                    <Text style={{ color: '#888', marginTop: 4 }}>
                        Add documents in <Text style={{ fontWeight: '700' }}>nodes</Text> with{' '}
                        <Text style={{ fontWeight: '700' }}>type = "subject"</Text> and a{' '}
                        <Text style={{ fontWeight: '700' }}>name</Text> field.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={subjects}
                    keyExtractor={(s) => s.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 16 }}
                    renderItem={({ item }) => (
                        <SubjectChip
                            label={item.name}
                            onPress={() => nav.navigate('SubjectDetail', { subjectId: item.id })}
                        />
                    )}
                />
            )}

            <TouchableOpacity
                style={[styles.btn, !firstSubjectId && { opacity: 0.5 }]}
                disabled={!firstSubjectId}
                onPress={() =>
                    nav.navigate('SelectUnitsOrChapters', { subjectId: firstSubjectId! })
                }
            >
                <TouchableOpacity
                    style={[styles.btn, !firstSubjectId && { opacity: 0.5 }]}
                    disabled={!firstSubjectId}
                    onPress={() =>
                        nav.navigate('CustomMCQQuiz', { subjectId: firstSubjectId! })
                    }
                >
                    <Text>Customize MCQ As Per Subject</Text>
                </TouchableOpacity>


            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('PYQSubjects')}>
                <Text>Solve Previous Year MCQ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('PYQSubjects')}>
                <Text>Previous Year MCQ Papers</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    c: { padding: 16, gap: 12 },
    h: { fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 8 },
    btn: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 14,
        borderRadius: 12,
        marginVertical: 6,
        backgroundColor: '#fff',
    },
    empty: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        padding: 14,
        backgroundColor: '#fcfcfc',
        marginBottom: 8,
    },
    warn: {
        backgroundColor: '#fee2e2',
        borderColor: '#fecaca',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
});
