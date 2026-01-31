// // src/screens/MCQ/SelectUnitsOrChaptersScreen.tsx
// import React, { useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// // 🔹 Static data
// import { SUBJECTS, Subject } from '../../data/demo';
// import { useTheme } from '../../theme/ThemeContext';   // ✅ theme context

// type Props = NativeStackScreenProps<RootStackParamList, 'SelectUnitsOrChapters'>;

// export default function SelectUnitsOrChaptersScreen({ route, navigation }: Props) {
//   // We expect subjectId to be passed from previous screen
//   const subjectId = route.params?.subjectId ?? '';

//   const { isDark } = useTheme();                             // ✅ read global theme
//   const styles = useMemo(() => createStyles(isDark), [isDark]); // ✅ memoized styles

//   const subject: Subject | undefined = useMemo(
//     () => SUBJECTS.find(s => s.id === subjectId),
//     [subjectId],
//   );

//   useEffect(() => {
//     if (!subjectId) {
//       console.warn('[SelectUnitsOrChapters] No subjectId passed in route params');
//     }
//   }, [subjectId]);

//   const handleStartFullSubjectQuiz = () => {
//     if (!subjectId) return;

//     navigation.navigate('MCQQuiz', {
//       subjectId,
//       // This title will be shown on MCQQuizScreen & ResultScreen
//       title: subject ? `${subject.name} – Full Subject MCQ` : 'Full Subject MCQ',
//     });
//   };

//   if (!subjectId) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorTitle}>Subject not found</Text>
//         <Text style={styles.errorText}>
//           We couldn&apos;t find which subject you selected.
//         </Text>
//         <TouchableOpacity
//           style={styles.backBtn}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.backBtnText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (!subject) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator color={isDark ? '#E5E7EB' : '#4B5563'} />
//         <Text style={styles.loadingText}>
//           Loading subject details…
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.screen}>
//       {/* Header */}
//       <Text style={styles.title}>Subject MCQ Practice</Text>
//       <Text style={styles.subtitle}>
//         Practice all chapters of{' '}
//         <Text style={styles.subtitleStrong}>{subject.name}</Text> in one go.
//       </Text>

//       {/* Info card */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>{subject.name}</Text>
//         <Text style={styles.cardText}>
//           This mode will create a quiz using MCQs from all units and chapters of{' '}
//           {subject.name}. Perfect for full subject revision.
//         </Text>

//         <View style={styles.statsRow}>
//           <View style={styles.statPill}>
//             <Text style={styles.statLabel}>Units</Text>
//             <Text style={styles.statValue}>{subject.units.length}</Text>
//           </View>
//           <View style={styles.statPill}>
//             <Text style={styles.statLabel}>Mode</Text>
//             <Text style={styles.statValue}>Full Subject</Text>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.primaryBtn}
//           activeOpacity={0.9}
//           onPress={handleStartFullSubjectQuiz}
//         >
//           <Text style={styles.primaryBtnText}>Start Full Subject MCQ Quiz</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Optional note / hint */}
//       <View style={styles.noteBox}>
//         <Text style={styles.noteText}>
//           Tip: Once the quiz starts, you can move between questions and submit at
//           the end to see your detailed result and explanations.
//         </Text>
//       </View>
//     </View>
//   );
// }

// // 🔧 Theme-aware styles
// const createStyles = (isDark: boolean) =>
//   StyleSheet.create({
//     screen: {
//       flex: 1,
//       padding: 16,
//       backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
//     },
//     center: {
//       flex: 1,
//       padding: 16,
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
//     },

//     title: {
//       fontSize: 20,
//       fontWeight: '700',
//       color: isDark ? '#F9FAFB' : '#111827',
//       marginBottom: 4,
//     },
//     subtitle: {
//       fontSize: 13,
//       color: isDark ? '#9CA3AF' : '#6B7280',
//       marginBottom: 16,
//     },
//     subtitleStrong: {
//       fontWeight: '700',
//       color: isDark ? '#E5E7EB' : '#111827',
//     },

//     card: {
//       backgroundColor: isDark ? '#020617' : '#FFFFFF',
//       borderRadius: 14,
//       padding: 14,
//       borderWidth: 1,
//       borderColor: isDark ? '#1F2937' : '#E5E7EB',
//       shadowColor: '#000',
//       shadowOpacity: isDark ? 0.3 : 0.05,
//       shadowRadius: 5,
//       shadowOffset: { width: 0, height: 2 },
//     },
//     cardTitle: {
//       fontSize: 16,
//       fontWeight: '700',
//       color: isDark ? '#F9FAFB' : '#111827',
//       marginBottom: 6,
//     },
//     cardText: {
//       fontSize: 13,
//       color: isDark ? '#E5E7EB' : '#4B5563',
//     },

