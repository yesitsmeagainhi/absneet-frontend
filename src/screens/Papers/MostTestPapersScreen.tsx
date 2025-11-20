// src/screens/Papers/MockTestPapersScreen.tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import {
  SUBJECTS,
  MOCK_FULL_EXAM_PAPERS,
  MOCK_PDF_PAPERS,
  type MockPdfPaper,
  type MockFullExamPdf,
} from '../../data/demo';

type Props = NativeStackScreenProps<RootStackParamList, 'MockTestPapers'>;

type SubjectWithMockPapers = {
  subjectId: string;
  subjectName: string;
  papers: MockPdfPaper[];
};

export default function MockTestPapersScreen({}: Props) {
  // 🟢 Full mock exam papers (all subjects combined) – sorted latest first
  const fullExamPapers: MockFullExamPdf[] = useMemo(
    () => [...MOCK_FULL_EXAM_PAPERS].sort((a, b) => b.year - a.year),
    [],
  );

  // 🟡 Subject-wise mock PDFs – grouped by subject
  const groupedSubjectMocks: SubjectWithMockPapers[] = useMemo(() => {
    const bySub: Record<string, SubjectWithMockPapers> = {};

    MOCK_PDF_PAPERS.forEach((p) => {
      if (!bySub[p.subjectId]) {
        const subj = SUBJECTS.find((s) => s.id === p.subjectId);
        bySub[p.subjectId] = {
          subjectId: p.subjectId,
          subjectName: subj?.name || p.subjectId.toUpperCase(),
          papers: [],
        };
      }
      bySub[p.subjectId].papers.push(p);
    });

    return Object.values(bySub).map((s) => ({
      ...s,
      papers: s.papers.sort((a, b) => b.year - a.year),
    }));
  }, []);

  return (
    <View style={styles.c}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Heading */}
        <Text style={styles.heading}>Mock Test Papers (PDF)</Text>
        <Text style={styles.subheading}>
          Practice full NEET-style mock tests and subject-wise mock papers in PDF format.
        </Text>

        {/* 🟢 Section 1: Complete Mock Exam – all subjects mixed */}
        <Text style={styles.sectionHeading}>Complete Exam (All Subjects Combined)</Text>
        <Text style={styles.sectionSub}>
          These mock tests contain Physics, Chemistry and Biology together in one paper,
          just like the actual NEET exam.
        </Text>

        {fullExamPapers.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              No complete mock test papers added yet.
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

        {/* Divider */}
        <View style={styles.divider} />

        {/* 🟡 Section 2: Subject-wise mock test PDFs */}
        <Text style={styles.sectionHeading}>Subject-wise Mock Papers</Text>
        <Text style={styles.sectionSub}>
          Use these for focused practice in individual subjects like Physics and Chemistry.
        </Text>

        {groupedSubjectMocks.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>
              No subject-wise mock papers added yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={groupedSubjectMocks}
            keyExtractor={(s) => s.subjectId}
            scrollEnabled={false}
            contentContainerStyle={{ paddingTop: 8 }}
            renderItem={({ item }) => (
              <View style={styles.subjectBlock}>
                <Text style={styles.subjectName}>{item.subjectName}</Text>

                {item.papers.map((paper) => (
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
                ))}
              </View>
            )}
          />
        )}
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
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  emptyWrap: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  subjectBlock: {
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  paperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  paperTitle: {
    fontSize: 14,
    color: '#111827',
  },
  paperMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  viewText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    marginLeft: 10,
  },
});
