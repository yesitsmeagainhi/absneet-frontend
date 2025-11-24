// src/screens/PYQ/PYQSubjectsScreen.tsx
import React, { useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import {
    PYQ_PAPERS,
    type Question,
    type PYQPaper,
} from '../../data/demo';

import { useTheme } from '../../theme/ThemeContext'; // ✅ global theme

type Props = NativeStackScreenProps<RootStackParamList, 'PYQSubjects'>;

type YearGroup = {
    year: number;
    exam: string;
    totalQuestions: number;
};

export default function PYQSubjectsScreen({ navigation }: Props) {
    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    // 📌 Group all PYQ papers BY YEAR and combine across subjects
    const yearGroups: YearGroup[] = useMemo(() => {
        const byYear: Record<number, YearGroup> = {};

        (PYQ_PAPERS as PYQPaper[]).forEach((p) => {
            if (!byYear[p.year]) {
                byYear[p.year] = {
                    year: p.year,
                    exam: p.exam,
                    totalQuestions: 0,
                };
            }
            byYear[p.year].totalQuestions += p.questions.length;
        });

        return Object.values(byYear).sort((a, b) => b.year - a.year); // latest first
    }, []);

    const handleStartFullExam = (year: number, exam: string) => {
        // 🔹 Collect ALL questions for this year across ALL subjects
        const combinedQuestions: Question[] = [];

        (PYQ_PAPERS as PYQPaper[]).forEach((p) => {
            if (p.year === year) {
                combinedQuestions.push(...p.questions);
            }
        });

        if (!combinedQuestions.length) {
            return;
        }

        navigation.navigate('MCQQuiz', {
            title: `${exam} ${year} – Full Exam (All Subjects)`,
            questions: combinedQuestions,
        });
    };

    return (
        <View style={styles.screen}>
            <Text style={styles.heading}>Previous Year NEET MCQ – Full Exam</Text>
            <Text style={styles.subheading}>
                Each paper below contains mixed questions from all subjects
                (Physics, Chemistry, Biology) just like the actual NEET exam.
            </Text>

            {yearGroups.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Text style={styles.emptyText}>
                        No previous year MCQ papers added yet.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={yearGroups}
                    keyExtractor={(item) => item.year.toString()}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => handleStartFullExam(item.year, item.exam)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.yearText}>
                                {item.exam} {item.year} – Full Exam
                            </Text>

                            <Text style={styles.subtitle}>
                                Mixed-subject MCQ paper (all subjects combined)
                            </Text>

                            <Text style={styles.metaText}>
                                Total Questions: {item.totalQuestions}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

/**
 * Theme-aware styles – dark by default, flip when isDark=false
 */
const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        screen: {
            flex: 1,
            padding: 16,
            backgroundColor: isDark ? '#020617' : '#F9FAFB',
        },
        heading: {
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
            marginBottom: 4,
        },
        subheading: {
            fontSize: 13,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginBottom: 12,
        },
        row: {
            padding: 16,
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
            borderRadius: 10,
            marginBottom: 10,
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
        },
        yearText: {
            fontSize: 16,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#111827',
        },
        subtitle: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 4,
        },
        metaText: {
            fontSize: 12,
            color: isDark ? '#E5E7EB' : '#4B5563',
            marginTop: 4,
        },
        emptyWrap: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyText: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
        },
    });
