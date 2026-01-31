// src/screens/Subject/SubjectViewScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootStackParamList } from '../../navigation/rootnavigator';
import { useTheme, Colors } from '../../theme/ThemeContext';
import { db } from '../../services/firebase.native';
import { SUBJECTS } from '../../data/demo';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type SubjectItem = {
  id: string;
  name: string;
  order: number;
  unitCount: number;
  chapterCount: number;
  color: string;
};

// Random pastel colors for subject initials
const SUBJECT_COLORS = [
  '#4ADE80', // Green
  '#FBBF24', // Amber
  '#F87171', // Red
  '#60A5FA', // Blue
  '#A78BFA', // Purple
  '#FB923C', // Orange
  '#2DD4BF', // Teal
  '#F472B6', // Pink
];

// Get a consistent color based on subject id
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
const getSubjectIcon = (name: string, id: string): string => {
  const searchText = `${name} ${id}`.toLowerCase();

  for (const { keywords, icon } of SUBJECT_ICON_KEYWORDS) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword)) {
        return icon;
      }
    }
  }

  return 'book-open-variant'; // Default icon
};

export default function SubjectViewScreen() {
  const nav = useNavigation<Nav>();
  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadSubjects = async () => {
      try {
        const nodesRef = db.collection('nodes');

        // Get subjects
        const subjectsSnap = await nodesRef
          .where('type', '==', 'subject')
          .orderBy('order', 'asc')
          .get();

        if (subjectsSnap.empty) {
          // Fallback to demo data
          const demoSubjects: SubjectItem[] = SUBJECTS.map((s, idx) => {
            const chapCount = s.units?.reduce((acc, u) => acc + (u.chapters?.length ?? 0), 0) ?? 0;
            return {
              id: s.id,
              name: s.name,
              order: idx,
              unitCount: s.units?.length ?? 0,
              chapterCount: chapCount,
              color: getSubjectColor(s.id),
            };
          });
          if (isMounted) {
            setSubjects(demoSubjects);
            setLoading(false);
          }
          return;
        }

        // Get unit counts
        const unitsSnap = await nodesRef.where('type', '==', 'unit').get();
        const unitCounts: Record<string, number> = {};
        unitsSnap.forEach(doc => {
          const data = doc.data() as any;
          const parentId = data.parentId as string | undefined;
          if (parentId) {
            unitCounts[parentId] = (unitCounts[parentId] ?? 0) + 1;
          }
        });

        // Get chapter counts
        const chaptersSnap = await nodesRef.where('type', '==', 'chapter').get();
        const chapterCounts: Record<string, number> = {};
        chaptersSnap.forEach(doc => {
          const data = doc.data() as any;
          const subjectId = data.subjectId as string | undefined;
          if (subjectId) {
            chapterCounts[subjectId] = (chapterCounts[subjectId] ?? 0) + 1;
          }
        });

        // Build subjects list
        const items: SubjectItem[] = subjectsSnap.docs.map((docSnap, idx) => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            name: data.name ?? data.title ?? 'Untitled',
            order: data.order ?? idx,
            unitCount: unitCounts[docSnap.id] ?? 0,
            chapterCount: chapterCounts[docSnap.id] ?? 0,
            color: getSubjectColor(docSnap.id),
          };
        });

        if (isMounted) {
          setSubjects(items);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('[SubjectViewScreen] Error loading subjects:', err);
        if (isMounted) {
          setError('Failed to load subjects. Please try again.');
          // Fallback to demo data
          const demoSubjects: SubjectItem[] = SUBJECTS.map((s, idx) => {
            const chapCount = s.units?.reduce((acc, u) => acc + (u.chapters?.length ?? 0), 0) ?? 0;
            return {
              id: s.id,
              name: s.name,
              order: idx,
              unitCount: s.units?.length ?? 0,
              chapterCount: chapCount,
              color: getSubjectColor(s.id),
            };
          });
          setSubjects(demoSubjects);
          setLoading(false);
        }
      }
    };

    loadSubjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderSubject = ({ item }: { item: SubjectItem }) => (
    <Pressable
      style={({ pressed }) => [
        styles.subjectCard,
        pressed && styles.subjectCardPressed,
        { borderLeftColor: item.color },
      ]}
      onPress={() => nav.navigate('SubjectDetail', { subjectId: item.id })}
    >
      {/* Icon container */}
      <View style={[styles.subjectIconContainer, { backgroundColor: item.color + '20' }]}>
        <Icon
          name={getSubjectIcon(item.name, item.id)}
          size={26}
          color={item.color}
        />
      </View>

      {/* Subject info */}
      <View style={styles.subjectCardContent}>
        <Text style={styles.subjectTitle}>{item.name}</Text>
        <Text style={styles.subjectMeta}>
          {item.chapterCount} {item.chapterCount === 1 ? 'Chapter' : 'Chapters'} • {item.unitCount} {item.unitCount === 1 ? 'Unit' : 'Units'}
        </Text>
      </View>

      {/* Arrow icon */}
      <Icon name="chevron-right" size={24} color={isDark ? '#6B7280' : '#9CA3AF'} />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}

      {subjects.length === 0 ? (
        <View style={styles.center}>
          <Icon name="book-open-variant" size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
          <Text style={styles.emptyTitle}>No subjects available</Text>
          <Text style={styles.emptySubtitle}>
            Subjects will appear here once added to the database.
          </Text>
        </View>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={s => s.id}
          renderItem={renderSubject}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#020617' : '#F3F4F6',
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    errorText: {
      fontSize: 12,
      color: '#F97316',
      padding: 16,
      paddingBottom: 0,
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
    listContent: {
      padding: 16,
      gap: 12,
    },
    subjectCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E5E7EB',
      borderLeftWidth: 4,
      shadowColor: '#000',
      shadowOpacity: isDark ? 0 : 0.06,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: isDark ? 0 : 2,
    },
    subjectCardPressed: {
      backgroundColor: isDark ? '#334155' : '#F0F9FF',
      borderColor: isDark ? '#475569' : '#BAE6FD',
    },
    subjectIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    subjectCardContent: {
      flex: 1,
      marginLeft: 14,
    },
    subjectTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    subjectMeta: {
      fontSize: 13,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 3,
    },
  });
