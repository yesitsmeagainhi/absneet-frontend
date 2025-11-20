// // import React from 'react';
// // import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
// // import Banner from '../../components/Banner';
// // import SubjectChip from '../../components/SubjectChip';
// // import { SUBJECTS } from '../../data/demo';
// // import { useNavigation } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { RootStackParamList } from '../../navigation/rootnavigator';


// // export default function HomeScreen() {
// //     const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


// //     return (
// //         <ScrollView contentContainerStyle={styles.c}>
// //             <Banner title="Banners" />


// //             <Text style={styles.h}>Subjects</Text>
// //             <FlatList
// //                 data={SUBJECTS}
// //                 keyExtractor={s => s.id}
// //                 horizontal
// //                 showsHorizontalScrollIndicator={false}
// //                 contentContainerStyle={{ paddingRight: 16 }}
// //                 renderItem={({ item }) => (
// //                     <SubjectChip label={item.name} onPress={() => nav.navigate('SubjectDetail', { subjectId: item.id })} />
// //                 )}
// //             />


// //             <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('SelectUnitsOrChapters', { subjectId: SUBJECTS[0].id })}>
// //                 <Text>Customize MCQ As Per Subject</Text>
// //             </TouchableOpacity>


// //             <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('PYQSubjects')}>
// //                 <Text>Solve Previous Year MCQ</Text>
// //             </TouchableOpacity>


// //             <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('PYQSubjects')}>
// //                 <Text>Previous Year MCQ Papers</Text>
// //             </TouchableOpacity>
// //         </ScrollView>
// //     );
// // }
// // const styles = StyleSheet.create({
// //     c: { padding: 16, gap: 12 },
// //     h: { fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 8 },
// //     btn: { borderWidth: 1, borderColor: '#ddd', padding: 14, borderRadius: 12, marginVertical: 6 },
// // });



//FiresTore Script
// // src/screens/Home/HomeScreen.tsx
// import React, { useEffect, useMemo, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     TouchableOpacity,
//     ScrollView,
//     ActivityIndicator,
// } from 'react-native';
// import Banner from '../../components/Banner';
// import SubjectChip from '../../components/SubjectChip';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/rootnavigator';

// // 🔗 compat Firestore instance (from your earlier setup)
// import { db } from '../../services/firebase.native';

// type Nav = NativeStackNavigationProp<RootStackParamList>;

// type SubjectDoc = {
//     id: string;
//     name: string;      // expected field in your docs
//     order?: number;    // optional for sorting
//     slug?: string;
//     active?: boolean;
// };

// export default function HomeScreen() {
//     const nav = useNavigation<Nav>();

//     const [subjects, setSubjects] = useState<SubjectDoc[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [err, setErr] = useState<string | null>(null);

//     // live subscribe to subjects (nodes where type === 'subject')
//     useEffect(() => {
//         try {
//             const q = db
//                 .collection('nodes')
//                 .where('type', '==', 'subject')
//                 // If you have an 'order' field, this sorts them nicely. If not, remove.
//                 .orderBy('order', 'asc');

//             const unsub = q.onSnapshot(
//                 (snap) => {
//                     const rows: SubjectDoc[] = snap.docs.map((d) => {
//                         const data: any = d.data() || {};
//                         return {
//                             id: d.id,
//                             name: data.name ?? data.title ?? 'Untitled',
//                             order: data.order,
//                             slug: data.slug,
//                             active: data.active,
//                         };
//                     });
//                     setSubjects(rows);
//                     setLoading(false);
//                 },
//                 (e) => {
//                     console.log('[Home] subjects onSnapshot error:', e);
//                     setErr(e?.message || 'Failed to load subjects');
//                     setLoading(false);
//                 }
//             );

//             return unsub;
//         } catch (e: any) {
//             console.log('[Home] subjects subscribe error:', e);
//             setErr(e?.message || 'Failed to load subjects');
//             setLoading(false);
//         }
//     }, []);

//     const firstSubjectId = useMemo(() => subjects[0]?.id, [subjects]);

//     return (
//         <ScrollView contentContainerStyle={styles.c}>
//             {/* Top banner (you can swap to a Firestore-backed banner later) */}
//             <Banner title="Banners" />

