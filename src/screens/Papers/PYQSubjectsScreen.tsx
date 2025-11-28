// // src/screens/PYQ/PYQSubjectsScreen.tsx
// import React, { useMemo } from 'react';
// import {
//     View,
//     Text,
//     FlatList,
//     TouchableOpacity,
//     StyleSheet,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// import {
//     PYQ_PAPERS,
//     type Question,
//     type PYQPaper,
// } from '../../data/demo';

// import { useTheme } from '../../theme/ThemeContext'; // ✅ global theme

// type Props = NativeStackScreenProps<RootStackParamList, 'PYQSubjects'>;

// type YearGroup = {
//     year: number;
//     exam: string;
//     totalQuestions: number;
// };

// export default function PYQSubjectsScreen({ navigation }: Props) {
//     const { isDark } = useTheme();
//     const styles = useMemo(() => createStyles(isDark), [isDark]);

//     // 📌 Group all PYQ papers BY YEAR and combine across subjects
//     const yearGroups: YearGroup[] = useMemo(() => {
//         const byYear: Record<number, YearGroup> = {};

//         (PYQ_PAPERS as PYQPaper[]).forEach((p) => {
//             if (!byYear[p.year]) {
//                 byYear[p.year] = {
//                     year: p.year,
//                     exam: p.exam,
//                     totalQuestions: 0,
//                 };
//             }
//             byYear[p.year].totalQuestions += p.questions.length;
//         });

//         return Object.values(byYear).sort((a, b) => b.year - a.year); // latest first
//     }, []);

//     const handleStartFullExam = (year: number, exam: string) => {
//         // 🔹 Collect ALL questions for this year across ALL subjects
//         const combinedQuestions: Question[] = [];

//         (PYQ_PAPERS as PYQPaper[]).forEach((p) => {
//             if (p.year === year) {
//                 combinedQuestions.push(...p.questions);
//             }
//         });

//         if (!combinedQuestions.length) {
//             return;
//         }

//         navigation.navigate('MCQQuiz', {
//             title: `${exam} ${year} – Full Exam (All Subjects)`,
//             questions: combinedQuestions,
//         });
//     };

//     return (
//         <View style={styles.screen}>
//             <Text style={styles.heading}>Previous Year NEET MCQ – Full Exam</Text>
//             <Text style={styles.subheading}>
//                 Each paper below contains mixed questions from all subjects
//                 (Physics, Chemistry, Biology) just like the actual NEET exam.
//             </Text>

//             {yearGroups.length === 0 ? (
//                 <View style={styles.emptyWrap}>
//                     <Text style={styles.emptyText}>
//                         No previous year MCQ papers added yet.
//                     </Text>
//                 </View>
//             ) : (
//                 <FlatList
//                     data={yearGroups}
//                     keyExtractor={(item) => item.year.toString()}
//                     contentContainerStyle={{ paddingBottom: 16 }}
//                     renderItem={({ item }) => (
//                         <TouchableOpacity
//                             style={styles.row}
//                             onPress={() => handleStartFullExam(item.year, item.exam)}
//                             activeOpacity={0.7}
//                         >
//                             <Text style={styles.yearText}>
//                                 {item.exam} {item.year} – Full Exam
//                             </Text>

//                             <Text style={styles.subtitle}>
//                                 Mixed-subject MCQ paper (all subjects combined)
//                             </Text>

//                             <Text style={styles.metaText}>
//                                 Total Questions: {item.totalQuestions}
//                             </Text>
//                         </TouchableOpacity>
//                     )}
//                 />
//             )}
//         </View>
//     );
// }

// /**
//  * Theme-aware styles – dark by default, flip when isDark=false
//  */
// const createStyles = (isDark: boolean) =>
//     StyleSheet.create({
//         screen: {
//             flex: 1,
//             padding: 16,
//             backgroundColor: isDark ? '#020617' : '#F9FAFB',
//         },
//         heading: {
//             fontSize: 18,
//             fontWeight: '700',
//             color: isDark ? '#F9FAFB' : '#111827',
//             marginBottom: 4,
//         },
//         subheading: {
//             fontSize: 13,
//             color: isDark ? '#9CA3AF' : '#6B7280',
//             marginBottom: 12,
//         },
//         row: {
//             padding: 16,
//             borderWidth: 1,
//             borderColor: isDark ? '#1F2937' : '#E5E7EB',
//             borderRadius: 10,
//             marginBottom: 10,
//             backgroundColor: isDark ? '#020617' : '#FFFFFF',
//         },
//         yearText: {
//             fontSize: 16,
//             fontWeight: '600',
//             color: isDark ? '#F9FAFB' : '#111827',
//         },
//         subtitle: {
//             fontSize: 12,
//             color: isDark ? '#9CA3AF' : '#6B7280',
//             marginTop: 4,
//         },
//         metaText: {
//             fontSize: 12,
//             color: isDark ? '#E5E7EB' : '#4B5563',
//             marginTop: 4,
//         },
//         emptyWrap: {
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'center',
//         },
//         emptyText: {
//             fontSize: 14,
//             color: isDark ? '#9CA3AF' : '#6B7280',
//             textAlign: 'center',
//         },
//     });


