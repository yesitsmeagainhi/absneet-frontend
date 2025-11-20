

// src/screens/MCQ/DemoMCQQuizScreen.tsx
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { SUBJECTS, Question as DemoQuestion } from '../../data/demo';

type Props = NativeStackScreenProps<RootStackParamList, 'DemoMCQQuiz'>;

type OptionKey = 'A' | 'B' | 'C' | 'D';

type McqDoc = {
    id: string;
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

export default function DemoMCQQuizScreen({ route, navigation }: Props) {
    const { subjectId } = route.params;

    // 1️⃣ Flatten all questions for this subject from local SUBJECTS
    const mcqs: McqDoc[] = useMemo(() => {
        const letters: OptionKey[] = ['A', 'B', 'C', 'D'];
        const subj = SUBJECTS.find(s => s.id === subjectId);
        if (!subj) return [];

        const collected: McqDoc[] = [];

        subj.units.forEach(unit => {
            unit.chapters.forEach(ch => {
                (ch.questions || []).forEach((q: DemoQuestion, idx) => {
                    const opts = q.options || [];
                    const correctIdx =
                        typeof q.correctIndex === 'number' ? q.correctIndex : 0;
                    const correctLetter: OptionKey = letters[correctIdx] ?? 'A';

                    collected.push({
                        id: q.id || `${ch.id}_${idx}`,
                        question: q.q,
                        options: {
                            A: opts[0] ?? '',
                            B: opts[1] ?? '',
                            C: opts[2] ?? '',
                            D: opts[3] ?? '',
                        },
                        correctOption: correctLetter,
                        explanation: q.explanation,
                    });
                });
            });
        });

        return collected;
    }, [subjectId]);

    const total = mcqs.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, OptionKey | null>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = total > 0 ? mcqs[currentIndex] : null;

    const handleSelectOption = (mcqId: string, option: OptionKey) => {
        if (submitted) return;
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
        if (currentIndex > 0) setCurrentIndex(i => i - 1);
    };

    const goNext = () => {
        if (currentIndex < total - 1) setCurrentIndex(i => i + 1);
    };

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === total - 1;

    const nextBtnLabel = !submitted
        ? isLast
            ? 'Submit Quiz'
            : 'Next'
        : 'Next';

    const nextBtnDisabled = submitted ? isLast : false;

    const onPressNext = () => {
        if (!submitted) {
            if (isLast) {
                handleSubmit();
            } else {
                goNext();
            }
        } else {
            if (!isLast) {
                goNext();
            }
        }
    };

    return (
        <View style={styles.c}>
            <Text style={styles.title}>Demo MCQ Quiz</Text>
            <Text style={styles.subtitle}>Total Questions: {total}</Text>

            {total === 0 && (
                <View style={styles.center}>
                    <Text style={{ color: '#555', textAlign: 'center' }}>
                        No demo questions found for this subject.
                    </Text>
                </View>
            )}

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

            {total > 0 && currentQuestion && (
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
                                const isCorrect =
                                    submitted && currentQuestion.correctOption === key;
                                const isWrong =
                                    submitted &&
                                    isSelected &&
                                    currentQuestion.correctOption !== key;

                                let bg = '#fff';
                                let border = '#e5e5e5';
                                let txt = '#111';

                                if (!submitted && isSelected) {
                                    bg = '#EDE9FE';
                                    border = '#6D28D9';
                                }

                                if (submitted) {
                                    if (isCorrect) {
                                        bg = '#DCFCE7';
                                        border = '#16A34A';
                                    } else if (isWrong) {
                                        bg = '#FEE2E2';
                                        border = '#DC2626';
                                    }
                                }

                                return (
                                    <TouchableOpacity
                                        key={key}
                                        style={[
                                            styles.optBtn,
                                            { backgroundColor: bg, borderColor: border },
                                        ]}
                                        disabled={submitted}
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

                            {/* Show explanation only when user got it wrong */}
                            {submitted && (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.answerSummary}>
                                        Your answer:{' '}
                                        {answers[currentQuestion.id]
                                            ? `${answers[currentQuestion.id]}. ${currentQuestion.options?.[
                                            answers[currentQuestion.id] as OptionKey
                                            ]
                                            }${answers[currentQuestion.id] ===
                                                currentQuestion.correctOption
                                                ? ' (Correct)'
                                                : ' (Wrong)'
                                            }`
                                            : 'Not answered'}
                                    </Text>

                                    <Text style={styles.answerSummary}>
                                        Correct answer:{' '}
                                        {currentQuestion.correctOption}.{' '}
                                        {currentQuestion.options?.[
                                            currentQuestion.correctOption
                                        ]}
                                    </Text>

                                    {currentQuestion.explanation &&
                                        answers[currentQuestion.id] &&
                                        answers[currentQuestion.id] !==
                                        currentQuestion.correctOption && (
                                            <View style={{ marginTop: 6 }}>
                                                <Text style={styles.explanationLabel}>
                                                    Explanation:
                                                </Text>
                                                <Text style={styles.explanationText}>
                                                    {currentQuestion.explanation}
                                                </Text>
                                            </View>
                                        )}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            )}

            {total > 0 && (
                <View style={styles.bottomBar}>
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
                            style={[
                                styles.navBtn,
                                nextBtnDisabled && styles.navBtnDisabled,
                            ]}
                            disabled={nextBtnDisabled}
                            onPress={onPressNext}
                        >
                            <Text
                                style={[
                                    styles.navBtnText,
                                    nextBtnDisabled && styles.navBtnTextDisabled,
                                ]}
                            >
                                {nextBtnLabel}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {submitted && (
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

    questionContainer: { flex: 1, marginTop: 4 },
    qCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
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
        marginTop: 2,
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
        marginBottom: 6,
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