//             {err ? (
//                 <View style={styles.warn}>
//                     <Text style={{ color: '#7a271a' }}>{err}</Text>
//                 </View>
//             ) : null}

//             <Text style={styles.h}>Subjects</Text>

//             {loading ? (
//                 <View style={{ paddingVertical: 24 }}>
//                     <ActivityIndicator />
//                 </View>
//             ) : subjects.length === 0 ? (
//                 <View style={styles.empty}>
//                     <Text style={{ color: '#666' }}>No subjects found.</Text>
//                     <Text style={{ color: '#888', marginTop: 4 }}>
//                         Add documents in <Text style={{ fontWeight: '700' }}>nodes</Text> with{' '}
//                         <Text style={{ fontWeight: '700' }}>type = "subject"</Text> and a{' '}
//                         <Text style={{ fontWeight: '700' }}>name</Text> field.
//                     </Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={subjects}
//                     keyExtractor={(s) => s.id}
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     contentContainerStyle={{ paddingRight: 16 }}
//                     renderItem={({ item }) => (
//                         <SubjectChip
//                             label={item.name}
//                             onPress={() => nav.navigate('SubjectDetail', { subjectId: item.id })}
//                         />
//                     )}
//                 />
//             )}

//             <TouchableOpacity
//                 style={[styles.btn, !firstSubjectId && { opacity: 0.5 }]}
//                 disabled={!firstSubjectId}
//                 onPress={() =>
//                     nav.navigate('SelectUnitsOrChapters', { subjectId: firstSubjectId! })
//                 }
//             >
//                 <TouchableOpacity
//                     style={[styles.btn, !firstSubjectId && { opacity: 0.5 }]}
//                     disabled={!firstSubjectId}
//                     onPress={() =>
//                         nav.navigate('CustomMCQQuiz', { subjectId: firstSubjectId! })
//                     }
//                 >
//                     <Text>Customize MCQ As Per Subject</Text>
//                 </TouchableOpacity>


//             </TouchableOpacity>

//             <TouchableOpacity style={styles.btn} onPress={() => nav.navigate('PYQSubjects')}>
//                 <Text>Solve Previous Year MCQ</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={styles.btn}
//                 onPress={() => nav.navigate('PYQPdfPapers')}
//             >
//                 <Text>Previous Year MCQ Papers</Text>
//             </TouchableOpacity>

//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     c: { padding: 16, gap: 12 },
//     h: { fontSize: 16, fontWeight: '600', marginTop: 4, marginBottom: 8 },
//     btn: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         padding: 14,
//         borderRadius: 12,
//         marginVertical: 6,
//         backgroundColor: '#fff',
//     },
//     empty: {
//         borderWidth: 1,
//         borderColor: '#eee',
//         borderRadius: 12,
//         padding: 14,
//         backgroundColor: '#fcfcfc',
//         marginBottom: 8,
//     },
//     warn: {
//         backgroundColor: '#fee2e2',
//         borderColor: '#fecaca',
//         borderWidth: 1,
//         padding: 10,
//         borderRadius: 10,
//     },
// });



// src/screens/Home/HomeScreen.tsx
import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Banner from '../../components/Banner';
import SubjectChip from '../../components/SubjectChip';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/rootnavigator';

