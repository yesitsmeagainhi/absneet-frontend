// src/screens/MCQ/SelectUnitsOrChaptersScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

// 🔹 Static data instead of Firestore
import { SUBJECTS, Question as DemoQuestion, Subject } from '../../data/demo';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectUnitsOrChapters'>;

type OptionKey = 'A' | 'B' | 'C' | 'D';

type McqDoc = {
    id: string;
    subjectId?: string;
    unitId?: string;
    chapterId?: string;
    question: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correctOption: OptionKey;
    explanation?: string;
};

export default function SelectUnitsOrChaptersScreen({ route, navigation }: Props) {
    // We expect subjectId to be passed from previous screen
    const initialSubjectId = route.params?.subjectId ?? '';

    const [loading, setLoading] = useState(false);
    const [mcqs, setMcqs] = useState<McqDoc[]>([]);
    const [answers, setAnswers] = useState<Record<string, OptionKey | null>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0); // one question per screen

    useEffect(() => {
        if (!initialSubjectId) {
            console.warn('[SelectUnitsOrChapters] No subjectId passed in route params');
            return;
        }

        const buildMcqsFromDemo = () => {
            try {
                setLoading(true);

                const subject: Subject | undefined = SUBJECTS.find(
                    s => s.id === initialSubjectId,
                );

                if (!subject) {
                    console.warn(
                        '[SelectUnitsOrChapters] Subject not found in demo.ts for id =',
                        initialSubjectId,
                    );
                    setMcqs([]);
                    setAnswers({});
                    setCurrentIndex(0);
                    setSubmitted(false);
                    setScore(0);
                    return;
                }

                const letters: OptionKey[] = ['A', 'B', 'C', 'D'];
                const collected: McqDoc[] = [];

                subject.units.forEach(unit => {
                    unit.chapters.forEach(chapter => {
                        const qs: DemoQuestion[] = chapter.questions || [];
                        qs.forEach((qObj, idx) => {
                            const opts = qObj.options || [];

                            const optMap = {
                                A: opts[0] ?? '',
                                B: opts[1] ?? '',
                                C: opts[2] ?? '',
                                D: opts[3] ?? '',
                            };

                            const correctLetter: OptionKey =
                                letters[qObj.correctIndex] ?? 'A';

                            collected.push({
                                id: qObj.id || `${chapter.id}_${idx}`,
                                subjectId: subject.id,
                                unitId: unit.id,
                                chapterId: chapter.id,
                                question: qObj.q,
                                options: optMap,
                                correctOption: correctLetter,
                                explanation: qObj.explanation,
                            });
                        });
                    });
                });

                console.log(
                    '[SelectUnitsOrChapters] total MCQs collected from demo.ts =',
                    collected.length,
                );

                setMcqs(collected);

                const initialAnswers: Record<string, OptionKey | null> = {};
                collected.forEach(r => {
                    initialAnswers[r.id] = null;
                });
                setAnswers(initialAnswers);
                setCurrentIndex(0);
                setSubmitted(false);
                setScore(0);
            } finally {
                setLoading(false);
            }
        };

        buildMcqsFromDemo();
    }, [initialSubjectId]);

    const total = mcqs.length;
    const currentQuestion = total > 0 ? mcqs[currentIndex] : null;

    const handleSelectOption = (mcqId: string, option: OptionKey) => {
        if (submitted) return; // lock after submit
        setAnswers(prev => ({
            ...prev,
            [mcqId]: option,
        }));
    };

    const handleSubmit = () => {
        if (!mcqs.length) return;

        let correct = 0;
        mcqs.forEach(q => {
            if (answers[q.id] && answers[q.id] === q.correctOption) {
                correct += 1;
            }
        });

        setScore(correct);
        setSubmitted(true);
    };

    const handleRetake = () => {
        const resetAnswers: Record<string, OptionKey | null> = {};
        mcqs.forEach(q => {
            resetAnswers[q.id] = null;
        });
        setAnswers(resetAnswers);
        setScore(0);
        setSubmitted(false);
        setCurrentIndex(0);
    };

    const goPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(i => i - 1);
        }
    };

    const goNext = () => {
        if (currentIndex < total - 1) {
            setCurrentIndex(i => i + 1);
        }
    };

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === total - 1;

    const nextBtnLabel = isLast ? 'Submit Quiz' : 'Next';

    const onPressNext = () => {
        if (isLast) {
            handleSubmit();
        } else {
            goNext();
        }
    };

    return (
        <View style={styles.c}>
            {/* Header */}
            <Text style={styles.title}>Subject MCQ Quiz</Text>
            <Text style={styles.subtitle}>
                Total Questions: {loading ? '...' : total}
            </Text>

            {/* Loading state */}
            {loading && (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                    <Text style={{ marginTop: 8 }}>Loading questions...</Text>
                </View>
            )}

            {/* No questions */}
            {!loading && !total && (
                <View style={styles.center}>
                    <Text style={{ textAlign: 'center', color: '#555' }}>
                        No MCQs found for this subject yet.
                    </Text>
                </View>
            )}

            {/* Result summary (top) */}
            {submitted && total > 0 && (
                <View style={styles.resultCard}>
                    <Text style={styles.resultText}>
                        Score: {score} / {total}
                    </Text>
                    <Text style={styles.resultSub}>
                        Accuracy: {((score / total) * 100).toFixed(1)}%
                    </Text>
                </View>
            )}

            {/* QUIZ MODE: One question per screen (like before) */}
            {!loading && !submitted && total > 0 && currentQuestion && (
                <View style={styles.questionContainer}>
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 24 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.qCard}>
                            <Text style={styles.qIndex}>
                                Question {currentIndex + 1} of {total}
                            </Text>
                            <Text style={styles.qText}>{currentQuestion.question}</Text>

                            {(['A', 'B', 'C', 'D'] as OptionKey[]).map(key => {
                                const userAns = answers[currentQuestion.id];
                                const isSelected = userAns === key;

                                let bg = '#fff';
                                let border = '#e5e5e5';
                                let txt = '#111';

                                if (isSelected) {
                                    bg = '#EDE9FE';
                                    border = '#6D28D9';
                                }

                                return (
                                    <TouchableOpacity
                                        key={key}
                                        style={[
                                            styles.optBtn,
                                            { backgroundColor: bg, borderColor: border },
                                        ]}
                                        activeOpacity={0.7}
                                        onPress={() =>
                                            handleSelectOption(currentQuestion.id, key)
                                        }
                                    >
                                        <Text style={[styles.optKey, { color: txt }]}>
                                            {key}.
                                        </Text>
                                        <Text style={[styles.optText, { color: txt }]}>
                                            {currentQuestion.options?.[key]}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* REVIEW MODE: Like CustomMCQSolveScreen – FlatList of all questions */}
            {submitted && total > 0 && (
                <FlatList
                    data={mcqs}
                    keyExtractor={item => item.id}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    renderItem={({ item, index }) => {
                        const userAns = answers[item.id];
                        const showExplanation =
                            item.explanation && userAns !== item.correctOption;

                        return (
                            <View style={styles.qCard}>
                                <Text style={styles.qText}>
                                    Q{index + 1}. {item.question}
                                </Text>

                                {(['A', 'B', 'C', 'D'] as OptionKey[]).map(key => {
                                    const isSelected = userAns === key;
                                    const isCorrect = item.correctOption === key;
                                    const isWrong = isSelected && !isCorrect;

                                    let bg = '#fff';
                                    let border = '#e5e5e5';
                                    let txt = '#111';

                                    if (isCorrect) {
                                        bg = '#DCFCE7';
                                        border = '#16A34A';
                                    } else if (isWrong) {
                                        bg = '#FEE2E2';
                                        border = '#DC2626';
                                    }

                                    return (
                                        <View
                                            key={key}
                                            style={[
                                                styles.optBtn,
                                                { backgroundColor: bg, borderColor: border },
                                            ]}
                                        >
                                            <Text style={[styles.optKey, { color: txt }]}>
                                                {key}.
                                            </Text>
                                            <Text style={[styles.optText, { color: txt }]}>
                                                {item.options?.[key]}
                                            </Text>
                                        </View>
                                    );
                                })}

                                {/* Correct answer line */}
                                <Text style={styles.answerSummary}>
                                    Correct answer:{' '}
                                    {item.correctOption}.{' '}
                                    {item.options?.[item.correctOption]}
                                </Text>

                                {/* Explanation if wrong / not answered */}
                                {showExplanation && (
                                    <View style={{ marginTop: 6 }}>
                                        <Text style={styles.explanationLabel}>
                                            Explanation:
                                        </Text>
                                        <Text style={styles.explanationText}>
                                            {item.explanation}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        );
                    }}
                />
            )}

            {/* Bottom actions: navigation (quiz) + retake/back (review) */}
            {!loading && total > 0 && (
                <View style={styles.bottomBar}>
                    {!submitted ? (
                        <View style={styles.navRow}>
                            <TouchableOpacity
                                style={[
                                    styles.navBtn,
                                    isFirst && styles.navBtnDisabled,
                                ]}
                                disabled={isFirst}
                                onPress={goPrev}
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
                                Q {currentIndex + 1} / {total}
                            </Text>

                            <TouchableOpacity
                                style={styles.navBtnPrimary}
                                onPress={onPressNext}
                            >
                                <Text style={styles.navBtnPrimaryText}>
                                    {nextBtnLabel}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={[styles.primaryBtn, { flex: 1 }]}
                                onPress={handleRetake}
                            >
                                <Text style={styles.primaryBtnText}>Retake Quiz</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.secondaryBtn, { flex: 1 }]}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.secondaryBtnText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    c: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 4, color: '#111827' },
    subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 12 },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    questionContainer: {
        flex: 1,
        marginTop: 4,
    },

    qCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    qIndex: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    qText: { fontSize: 15, fontWeight: '600', marginBottom: 10, color: '#111827' },

    optBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 6,
    },
    optKey: { fontWeight: '700', marginRight: 8 },
    optText: { flex: 1, fontSize: 14 },

    resultCard: {
        backgroundColor: '#EEF2FF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#C7D2FE',
    },
    resultText: { fontSize: 16, fontWeight: '700', color: '#1D4ED8' },
    resultSub: { fontSize: 13, color: '#4B5563', marginTop: 2 },

    answerSummary: {
        fontSize: 13,
        color: '#374151',
        marginTop: 4,
    },
    explanationLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#111827',
    },
    explanationText: {
        fontSize: 13,
        color: '#4B5563',
        marginTop: 2,
    },

    bottomBar: {
        paddingTop: 8,
        paddingBottom: 12,
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
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
    progressText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },

    actionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 6,
    },
    primaryBtn: {
        backgroundColor: '#6D28D9',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    secondaryBtn: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
    },
    secondaryBtnText: {
        color: '#111827',
        fontWeight: '600',
        fontSize: 14,
    },
});
