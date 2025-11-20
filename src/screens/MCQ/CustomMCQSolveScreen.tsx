//Firestore

// // src/screens/MCQ/CustomMCQSolveScreen.tsx
// import React, { useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// type Props = NativeStackScreenProps<RootStackParamList, 'CustomMCQSolve'>;

// type OptionKey = 'A' | 'B' | 'C' | 'D';

// type McqDoc = {
//   id: string;
//   subjectId?: string;
//   unitId?: string;
//   chapterId?: string;
//   question: string;
//   options: {
//     A: string;
//     B: string;
//     C: string;
//     D: string;
//   };
//   correctOption: OptionKey;
// };

// export default function CustomMCQSolveScreen({ route, navigation }: Props) {
//   const initialQuestions: McqDoc[] = useMemo(
//     () => route.params?.questions || [],
//     [route.params?.questions]
//   );

//   const [mcqs] = useState<McqDoc[]>(initialQuestions);
//   const [answers, setAnswers] = useState<Record<string, OptionKey | null>>(() => {
//     const map: Record<string, OptionKey | null> = {};
//     initialQuestions.forEach(q => {
//       map[q.id] = null;
//     });
//     return map;
//   });
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);

//   const total = mcqs.length;

//   const handleSelectOption = (mcqId: string, option: OptionKey) => {
//     if (submitted) return;
//     setAnswers(prev => ({
//       ...prev,
//       [mcqId]: option,
//     }));
//   };

//   const handleSubmit = () => {
//     if (!mcqs.length) return;
//     let correct = 0;
//     mcqs.forEach(q => {
//       if (answers[q.id] && answers[q.id] === q.correctOption) {
//         correct += 1;
//       }
//     });
//     setScore(correct);
//     setSubmitted(true);
//   };

//   const handleRetake = () => {
//     const reset: Record<string, OptionKey | null> = {};
//     mcqs.forEach(q => {
//       reset[q.id] = null;
//     });
//     setAnswers(reset);
//     setScore(0);
//     setSubmitted(false);
//   };

//   if (!total) {
//     return (
//       <View style={styles.c}>
//         <Text style={styles.title}>Custom MCQ Quiz</Text>
//         <View style={styles.center}>
//           <Text style={{ color: '#6B7280' }}>
//             No questions received. Please go back and select again.
//           </Text>
//           <TouchableOpacity
//             style={[styles.secondaryBtn, { marginTop: 12 }]}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.secondaryBtnText}>Back</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.c}>
//       <Text style={styles.title}>Custom MCQ Quiz</Text>
//       <Text style={styles.subtitle}>Total Questions: {total}</Text>

//       {submitted && (
//         <View style={styles.resultCard}>
//           <Text style={styles.resultText}>
//             Score: {score} / {total}
//           </Text>
//           <Text style={styles.resultSub}>
//             Accuracy: {((score / total) * 100).toFixed(1)}%
//           </Text>
//         </View>
//       )}

//       <FlatList
//         data={mcqs}
//         keyExtractor={item => item.id}
//         style={{ flex: 1 }}
//         contentContainerStyle={{ paddingBottom: 120 }}
//         renderItem={({ item, index }) => {
//           const userAns = answers[item.id];
//           return (
//             <View style={styles.qCard}>
//               <Text style={styles.qText}>
//                 Q{index + 1}. {item.question}
//               </Text>

//               {(['A', 'B', 'C', 'D'] as OptionKey[]).map(key => {
//                 const isSelected = userAns === key;
//                 const isCorrect = submitted && item.correctOption === key;
//                 const isWrong =
//                   submitted && isSelected && item.correctOption !== key;

//                 let bg = '#fff';
//                 let border = '#e5e5e5';
//                 let txt = '#111';

//                 if (!submitted && isSelected) {
//                   bg = '#EDE9FE';
//                   border = '#6D28D9';
//                 }

//                 if (submitted) {
//                   if (isCorrect) {
//                     bg = '#DCFCE7';
//                     border = '#16A34A';
//                   } else if (isWrong) {
//                     bg = '#FEE2E2';
//                     border = '#DC2626';
//                   }
//                 }

//                 return (
//                   <TouchableOpacity
//                     key={key}
//                     style={[
//                       styles.optBtn,
//                       { backgroundColor: bg, borderColor: border },
//                     ]}
//                     disabled={submitted}
//                     activeOpacity={0.7}
//                     onPress={() => handleSelectOption(item.id, key)}
//                   >
//                     <Text style={[styles.optKey, { color: txt }]}>{key}.</Text>
//                     <Text style={[styles.optText, { color: txt }]}>
//                       {item.options?.[key]}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}

//               {submitted && (
//                 <View style={{ marginTop: 6 }}>
//                   <Text style={styles.correctAns}>
//                     Correct answer: {item.correctOption}.{' '}
//                     {item.options?.[item.correctOption]}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           );
//         }}
//       />

//       {/* Bottom actions */}
//       <View style={styles.bottomBar}>
//         {!submitted ? (
//           <TouchableOpacity style={styles.startBtn} onPress={handleSubmit}>
//             <Text style={styles.startBtnText}>Submit Quiz</Text>
//           </TouchableOpacity>
//         ) : (
//           <View style={{ flexDirection: 'row', gap: 12 }}>
//             <TouchableOpacity
//               style={[styles.startBtn, { flex: 1 }]}
//               onPress={handleRetake}
//             >
//               <Text style={styles.startBtnText}>Retake</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.secondaryBtn, { flex: 1 }]}
//               onPress={() => navigation.goBack()}
//             >
//               <Text style={styles.secondaryBtnText}>Back</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   c: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
//   title: { fontSize: 20, fontWeight: '700', marginBottom: 4, color: '#111827' },
//   subtitle: { fontSize: 13, color: '#6B7280', marginBottom: 8 },

