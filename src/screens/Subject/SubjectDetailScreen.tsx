// src/screens/Subject/SubjectDetailScreen.tsx
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    StatusBar,
    Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { SUBJECTS, Subject } from '../../data/demo';
import { useTheme, Colors } from '../../theme/ThemeContext';

// 🔹 Firestore (React Native Firebase)
import firestore, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'SubjectDetail'>;

type SubjectDoc = {
    id: string;
    name: string;
    order?: number;
    active?: boolean;
    createdAt?: FirebaseFirestoreTypes.Timestamp | null;
};

export default function SubjectDetailScreen({ route, navigation }: Props) {
    const { subjectId } = route.params;
    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    // 🔹 Set blue StatusBar when this screen is focused
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(isDark ? '#0F172A' : Colors.primary);
                StatusBar.setTranslucent(false);
            }
        }, [isDark])
    );

    // 🔹 State from Firestore
    const [subjectDoc, setSubjectDoc] = useState<SubjectDoc | null>(null);

    // 🔹 Fallback demo subject (from SUBJECTS array)
    const fallbackSubject: Subject | undefined = SUBJECTS.find(
        s => s.id === subjectId,
    );

    // 🔥 LIVE snapshot for this subject
    useEffect(() => {
        if (!subjectId) return;

        const ref = firestore().collection('nodes').doc(subjectId);

        const unsubscribe = ref.onSnapshot(
            snap => {
                if (!snap.exists) {
                    console.log('[SubjectDetail] subject doc not found, using demo fallback');
                    setSubjectDoc(null);
                    return;
                }

                const data = snap.data() as any;
                setSubjectDoc({
                    id: snap.id,
                    name: data.name ?? data.title ?? 'Subject',
                    order: data.order,
                    active: data.active,
                    createdAt: data.createdAt ?? null,
                });
            },
            err => {
                console.log('[SubjectDetail] onSnapshot error', err);
                // keep any previous value, don’t crash; demo fallback will still work
            },
        );

        return () => {
            unsubscribe();
        };
    }, [subjectId]);

    // 🔹 Decide final subject name (Firestore → demo → generic)
    const subjectName =
        subjectDoc?.name ?? fallbackSubject?.name ?? 'Subject';

    return (
        <View style={styles.screen}>
            <View style={styles.container}>
                {/* Header / hero */}
                <View style={styles.headerCard}>
                    <Text style={styles.headerEyebrow}>Subject Overview</Text>
                    <Text style={styles.headerTitle}>{subjectName}</Text>
                    <Text style={styles.headerSubtitle}>
                        Choose how you want to study this subject.
                    </Text>

                    {/* Optional: show if subject is inactive */}
                    {subjectDoc && subjectDoc.active === false && (
                        <Text
                            style={{
                                marginTop: 6,
                                fontSize: 11,
                                color: '#F97316',
                            }}
                        >
                            This subject is currently marked as inactive.
                        </Text>
                    )}
                </View>

                {/* Actions */}
                <View style={styles.cardGrid}>
                    {/* Study material */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.modeCard,
                            styles.modeCardNeutral,
                            pressed && styles.modeCardNeutralPressed,
                        ]}
                        onPress={() => navigation.navigate('Units', { subjectId })}
                    >
                        <Text style={styles.modeEmoji}>📚</Text>
                        <Text style={styles.modeTitle}>Study Material</Text>
                        <Text style={styles.modeText}>
                            View units, chapters, videos, PDFs and notes.
                        </Text>
                    </Pressable>

                    {/* MCQ practice for this subject */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.modeCard,
                            styles.modeCardPrimary,
                            pressed && styles.modeCardPrimaryPressed,
                        ]}
                        onPress={() =>
                            navigation.navigate('SelectUnitsOrChapters', { subjectId })
                        }
                    >
                        <Text style={styles.modeEmoji}>🧠</Text>
                        <Text style={styles.modeTitlePrimary}>Solve MCQ</Text>
                        <Text style={styles.modeTextPrimary}>
                            Practice chapter-wise or full-subject MCQs.
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

// 🔧 Theme-aware styles
const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        screen: {
            flex: 1,
            backgroundColor: isDark ? '#0F172A' : '#F9FAFB', // match HomeScreen
        },
        container: {
            flex: 1,
            padding: 16,
            gap: 16,
            paddingBottom: 28,
        },

        // Header / hero
        headerCard: {
            backgroundColor: isDark ? '#111827' : '#FFFFFF',
            borderRadius: 18,
            padding: 14,
            borderWidth: 1,
            borderColor: isDark ? '#1D4ED8' : '#E5E7EB',
        },
        headerEyebrow: {
            fontSize: 11,
            color: isDark ? '#93C5FD' : '#1D4ED8',
            marginBottom: 4,
            fontWeight: '600',
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
            marginBottom: 4,
        },
        headerSubtitle: {
            fontSize: 13,
            color: isDark ? '#E5E7EB' : '#4B5563',
        },

        // Grid
        cardGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },

        // Base card
        modeCard: {
            flexBasis: '48%',
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
        },

        // Primary (blue) card – like Custom MCQ Quiz
        modeCardPrimary: {
            backgroundColor: Colors.primary,
            borderColor: Colors.primaryDark,
        },
        modeCardPrimaryPressed: {
            backgroundColor: Colors.primaryDark,
        },

        // Neutral card
        modeCardNeutral: {
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderColor: isDark ? '#374151' : '#E5E7EB',
        },
        modeCardNeutralPressed: {
            backgroundColor: isDark ? '#111827' : '#F3F4F6',
        },

        modeEmoji: {
            fontSize: 20,
            marginBottom: 4,
        },

        modeTitlePrimary: {
            fontSize: 14,
            fontWeight: '700',
            color: '#F9FAFB',
            marginBottom: 4,
        },
        modeTextPrimary: {
            fontSize: 12,
            color: '#E5E7EB',
        },

        modeTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#111827',
            marginBottom: 4,
        },
        modeText: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
    });
