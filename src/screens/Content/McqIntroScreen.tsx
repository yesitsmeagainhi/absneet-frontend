// //src/screens/Content/McqIntroScreen.tsx
// import React from 'react';
// import { View, Text, Button } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';


// export default function McqIntroScreen() {
//     const route = useRoute<any>();
//     const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//     const { subjectId, chapterId } = route.params ?? {};
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 }}>
//             <Text>MCQ for selected chapter</Text>
//             <Button title="Start MCQ" onPress={() => nav.navigate('MCQQuiz', { subjectId, chapterId })} />
//         </View>
//     );
// }


//Firestore
// // src/screens/Content/McqIntroScreen.tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, ActivityIndicator } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// import { db } from '../../firebase';
// import { doc, getDoc } from 'firebase/firestore';

// type Question = {
//   id: string;
//   q: string;
//   options: string[];
//   correctIndex: number;
// };

// type ChapterDoc = {
//   name: string;
//   questions?: Question[];
// };

// export default function McqIntroScreen() {
//   const route = useRoute<any>();
//   const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//   const { subjectId, unitId, chapterId } = route.params ?? {};

//   const [chapter, setChapter] = useState<ChapterDoc | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         if (!chapterId) {
//           setError('No chapter selected.');
//           setLoading(false);
//           return;
//         }
//         const ref = doc(db, 'nodes', chapterId);
//         const snap = await getDoc(ref);
//         if (!snap.exists()) {
//           setError('Chapter not found.');
//         } else {
//           setChapter(snap.data() as ChapterDoc);
//         }
//       } catch (e: any) {
//         console.error('[McqIntroScreen] load error', e);
//         setError('Failed to load MCQs.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [chapterId]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
//         <Text style={{ marginTop: 8 }}>Loading MCQs…</Text>
//       </View>
//     );
//   }

//   if (error || !subjectId || !chapterId) {
//     return (
//       <View style={styles.center}>
//         <Text>{error || 'Missing chapter selection.'}</Text>
//       </View>
//     );
//   }

//   const count = chapter?.questions?.length || 0;

//   return (
//     <View style={styles.center}>
//       <Text style={{ fontSize: 16, marginBottom: 6 }}>
//         {chapter?.name || 'MCQ for selected chapter'}
//       </Text>
//       <Text style={{ marginBottom: 12 }}>
//         Total questions: {count}
//       </Text>
//       <Button
//         title={count > 0 ? 'Start MCQ' : 'No MCQs available'}
//         disabled={count === 0}
//         onPress={() =>
//           nav.navigate('MCQQuiz', {
//             subjectId,
//             unitId,
//             chapterId,
//           })
//         }
//       />
//     </View>
//   );
// }

// const styles = {
//   center: {
//     flex: 1,
//     alignItems: 'center' as const,
//     justifyContent: 'center' as const,
//     padding: 16,
//     gap: 12,
//   },
// };


// src/screens/Content/McqIntroScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

import { useTheme } from '../../theme/ThemeContext';

// ---------- Types ----------
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

// ---------- Component ----------
export default function McqIntroScreen() {
  const route = useRoute<any>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { subjectId, unitId, chapterId } = route.params ?? {};

  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const [chapter, setChapter] = useState<ChapterDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chapterId) {
      setError('No chapter selected.');
      setChapter(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 🔹 Live listener on nodes/{chapterId}
    const ref = doc(db, 'nodes', chapterId);

    const unsubscribe = onSnapshot(
      ref,
      snap => {
        if (!snap.exists()) {
          setError('Chapter not found.');
          setChapter(null);
        } else {
          setError(null);
          setChapter(snap.data() as ChapterDoc);
        }
        setLoading(false);
      },
      err => {
        console.error('[McqIntroScreen] onSnapshot error', err);
        setError('Failed to load MCQs.');
        setChapter(null);
        setLoading(false);
      },
    );

    // 🔙 cleanup when screen unmounts / chapterId changes
    return () => unsubscribe();
  }, [chapterId]);


  // ---------- States ----------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#4F46E5" />
        <Text style={styles.helperText}>Loading MCQs…</Text>
      </View>
    );
  }

  if (error || !subjectId || !chapterId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Missing chapter selection.'}</Text>
      </View>
    );
  }

  const count = chapter?.questions?.length || 0;

  // ---------- UI ----------
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.badge}>Chapter MCQ</Text>

        <Text style={styles.title}>
          {chapter?.name || 'MCQ for selected chapter'}
        </Text>

        <Text style={styles.metaText}>
          Total questions:{' '}
          <Text style={styles.metaStrong}>{count}</Text>
        </Text>

        <Text style={styles.subText}>
          Solve all questions from this chapter in exam-style MCQ format.
        </Text>

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            count === 0 && styles.primaryBtnDisabled,
          ]}
          disabled={count === 0}
          onPress={() =>
            nav.navigate('MCQQuiz', {
              subjectId,
              unitId,
              chapterId,
            })
          }
        >
          <Text style={styles.primaryBtnText}>
            {count > 0 ? 'Start MCQ' : 'No MCQs available'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/**
 * Theme-aware styles – dark by default, flips when isDark = false
 */
const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    // full screen
    screen: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
      padding: 16,
      justifyContent: 'center',
    },

    // central card
    card: {
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
    },

    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: isDark ? '#1D243A' : '#EEF2FF',
      color: '#4F46E5',
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 8,
    },

    title: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 6,
    },

    metaText: {
      fontSize: 13,
      color: isDark ? '#E5E7EB' : '#4B5563',
      marginBottom: 4,
    },

    metaStrong: {
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
    },

    subText: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 16,
    },

    // primary button
    primaryBtn: {
      marginTop: 4,
      backgroundColor: '#4F46E5',
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
    },
    primaryBtnDisabled: {
      backgroundColor: '#9CA3AF',
    },
    primaryBtnText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },

    // loading / error shared
    center: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    helperText: {
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
  });
