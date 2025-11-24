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

// 🔹 Static data
import {
  SUBJECTS,
  Subject,
  Unit,
  Chapter,
  Question as DemoQuestion,
} from '../../data/demo';

import { useTheme } from '../../theme/ThemeContext';  // ✅ theme

type Props = NativeStackScreenProps<RootStackParamList, 'MCQQuiz'>;

// Reuse Question type from demo.ts
type Question = DemoQuestion;

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

  const { isDark } = useTheme();                       // ✅ read global theme
  const styles = useMemo(() => createStyles(isDark), [isDark]); // ✅ recompute when toggled

  const [chapter, setChapter] = useState<ChapterDoc | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Detect "subject-only" mode (full subject quiz, no unit/chapter)
  const isSubjectOnlyMode =
    !!subjectId && !unitId && !chapterId && !routeQuestions;

  useEffect(() => {
    const load = () => {
      try {
        setLoading(true);
        setError(null);

        // 1️⃣ Custom / PYQ / Firestore mode → questions passed via route
        if (routeQuestions && Array.isArray(routeQuestions) && routeQuestions.length > 0) {
          const qs = routeQuestions as Question[];
          setQuestions(qs);
          setChapter({ name: title });
          setIdx(0);
          setAnswers(new Array(qs.length).fill(-1)); // -1 = not answered
          return;
        }

        // 2️⃣ Full Subject MCQ → only subjectId passed (NO unitId / chapterId)
        if (isSubjectOnlyMode && subjectId) {
          const subject: Subject | undefined = SUBJECTS.find(
            s => s.id === subjectId,
          );
          if (!subject) {
            setError('Subject not found in demo data.');
            return;
          }

          const collected: Question[] = [];
          subject.units.forEach((unit: Unit) => {
            unit.chapters.forEach((chapter: Chapter) => {
              const qs = (chapter.questions || []) as Question[];
              if (qs && qs.length) {
                collected.push(...qs);
              }
            });
          });

          if (!collected.length) {
            setError('No MCQs found for this subject yet.');
            return;
          }

          setChapter({
            name: title || `${subject.name} – Full Subject MCQ`,
            questions: collected,
          });
          setQuestions(collected);
          setIdx(0);
          setAnswers(new Array(collected.length).fill(-1));
          return;
        }

        // 3️⃣ Chapter-wise mode → subjectId + unitId + chapterId required
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

        const qs = (ch.questions || []) as Question[];
        if (!qs.length) {
          setError('No questions in this chapter.');
          return;
        }

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
  }, [subjectId, unitId, chapterId, routeQuestions, title, isSubjectOnlyMode]);

  // 🔹 Loading / error states
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

// 🔧 Theme-aware styles
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
