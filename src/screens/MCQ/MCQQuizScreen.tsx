// src/screens/MCQ/MCQQuizScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { useTheme } from '../../theme/ThemeContext';

// 🔹 Firestore (same style as McqIntroScreen)
import { db } from '../../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'MCQQuiz'>;

// 🔹 Same Question shape as admin ChaptersPage
type Question = {
  id: string;
  q: string;
  options: string[];
  correctIndex: number;
};

type ChapterDoc = {
  name?: string;
  questions?: Question[];
};

export default function MCQQuizScreen({ route, navigation }: Props) {
  const {
    subjectId,
    unitId,
    chapterId,
    questions: routeQuestions,
    title,
  } = (route.params || {}) as {
    subjectId?: string;
    unitId?: string;
    chapterId?: string;
    questions?: Question[];
    title?: string;
  };

  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const [chapter, setChapter] = useState<ChapterDoc | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Full subject mode = only subjectId, no unitId/chapterId and no injected questions
  const isSubjectOnlyMode =
    !!subjectId && !unitId && !chapterId && !routeQuestions;

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1️⃣ Custom / PYQ / any pre-built quiz: questions are passed via route
        if (
          routeQuestions &&
          Array.isArray(routeQuestions) &&
          routeQuestions.length > 0
        ) {
          const qs = routeQuestions as Question[];
          setQuestions(qs);
          setChapter({ name: title });
          setIdx(0);
          setAnswers(new Array(qs.length).fill(-1));
          return;
        }

        // 2️⃣ Full Subject MCQ – gather all chapter.questions for this subject from Firestore
        if (isSubjectOnlyMode && subjectId) {
          try {
            const qRef = query(
              collection(db, 'nodes'),
              where('type', '==', 'chapter'),
              where('subjectId', '==', subjectId),
              orderBy('order', 'asc')
            );

            const snap = await getDocs(qRef);

            const collected: Question[] = [];
            snap.forEach(d => {
              const data = d.data() as ChapterDoc;
              const qs = (data.questions || []) as Question[];
              if (qs && qs.length) {
                collected.push(...qs);
              }
            });

            if (!collected.length) {
              setError('No MCQs found for this subject yet.');
              return;
            }

            setChapter({
              name: title || 'Full Subject MCQ',
              questions: collected,
            });
            setQuestions(collected);
            setIdx(0);
            setAnswers(new Array(collected.length).fill(-1));
            return;
          } catch (e: any) {
            console.error('[MCQQuizScreen] subject-only Firestore load error', e);
            if (e?.code === 'failed-precondition') {
              setError(
                'Firestore index missing for (type, subjectId, order). Please create the composite index in console.'
              );
            } else {
              setError('Failed to load subject MCQs.');
            }
            return;
          }
        }

        // 3️⃣ Chapter-wise mode → read single chapter doc from Firestore
        if (!chapterId) {
          setError('No chapter selected.');
          return;
        }

        const ref = doc(db, 'nodes', chapterId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setError('Chapter not found.');
          return;
        }

        const data = snap.data() as ChapterDoc;
        const qs = (data.questions || []) as Question[];

        if (!qs.length) {
          setError('No questions in this chapter.');
          return;
        }

        setChapter({ name: data.name, questions: qs });
        setQuestions(qs);
        setIdx(0);
        setAnswers(new Array(qs.length).fill(-1));
      } catch (e: any) {
        console.error('[MCQQuizScreen] load error', e);
        setError('Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [subjectId, unitId, chapterId, routeQuestions, title, isSubjectOnlyMode]);

  // ---------- Loading / error ----------
  if (loading) {
    return (
      <View style={styles.cCenter}>
        <ActivityIndicator />
        <Text style={styles.centerText}>Loading questions…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.cCenter}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.cCenter}>
        <Text style={styles.centerText}>No questions in this quiz.</Text>
      </View>
    );
  }

  // ---------- Quiz logic ----------
  const total = questions.length;
  const q = questions[idx];

  const isFirst = idx === 0;
  const isLast = idx === total - 1;

  const handleSelect = (choice: number) => {
    const next = [...answers];
    next[idx] = choice;
    setAnswers(next);
  };

  const handlePrev = () => {
    if (!isFirst) setIdx(idx - 1);
  };

  const handleSubmit = () => {
    const correct = questions.reduce(
      (acc, qq, i) =>
        acc + ((answers[i] ?? -1) === qq.correctIndex ? 1 : 0),
      0,
    );

    navigation.replace('Result', {
      title: title || chapter?.name || 'Quiz Result',
      correct,
      total: questions.length,
      questions,
      answers,
    });
  };

  const handleNext = () => {
    if (isLast) handleSubmit();
    else setIdx(idx + 1);
  };

  const nextLabel = isLast ? 'Submit Quiz' : 'Next';

  // ---------- UI ----------
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
            style={[styles.opt, selected && styles.optSelected]}
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
          style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
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

// 🔧 Theme-aware styles (unchanged)
const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    c: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
    },
    cCenter: {
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
    h: {
      fontWeight: '700',
      fontSize: 14,
      color: isDark ? '#E5E7EB' : '#4B5563',
    },
    quizTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginTop: 4,
      marginBottom: 4,
      color: isDark ? '#F9FAFB' : '#111827',
    },
    chapterName: {
      fontSize: 14,
      marginTop: 4,
      marginBottom: 4,
      color: isDark ? '#9CA3AF' : '#555555',
    },
    q: {
      fontSize: 16,
      marginVertical: 12,
      color: isDark ? '#F9FAFB' : '#111827',
    },
    opt: {
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#DDDDDD',
      padding: 14,
      borderRadius: 10,
      marginBottom: 8,
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
    },
    optSelected: {
      borderColor: '#6D28D9',
      backgroundColor: isDark ? '#312E81' : '#EDE9FE',
    },
    optText: {
      fontSize: 14,
      color: isDark ? '#F9FAFB' : '#111827',
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
      backgroundColor: isDark ? '#1F2937' : '#E5E7EB',
    },
    navBtnDisabled: {
      backgroundColor: isDark ? '#111827' : '#F3F4F6',
    },
    navBtnText: {
      fontSize: 13,
      fontWeight: '600',
      color: isDark ? '#E5E7EB' : '#111827',
    },
    navBtnTextDisabled: {
      color: isDark ? '#6B7280' : '#9CA3AF',
    },
    progressText: {
      fontSize: 13,
      fontWeight: '600',
      color: isDark ? '#E5E7EB' : '#4B5563',
    },
    navBtnPrimary: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 999,
      backgroundColor: '#6D28D9',
    },
    navBtnPrimaryText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
  });