//     statsRow: {
//       flexDirection: 'row',
//       gap: 8,
//       marginTop: 10,
//     },
//     statPill: {
//       flex: 1,
//       paddingVertical: 8,
//       paddingHorizontal: 10,
//       borderRadius: 999,
//       backgroundColor: isDark ? '#111827' : '#F3F4FF',
//       borderWidth: 1,
//       borderColor: isDark ? '#1D4ED8' : '#C7D2FE',
//     },
//     statLabel: {
//       fontSize: 11,
//       color: isDark ? '#9CA3AF' : '#6B7280',
//     },
//     statValue: {
//       fontSize: 14,
//       fontWeight: '700',
//       color: isDark ? '#BFDBFE' : '#1D4ED8',
//       marginTop: 2,
//     },

//     primaryBtn: {
//       marginTop: 14,
//       paddingVertical: 12,
//       borderRadius: 999,
//       backgroundColor: '#6D28D9',
//       alignItems: 'center',
//     },
//     primaryBtnText: {
//       color: '#FFFFFF',
//       fontWeight: '600',
//       fontSize: 14,
//     },

//     noteBox: {
//       marginTop: 16,
//       padding: 10,
//       borderRadius: 10,
//       backgroundColor: isDark ? '#020617' : '#EFF6FF',
//       borderWidth: 1,
//       borderColor: isDark ? '#1D4ED8' : '#BFDBFE',
//     },
//     noteText: {
//       fontSize: 12,
//       color: isDark ? '#BFDBFE' : '#1E3A8A',
//     },

//     errorTitle: {
//       fontSize: 18,
//       fontWeight: '700',
//       color: '#F87171',
//       marginBottom: 4,
//     },
//     errorText: {
//       fontSize: 13,
//       color: isDark ? '#E5E7EB' : '#4B5563',
//       textAlign: 'center',
//       marginBottom: 12,
//     },
//     backBtn: {
//       marginTop: 8,
//       paddingHorizontal: 16,
//       paddingVertical: 10,
//       borderRadius: 999,
//       backgroundColor: '#6B7280',
//     },
//     backBtnText: {
//       color: '#FFFFFF',
//       fontWeight: '600',
//       fontSize: 14,
//     },

//     loadingText: {
//       marginTop: 8,
//       color: isDark ? '#E5E7EB' : '#4B5563',
//     },
//   });

// src/screens/MCQ/SelectUnitsOrChaptersScreen.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { useTheme, Colors } from '../../theme/ThemeContext';

// 🔹 Firestore (modular, real-time)
import { db } from '../../firebase';
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'SelectUnitsOrChapters'
>;

