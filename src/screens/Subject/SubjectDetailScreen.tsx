// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';


// export default function SubjectDetailScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'SubjectDetail'>) {
//     const { subjectId } = route.params;
//     return (
//         <View style={styles.c}>
//             <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Units', { subjectId })}>
//                 <Text>Study Material</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectUnitsOrChapters', { subjectId })}>
//                 <Text>Solve MCQ</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }
// const styles = StyleSheet.create({ c: { flex: 1, padding: 16, gap: 12 }, card: { borderWidth: 1, borderColor: '#ddd', padding: 16, borderRadius: 12 } });
// src/screens/Subject/SubjectDetailScreen.tsx
import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { SUBJECTS, Subject } from '../../data/demo';
import { useTheme } from '../../theme/ThemeContext';  // ✅ import theme

type Props = NativeStackScreenProps<RootStackParamList, 'SubjectDetail'>;

export default function SubjectDetailScreen({ route, navigation }: Props) {
    const { subjectId } = route.params;
    const { isDark } = useTheme();                           // ✅ read global theme
    const styles = useMemo(() => createStyles(isDark), [isDark]); // ✅ recompute on toggle

    const subject: Subject | undefined = SUBJECTS.find(s => s.id === subjectId);
    const subjectName = subject?.name ?? 'Subject';

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

        // Primary (purple) card – like Custom MCQ Quiz
        modeCardPrimary: {
            backgroundColor: '#4F46E5',
            borderColor: '#4338CA',
        },
        modeCardPrimaryPressed: {
            backgroundColor: '#4338CA',
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


//Without themed UI
// // src/screens/SubjectDetailScreen.tsx
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// type Props = NativeStackScreenProps<RootStackParamList, 'SubjectDetail'>;

// export default function SubjectDetailScreen({ route, navigation }: Props) {
//     const { subjectId } = route.params;

//     return (
//         <View style={styles.c}>
//             <TouchableOpacity
//                 style={styles.card}
//                 onPress={() => navigation.navigate('Units', { subjectId })}
//             >
//                 <Text>Study Material</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//                 style={styles.card}
//                 onPress={() => navigation.navigate('SelectUnitsOrChapters', { subjectId })}
//             >
//                 <Text>Solve MCQ</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     c: { flex: 1, padding: 16, gap: 12 },
//     card: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         padding: 16,
//         borderRadius: 12,
//     },
// });
