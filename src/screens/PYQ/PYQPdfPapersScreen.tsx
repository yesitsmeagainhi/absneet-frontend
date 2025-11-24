// src/screens/PYQ/PYQPdfPapersScreen.tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import {
  PYQ_FULL_EXAM_PAPERS,
  type FullExamPdf,
} from '../../data/demo';

import { useTheme } from '../../theme/ThemeContext'; // ✅ theme hook

type Props = NativeStackScreenProps<RootStackParamList, 'PYQPdfPapers'>;

export default function PYQPdfPapersScreen({ }: Props) {
  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);  // ✅ themed styles

  // 🟢 Full NEET exam (all subjects combined) – sorted latest first
  const fullExamPapers: FullExamPdf[] = useMemo(
    () => [...PYQ_FULL_EXAM_PAPERS].sort((a, b) => b.year - a.year),
    [],
  );

  return (
    <View style={styles.c}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Main heading */}
        <Text style={styles.heading}>Previous Year NEET Papers (Complete Exam)</Text>
        <Text style={styles.subheading}>
          Download full NEET question papers with Physics, Chemistry and Biology
          mixed together in one paper — just like the actual exam.
        </Text>

        {/* 🟢 Complete Exam option (all subjects combined) */}
        <View style={styles.completeExamCard}>
          <Text style={styles.completeExamTitle}>Complete Exam Papers</Text>
          <Text style={styles.completeExamDesc}>
            Each PDF below is a full NEET paper with all subjects combined.
          </Text>

          {fullExamPapers.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                No complete NEET exam papers added yet.
              </Text>
            </View>
          ) : (
            fullExamPapers.map((paper) => (
              <TouchableOpacity
                key={paper.id}
                style={styles.paperRow}
                onPress={() => Linking.openURL(paper.pdfUrl)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.paperTitle}>{paper.title}</Text>
                  <Text style={styles.paperMeta}>
                    {paper.exam} · {paper.year}
                  </Text>
                </View>
                <Text style={styles.viewText}>View PDF</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* NOTE: No subject-wise section here on purpose */}
      </ScrollView>
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
    completeExamCard: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      padding: 12,
    },
    completeExamTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#E5E7EB' : '#111827',
      marginBottom: 4,
    },
    completeExamDesc: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 10,
    },
    emptyWrap: {
      paddingVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
    paperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
      backgroundColor: isDark ? '#020617' : '#F9FAFF',
      marginBottom: 8,
    },
    paperTitle: {
      fontSize: 14,
      color: isDark ? '#E5E7EB' : '#111827',
    },
    paperMeta: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 2,
    },
    viewText: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#38BDF8' : '#2563EB',
      marginLeft: 10,
    },
  });