// src/screens/PYQ/PYQSubjectsScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useTheme } from '../../theme/ThemeContext';

// 🔹 Firestore (React Native Firebase)
import firestore from '@react-native-firebase/firestore';

// Reuse Question shape used in MCQQuizScreen
type Question = {
    id: string;
    q: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
};

type PYQPaperDoc = {
    id: string;
    exam: string;
    year: number;
    title?: string;
    questions: Question[];
};

type Props = NativeStackScreenProps<RootStackParamList, 'PYQSubjects'>;

type YearGroup = {
    year: number;
    exam: string;
    totalQuestions: number;
};

export default function PYQSubjectsScreen({ navigation }: Props) {
    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const [papers, setPapers] = useState<PYQPaperDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Load PYQ papers from Firestore
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const snap = await firestore()
                    .collection('nodes')
                    .orderBy('year', 'desc') // latest papers first
                    .get();

                const list: PYQPaperDoc[] = snap.docs.map(d => {
                    const data = d.data() as any;
                    const rawQs: any[] = Array.isArray(data.questions)
                        ? data.questions
                        : [];

                    const questions: Question[] = rawQs.map((q: any, idx: number) => ({
                        id: q.id || `${d.id}_${idx}`,
                        q: q.q ?? '',
                        options: Array.isArray(q.options) ? q.options : [],
                        correctIndex:
                            typeof q.correctIndex === 'number' ? q.correctIndex : 0,
                        explanation: q.explanation,
                    }));

                    return {
                        id: d.id,
                        exam: data.exam ?? 'NEET',
                        year: Number(data.year) || 0,
                        title: data.title,
                        questions,
                    };
                });

                setPapers(list);
            } catch (e: any) {
                console.error('[PYQSubjectsScreen] Firestore load error', e);
                setError('Failed to load previous year papers. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    // 📌 Group all PYQ papers BY YEAR and combine across papers
    const yearGroups: YearGroup[] = useMemo(() => {
        const byYear: Record<number, YearGroup> = {};

        papers.forEach(p => {
            if (!p.year) return;

            if (!byYear[p.year]) {
                byYear[p.year] = {
                    year: p.year,
                    exam: p.exam || 'NEET',
                    totalQuestions: 0,
                };
            }
            byYear[p.year].totalQuestions += p.questions.length;
        });

        return Object.values(byYear).sort((a, b) => b.year - a.year); // latest first
    }, [papers]);

    const handleStartFullExam = (year: number, exam: string) => {
        // 🔹 Collect ALL questions for this year across ALL papers
        const combinedQuestions: Question[] = [];

        papers.forEach(p => {
            if (p.year === year) {
                combinedQuestions.push(...p.questions);
            }
        });

        if (!combinedQuestions.length) {
            return;
        }

        navigation.navigate('MCQQuiz', {
            title: `${exam} ${year} – Full Exam (All Subjects)`,
            questions: combinedQuestions,
        });
    };

    if (loading) {
        return (
            <View style={styles.screen}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={isDark ? '#E5E7EB' : '#4B5563'} />
                    <Text style={{ marginTop: 8, color: isDark ? '#E5E7EB' : '#6B7280' }}>
                        Loading previous year papers…
                    </Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.screen}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#F97373', textAlign: 'center' }}>{error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <Text style={styles.heading}>Previous Year NEET MCQ – Full Exam</Text>
            <Text style={styles.subheading}>
                Each paper below contains mixed questions from all subjects
                (Physics, Chemistry, Biology) just like the actual NEET exam.
            </Text>

            {yearGroups.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Text style={styles.emptyText}>
                        No previous year MCQ papers added yet.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={yearGroups}
                    keyExtractor={(item) => item.year.toString()}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => handleStartFullExam(item.year, item.exam)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.yearText}>
                                {item.exam} {item.year} – Full Exam
                            </Text>

                            <Text style={styles.subtitle}>
                                Mixed-subject MCQ paper (all subjects combined)
                            </Text>

                            <Text style={styles.metaText}>
                                Total Questions: {item.totalQuestions}
                            </Text>
                        </TouchableOpacity>
                    )}
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
        screen: {
            flex: 1,
            padding: 16,
            backgroundColor: isDark ? '#020617' : '#F9FAFB',
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
        row: {
            padding: 16,
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
            borderRadius: 10,
            marginBottom: 10,
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
        },
        yearText: {
            fontSize: 16,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#111827',
        },
        subtitle: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 4,
        },
        metaText: {
            fontSize: 12,
            color: isDark ? '#E5E7EB' : '#4B5563',
            marginTop: 4,
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
    });
