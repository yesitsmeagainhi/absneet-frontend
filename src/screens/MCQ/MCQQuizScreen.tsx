//Firestore
// // src/screens/MCQ/MCQQuizScreen.tsx
// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
//     ActivityIndicator,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// import { db } from '../../firebase';
// import { doc, getDoc } from 'firebase/firestore';

// type Props = NativeStackScreenProps<RootStackParamList, 'MCQQuiz'>;

// type Question = {
//     id: string;
//     q: string;
//     options: string[];
//     correctIndex: number;
//     explanation?: string;   // 🔹 explanation for right answer
// };

// type ChapterDoc = {
//     name?: string;
//     questions?: Question[];
// };

// export default function MCQQuizScreen({ route, navigation }: Props) {
//     const { subjectId, unitId, chapterId, questions: routeQuestions, title } = route.params || {};

//     const [chapter, setChapter] = useState<ChapterDoc | null>(null);
//     const [questions, setQuestions] = useState<Question[]>([]);
//     const [idx, setIdx] = useState(0);
//     const [answers, setAnswers] = useState<number[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // 🔹 Load questions: from route (PYQ/custom) OR from Firestore (chapter MCQ)
//     useEffect(() => {
//         const load = async () => {
//             try {
//                 // 1️⃣ If questions are passed via route → use them directly (PYQ mode/custom mode)
//                 if (routeQuestions && routeQuestions.length > 0) {
//                     const qs = routeQuestions as Question[];
//                     setQuestions(qs);
//                     setChapter({ name: title }); // optional header
//                     setIdx(0);
//                     setAnswers(new Array(qs.length).fill(-1));
//                     setLoading(false);
//                     return;
//                 }

//                 // 2️⃣ Else, normal chapter-wise mode (load from Firestore)
//                 if (!chapterId) {
//                     setError('No chapter selected.');
//                     setLoading(false);
//                     return;
//                 }

//                 const ref = doc(db, 'nodes', chapterId);
//                 const snap = await getDoc(ref);

//                 if (!snap.exists()) {
//                     setError('Chapter not found.');
//                     setLoading(false);
//                     return;
//                 }

//                 const data = snap.data() as ChapterDoc;
//                 const qs = data.questions || [];

//                 setChapter(data);
//                 setQuestions(qs);
//                 setIdx(0);
//                 setAnswers(new Array(qs.length).fill(-1));
//             } catch (e: any) {
//                 console.error('[MCQQuizScreen] load error', e);
//                 setError('Failed to load questions.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         load();
//     }, [chapterId, routeQuestions, title]);

//     // 🔹 Loading / error states
//     if (loading) {
//         return (
//             <View style={styles.cCenter}>
//                 <ActivityIndicator />
//                 <Text style={{ marginTop: 8 }}>Loading questions…</Text>
//             </View>
//         );
//     }

//     if (error) {
//         return (
//             <View style={styles.cCenter}>
//                 <Text>{error}</Text>
//             </View>
//         );
//     }

//     if (!questions.length) {
//         return (
//             <View style={styles.cCenter}>
//                 <Text>No questions in this quiz.</Text>
//             </View>
//         );
//     }

//     const q = questions[idx];

//     // const select = (choice: number) => {
//     //     const next = [...answers];
//     //     next[idx] = choice;

//     //     if (idx + 1 < questions.length) {
//     //         setAnswers(next);
//     //         setIdx(idx + 1);
//     //     } else {
//     //         // compute score
//     //         const correct = questions.reduce(
//     //             (acc, qq, i) =>
//     //                 acc + ((next[i] ?? -1) === qq.correctIndex ? 1 : 0),
//     //             0,
//     //         );

//     //         // 🔹 navigate to Result screen with full data for Review
//     //         navigation.replace('Result', {
//     //             title: title || chapter?.name || 'Quiz Result',
//     //             correct,
//     //             total: questions.length,
//     //             questions,
//     //             answers: next, // index of chosen option per question
//     //         });
//     //     }
//     // };

//     // inside MCQQuizScreen.tsx, in select()
//     const select = (choice: number) => {
//         const next = [...answers];
//         next[idx] = choice;

//         if (idx + 1 < questions.length) {
//             setAnswers(next);
//             setIdx(idx + 1);
//         } else {
//             const correct = questions.reduce(
//                 (acc, qq, i) => acc + ((next[i] ?? -1) === qq.correctIndex ? 1 : 0),
//                 0,
//             );