export default function SelectUnitsOrChaptersScreen({
  route,
  navigation,
}: Props) {
  const subjectId = route.params?.subjectId ?? '';

  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  // Set blue StatusBar when this screen is focused
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(isDark ? '#0F172A' : Colors.primary);
        StatusBar.setTranslucent(false);
      }
    }, [isDark])
  );

  const [subjectName, setSubjectName] = useState<string>('');
  const [unitsCount, setUnitsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId) {
      setError('No subject selected.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 🔹 Subject doc listener
    const subjectRef = doc(db, 'nodes', subjectId);
    const unsubSubject = onSnapshot(
      subjectRef,
      snap => {
        if (!snap.exists()) {
          setError('Subject not found.');
          setSubjectName('');
          setUnitsCount(0);
          setLoading(false);
          return;
        }

        const data = snap.data() as any;
        const name = data.name ?? 'Selected subject';
        setSubjectName(name);
        setLoading(false); // we can show screen once subject is known
      },
      err => {
        console.error('[SelectUnitsOrChapters] subject onSnapshot error', err);
        if ((err as any)?.code === 'failed-precondition') {
          setError(
            'Firestore index missing for this query. Please create the index in console.'
          );
        } else {
          setError('Failed to load subject details.');
        }
        setLoading(false);
      },
    );

    // 🔹 Units count listener: type='unit', parentId = subjectId
    const unitsQ = query(
      collection(db, 'nodes'),
      where('type', '==', 'unit'),
      where('parentId', '==', subjectId),
    );

    const unsubUnits = onSnapshot(
      unitsQ,
      snap => {
        setUnitsCount(snap.size || 0);
      },
      err => {
        console.error('[SelectUnitsOrChapters] units onSnapshot error', err);
        if ((err as any)?.code === 'failed-precondition') {
          setError(
            'Firestore index missing for (type, parentId). Please create the composite index in console.'
          );
        }
      },
    );

    // 🔙 Cleanup listeners on unmount / subject change
    return () => {
      unsubSubject();
      unsubUnits();
    };
  }, [subjectId]);

  const handleStartFullSubjectQuiz = () => {
    if (!subjectId) return;

    navigation.navigate('MCQQuiz', {
      subjectId,
      title: subjectName
        ? `${subjectName} – Full Subject MCQ`
        : 'Full Subject MCQ',
    });
  };

  const handleGoToChapterSelection = () => {
    navigation.navigate('Units', { subjectId });
  };

  // 🔹 No subjectId passed at all
  if (!subjectId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Subject not found</Text>
        <Text style={styles.errorText}>
          We couldn&apos;t find which subject you selected.
        </Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🔹 Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={isDark ? '#E5E7EB' : '#4B5563'} />
        <Text style={styles.loadingText}>Loading subject details…</Text>
      </View>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Unable to load</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---------- Main UI ----------
  return (
    <View style={styles.screen}>
      {/* Header */}
      <Text style={styles.title}>Subject MCQ Practice</Text>
      <Text style={styles.subtitle}>
        Practice all chapters of{' '}
        <Text style={styles.subtitleStrong}>
          {subjectName || 'this subject'}
        </Text>{' '}
        in one go.
      </Text>

      {/* Info card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{subjectName || 'Selected Subject'}</Text>
        <Text style={styles.cardText}>
          This mode will create a quiz using MCQs from all units and chapters of{' '}
          {subjectName || 'this subject'}. Perfect for full subject revision.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Units</Text>
            <Text style={styles.statValue}>{unitsCount}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Mode</Text>
            <Text style={styles.statValue}>Full Subject</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.9}
          onPress={handleStartFullSubjectQuiz}
        >
          <Text style={styles.primaryBtnText}>
            Start Full Subject MCQ Quiz
          </Text>
        </TouchableOpacity>
      </View>

      {/* Optional note / hint */}
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          Tip: Once the quiz starts, you can move between questions and submit at
          the end to see your detailed result and explanations.
        </Text>
      </View>
    </View>
  );
}

// 🔧 Theme-aware styles (unchanged)
const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
    },
    center: {
      flex: 1,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
    },

    title: {
      fontSize: 20,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 13,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 16,
    },
    subtitleStrong: {
      fontWeight: '700',
      color: isDark ? '#E5E7EB' : '#111827',
    },

    card: {
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
      shadowColor: '#000',
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 6,
    },
    cardText: {
      fontSize: 13,
      color: isDark ? '#E5E7EB' : '#4B5563',
    },

    statsRow: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 10,
    },
    statPill: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: isDark ? '#111827' : '#F3F4FF',
      borderWidth: 1,
      borderColor: isDark ? '#1D4ED8' : '#C7D2FE',
    },
    statLabel: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    statValue: {
      fontSize: 14,
      fontWeight: '700',
      color: isDark ? '#BFDBFE' : '#1D4ED8',
      marginTop: 2,
    },

    primaryBtn: {
      marginTop: 14,
      paddingVertical: 12,
      borderRadius: 999,
      backgroundColor: '#074e87',
      alignItems: 'center',
    },
    primaryBtnText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },

    noteBox: {
      marginTop: 16,
      padding: 10,
      borderRadius: 10,
      backgroundColor: isDark ? '#020617' : '#EFF6FF',
      borderWidth: 1,
      borderColor: isDark ? '#1D4ED8' : '#BFDBFE',
    },
    noteText: {
      fontSize: 12,
      color: isDark ? '#BFDBFE' : '#1E3A8A',
    },

    errorTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#F87171',
      marginBottom: 4,
    },
    errorText: {
      fontSize: 13,
      color: isDark ? '#E5E7EB' : '#4B5563',
      textAlign: 'center',
      marginBottom: 12,
    },
    backBtn: {
      marginTop: 8,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      backgroundColor: '#6B7280',
    },
    backBtnText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },

    loadingText: {
      marginTop: 8,
      color: isDark ? '#E5E7EB' : '#4B5563',
    },
  });
