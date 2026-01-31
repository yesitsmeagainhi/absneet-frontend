// src/screens/Search/SearchScreen.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../navigation/rootnavigator';
import { useTheme, Colors } from '../../theme/ThemeContext';
import { db } from '../../services/firebase.native';
import { SUBJECTS } from '../../data/demo';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Search result item type
type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  category: 'subject' | 'chapter' | 'unit' | 'practice' | 'feature';
  icon: string;
  color: string;
  // Navigation params
  navRoute: keyof RootStackParamList;
  navParams?: any;
};

// Practice modes data
const PRACTICE_MODES: SearchItem[] = [
  {
    id: 'custom_mcq',
    title: 'Custom MCQ Quiz',
    subtitle: 'Build quiz from selected topics',
    category: 'practice',
    icon: 'brain',
    color: Colors.primary,
    navRoute: 'CustomMCQQuiz',
    navParams: undefined,
  },
  {
    id: 'pyq_mcq',
    title: 'Previous Year MCQ',
    subtitle: 'Practice NEET pattern questions',
    category: 'practice',
    icon: 'history',
    color: '#F59E0B',
    navRoute: 'PYQSubjects',
    navParams: undefined,
  },
  {
    id: 'pyq_papers',
    title: 'PYQ Papers (PDF)',
    subtitle: 'Download previous year papers',
    category: 'practice',
    icon: 'file-pdf-box',
    color: '#EF4444',
    navRoute: 'PYQPdfPapers',
    navParams: undefined,
  },
  {
    id: 'mock_tests',
    title: 'Mock Test Papers',
    subtitle: 'Full-length practice tests',
    category: 'practice',
    icon: 'clipboard-text-outline',
    color: '#8B5CF6',
    navRoute: 'MockTestPapers',
    navParams: undefined,
  },
];

// App features data
const APP_FEATURES: SearchItem[] = [
  {
    id: 'help',
    title: 'Help & Support',
    subtitle: 'Get assistance and FAQs',
    category: 'feature',
    icon: 'help-circle-outline',
    color: '#6B7280',
    navRoute: 'Help',
    navParams: undefined,
  },
  {
    id: 'all_subjects',
    title: 'All Subjects',
    subtitle: 'View all available subjects',
    category: 'feature',
    icon: 'book-open-variant',
    color: '#10B981',
    navRoute: 'SubjectView',
    navParams: undefined,
  },
];