//             navigation.replace('Result', {
//                 correct,
//                 total: questions.length,
//                 questions,  // 🔹 full questions array
//                 answers: next, // 🔹 chosen option index per question (0–3 or -1)
//             });
//         }
//     };

//     return (
//         <View style={styles.c}>
//             <Text style={styles.h}>
//                 {idx + 1}/{questions.length}
//             </Text>

//             {title ? (
//                 <Text style={styles.quizTitle}>{title}</Text>
//             ) : chapter?.name ? (
//                 <Text style={styles.chapterName}>{chapter.name}</Text>
//             ) : null}

//             <Text style={styles.q}>{q.q}</Text>

//             {q.options.map((opt, i) => (
//                 <TouchableOpacity
//                     key={i}
//                     style={styles.opt}
//                     onPress={() => select(i)}
//                 >
//                     <Text>{opt}</Text>
//                 </TouchableOpacity>
//             ))}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     c: {
//         flex: 1,
//         padding: 16,
//         gap: 10,
//         backgroundColor: '#F9FAFB',
//     },
//     cCenter: {
//         flex: 1,
//         padding: 16,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     h: {
//         fontWeight: '700',
//         fontSize: 14,
//         color: '#4B5563',
//     },
//     quizTitle: {
//         fontSize: 16,
//         fontWeight: '700',
//         marginTop: 4,
//         marginBottom: 4,
//         color: '#111827',
//     },
//     chapterName: {
//         fontSize: 14,
//         marginTop: 4,
//         marginBottom: 4,
//         color: '#555',
//     },
//     q: {
//         fontSize: 16,
//         marginVertical: 8,
//         color: '#111827',
//     },
//     opt: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         padding: 14,
//         borderRadius: 10,
//         marginBottom: 8,
//         backgroundColor: '#FFFFFF',
//     },
// });



// src/screens/MCQ/MCQQuizScreen.tsx
// src/screens/MCQ/MCQQuizScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

// 🔹 Static data
import {
    SUBJECTS,
    Subject,
    Unit,
    Chapter,
    Question as DemoQuestion,
} from '../../data/demo';

type Props = NativeStackScreenProps<RootStackParamList, 'MCQQuiz'>;

// Reuse Question type from demo.ts
type Question = DemoQuestion;

type ChapterDoc = {
    name?: string;
    questions?: Question[];
};

