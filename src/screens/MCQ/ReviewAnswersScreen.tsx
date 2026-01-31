import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useTheme, Colors } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ReviewAnswers'>;

type Question = {
    id: string;
    q: string;
    qImage?: string;           // Optional question image URL
    options: string[];
    optionImages?: string[];   // Optional image URLs for options
    correctIndex: number;
    explanation?: string;
    explanationImage?: string; // Optional explanation image
};

export default function ReviewAnswersScreen({ route }: Props) {
    const { title, questions, answers } = route.params as {
        title?: string;
        questions: Question[];
        answers: number[];
    };

    const { isDark } = useTheme();

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

    return (
        <View style={styles.c}>
            <Text style={styles.heading}>{title || 'Review Answers'}</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                {questions.map((q, index) => {
                    const userChoice = answers[index]; // 0-based index or -1
                    const correctIndex = q.correctIndex;

                    // Check if question image exists and is non-empty
                    const hasQuestionImage = q.qImage && q.qImage.trim() !== '';

                    return (
                        <View key={q.id || index} style={styles.card}>
                            <Text style={styles.qIndex}>Q{index + 1}.</Text>
                            <Text style={styles.qText}>{q.q}</Text>

                            {/* Question Image (if available and non-empty) */}
                            {hasQuestionImage && (
                                <Image
                                    source={{ uri: q.qImage }}
                                    style={styles.questionImage}
                                    resizeMode="contain"
                                />
                            )}

                            {q.options.map((opt, optIndex) => {
                                // Get option image only if it exists and is non-empty
                                const optionImage = q.optionImages?.[optIndex] && q.optionImages[optIndex].trim() !== ''
                                    ? q.optionImages[optIndex]
                                    : null;
                                const isCorrect = optIndex === correctIndex;
                                const isUser = optIndex === userChoice;

                                let bg = '#FFFFFF';
                                let border = '#E5E7EB';
                                let txt = '#111827';

                                if (isCorrect) {
                                    bg = '#DCFCE7';      // green for correct option
                                    border = '#16A34A';
                                }
                                if (!isCorrect && isUser) {
                                    bg = '#FEE2E2';      // red for your wrong chosen option
                                    border = '#DC2626';
                                }

                                return (
                                    <View
                                        key={optIndex}
                                        style={[
                                            styles.optRow,
                                            { backgroundColor: bg, borderColor: border },
                                        ]}
                                    >
                                        <Text style={[styles.optLabel, { color: txt }]}>
                                            {String.fromCharCode(65 + optIndex)}.
                                        </Text>
                                        {optionImage ? (
                                            <Image
                                                source={{ uri: optionImage }}
                                                style={styles.optionImage}
                                                resizeMode="contain"
                                            />
                                        ) : (
                                            <Text style={[styles.optText, { color: txt }]}>
                                                {opt}
                                            </Text>
                                        )}
                                    </View>
                                );
                            })}

                            <View style={styles.summaryBlock}>
                                <Text style={styles.summaryLine}>
                                    Your answer:{' '}
                                    {userChoice === -1 || userChoice == null
                                        ? 'Not answered'
                                        : `${String.fromCharCode(65 + userChoice)}. ${q.options[userChoice]
                                        }`}
                                </Text>
                                <Text style={styles.summaryLine}>
                                    Correct answer:{' '}
                                    {`${String.fromCharCode(65 + correctIndex)}. ${q.options[correctIndex]
                                        }`}
                                </Text>

                                <Text style={styles.explHeading}>Explanation:</Text>
                                <Text style={styles.explText}>
                                    {q.explanation || 'Explanation not available.'}
                                </Text>
                                {q.explanationImage && q.explanationImage.trim() !== '' && (
                                    <Image
                                        source={{ uri: q.explanationImage }}
                                        style={styles.explanationImage}
                                        resizeMode="contain"
                                    />
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    c: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F9FAFB',
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 10,
    },
    qIndex: {
        fontSize: 13,
        fontWeight: '700',
        color: '#4B5563',
        marginBottom: 2,
    },
    qText: {
        fontSize: 15,
        color: '#111827',
        marginBottom: 8,
    },
    questionImage: {
        width: '100%',
        height: 180,
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    optionImage: {
        flex: 1,
        height: 80,
        borderRadius: 6,
    },
    explanationImage: {
        width: '100%',
        height: 150,
        marginTop: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    optRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 6,
    },
    optLabel: {
        fontWeight: '700',
        marginRight: 8,
    },
    optText: {
        flex: 1,
        fontSize: 14,
    },
    summaryBlock: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    summaryLine: {
        fontSize: 13,
        color: '#374151',
        marginBottom: 2,
    },
    explHeading: {
        fontSize: 13,
        fontWeight: '700',
        marginTop: 6,
        marginBottom: 2,
        color: '#111827',
    },
    explText: {
        fontSize: 13,
        color: '#4B5563',
    },
});