export default function SearchScreen() {
  const nav = useNavigation<Nav>();
  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const [query, setQuery] = useState('');
  const [subjects, setSubjects] = useState<SearchItem[]>([]);
  const [chapters, setChapters] = useState<SearchItem[]>([]);
  const [units, setUnits] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load subjects, units, and chapters from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const nodesRef = db.collection('nodes');

        // Load subjects
        const subjectsSnap = await nodesRef
          .where('type', '==', 'subject')
          .orderBy('order', 'asc')
          .get();

        const subjectItems: SearchItem[] = [];
        const subjectMap: Record<string, string> = {};

        if (subjectsSnap.empty) {
          // Fallback to demo data
          SUBJECTS.forEach(s => {
            subjectMap[s.id] = s.name;
            subjectItems.push({
              id: s.id,
              title: s.name,
              subtitle: `${s.units?.length || 0} units`,
              category: 'subject',
              icon: getSubjectIcon(s.name),
              color: getSubjectColor(s.id),
              navRoute: 'SubjectDetail',
              navParams: { subjectId: s.id },
            });
          });
        } else {
          subjectsSnap.forEach(doc => {
            const data = doc.data();
            subjectMap[doc.id] = data.name || data.title || 'Untitled';
            subjectItems.push({
              id: doc.id,
              title: data.name || data.title || 'Untitled',
              subtitle: 'Subject',
              category: 'subject',
              icon: getSubjectIcon(data.name || ''),
              color: getSubjectColor(doc.id),
              navRoute: 'SubjectDetail',
              navParams: { subjectId: doc.id },
            });
          });
        }

        setSubjects(subjectItems);

        // Load units
        const unitsSnap = await nodesRef.where('type', '==', 'unit').get();
        const unitItems: SearchItem[] = [];
        const unitMap: Record<string, { name: string; subjectId: string }> = {};

        unitsSnap.forEach(doc => {
          const data = doc.data();
          const subjectId = data.parentId || data.subjectId || '';
          const subjectName = subjectMap[subjectId] || 'Unknown Subject';
          unitMap[doc.id] = { name: data.name || data.title || 'Untitled', subjectId };
          unitItems.push({
            id: doc.id,
            title: data.name || data.title || 'Untitled',
            subtitle: `Unit in ${subjectName}`,
            category: 'unit',
            icon: 'folder-outline',
            color: '#3B82F6',
            navRoute: 'Chapters',
            navParams: { subjectId, unitId: doc.id },
          });
        });

        setUnits(unitItems);

        // Load chapters
        const chaptersSnap = await nodesRef.where('type', '==', 'chapter').get();
        const chapterItems: SearchItem[] = [];

        chaptersSnap.forEach(doc => {
          const data = doc.data();
          const unitId = data.parentId || data.unitId || '';
          const subjectId = data.subjectId || unitMap[unitId]?.subjectId || '';
          const subjectName = subjectMap[subjectId] || 'Unknown Subject';
          chapterItems.push({
            id: doc.id,
            title: data.name || data.title || 'Untitled',
            subtitle: `Chapter in ${subjectName}`,
            category: 'chapter',
            icon: 'book-outline',
            color: '#10B981',
            navRoute: 'ContentTabs',
            navParams: { subjectId, unitId, chapterId: doc.id },
          });
        });

        setChapters(chapterItems);
        setLoading(false);
      } catch (error) {
        console.error('[SearchScreen] Error loading data:', error);
        // Fallback to demo data for subjects
        const demoSubjects: SearchItem[] = SUBJECTS.map(s => ({
          id: s.id,
          title: s.name,
          subtitle: `${s.units?.length || 0} units`,
          category: 'subject',
          icon: getSubjectIcon(s.name),
          color: getSubjectColor(s.id),
          navRoute: 'SubjectDetail',
          navParams: { subjectId: s.id },
        }));
        setSubjects(demoSubjects);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) {
      // Show recent/popular items when no query
      return {
        practice: PRACTICE_MODES,
        subjects: subjects.slice(0, 3),
        features: APP_FEATURES,
      };
    }

    const filterItems = (items: SearchItem[]) =>
      items.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q)
      );

    return {
      practice: filterItems(PRACTICE_MODES),
      subjects: filterItems(subjects),
      units: filterItems(units),
      chapters: filterItems(chapters),
      features: filterItems(APP_FEATURES),
    };
  }, [query, subjects, units, chapters]);

  // Handle item press
  const handleItemPress = useCallback(
    (item: SearchItem) => {
      Keyboard.dismiss();
      nav.navigate(item.navRoute as any, item.navParams);
    },
    [nav]
  );

  // Render search item
  const renderItem = useCallback(
    ({ item }: { item: SearchItem }) => (
      <Pressable
        style={({ pressed }) => [
          styles.resultItem,
          pressed && styles.resultItemPressed,
        ]}
        onPress={() => handleItemPress(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Icon name={item.icon} size={22} color={item.color} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {item.subtitle}
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
      </Pressable>
    ),
    [styles, isDark, handleItemPress]
  );

  // Render section
  const renderSection = (title: string, items: SearchItem[]) => {
    if (!items || items.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map(item => (
          <View key={item.id}>{renderItem({ item })}</View>
        ))}
      </View>
    );
  };

  // Check if there are any results
  const hasResults =
    filteredResults.practice.length > 0 ||
    filteredResults.subjects.length > 0 ||
    (filteredResults.units?.length || 0) > 0 ||
    (filteredResults.chapters?.length || 0) > 0 ||
    filteredResults.features.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.header}>
          <Pressable onPress={() => nav.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
          </Pressable>
          <View style={styles.searchInputContainer}>
            <Icon name="magnify" size={20} color={isDark ? '#6B7280' : '#9CA3AF'} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search subjects, chapters, MCQs..."
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              value={query}
              onChangeText={setQuery}
              autoFocus
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')} style={styles.clearBtn}>
                <Icon name="close-circle" size={18} color={isDark ? '#6B7280' : '#9CA3AF'} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Results */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading search data...</Text>
          </View>
        ) : !hasResults && query.length > 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="magnify-close" size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching for subjects, chapters, or practice modes
            </Text>
          </View>
        ) : (
          <FlatList
            data={[1]} // Dummy data to render once
            keyExtractor={() => 'search-content'}
            renderItem={() => (
              <View style={styles.resultsContainer}>
                {query.length === 0 && (
                  <Text style={styles.suggestionsTitle}>
                    {query ? 'Search Results' : 'Quick Access'}
                  </Text>
                )}

                {renderSection('Practice Modes', filteredResults.practice)}
                {renderSection('Subjects', filteredResults.subjects)}
                {filteredResults.units && renderSection('Units', filteredResults.units)}
                {filteredResults.chapters && renderSection('Chapters', filteredResults.chapters)}
                {/* {renderSection('App Features', filteredResults.features)} */}
              </View>
            )}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// Helper functions
const SUBJECT_COLORS = [
  '#4ADE80', '#FBBF24', '#F87171', '#60A5FA',
  '#A78BFA', '#FB923C', '#2DD4BF', '#F472B6',
];

const getSubjectColor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
};