// Static demo data
import { SUBJECTS, Subject } from '../../data/demo';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
    const nav = useNavigation<Nav>();

    const subjects: Subject[] = SUBJECTS;
    const firstSubjectId = useMemo(() => subjects[0]?.id, [subjects]);
    const isSubjectDependentDisabled = !firstSubjectId;

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.c}
                showsVerticalScrollIndicator={false}
            >
                {/* Top app bar */}
                <View style={styles.topBar}>
                    <View>
                        <Text style={styles.appTitle}>ABS NEET</Text>
                        <Text style={styles.appSubtitle}>Smart Practice App</Text>
                    </View>
                    <View style={styles.neetBadge}>
                        <Text style={styles.neetBadgeText}>NEET 2025</Text>
                    </View>
                </View>

                {/* Banner (your slider / promos) */}
                <View style={styles.bannerWrap}>
                    <Banner title="Boost your NEET score this week" />
                </View>

                {/* Hero / main highlight */}
                <View style={styles.heroCard}>
                    <Text style={styles.heroEyebrow}>Today’s Focus</Text>
                    <Text style={styles.heroTitle}>
                        Crack NEET with daily mock tests & chapter-wise practice.
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Start with mixed PYQ exams for real exam feel, then fix your weak
                        topics using subject and chapter quizzes.
                    </Text>

                    <View style={styles.heroStatsRow}>
                        <View style={styles.heroPill}>
                            <Text style={styles.heroPillLabel}>Practice Modes</Text>
                            <Text style={styles.heroPillValue}>4</Text>
                        </View>
                        <View style={styles.heroPill}>
                            <Text style={styles.heroPillLabel}>Subjects</Text>
                            <Text style={styles.heroPillValue}>{subjects.length || 0}</Text>
                        </View>
                    </View>
                </View>

                {/* Subjects row */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Your Subjects</Text>
                    {!!subjects.length && (
                        <Text style={styles.sectionMeta}>{subjects.length} loaded</Text>
                    )}
                </View>

                {subjects.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={{ color: '#6B7280', fontWeight: '500' }}>
                            No subjects in demo data.
                        </Text>
                        <Text style={{ color: '#9CA3AF', marginTop: 4, fontSize: 12 }}>
                            Add entries in <Text style={{ fontWeight: '700' }}>SUBJECTS</Text>{' '}
                            inside <Text style={{ fontWeight: '700' }}>src/data/demo.ts</Text>.
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
                                onPress={() =>
                                    nav.navigate('SubjectDetail', { subjectId: item.id })
                                }
                            />
                        )}
                    />
                )}

                {/* Practice modes / quick actions */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Practice Modes</Text>
                    <Text style={styles.sectionMeta}>Choose how you want to study</Text>
                </View>

                <View style={styles.cardGrid}>
                    {/* Custom MCQ as per Subject */}
                    <TouchableOpacity
                        style={[
                            styles.modeCard,
                            styles.modeCardPrimary,
                            isSubjectDependentDisabled && styles.modeCardDisabled,
                        ]}
                        disabled={isSubjectDependentDisabled}
                        activeOpacity={0.85}
                        onPress={() =>
                            firstSubjectId &&
                            nav.navigate('CustomMCQQuiz', { subjectId: firstSubjectId })
                        }
                    >
                        <Text style={styles.modeEmoji}>🧠</Text>
                        <Text style={styles.modeTitlePrimary}>Custom MCQ Quiz</Text>
                        <Text style={styles.modeTextPrimary}>
                            Build a quiz from selected topics of a subject.
                        </Text>
                        {isSubjectDependentDisabled && (
                            <Text style={styles.modeHintPrimary}>
                                Add at least one subject to begin.
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Previous Year MCQ – mixed exam */}
                    <TouchableOpacity
                        style={[styles.modeCard, styles.modeCardAccent]}
                        activeOpacity={0.85}
                        onPress={() => nav.navigate('PYQSubjects')}
                    >
                        <Text style={styles.modeEmoji}>📜</Text>
                        <Text style={styles.modeTitle}>Previous Year MCQ</Text>
                        <Text style={styles.modeText}>
                            Solve full NEET-style mixed MCQ sets (Physics + Chemistry + Bio).
                        </Text>
                        <Text style={styles.modeHint}>Best for real exam practice</Text>
                    </TouchableOpacity>

                    {/* Previous Year MCQ Papers PDF */}
                    <TouchableOpacity
                        style={[styles.modeCard, styles.modeCardNeutral]}
                        activeOpacity={0.85}
                        onPress={() => nav.navigate('PYQPdfPapers')}
                    >
                        <Text style={styles.modeEmoji}>📂</Text>
                        <Text style={styles.modeTitle}>PYQ Papers (PDF)</Text>
                        <Text style={styles.modeText}>
                            Download complete NEET papers in PDF for offline solving.
                        </Text>
                        <Text style={styles.modeHint}>Use with OMR sheets</Text>
                    </TouchableOpacity>

                    {/* Mock Test Papers */}
                    <TouchableOpacity
                        style={[styles.modeCard, styles.modeCardNeutral]}
                        activeOpacity={0.85}
                        onPress={() => nav.navigate('MockTestPapers')}
                    >
                        <Text style={styles.modeEmoji}>📝</Text>
                        <Text style={styles.modeTitle}>Mock Test Papers</Text>
                        <Text style={styles.modeText}>
                            Attempt full-length mock tests and track improvement.
                        </Text>
                        <Text style={styles.modeHint}>Perfect for weekend practice</Text>
                    </TouchableOpacity>
                </View>

                {/* Info strip */}
                {/* <View style={styles.infoStrip}>
                    <Text style={styles.infoStripText}>
                        Tip: Do 1 mixed PYQ paper every 2–3 days, then revise your mistakes
                        with chapter-wise MCQs.
                    </Text>
                </View> */}

                {/* Big CTA button at bottom */}
                {/* <TouchableOpacity
                    style={styles.primaryCta}
                    activeOpacity={0.9}
                    onPress={() => nav.navigate('MockTestPapers')}
                >
                    <Text style={styles.primaryCtaText}>Start Full Mock Test Now</Text>
                </TouchableOpacity> */}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#0F172A', // darker base so content pops
    },
    c: {
        padding: 16,
        gap: 16,
        paddingBottom: 28,
    },

    // Top bar
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    appTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#F9FAFB',
    },
    appSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    neetBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#22C55E',
    },
    neetBadgeText: {
        color: '#022C22',
        fontSize: 11,
        fontWeight: '700',
    },

    bannerWrap: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 4,
    },

    // Hero
    heroCard: {
        backgroundColor: '#111827',
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: '#1D4ED8',
    },
    heroEyebrow: {
        fontSize: 11,
        color: '#93C5FD',
        marginBottom: 4,
        fontWeight: '600',
    },
    heroTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#F9FAFB',
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 13,
        color: '#E5E7EB',
    },
    heroStatsRow: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 8,
    },
    heroPill: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#4B5563',
    },
    heroPillLabel: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    heroPillValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#F9FAFB',
        marginTop: 2,
    },

    // Sections
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 6,
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#E5E7EB',
    },
    sectionMeta: {
        fontSize: 12,
        color: '#9CA3AF',
    },

    empty: {
        borderWidth: 1,
        borderColor: '#1F2937',
        borderRadius: 12,
        padding: 14,
        backgroundColor: '#020617',
        marginBottom: 8,
    },

    // Practice modes grid
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    modeCard: {
        flexBasis: '48%',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
    },

    // Primary accent card (dark with bright text)
    modeCardPrimary: {
        backgroundColor: '#4F46E5',
        borderColor: '#4338CA',
    },
    modeTitlePrimary: {
        fontSize: 14,
        fontWeight: '700',
        color: '#F9FAFB',
        marginBottom: 4,
    },
    modeTextPrimary: {
        fontSize: 12,
        color: '#E5E7EB',
    },
    modeHintPrimary: {
        fontSize: 11,
        color: '#E0E7FF',
        marginTop: 6,
    },

    // Secondary cards
    modeCardAccent: {
        backgroundColor: '#0F172A',
        borderColor: '#38BDF8',
    },
    modeCardNeutral: {
        backgroundColor: '#020617',
        borderColor: '#374151',
    },
    modeCardDisabled: {
        opacity: 0.5,
    },

    modeEmoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    modeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F9FAFB',
        marginBottom: 4,
    },
    modeText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    modeHint: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 6,
    },

    // Info strip
    infoStrip: {
        marginTop: 14,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#022C22',
        borderWidth: 1,
        borderColor: '#16A34A',
    },
    infoStripText: {
        fontSize: 12,
        color: '#BBF7D0',
    },

    // Primary CTA
    primaryCta: {
        marginTop: 14,
        paddingVertical: 13,
        borderRadius: 999,
        backgroundColor: '#22C55E',
        alignItems: 'center',
    },
    primaryCtaText: {
        color: '#022C22',
        fontWeight: '700',
        fontSize: 15,
    },
});
