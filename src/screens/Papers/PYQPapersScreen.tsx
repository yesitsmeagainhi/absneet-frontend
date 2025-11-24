// src/screens/PYQ/PYQPapersScreen.tsx
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
import { PYQ_PAPERS } from '../../data/demo';
import { useTheme } from '../../theme/ThemeContext'; // ✅ theme

type Props = NativeStackScreenProps<RootStackParamList, 'PYQPapers'>;

export default function PYQPapersScreen({ route, navigation }: Props) {
    const { subjectId, subjectName } = route.params;

    const { isDark } = useTheme();                       // ✅ read theme
    const styles = useMemo(() => createStyles(isDark), [isDark]); // ✅ themed styles

    // 🔹 Get all PYQ MCQ papers for this subject, latest year first
    const papers = useMemo(
        () =>
            PYQ_PAPERS
                .filter(p => p.subjectId === subjectId)
                .sort((a, b) => b.year - a.year),
        [subjectId],
    );

    return (
        <View style={styles.c}>
            <Text style={styles.heading}>
                {subjectName} – Previous Year MCQ Papers
            </Text>
            <Text style={styles.subheading}>
                Practice full previous year MCQ papers, year-wise.
            </Text>

            {papers.length === 0 ? (
                <View style={styles.emptyWrap}>
                    <Text style={styles.emptyText}>
                        No previous year MCQ papers added yet for this subject.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={papers}
                    keyExtractor={p => p.id}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    renderItem={({ item }) => {
                        const questionCount = item.questions.length;

                        return (
                            <View style={styles.paperCard}>
                                {/* Top row: Year + exam + questions badge */}
                                <View style={styles.topRow}>
                                    <View>
                                        <Text style={styles.yearText}>{item.year}</Text>
                                        <Text style={styles.examText}>
                                            {item.exam} · MCQ Paper
                                        </Text>
                                    </View>
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            {questionCount} Qs
                                        </Text>
                                    </View>
                                </View>

                                {/* Title / description */}
                                <Text style={styles.paperTitle}>{item.title}</Text>

                                {/* Action */}
                                <View style={styles.footerRow}>
                                    <TouchableOpacity
                                        style={styles.solveBtn}
                                        onPress={() =>
                                            navigation.navigate('MCQQuiz', {
                                                subjectId,
                                                title: item.title,      // shows on quiz & result
                                                questions: item.questions,
                                            })
                                        }
                                    >
                                        <Text style={styles.solveBtnText}>Solve MCQ Paper</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
}

/** Theme-aware styles */
const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        c: {
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
        paperCard: {
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
            marginBottom: 12,
        },
        topRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
        },
        yearText: {
            fontSize: 16,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
        },
        examText: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 2,
        },
        badge: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: isDark ? '#1E293B' : '#EEF2FF',
        },
        badgeText: {
            fontSize: 12,
            fontWeight: '600',
            color: isDark ? '#C4B5FD' : '#4F46E5',
        },
        paperTitle: {
            fontSize: 14,
            color: isDark ? '#E5E7EB' : '#111827',
            marginTop: 6,
            marginBottom: 10,
        },
        footerRow: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        solveBtn: {
            backgroundColor: '#6D28D9',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 999,
        },
        solveBtnText: {
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: '600',
        },
    });
