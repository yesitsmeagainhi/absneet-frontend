// src/screens/Home/HomeScreen.tsx
import React, { useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    Image,
    Pressable,
} from 'react-native';
// import SubjectChip from '../../components/SubjectChip'; // 🔸 no longer used
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/rootnavigator';

// Static demo data
import { SUBJECTS, Subject } from '../../data/demo';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type HomeBanner = {
    id: string;
    imageUri: string;
};

const HOME_BANNERS: HomeBanner[] = [
    {
        id: 'b2',
        imageUri:
            'https://images.pexels.com/photos/5496463/pexels-photo-5496463.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
        id: 'b3',
        imageUri:
            'https://images.pexels.com/photos/4143791/pexels-photo-4143791.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
];

export default function HomeScreen() {
    const nav = useNavigation<Nav>();

    const subjects: Subject[] = SUBJECTS;
    const firstSubjectId = useMemo(() => subjects[0]?.id, [subjects]);
    const isSubjectDependentDisabled = !firstSubjectId;

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.c}
                showsVerticalScrollIndicator={false}
            >
                {/* Top app bar */}
                <View style={styles.topBar}>
                    <View>
                        <Text style={styles.appTitle}>ABS NEET</Text>
                        <Text style={styles.appSubtitle}>NEET Practice App</Text>
                    </View>
                    <View style={styles.neetBadge}>
                        <Text style={styles.neetBadgeText}>NEET 2025</Text>
                    </View>
                </View>

                {/* 🔹 Image-only banner slider */}
                <View style={styles.bannerWrap}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.bannerScroll}
                    >
                        {HOME_BANNERS.map(b => (
                            <Pressable
                                key={b.id}
                                style={styles.bannerCard}
                                android_ripple={{ color: '#1E293B' }}
                            >
                                <Image
                                    source={{ uri: b.imageUri }}
                                    style={styles.bannerImage}
                                    resizeMode="cover"
                                />
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Subjects row */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Your Subjects</Text>
                    {!!subjects.length && (
                        <Text style={styles.sectionMeta}>{subjects.length} loaded</Text>
                    )}
                </View>

                {subjects.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={{ color: '#6B7280', fontWeight: '500' }}>
                            No subjects in demo data.
                        </Text>
                        <Text style={{ color: '#9CA3AF', marginTop: 4, fontSize: 12 }}>
                            Add entries in <Text style={{ fontWeight: '700' }}>SUBJECTS</Text>{' '}
                            inside <Text style={{ fontWeight: '700' }}>src/data/demo.ts</Text>.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={subjects}
                        keyExtractor={s => s.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 16 }}
                        renderItem={({ item }) => (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.subjectCard,
                                    pressed && styles.subjectCardPressed, // 🔹 purple when pressed
                                ]}
                                onPress={() =>
                                    nav.navigate('SubjectDetail', { subjectId: item.id })
                                }
                            >
                                <Text style={styles.subjectTitle}>{item.name}</Text>
                                <Text style={styles.subjectMeta}>
                                    {item.units?.length ?? 0} units
                                </Text>
                            </Pressable>
                        )}
                    />
                )}

                {/* Practice modes / quick actions */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Practice Modes</Text>
                    <Text style={styles.sectionMeta}>Choose how you want to study</Text>
                </View>

                <View style={styles.cardGrid}>
                    {/* Custom MCQ as per Subject */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.modeCard,
                            styles.modeCardPrimary,
                            isSubjectDependentDisabled && styles.modeCardDisabled,
                            pressed && !isSubjectDependentDisabled && styles.modeCardPrimaryPressed,
                        ]}
                        disabled={isSubjectDependentDisabled}
                        onPress={() =>
                            firstSubjectId &&
                            nav.navigate('CustomMCQQuiz', { subjectId: firstSubjectId })
                        }
                    >
                        <Text style={styles.modeEmoji}>🧠</Text>
                        <Text style={styles.modeTitlePrimary}>Custom MCQ Quiz</Text>
                        <Text style={styles.modeTextPrimary}>
                            Build a quiz from selected topics of a subject.
                        </Text>
                        {isSubjectDependentDisabled && (
                            <Text style={styles.modeHintPrimary}>
                                Add at least one subject to begin.
                            </Text>
                        )}
                    </Pressable>

                    {/* Previous Year MCQ – mixed exam */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.modeCard,
                            styles.modeCardAccent,
                            pressed && styles.modeCardPrimary,
                        ]}
                        onPress={() => nav.navigate('PYQSubjects')}
                    >
                        <Text style={styles.modeEmoji}>📜</Text>
                        <Text style={styles.modeTitle}>Previous Year MCQ</Text>
                        <Text style={styles.modeText}>
                            Solve full NEET-style mixed MCQ sets (Physics + Chemistry + Bio).
                        </Text>
                        <Text style={styles.modeHint}>Best for real exam practice</Text>
                    </Pressable>

                    {/* Previous Year MCQ Papers PDF */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.modeCard,
                            styles.modeCardNeutral,
                            pressed && styles.modeCardPrimary,
                        ]}
                        onPress={() => nav.navigate('PYQPdfPapers')}
                    >
                        <Text style={styles.modeEmoji}>📂</Text>
                        <Text style={styles.modeTitle}>PYQ Papers (PDF)</Text>
                        <Text style={styles.modeText}>
                            Download complete NEET papers in PDF for offline solving.
                        </Text>
                        <Text style={styles.modeHint}>Use with OMR sheets</Text>
                    </Pressable>

                    {/* Mock Test Papers */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.modeCard,
                            styles.modeCardNeutral,
                            pressed && styles.modeCardPrimary,
                        ]}
                        onPress={() => nav.navigate('MockTestPapers')}
                    >
                        <Text style={styles.modeEmoji}>📝</Text>
                        <Text style={styles.modeTitle}>Mock Test Papers</Text>
                        <Text style={styles.modeText}>
                            Attempt full-length mock tests and track improvement.
                        </Text>
                        <Text style={styles.modeHint}>Perfect for weekend practice</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    c: {
        padding: 16,
        gap: 16,
        paddingBottom: 28,
    },

    // Top bar
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    appTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#F9FAFB',
    },
    appSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    neetBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#22C55E',
    },
    neetBadgeText: {
        color: '#022C22',
        fontSize: 11,
        fontWeight: '700',
    },

    // 🔹 Banner slider (image only)
    bannerWrap: {
        marginBottom: 4,
    },
    bannerScroll: {
        paddingRight: 16,
    },
    bannerCard: {
        width: 320,
        height: 150,
        marginRight: 12,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#020617',
        borderWidth: 1,
        borderColor: '#38BDF8',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },

    // Sections
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 6,
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#E5E7EB',
    },
    sectionMeta: {
        fontSize: 12,
        color: '#9CA3AF',
    },

    empty: {
        borderWidth: 1,
        borderColor: '#1F2937',
        borderRadius: 12,
        padding: 14,
        backgroundColor: '#020617',
        marginBottom: 8,
    },

    // 🔹 Subject cards (now match practice-mode “card” look)
    subjectCard: {
        minWidth: 130,
        minHeight: 80,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 14,
        marginRight: 10,
        backgroundColor: '#020617',
        borderWidth: 3,
        borderColor: '#374151',
    },
    subjectCardPressed: {
        backgroundColor: '#374151',
        borderColor: '#374151',
    },
    subjectTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F9FAFB',
    },
    subjectMeta: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },

    // Practice modes grid
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    modeCard: {
        flexBasis: '48%',
        borderRadius: 14,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
    },
    modeCardPrimary: {
        backgroundColor: '#4F46E5',
        borderColor: '#4338CA',
    },
    modeCardPrimaryPressed: {
        backgroundColor: '#4338CA',
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
    modeHintPrimary: {
        fontSize: 11,
        color: '#E0E7FF',
        marginTop: 6,
    },

    modeCardAccent: {
        backgroundColor: '#0F172A',
        borderColor: '#38BDF8',
    },
    modeCardNeutral: {
        backgroundColor: '#020617',
        borderColor: '#374151',
    },
    modeCardDisabled: {
        opacity: 0.5,
    },

    modeEmoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    modeTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F9FAFB',
        marginBottom: 4,
    },
    modeText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    modeHint: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 6,
    },
});
