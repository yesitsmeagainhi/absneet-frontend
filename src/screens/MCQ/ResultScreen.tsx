// // src/screens/MCQ/ResultScreen.tsx
// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

// export default function ResultScreen({ route, navigation }: Props) {
//   const { correct, total, questions, answers } = route.params as any;

//   return (
//     <View style={styles.c}>
//       <Text style={styles.score}>Score: {correct} / {total}</Text>

//       <View style={styles.buttons}>
//         <Button
//           title="Review Answers"
//           onPress={() =>
//             navigation.navigate('ReviewAnswers', {
//               title: 'Review Answers',
//               questions,
//               answers,
//             })
//           }
//         />
//         <Button
//           title="Back to Home"
//           onPress={() => navigation.popToTop()}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   c: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12,
//     padding: 16,
//   },
//   score: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 16,
//   },
//   buttons: {
//     width: '80%',
//     gap: 12,
//   },
// });

// src/screens/MCQ/ResultScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

// 🔹 Use the Question type from your static demo data
import { Question } from '../../data/demo';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

type ResultParams = {
  correct: number;
  total: number;
  questions: Question[];   // full questions array used in quiz
  answers: number[];       // selected option index per question (0–3, or -1 for not attempted)
  title?: string;
};

export default function ResultScreen({ route, navigation }: Props) {
  const { correct, total, questions, answers, title } =
    route.params as ResultParams;

  // 🔹 Derived stats
  const attempted = answers.filter((a) => a >= 0).length;
  const skipped = Math.max(total - attempted, 0);
  const incorrect = Math.max(attempted - correct, 0);
  const finalScore = correct; // 1 mark per correct question
  const accuracy =
    total > 0 ? ((correct / total) * 100).toFixed(1) : '0.0';

  return (
    <View style={styles.c}>
      {/* Summary */}
      <View style={styles.summaryCard}>
        {title ? <Text style={styles.summaryTitle}>{title}</Text> : null}

        <Text style={styles.summaryScore}>
          Final Score: {finalScore} / {total}
        </Text>
        <Text style={styles.summarySub}>Accuracy: {accuracy}%</Text>

        {/* 🔹 Stats grid */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Attempted</Text>
            <Text style={styles.statValue}>{attempted}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Skipped</Text>
            <Text style={styles.statValue}>{skipped}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Correct</Text>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>
              {correct}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Incorrect</Text>
            <Text style={[styles.statValue, { color: '#DC2626' }]}>
              {incorrect}
            </Text>
          </View>
        </View>
      </View>

      {/* Review list */}
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {questions.map((q, idx) => {
          const selectedIndex = answers[idx] ?? -1;
          const correctIndex = q.correctIndex;

          const userAnswered = selectedIndex >= 0;
          const gotRight = userAnswered && selectedIndex === correctIndex;

          const userOptionText =
            userAnswered ? q.options[selectedIndex] : null;
          const correctOptionText = q.options[correctIndex];

          const userLabel = userAnswered
            ? `${String.fromCharCode(65 + selectedIndex)}. ${userOptionText}`
            : 'Not answered';

          const correctLabel = `${String.fromCharCode(
            65 + correctIndex,
          )}. ${correctOptionText}`;

          return (
            <View key={q.id} style={styles.qCard}>
              <Text style={styles.qIndex}>Q{idx + 1}</Text>
              <Text style={styles.qText}>{q.q}</Text>

              {/* Your answer */}
              <Text style={styles.answerLine}>
                Your answer:{' '}
                {userAnswered ? (
                  <Text
                    style={{
                      color: gotRight ? '#16A34A' : '#DC2626',
                      fontWeight: '600',
                    }}
                  >
                    {userLabel} {gotRight ? '(Correct)' : '(Wrong)'}
                  </Text>
                ) : (
                  <Text style={{ color: '#6B7280' }}>{userLabel}</Text>
                )}
              </Text>

              {/* Correct answer */}
              <Text style={styles.answerLine}>
                Correct answer:{' '}
                <Text style={{ fontWeight: '600', color: '#111827' }}>
                  {correctLabel}
                </Text>
              </Text>

              {/* Explanation ONLY if user was wrong and explanation exists */}
              {!gotRight && q.explanation && (
                <View style={{ marginTop: 6 }}>
                  <Text style={styles.explLabel}>Explanation:</Text>
                  <Text style={styles.explText}>{q.explanation}</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.primaryBtnText}>Back to Home</Text>
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

  summaryCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D4ED8',
    marginBottom: 4,
  },
  summaryScore: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  summarySub: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  statBox: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#E0E7FF',
  },
  statLabel: {
    fontSize: 11,
    color: '#4B5563',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },

  qCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  qIndex: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  qText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  answerLine: {
    fontSize: 13,
    color: '#374151',
    marginTop: 2,
  },
  explLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginTop: 6,
  },
  explText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },

  bottomBar: {
    marginTop: 4,
  },
  primaryBtn: {
    backgroundColor: '#6D28D9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
