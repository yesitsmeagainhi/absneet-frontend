
// src/screens/SelectUnitsOrChaptersScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectUnitsOrChapters'>;

type OptionKey = 'A' | 'B' | 'C' | 'D';

// How questions are stored in chapter docs (ChaptersPage)
type RawQuestion = {
    id?: string;
    q: string;
    options: string[];     // ['opt1','opt2','opt3','opt4']
    correctIndex: number;  // 0-based index into options[]
    explanation?: string;  // optional explanation field in Firestore
    exp?: string;          // fallback key if you used "exp"
};

type RawChapterDoc = {
    subjectId?: string;
    unitId?: string;
    questions?: RawQuestion[];
};

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
    const [currentIndex, setCurrentIndex] = useState(0); // 👈 one question per screen

    useEffect(() => {
        if (!initialSubjectId) {
            console.warn('[SelectUnitsOrChapters] No subjectId passed in route params');
            return;
        }

        const loadMcqs = async () => {
            try {
                setLoading(true);

                // 🔹 STEP 1: load all chapters for this subject from "nodes"
                const chaptersQ = query(
                    collection(db, 'nodes'),
                    where('type', '==', 'chapter'),
                    where('subjectId', '==', initialSubjectId),
                );
                const snap = await getDocs(chaptersQ);

                console.log(
                    '[SelectUnitsOrChapters] chapters found =',
                    snap.docs.length,
                );

                const collected: McqDoc[] = [];
                const letters: OptionKey[] = ['A', 'B', 'C', 'D'];

                snap.docs.forEach((docSnap) => {
                    const data = docSnap.data() as RawChapterDoc & { subjectId?: string; unitId?: string };
                    const chapterId = docSnap.id;
                    const qs = data.questions || [];

                    console.log(
                        `[SelectUnitsOrChapters] chapter ${chapterId} has questions =`,
                        qs.length,
                    );

                    qs.forEach((qObj, qIdx) => {
                        const opts = qObj.options || [];

                        const optMap = {
                            A: opts[0] ?? '',
                            B: opts[1] ?? '',
                            C: opts[2] ?? '',
                            D: opts[3] ?? '',
                        };

                        const idx = typeof qObj.correctIndex === 'number' ? qObj.correctIndex : 0;
                        const correctLetter: OptionKey = letters[idx] ?? 'A';

                        const explanation =
                            (qObj.explanation ?? qObj.exp ?? '') || undefined;

                        collected.push({
                            id: qObj.id || `${chapterId}_${qIdx}`, // unique ID per question
                            subjectId: data.subjectId,
                            unitId: data.unitId,
                            chapterId,
                            question: qObj.q,
                            options: optMap,
                            correctOption: correctLetter,
                            explanation,
                        });
                    });
                });

                console.log(
                    '[SelectUnitsOrChapters] total MCQs collected =',
                    collected.length,
                );

                setMcqs(collected);

                // Initialize answers map + reset current question
                const initialAnswers: Record<string, OptionKey | null> = {};
                collected.forEach(r => {
                    initialAnswers[r.id] = null;
                });
                setAnswers(initialAnswers);
                setCurrentIndex(0);
                setSubmitted(false);
                setScore(0);
            } catch (err) {
                console.error('[SelectUnitsOrChapters] Error loading MCQs', err);
            } finally {
                setLoading(false);
            }
        };

        loadMcqs();
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

    // Next/Submit button behavior
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

            {/* Result summary */}
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

            {/* ONE QUESTION PER SCREEN */}
            {!loading && total > 0 && currentQuestion && (
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
                                    submitted && isSelected && currentQuestion.correctOption !== key;

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
                                        onPress={() => handleSelectOption(currentQuestion.id, key)}
                                    >
                                        <Text style={[styles.optKey, { color: txt }]}>{key}.</Text>
                                        <Text style={[styles.optText, { color: txt }]}>
                                            {currentQuestion.options?.[key]}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}

                            {/* Review info: your answer + correct answer + explanation */}
                            {submitted && (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.answerSummary}>
                                        Your answer:{' '}
                                        {answers[currentQuestion.id]
                                            ? `${answers[currentQuestion.id]}. ${currentQuestion.options?.[
                                            answers[currentQuestion.id] as OptionKey
                                            ]
                                            } ${answers[currentQuestion.id] ===
                                                currentQuestion.correctOption
                                                ? '(Correct)'
                                                : '(Wrong)'
                                            }`
                                            : 'Not answered'}
                                    </Text>

                                    <Text style={styles.answerSummary}>
                                        Correct answer:{' '}
                                        {currentQuestion.correctOption}.{' '}
                                        {currentQuestion.options?.[currentQuestion.correctOption]}
                                    </Text>

                                    {currentQuestion.explanation ? (
                                        <View style={{ marginTop: 6 }}>
                                            <Text style={styles.explanationLabel}>Explanation:</Text>
                                            <Text style={styles.explanationText}>
                                                {currentQuestion.explanation}
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            )}

            {/* Bottom actions: navigation + submit / retake / back */}
            {!loading && total > 0 && (
                <View style={styles.bottomBar}>
                    {/* Navigation row */}
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

                    {/* After submission: Retake + Back */}
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

    questionContainer: {
        flex: 1,
        marginTop: 4,
    },

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