export default function MCQQuizScreen({ route, navigation }: Props) {
    const { subjectId, unitId, chapterId, questions: routeQuestions, title } =
        route.params || {};

    const [chapter, setChapter] = useState<ChapterDoc | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Load questions:
    //    1) From route (PYQ/custom)
    //    2) From demo.ts (chapter-wise MCQ)
    useEffect(() => {
        const load = () => {
            try {
                setLoading(true);
                setError(null);

                // 1️⃣ If questions are passed via route → use them directly (PYQ/custom mode)
                if (routeQuestions && (routeQuestions as Question[]).length > 0) {
                    const qs = routeQuestions as Question[];
                    setQuestions(qs);
                    setChapter({ name: title });
                    setIdx(0);
                    setAnswers(new Array(qs.length).fill(-1)); // -1 = not answered
                    return;
                }

                // 2️⃣ Else, chapter-wise mode → load from static SUBJECTS in demo.ts
                if (!subjectId || !unitId || !chapterId) {
                    setError('No chapter selected.');
                    return;
                }

                // Find subject
                const subject: Subject | undefined = SUBJECTS.find(
                    s => s.id === subjectId,
                );
                if (!subject) {
                    setError('Subject not found in demo data.');
                    return;
                }

                // Find unit
                const unit: Unit | undefined = subject.units.find(
                    u => u.id === unitId,
                );
                if (!unit) {
                    setError('Unit not found in demo data.');
                    return;
                }

                // Find chapter
                const ch: Chapter | undefined = unit.chapters.find(
                    c => c.id === chapterId,
                );
                if (!ch) {
                    setError('Chapter not found in demo data.');
                    return;
                }

                const qs = ch.questions || [];
                setChapter({ name: ch.name, questions: qs });
                setQuestions(qs);
                setIdx(0);
                setAnswers(new Array(qs.length).fill(-1));
            } catch (e: any) {
                console.error('[MCQQuizScreen] load error (demo.ts)', e);
                setError('Failed to load questions.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [subjectId, unitId, chapterId, routeQuestions, title]);

    // 🔹 Loading / error states
    if (loading) {
        return (
            <View style={styles.cCenter}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8 }}>Loading questions…</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.cCenter}>
                <Text>{error}</Text>
            </View>
        );
    }

    if (!questions.length) {
        return (
            <View style={styles.cCenter}>
                <Text>No questions in this quiz.</Text>
            </View>
        );
    }

    const total = questions.length;
    const q = questions[idx];

    const isFirst = idx === 0;
    const isLast = idx === total - 1;

    // 🔹 Select option → only marks answer, no auto-next
    const handleSelect = (choice: number) => {
        const next = [...answers];
        next[idx] = choice;
        setAnswers(next);
    };

    // 🔹 Previous / Next / Submit handlers
    const handlePrev = () => {
        if (!isFirst) {
            setIdx(idx - 1);
        }
    };

    const handleSubmit = () => {
        const correct = questions.reduce(
            (acc, qq, i) => acc + ((answers[i] ?? -1) === qq.correctIndex ? 1 : 0),
            0,
        );

        navigation.replace('Result', {
            title: title || chapter?.name || 'Quiz Result',
            correct,
            total: questions.length,
            questions,   // from demo.ts or route
            answers,     // number[]
        });
    };

    const handleNext = () => {
        if (isLast) {
            handleSubmit();
        } else {
            setIdx(idx + 1);
        }
    };

    const nextLabel = isLast ? 'Submit Quiz' : 'Next';

    return (
        <View style={styles.c}>
            <Text style={styles.h}>
                {idx + 1}/{questions.length}
            </Text>

            {title ? (
                <Text style={styles.quizTitle}>{title}</Text>
            ) : chapter?.name ? (
                <Text style={styles.chapterName}>{chapter.name}</Text>
            ) : null}

            <Text style={styles.q}>{q.q}</Text>

            {q.options.map((opt, i) => {
                const selected = answers[idx] === i;
                return (
                    <TouchableOpacity
                        key={i}
                        style={[
                            styles.opt,
                            selected && styles.optSelected,
                        ]}
                        onPress={() => handleSelect(i)}
                    >
                        <Text
                            style={[
                                styles.optText,
                                selected && styles.optTextSelected,
                            ]}
                        >
                            {opt}
                        </Text>
                    </TouchableOpacity>
                );
            })}

            {/* Bottom navigation bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[
                        styles.navBtn,
                        isFirst && styles.navBtnDisabled,
                    ]}
                    disabled={isFirst}
                    onPress={handlePrev}
                >
                    <Text
                        style={[
                            styles.navBtnText,
                            isFirst && styles.navBtnTextDisabled,
                        ]}
                    >
                        Previous
                    </Text>
                </TouchableOpacity>

                <Text style={styles.progressText}>
                    Q {idx + 1} / {total}
                </Text>

                <TouchableOpacity
                    style={styles.navBtnPrimary}
                    onPress={handleNext}
                >
                    <Text style={styles.navBtnPrimaryText}>{nextLabel}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    c: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F9FAFB',
    },
    cCenter: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    h: {
        fontWeight: '700',
        fontSize: 14,
        color: '#4B5563',
    },
    quizTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 4,
        marginBottom: 4,
        color: '#111827',
    },
    chapterName: {
        fontSize: 14,
        marginTop: 4,
        marginBottom: 4,
        color: '#555',
    },
    q: {
        fontSize: 16,
        marginVertical: 12,
        color: '#111827',
    },
    opt: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 14,
        borderRadius: 10,
        marginBottom: 8,
        backgroundColor: '#FFFFFF',
    },
    optSelected: {
        borderColor: '#6D28D9',
        backgroundColor: '#EDE9FE',
    },
    optText: {
        fontSize: 14,
        color: '#111827',
    },
    optTextSelected: {
        fontWeight: '600',
    },

    bottomBar: {
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 12,
    },
    navBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: '#E5E7EB',
    },
    navBtnDisabled: {
        backgroundColor: '#F3F4F6',
    },
    navBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
    },
    navBtnTextDisabled: {
        color: '#9CA3AF',
    },
    progressText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    navBtnPrimary: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 999,
        backgroundColor: '#6D28D9',
    },
    navBtnPrimaryText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