// Subject-specific icons mapping (keywords to icon names)
const SUBJECT_ICON_KEYWORDS: Array<{ keywords: string[]; icon: string }> = [
  { keywords: ['physics', 'physical'], icon: 'atom' },
  { keywords: ['chemistry', 'chemical', 'chem'], icon: 'flask' },
  { keywords: ['biology', 'bio', 'life science'], icon: 'dna' },
  { keywords: ['botany', 'plant', 'flora'], icon: 'leaf' },
  { keywords: ['zoology', 'animal', 'fauna', 'zoo'], icon: 'paw' },
  { keywords: ['mathematics', 'math', 'maths', 'algebra', 'calculus', 'geometry'], icon: 'calculator-variant' },
  { keywords: ['english', 'language', 'grammar', 'literature'], icon: 'alphabetical' },
  { keywords: ['hindi', 'sanskrit', 'urdu'], icon: 'abjad-hindi' },
  { keywords: ['history', 'historical'], icon: 'book-clock' },
  { keywords: ['geography', 'geo', 'earth'], icon: 'earth' },
  { keywords: ['economics', 'economy', 'finance'], icon: 'chart-line' },
  { keywords: ['political', 'politics', 'civics'], icon: 'account-group' },
  { keywords: ['computer', 'programming', 'coding', 'it', 'software'], icon: 'laptop' },
  { keywords: ['science', 'general science'], icon: 'flask-outline' },
  { keywords: ['social', 'sociology'], icon: 'account-multiple' },
  { keywords: ['psychology', 'mental'], icon: 'head-cog' },
  { keywords: ['environment', 'ecology', 'environmental'], icon: 'tree' },
  { keywords: ['anatomy', 'human body'], icon: 'human' },
  { keywords: ['physiology'], icon: 'heart-pulse' },
  { keywords: ['biochem', 'biochemistry'], icon: 'molecule' },
  { keywords: ['organic'], icon: 'hexagon-multiple' },
  { keywords: ['inorganic'], icon: 'diamond-stone' },
  { keywords: ['mechanics', 'motion'], icon: 'cog' },
  { keywords: ['optics', 'light'], icon: 'lightbulb-on' },
  { keywords: ['electricity', 'electric', 'current'], icon: 'flash' },
  { keywords: ['magnetism', 'magnetic'], icon: 'magnet' },
  { keywords: ['thermodynamics', 'heat', 'thermal'], icon: 'thermometer' },
  { keywords: ['genetics', 'gene', 'heredity'], icon: 'dna' },
  { keywords: ['evolution'], icon: 'human-handsup' },
  { keywords: ['cell', 'cellular'], icon: 'circle-slice-8' },
  { keywords: ['microbiology', 'microbe', 'bacteria'], icon: 'bacteria' },
];

// Get icon name for a subject (checks keywords in name)
const getSubjectIcon = (name: string): string => {
  const searchText = name.toLowerCase();

  for (const { keywords, icon } of SUBJECT_ICON_KEYWORDS) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return icon;
      }
    }
  }

  return 'book-open-variant'; // Default icon
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDark ? '#020617' : '#F3F4F6',
    },
    container: {
      flex: 1,
      backgroundColor: isDark ? '#020617' : '#F3F4F6',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
      gap: 8,
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#1E293B' : '#E5E7EB',
    },
    backBtn: {
      padding: 8,
    },
    searchInputContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#F3F4F6',
      borderRadius: 12,
      paddingHorizontal: 12,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: isDark ? '#F9FAFB' : '#111827',
      paddingVertical: 10,
    },
    clearBtn: {
      padding: 4,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#E5E7EB' : '#374151',
      marginTop: 16,
    },
    emptySubtitle: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      marginTop: 8,
    },
    resultsContainer: {
      padding: 16,
    },
    suggestionsTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 16,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: isDark ? '#9CA3AF' : '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E5E7EB',
    },
    resultItemPressed: {
      backgroundColor: isDark ? '#334155' : '#F3F4F6',
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemContent: {
      flex: 1,
      marginLeft: 12,
    },
    itemTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    itemSubtitle: {
      fontSize: 13,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 2,
    },
  });
