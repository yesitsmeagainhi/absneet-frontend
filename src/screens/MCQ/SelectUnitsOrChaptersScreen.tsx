// src/screens/MCQ/SelectUnitsOrChaptersScreen.tsx
import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

// 🔹 Static data
import { SUBJECTS, Subject } from '../../data/demo';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectUnitsOrChapters'>;

export default function SelectUnitsOrChaptersScreen({ route, navigation }: Props) {
  // We expect subjectId to be passed from previous screen
  const subjectId = route.params?.subjectId ?? '';

  const subject: Subject | undefined = useMemo(
    () => SUBJECTS.find(s => s.id === subjectId),
    [subjectId],
  );

  useEffect(() => {
    if (!subjectId) {
      console.warn('[SelectUnitsOrChapters] No subjectId passed in route params');
    }
  }, [subjectId]);

  const handleStartFullSubjectQuiz = () => {
    if (!subjectId) return;

    navigation.navigate('MCQQuiz', {
      subjectId,
      // This title will be shown on MCQQuizScreen & ResultScreen
      title: subject ? `${subject.name} – Full Subject MCQ` : 'Full Subject MCQ',
    });
  };

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

  if (!subject) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8, color: '#4B5563' }}>
          Loading subject details…
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Header */}
      <Text style={styles.title}>Subject MCQ Practice</Text>
      <Text style={styles.subtitle}>
        Practice all chapters of{' '}
        <Text style={{ fontWeight: '700' }}>{subject.name}</Text> in one go.
      </Text>

      {/* Info card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{subject.name}</Text>
        <Text style={styles.cardText}>
          This mode will create a quiz using MCQs from all units and chapters of{' '}
          {subject.name}. Perfect for full subject revision.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Units</Text>
            <Text style={styles.statValue}>{subject.units.length}</Text>
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
          <Text style={styles.primaryBtnText}>Start Full Subject MCQ Quiz</Text>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  center: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 13,
    color: '#4B5563',
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
    backgroundColor: '#F3F4FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
    marginTop: 2,
  },

  primaryBtn: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#6D28D9',
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
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  noteText: {
    fontSize: 12,
    color: '#1E3A8A',
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B91C1C',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#4B5563',
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
});
