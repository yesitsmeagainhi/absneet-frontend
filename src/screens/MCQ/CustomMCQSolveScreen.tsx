// src/screens/MCQ/CustomMCQSolveScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomMCQSolve'>;

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
};

export default function CustomMCQSolveScreen({ route, navigation }: Props) {
  const initialQuestions: McqDoc[] = useMemo(
    () => route.params?.questions || [],
    [route.params?.questions]
  );

  const [mcqs] = useState<McqDoc[]>(initialQuestions);
  const [answers, setAnswers] = useState<Record<string, OptionKey | null>>(() => {
    const map: Record<string, OptionKey | null> = {};
    initialQuestions.forEach(q => {
      map[q.id] = null;
    });
    return map;
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const total = mcqs.length;

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
    const reset: Record<string, OptionKey | null> = {};
    mcqs.forEach(q => {
      reset[q.id] = null;
    });
    setAnswers(reset);
    setScore(0);
    setSubmitted(false);
  };

  if (!total) {
    return (
      <View style={styles.c}>
        <Text style={styles.title}>Custom MCQ Quiz</Text>
        <View style={styles.center}>
          <Text style={{ color: '#6B7280' }}>
            No questions received. Please go back and select again.
          </Text>
          <TouchableOpacity
            style={[styles.secondaryBtn, { marginTop: 12 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryBtnText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.c}>
      <Text style={styles.title}>Custom MCQ Quiz</Text>
      <Text style={styles.subtitle}>Total Questions: {total}</Text>

      {submitted && (
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>
            Score: {score} / {total}
          </Text>
          <Text style={styles.resultSub}>
            Accuracy: {((score / total) * 100).toFixed(1)}%
          </Text>
        </View>
      )}

      <FlatList
        data={mcqs}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item, index }) => {
          const userAns = answers[item.id];
          return (
            <View style={styles.qCard}>
              <Text style={styles.qText}>
                Q{index + 1}. {item.question}
              </Text>

              {(['A', 'B', 'C', 'D'] as OptionKey[]).map(key => {
                const isSelected = userAns === key;
                const isCorrect = submitted && item.correctOption === key;
                const isWrong =
                  submitted && isSelected && item.correctOption !== key;

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
                    onPress={() => handleSelectOption(item.id, key)}
                  >
                    <Text style={[styles.optKey, { color: txt }]}>{key}.</Text>
                    <Text style={[styles.optText, { color: txt }]}>
                      {item.options?.[key]}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {submitted && (
                <View style={{ marginTop: 6 }}>
                  <Text style={styles.correctAns}>
                    Correct answer: {item.correctOption}.{' '}
                    {item.options?.[item.correctOption]}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        {!submitted ? (
          <TouchableOpacity style={styles.startBtn} onPress={handleSubmit}>
            <Text style={styles.startBtnText}>Submit Quiz</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[styles.startBtn, { flex: 1 }]}
              onPress={handleRetake}
            >
              <Text style={styles.startBtnText}>Retake</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4, color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280', marginBottom: 8 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  qCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  qText: { fontSize: 15, fontWeight: '600', marginBottom: 8, color: '#111827' },

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
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  resultText: { fontSize: 16, fontWeight: '700', color: '#1D4ED8' },
  resultSub: { fontSize: 13, color: '#4B5563', marginTop: 2 },

  correctAns: { fontSize: 13, color: '#047857', fontWeight: '600' },

  bottomBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  startBtn: {
    backgroundColor: '#6D28D9',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: '#E5E7EB',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 15,
  },
});