//   center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

//   qCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     marginTop: 8,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   qText: { fontSize: 15, fontWeight: '600', marginBottom: 8, color: '#111827' },

//   optBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     paddingVertical: 8,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     marginBottom: 6,
//   },
//   optKey: { fontWeight: '700', marginRight: 8 },
//   optText: { flex: 1, fontSize: 14 },

//   resultCard: {
//     backgroundColor: '#EEF2FF',
//     borderRadius: 12,
//     padding: 12,
//     marginTop: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: '#C7D2FE',
//   },
//   resultText: { fontSize: 16, fontWeight: '700', color: '#1D4ED8' },
//   resultSub: { fontSize: 13, color: '#4B5563', marginTop: 2 },

//   correctAns: { fontSize: 13, color: '#047857', fontWeight: '600' },

//   bottomBar: {
//     position: 'absolute',
//     left: 16,
//     right: 16,
//     bottom: 16,
//   },
//   startBtn: {
//     backgroundColor: '#6D28D9',
//     padding: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   startBtnText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 15,
//   },
//   secondaryBtn: {
//     backgroundColor: '#E5E7EB',
//     padding: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   secondaryBtnText: {
//     color: '#111827',
//     fontWeight: '600',
//     fontSize: 15,
//   },
// });


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
  // 🔹 explanation should be populated from Firestore when building questions
  explanation?: string;
};

export default function CustomMCQSolveScreen({ route, navigation }: Props) {
  const initialQuestions: McqDoc[] = useMemo(
    () => route.params?.questions || [],
    [route.params?.questions],
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
  const [currentIndex, setCurrentIndex] = useState(0); // 🔹 one question per screen

  const total = mcqs.length;
  const currentQuestion = total > 0 ? mcqs[currentIndex] : null;

  const handleSelectOption = (mcqId: string, option: OptionKey) => {
    if (submitted) return;
    setAnswers(prev => ({
      ...prev,
      [mcqId]: option,
    }));
  };

  const computeScore = () => {
    let correct = 0;
    mcqs.forEach(q => {
      if (answers[q.id] && answers[q.id] === q.correctOption) {
        correct += 1;
      }
    });
    return correct;
  };

  const handleSubmit = () => {
    if (!mcqs.length) return;
    const correct = computeScore();
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
    setCurrentIndex(0);
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  const goNextOrSubmit = () => {
    const isLast = currentIndex === total - 1;
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentIndex(i => i + 1);
    }
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

      {/* After submit → show summary */}
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

      {/* QUIZ MODE: one question per screen */}
      {!submitted && currentQuestion && (
        <View style={{ flex: 1 }}>
          <Text style={styles.progressText}>
            Question {currentIndex + 1} of {total}
          </Text>

          <View style={styles.qCard}>
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
                  onPress={() => handleSelectOption(currentQuestion.id, key)}
                >
                  <Text style={[styles.optKey, { color: txt }]}>{key}.</Text>
                  <Text style={[styles.optText, { color: txt }]}>
                    {currentQuestion.options?.[key]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* REVIEW MODE: show all questions + explanation for wrong answers */}
      {submitted && (
        <FlatList
          data={mcqs}
          keyExtractor={item => item.id}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          renderItem={({ item, index }) => {
            const userAns = answers[item.id];
            const isCorrectAns = userAns === item.correctOption;
            const showExplanation =
              item.explanation && userAns !== item.correctOption; // wrong or not attempted

            return (
              <View style={styles.qCard}>
                <Text style={styles.qText}>
                  Q{index + 1}. {item.question}
                </Text>

                {(['A', 'B', 'C', 'D'] as OptionKey[]).map(key => {
                  const isSelected = userAns === key;
                  const isCorrect = item.correctOption === key;
                  const isWrong =
                    submitted && isSelected && !isCorrect;

                  let bg = '#fff';
                  let border = '#e5e5e5';
                  let txt = '#111';

                  if (isSelected && !submitted) {
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
                    <View
                      key={key}
                      style={[
                        styles.optBtn,
                        { backgroundColor: bg, borderColor: border },
                      ]}
                    >
                      <Text style={[styles.optKey, { color: txt }]}>{key}.</Text>
                      <Text style={[styles.optText, { color: txt }]}>
                        {item.options?.[key]}
                      </Text>
                    </View>
                  );
                })}

                {/* Correct answer line */}
                <Text style={styles.correctAns}>
                  Correct answer: {item.correctOption}.{' '}
                  {item.options?.[item.correctOption]}
                </Text>

                {/* Explanation only if user got it wrong (or skipped) and explanation exists */}
                {showExplanation && (
                  <View style={{ marginTop: 6 }}>
                    <Text style={styles.explLabel}>Explanation:</Text>
                    <Text style={styles.explText}>{item.explanation}</Text>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        {!submitted ? (
          <View style={styles.navRow}>
            <TouchableOpacity
              style={[
                styles.navBtn,
                currentIndex === 0 && styles.navBtnDisabled,
              ]}
              disabled={currentIndex === 0}
              onPress={goPrev}
            >
              <Text
                style={[
                  styles.navBtnText,
                  currentIndex === 0 && styles.navBtnTextDisabled,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navBtnPrimary}
              onPress={goNextOrSubmit}
            >
              <Text style={styles.navBtnPrimaryText}>
                {currentIndex === total - 1 ? 'Submit Quiz' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
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

  progressText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 4,
  },

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

  correctAns: { fontSize: 13, color: '#047857', fontWeight: '600', marginTop: 4 },

  explLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  explText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },

  bottomBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },

  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
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
    flex: 1.2,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#6D28D9',
    alignItems: 'center',
  },
  navBtnPrimaryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
