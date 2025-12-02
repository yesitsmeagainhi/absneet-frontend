// src/screens/Papers/MockTestPapersScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { useTheme } from '../../theme/ThemeContext';
import { db } from '../../firebase';
import {
  collection,
  orderBy,
  query,
  onSnapshot, // 👈 real-time listener
} from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'MockTestPapers'>;

type FullExamPdfDoc = {
  id: string;
  exam: string;
  year: number;
  title: string;
  pdfUrl: string;
};

type SubjectMockPdfDoc = {
  id: string;
  subjectId: string;
  subjectName?: string;
  exam: string;
  year: number;
  title: string;
  pdfUrl: string;
};

type SubjectWithMockPapers = {
  subjectId: string;
  subjectName: string;
  papers: SubjectMockPdfDoc[];
};

const fullExamCol = collection(db, 'mock_full_exam_papers');       // 👈 adjust name if needed
const subjectMocksCol = collection(db, 'mock_subject_mock_papers'); // 👈 adjust name if needed

export default function MockTestPapersScreen({ navigation }: Props) {
  const { isDark } = useTheme();
  const styles = useMemo(() => createStyles(isDark), [isDark]);

  const [fullExamPapers, setFullExamPapers] = useState<FullExamPdfDoc[]>([]);
  const [groupedSubjectMocks, setGroupedSubjectMocks] = useState<SubjectWithMockPapers[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 Real-time listeners for both collections
  useEffect(() => {
    setLoading(true);
    setError(null);

    // 1️⃣ Full exam mock papers
    const fullQ = query(fullExamCol, orderBy('year', 'desc'));
    const unsubscribeFull = onSnapshot(
      fullQ,
      snap => {
        const fullList: FullExamPdfDoc[] = snap.docs.map(d => {
          const data = d.data() as any;
          return {
            id: d.id,
            exam: data.exam ?? 'NEET',
            year: data.year ?? 0,
            title: data.title ?? `${data.exam ?? 'NEET'} ${data.year ?? ''} Mock Test`,
            pdfUrl: data.pdfUrl ?? '',
          };
        });

        setFullExamPapers(fullList);
        setLoading(false); // at least one section is ready
      },
      err => {
        console.error('[MockTestPapersScreen] fullExam onSnapshot error', err);
        setError('Failed to load mock test papers.');
        setLoading(false);
      },
    );

    // 2️⃣ Subject-wise mock papers
    const subjQ = query(subjectMocksCol, orderBy('year', 'desc'));
    const unsubscribeSubj = onSnapshot(
      subjQ,
      snap => {
        const subjectDocs: SubjectMockPdfDoc[] = snap.docs.map(d => {
          const data = d.data() as any;
          return {
            id: d.id,
            subjectId: data.subjectId ?? 'general',
            subjectName: data.subjectName,
            exam: data.exam ?? 'NEET',
            year: data.year ?? 0,
            title: data.title ?? `${data.exam ?? 'NEET'} ${data.year ?? ''} Mock`,
            pdfUrl: data.pdfUrl ?? '',
          };
        });

        // group by subjectId
        const bySub: Record<string, SubjectWithMockPapers> = {};
        subjectDocs.forEach(p => {
          if (!bySub[p.subjectId]) {
            bySub[p.subjectId] = {
              subjectId: p.subjectId,
              subjectName: p.subjectName || p.subjectId.toUpperCase(),
              papers: [],
            };
          }
          bySub[p.subjectId].papers.push(p);
        });

        const grouped = Object.values(bySub).map(s => ({
          ...s,
          papers: [...s.papers].sort((a, b) => b.year - a.year),
        }));

        setGroupedSubjectMocks(grouped);
      },
      err => {
        console.error('[MockTestPapersScreen] subjectMocks onSnapshot error', err);
        setError('Failed to load subject-wise mock test papers.');
      },
    );

    // 🔙 cleanup both listeners on unmount
    return () => {
      unsubscribeFull();
      unsubscribeSubj();
    };
  }, []);

  const openPdf = (title: string, pdfUrl: string) => {
    if (!pdfUrl) return;
    navigation.navigate('PDFViewer', {
      title,
      url: pdfUrl,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerWrap}>
        <ActivityIndicator color={isDark ? '#E5E7EB' : '#4B5563'} />
        <Text style={styles.centerText}>Loading mock test papers…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerWrap}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.c}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Heading */}
        <Text style={styles.heading}>Mock Test Papers (PDF)</Text>
        <Text style={styles.subheading}>
          Practice full NEET-style mock tests and subject-wise mock papers in PDF format.
        </Text>

        {/* 🟢 Section 1: Complete Mock Exam – all subjects combined */}
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
          fullExamPapers.map(paper => (
            <TouchableOpacity
              key={paper.id}
              style={styles.paperRow}
              onPress={() => openPdf(paper.title, paper.pdfUrl)}
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
            keyExtractor={s => s.subjectId}
            scrollEnabled={false}
            contentContainerStyle={{ paddingTop: 8 }}
            renderItem={({ item }) => (
              <View style={styles.subjectBlock}>
                <Text style={styles.subjectName}>{item.subjectName}</Text>

                {item.papers.map(paper => (
                  <TouchableOpacity
                    key={paper.id}
                    style={styles.paperRow}
                    onPress={() => openPdf(paper.title, paper.pdfUrl)}
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
// /** Theme-aware styles */
const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    c: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? '#020617' : '#F9FAFB',
    },
    centerWrap: {
      flex: 1,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#020617' : '#F9FAFB',
    },
    centerText: {
      marginTop: 8,
      fontSize: 13,
      color: isDark ? '#E5E7EB' : '#6B7280',
      textAlign: 'center',
    },
    errorText: {
      fontSize: 14,
      color: '#F97373',
      textAlign: 'center',
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
    sectionHeading: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#E5E7EB' : '#111827',
      marginTop: 8,
      marginBottom: 4,
    },
    sectionSub: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 8,
    },
    divider: {
      height: 1,
      backgroundColor: isDark ? '#1F2937' : '#E5E7EB',
      marginVertical: 12,
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
    subjectBlock: {
      marginBottom: 16,
    },
    subjectName: {
      fontSize: 15,
      fontWeight: '600',
      color: isDark ? '#E5E7EB' : '#111827',
      marginBottom: 6,
    },
    paperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
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
