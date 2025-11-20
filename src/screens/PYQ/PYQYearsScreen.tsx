import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { PYQ_PAPERS } from '../../data/demo';

type Props = NativeStackScreenProps<RootStackParamList, 'PYQYears'>;

export default function PYQYearsScreen({ route, navigation }: Props) {
  const { subjectId, subjectName } = route.params;

  // All papers for this subject
  const subjectPapers = useMemo(
    () => PYQ_PAPERS.filter(p => p.subjectId === subjectId),
    [subjectId],
  );

  // Unique years for this subject
  const years = useMemo(() => {
    const set = new Set<number>();
    subjectPapers.forEach(p => set.add(p.year));
    return Array.from(set).sort((a, b) => b - a); // latest first
  }, [subjectPapers]);

  const handleSelectYear = (year: number) => {
    // All papers for this subject + year
    const papersForYear = subjectPapers.filter(p => p.year === year);

    // Combine all questions from those papers
    const questions = papersForYear.flatMap(p => p.questions);

    if (questions.length === 0) {
      // Optional: you can show an alert here if needed
      return;
    }

    const firstPaper = papersForYear[0];
    navigation.navigate('MCQQuiz', {
      subjectId,
      title: `${subjectName} – ${year} PYQ`,
      questions, // array of { id, q, options, correctIndex } for that subject+year
    });

    // navigation.navigate('PYQQuiz', {
    //   subjectId,
    //   subjectName,
    //   paperId: `${subjectId}-${year}`,
    //   title: `${subjectName} – ${year} PYQ`,
    //   year,
    //   exam: firstPaper?.exam ?? 'NEET',
    //   questions,
    // });
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#F9FAFB' }}>
      <Text style={styles.heading}>{subjectName} – Select Year</Text>

      {years.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: '#6B7280', textAlign: 'center' }}>
            No previous year MCQs added yet for this subject.
          </Text>
        </View>
      ) : (
        <FlatList
          data={years}
          keyExtractor={y => y.toString()}
          contentContainerStyle={{ paddingTop: 8 }}
          renderItem={({ item: year }) => {
            const papersCount = subjectPapers.filter(p => p.year === year).length;
            const totalQs = subjectPapers
              .filter(p => p.year === year)
              .reduce((sum, p) => sum + p.questions.length, 0);

            return (
              <TouchableOpacity
                style={styles.yearRow}
                onPress={() => handleSelectYear(year)}
              >
                <Text style={styles.yearText}>{year}</Text>
                <Text style={styles.metaText}>
                  {papersCount} paper{papersCount > 1 ? 's' : ''} · {totalQs} MCQs
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearRow: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  yearText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
});
