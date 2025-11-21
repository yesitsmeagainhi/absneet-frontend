// // src/screens/MCQ/CustomMCQselectScreen.tsx
// import React, { useEffect, useMemo, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ActivityIndicator,
//     ScrollView,
//     Alert,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// import { db } from '../../firebase';
// import { collection, getDocs, query, where } from 'firebase/firestore';

// type Props = NativeStackScreenProps<RootStackParamList, 'CustomMCQQuiz'>;

// type OptionKey = 'A' | 'B' | 'C' | 'D';

// type RawQuestion = {
//     id?: string;
//     q: string;
//     options: string[];
//     correctIndex: number;
// };

// type SubjectNode = {
//     id: string;
//     name: string;
//     type: 'subject';
//     order?: number;
// };

// type UnitNode = {
//     id: string;
//     name: string;
//     type: 'unit';
//     parentId: string;      // subjectId
//     subjectId?: string;
//     order?: number;
// };

// type ChapterNode = {
//     id: string;
//     name: string;
//     type: 'chapter';
//     parentId: string;      // unitId
//     subjectId?: string;
//     unitId?: string;
//     questions?: RawQuestion[];
// };

// type McqDoc = {
//     id: string;
//     subjectId?: string;
//     unitId?: string;
//     chapterId?: string;
//     question: string;
//     options: {
//         A: string;
//         B: string;
//         C: string;
//         D: string;
//     };
//     correctOption: OptionKey;
// };

// type Option = { id: string; label: string };

// function MultiSelectDropdown({
//     label,
//     options,
//     selectedIds,
//     onChangeSelected,
//     disabled,
// }: {
//     label: string;
//     options: Option[];
//     selectedIds: string[];
//     onChangeSelected: (ids: string[]) => void;
//     disabled?: boolean;
// }) {
//     const [open, setOpen] = useState(false);

//     const selectedLabels = useMemo(
//         () =>
//             options
//                 .filter(o => selectedIds.includes(o.id))
//                 .map(o => o.label),
//         [options, selectedIds]
//     );

//     let valueLabel = `Select ${label.toLowerCase()}`;
//     if (selectedLabels.length === 1) {
//         valueLabel = selectedLabels[0];
//     } else if (selectedLabels.length === 2) {
//         valueLabel = selectedLabels.join(', ');
//     } else if (selectedLabels.length > 2) {
//         valueLabel = `${selectedLabels[0]}, +${selectedLabels.length - 1} more`;
//     }

//     const toggleId = (id: string) => {
//         if (selectedIds.includes(id)) {
//             onChangeSelected(selectedIds.filter(x => x !== id));
//         } else {
//             onChangeSelected([...selectedIds, id]);
//         }
//     };

//     const isDisabled = disabled || options.length === 0;

//     return (
//         <View style={[styles.dropdownBlock, isDisabled && { opacity: 0.5 }]}>
//             <Text style={styles.dropdownLabel}>{label}</Text>

//             <TouchableOpacity
//                 style={styles.select}
//                 disabled={isDisabled}
//                 activeOpacity={0.7}
//                 onPress={() => setOpen(o => !o)}
//             >
//                 <Text
//                     style={[
//                         styles.selectText,
//                         { color: selectedLabels.length ? '#111827' : '#9CA3AF' },
//                     ]}
//                     numberOfLines={1}
//                 >
//                     {valueLabel}
//                 </Text>
//                 <Text style={styles.selectIcon}>{open ? '▲' : '▼'}</Text>
//             </TouchableOpacity>

//             {open && !isDisabled && (
//                 <View style={styles.menu}>
//                     <ScrollView nestedScrollEnabled>
//                         {options.map(item => {
//                             const checked = selectedIds.includes(item.id);
//                             return (
//                                 <TouchableOpacity
//                                     key={item.id}
//                                     style={styles.menuItem}
//                                     onPress={() => toggleId(item.id)}
//                                     activeOpacity={0.7}
//                                 >
//                                     <View
//                                         style={[
//                                             styles.checkbox,
//                                             checked && styles.checkboxChecked,
//                                         ]}
//                                     />
//                                     <Text style={styles.menuItemLabel}>{item.label}</Text>
//                                 </TouchableOpacity>
//                             );
//                         })}
//                     </ScrollView>
//                 </View>
//             )}
//         </View>
//     );
// }

// export default function CustomMCQQuizScreen({ navigation }: Props) {
//     const [loadingMeta, setLoadingMeta] = useState(true);
//     const [subjects, setSubjects] = useState<SubjectNode[]>([]);
//     const [units, setUnits] = useState<UnitNode[]>([]);
//     const [chapters, setChapters] = useState<ChapterNode[]>([]);

//     const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
//     const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
//     const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);

//     // -------- LOAD SUBJECTS / UNITS / CHAPTERS --------

//     useEffect(() => {
//         const loadAll = async () => {
//             try {
//                 setLoadingMeta(true);
//                 const colRef = collection(db, 'nodes');

//                 const [subSnap, unitSnap] = await Promise.all([
//                     getDocs(query(colRef, where('type', '==', 'subject'))),
//                     getDocs(query(colRef, where('type', '==', 'unit'))),
//                 ]);

//                 const subjectsData: SubjectNode[] = subSnap.docs.map(d => {
//                     const data = d.data() as any;
//                     return {
//                         id: d.id,
//                         name: data.name ?? '',
//                         type: 'subject',
//                         order: data.order,
//                     };
//                 });

//                 const unitsData: UnitNode[] = unitSnap.docs.map(d => {
//                     const data = d.data() as any;
//                     return {
//                         id: d.id,
//                         name: data.name ?? '',
//                         type: 'unit',
//                         parentId: data.parentId || data.subjectId || '',
//                         subjectId: data.subjectId ?? data.parentId,
//                         order: data.order,
//                     };
//                 });

//                 const unitsById: Record<string, UnitNode> = {};
//                 unitsData.forEach(u => {
//                     unitsById[u.id] = u;
//                 });

//                 const chapSnap = await getDocs(
//                     query(colRef, where('type', '==', 'chapter')),
//                 );
//                 const chaptersData: ChapterNode[] = chapSnap.docs.map(d => {
//                     const data = d.data() as any;
//                     let subjectId: string | undefined = data.subjectId;
//                     const unitId: string | undefined = data.unitId ?? data.parentId;

//                     if (!subjectId && unitId && unitsById[unitId]) {
//                         subjectId =
//                             unitsById[unitId].subjectId ?? unitsById[unitId].parentId;
//                     }

//                     return {
//                         id: d.id,
//                         name: data.name ?? '',
//                         type: 'chapter',
//                         parentId: data.parentId || unitId || '',
//                         subjectId,
//                         unitId,
//                         questions: data.questions || [],
//                     };
//                 });

//                 setSubjects(subjectsData);
//                 setUnits(unitsData);
//                 setChapters(chaptersData);
//             } catch (err) {
//                 console.error('[CustomMCQQuiz] Error loading structure', err);
//             } finally {
//                 setLoadingMeta(false);
//             }
//         };

//         loadAll();
//     }, []);

//     // Reset selections in a controlled way
//     useEffect(() => {
//         setSelectedUnitIds([]);
//         setSelectedChapterIds([]);
//     }, [selectedSubjectIds.join(',')]);

//     useEffect(() => {
//         setSelectedChapterIds([]);
//     }, [selectedUnitIds.join(',')]);

//     // -------- OPTIONS FOR DROPDOWNS --------

//     const subjectOptions: Option[] = useMemo(
//         () => subjects.map(s => ({ id: s.id, label: s.name })),
//         [subjects]
//     );

//     const unitOptions: Option[] = useMemo(() => {
//         if (selectedSubjectIds.length === 0) return [];
//         const setSubs = new Set(selectedSubjectIds);
//         return units
//             .filter(u => {
//                 const sId = u.subjectId || u.parentId;
//                 return sId && setSubs.has(sId);
//             })
//             .map(u => ({ id: u.id, label: u.name }));
//     }, [units, selectedSubjectIds]);

//     // 🔴 CHAPTERS NOW ONLY COME FROM SELECTED UNITS
//     const chapterOptions: Option[] = useMemo(() => {
//         if (selectedUnitIds.length === 0) return [];
//         const setUnits = new Set(selectedUnitIds);
//         return chapters
//             .filter(c => c.unitId && setUnits.has(c.unitId))
//             .map(c => ({ id: c.id, label: c.name }));
//     }, [chapters, selectedUnitIds]);

//     // -------- BUILD MCQS AND NAVIGATE --------

//     const handleStartQuiz = () => {
//         const letters: OptionKey[] = ['A', 'B', 'C', 'D'];
//         let targetChapters: ChapterNode[] = [];

//         if (selectedChapterIds.length > 0) {
//             const setChap = new Set(selectedChapterIds);
//             targetChapters = chapters.filter(c => setChap.has(c.id));
//         } else if (selectedUnitIds.length > 0) {
//             const setUnits = new Set(selectedUnitIds);
//             targetChapters = chapters.filter(
//                 c => c.unitId && setUnits.has(c.unitId),
//             );
//         } else {
//             Alert.alert(
//                 'Selection required',
//                 'Please select at least one Unit or Chapter to start the quiz.',
//             );
//             return;
//         }

//         const collected: McqDoc[] = [];

//         targetChapters.forEach(ch => {
//             const qs = ch.questions || [];
//             qs.forEach((qObj, idx) => {
//                 const opts = qObj.options || [];
//                 const optMap = {
//                     A: opts[0] ?? '',
//                     B: opts[1] ?? '',
//                     C: opts[2] ?? '',
//                     D: opts[3] ?? '',
//                 };
//                 const ci =
//                     typeof qObj.correctIndex === 'number' ? qObj.correctIndex : 0;
//                 const correctLetter: OptionKey = letters[ci] ?? 'A';

//                 collected.push({
//                     id: qObj.id || `${ch.id}_${idx}`,
//                     subjectId: ch.subjectId,
//                     unitId: ch.unitId,
//                     chapterId: ch.id,
//                     question: qObj.q,
//                     options: optMap,
//                     correctOption: correctLetter,
//                 });
//             });
//         });

//         if (collected.length === 0) {
//             Alert.alert(
//                 'No questions',
//                 'No MCQs found for the selected filters. Please try a different selection.',
//             );
//             return;
//         }

//         navigation.navigate('CustomMCQSolve', { questions: collected });
//     };

//     // 👉 Start button only enabled if Unit or Chapter is selected
//     const nothingSelected =
//         selectedUnitIds.length === 0 && selectedChapterIds.length === 0;

//     return (
//         <View style={styles.container}>
//             <ScrollView
//                 contentContainerStyle={styles.scrollContent}
//                 keyboardShouldPersistTaps="handled"
//             >
//                 {/* Header */}
//                 <Text style={styles.title}>Custom MCQ Quiz</Text>
//                 <Text style={styles.subtitle}>
//                     Build your own quiz by selecting Subjects, Units and Chapters.
//                 </Text>

//                 {loadingMeta ? (
//                     <View style={styles.center}>
//                         <ActivityIndicator size="large" />
//                         <Text style={styles.centerText}>Loading structure...</Text>
//                     </View>
//                 ) : (
//                     <>
//                         {/* Info / Summary card */}
//                         <View style={styles.infoCard}>
//                             <Text style={styles.infoHeading}>How it works</Text>
//                             <Text style={styles.infoText}>1. Pick one or more Subjects.</Text>
//                             <Text style={styles.infoText}>
//                                 2. Select Units under those Subjects.
//                             </Text>
//                             <Text style={styles.infoText}>
//                                 3. (Optional) Narrow further by Chapters.
//                             </Text>

//                             <View style={styles.summaryRow}>
//                                 <View style={styles.summaryPill}>
//                                     <Text style={styles.summaryLabel}>Subjects</Text>
//                                     <Text style={styles.summaryValue}>
//                                         {selectedSubjectIds.length}
//                                     </Text>
//                                 </View>
//                                 <View style={styles.summaryPill}>
//                                     <Text style={styles.summaryLabel}>Units</Text>
//                                     <Text style={styles.summaryValue}>
//                                         {selectedUnitIds.length}
//                                     </Text>
//                                 </View>
//                                 <View style={styles.summaryPill}>
//                                     <Text style={styles.summaryLabel}>Chapters</Text>
//                                     <Text style={styles.summaryValue}>
//                                         {selectedChapterIds.length}
//                                     </Text>
//                                 </View>
//                             </View>
//                         </View>

//                         {/* Filter card */}
//                         <View style={styles.filterCard}>
//                             <Text style={styles.filterTitle}>Choose your topics</Text>

//                             {/* SUBJECTS */}
//                             <MultiSelectDropdown
//                                 label="Subjects"
//                                 options={subjectOptions}
//                                 selectedIds={selectedSubjectIds}
//                                 onChangeSelected={setSelectedSubjectIds}
//                             />
//                             {selectedSubjectIds.length === 0 && (
//                                 <Text style={styles.helperText}>
//                                     Select at least one Subject to choose Units.
//                                 </Text>
//                             )}

//                             {/* UNITS */}
//                             <MultiSelectDropdown
//                                 label="Units"
//                                 options={unitOptions}
//                                 selectedIds={selectedUnitIds}
//                                 onChangeSelected={setSelectedUnitIds}
//                                 disabled={selectedSubjectIds.length === 0}
//                             />
//                             {selectedSubjectIds.length > 0 && selectedUnitIds.length === 0 && (
//                                 <Text style={styles.helperText}>
//                                     Now select Unit(s) under the chosen Subject(s).
//                                 </Text>
//                             )}

//                             {/* CHAPTERS */}
//                             <MultiSelectDropdown
//                                 label="Chapters"
//                                 options={chapterOptions}
//                                 selectedIds={selectedChapterIds}
//                                 onChangeSelected={setSelectedChapterIds}
//                                 disabled={selectedUnitIds.length === 0}
//                             />
//                             {selectedUnitIds.length === 0 && (
//                                 <Text style={styles.helperText}>
//                                     Select at least one Unit to see its Chapters.
//                                 </Text>
//                             )}
//                         </View>
//                     </>
//                 )}
//             </ScrollView>

//             {/* Sticky bottom button */}
//             {!loadingMeta && (
//                 <View style={styles.footer}>
//                     <TouchableOpacity
//                         style={[styles.loadBtn, nothingSelected && { opacity: 0.4 }]}
//                         disabled={nothingSelected}
//                         onPress={handleStartQuiz}
//                     >
//                         <Text style={styles.loadBtnText}>Start Quiz</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F3F4F6',
//     },
//     scrollContent: {
//         paddingHorizontal: 16,
//         paddingTop: 16,
//         paddingBottom: 24,
//     },

//     title: {
//         fontSize: 20,
//         fontWeight: '700',
//         marginBottom: 4,
//         color: '#111827',
//     },
//     subtitle: {
//         fontSize: 13,
//         color: '#6B7280',
//         marginBottom: 12,
//     },

//     center: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 32,
//     },
//     centerText: {
//         marginTop: 8,
//         fontSize: 13,
//         color: '#6B7280',
//     },

//     infoCard: {
//         backgroundColor: '#EEF2FF',
//         borderRadius: 14,
//         paddingHorizontal: 14,
//         paddingVertical: 12,
//         marginBottom: 16,
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//     },
//     infoHeading: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#111827',
//         marginBottom: 6,
//     },
//     infoText: {
//         fontSize: 12,
//         color: '#4B5563',
//         marginBottom: 2,
//     },
//     summaryRow: {
//         flexDirection: 'row',
//         marginTop: 10,
//         gap: 8,
//     },
//     summaryPill: {
//         flex: 1,
//         borderRadius: 999,
//         paddingVertical: 6,
//         paddingHorizontal: 10,
//         backgroundColor: '#fff',
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     summaryLabel: {
//         fontSize: 11,
//         color: '#6B7280',
//     },
//     summaryValue: {
//         fontSize: 13,
//         fontWeight: '700',
//         color: '#111827',
//     },

//     filterCard: {
//         backgroundColor: '#fff',
//         borderRadius: 14,
//         paddingHorizontal: 14,
//         paddingVertical: 12,
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//         marginBottom: 12,
//     },
//     filterTitle: {
//         fontSize: 15,
//         fontWeight: '600',
//         color: '#111827',
//         marginBottom: 6,
//     },

//     dropdownBlock: {
//         marginTop: 8,
//         marginBottom: 6,
//     },
//     dropdownLabel: {
//         fontSize: 13,
//         fontWeight: '600',
//         marginBottom: 6,
//         color: '#374151',
//     },
//     helperText: {
//         fontSize: 11,
//         color: '#9CA3AF',
//         marginTop: -2,
//         marginBottom: 4,
//     },

//     select: {
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//         borderRadius: 10,
//         backgroundColor: '#F9FAFB',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     selectText: {
//         flex: 1,
//         fontSize: 13,
//     },
//     selectIcon: {
//         marginLeft: 8,
//         color: '#6B7280',
//         fontSize: 12,
//     },

//     menu: {
//         marginTop: 6,
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//         borderRadius: 10,
//         backgroundColor: '#fff',
//         maxHeight: 220,
//         overflow: 'hidden',
//     },
//     menuItem: {
//         paddingVertical: 8,
//         paddingHorizontal: 10,
//         borderTopWidth: 1,
//         borderTopColor: '#F3F4F6',
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     menuItemLabel: {
//         fontSize: 13,
//         color: '#111827',
//     },

//     checkbox: {
//         width: 18,
//         height: 18,
//         borderWidth: 1,
//         borderColor: '#9CA3AF',
//         borderRadius: 4,
//         marginRight: 8,
//     },
//     checkboxChecked: {
//         backgroundColor: '#6D28D9',
//         borderColor: '#6D28D9',
//     },

//     footer: {
//         paddingHorizontal: 16,
//         paddingBottom: 16,
//         paddingTop: 8,
//         borderTopWidth: 1,
//         borderTopColor: '#E5E7EB',
//         backgroundColor: '#F9FAFB',
//     },
//     loadBtn: {
//         backgroundColor: '#6D28D9',
//         paddingVertical: 14,
//         borderRadius: 12,
//         alignItems: 'center',
//     },
//     loadBtnText: {
//         color: '#fff',
//         fontWeight: '600',
//         fontSize: 15,
//     },
// });


// src/screens/MCQ/CustomMCQselectScreen.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

// 🔹 Use static demo data instead of Firestore
import {
    SUBJECTS,
    Subject,
    Unit,
    Chapter,
    Question as DemoQuestionType,
} from '../../data/demo';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomMCQQuiz'>;

type SubjectNode = {
    id: string;
    name: string;
    type: 'subject';
    order?: number;
};

type UnitNode = {
    id: string;
    name: string;
    type: 'unit';
    parentId: string; // subjectId
    subjectId: string;
    order?: number;
};

type ChapterNode = {
    id: string;
    name: string;
    type: 'chapter';
    parentId: string; // unitId
    subjectId: string;
    unitId: string;
    questions: DemoQuestionType[];
};

type Option = { id: string; label: string };

// Simple pill chip
function Chip({
    label,
    selected,
    disabled,
    onPress,
}: {
    label: string;
    selected: boolean;
    disabled?: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            disabled={disabled}
            onPress={onPress}
            style={[
                styles.chip,
                selected && styles.chipSelected,
                disabled && styles.chipDisabled,
            ]}
        >
            <Text
                numberOfLines={1}
                style={[
                    styles.chipText,
                    selected && styles.chipTextSelected,
                    disabled && styles.chipTextDisabled,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export default function CustomMCQQuizScreen({ navigation }: Props) {
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [subjects, setSubjects] = useState<SubjectNode[]>([]);
    const [units, setUnits] = useState<UnitNode[]>([]);
    const [chapters, setChapters] = useState<ChapterNode[]>([]);

    const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
    const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
    const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);

    // -------- LOAD SUBJECTS / UNITS / CHAPTERS FROM demo.ts --------
    useEffect(() => {
        const loadFromDemo = () => {
            setLoadingMeta(true);
            try {
                const subjNodes: SubjectNode[] = [];
                const unitNodes: UnitNode[] = [];
                const chapNodes: ChapterNode[] = [];

                SUBJECTS.forEach((subject: Subject, sIdx) => {
                    subjNodes.push({
                        id: subject.id,
                        name: subject.name,
                        type: 'subject',
                        order: sIdx + 1,
                    });

                    (subject.units || []).forEach((unit: Unit, uIdx) => {
                        unitNodes.push({
                            id: unit.id,
                            name: unit.name,
                            type: 'unit',
                            parentId: subject.id,
                            subjectId: subject.id,
                            order: uIdx + 1,
                        });

                        (unit.chapters || []).forEach((chapter: Chapter) => {
                            chapNodes.push({
                                id: chapter.id,
                                name: chapter.name,
                                type: 'chapter',
                                parentId: unit.id,
                                subjectId: subject.id,
                                unitId: unit.id,
                                questions: (chapter.questions || []) as DemoQuestionType[],
                            });
                        });
                    });
                });

                setSubjects(subjNodes);
                setUnits(unitNodes);
                setChapters(chapNodes);
            } finally {
                setLoadingMeta(false);
            }
        };

        loadFromDemo();
    }, []);

    // When subjects change: keep only units that still belong to selected subjects
    useEffect(() => {
        if (selectedSubjectIds.length === 0) {
            setSelectedUnitIds([]);
            setSelectedChapterIds([]);
            return;
        }

        const subjectSet = new Set(selectedSubjectIds);

        setSelectedUnitIds(prevUnits => {
            const nextUnits = prevUnits.filter(uid => {
                const u = units.find(x => x.id === uid);
                if (!u) return false;
                const sId = u.subjectId || u.parentId;
                return !!sId && subjectSet.has(sId);
            });
            return nextUnits;
        });
    }, [selectedSubjectIds.join(','), units]);

    // When units change: keep only chapters that still belong to selected units
    useEffect(() => {
        if (selectedUnitIds.length === 0) {
            setSelectedChapterIds([]);
            return;
        }

        const unitSet = new Set(selectedUnitIds);
        setSelectedChapterIds(prevChaps => {
            const nextChaps = prevChaps.filter(cid => {
                const c = chapters.find(x => x.id === cid);
                if (!c) return false;
                return !!c.unitId && unitSet.has(c.unitId);
            });
            return nextChaps;
        });
    }, [selectedUnitIds.join(','), chapters]);

    // -------- OPTIONS (for chips) --------

    const subjectOptions: Option[] = useMemo(
        () =>
            subjects
                .slice()
                .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
                .map(s => ({ id: s.id, label: s.name })),
        [subjects],
    );

    const unitOptions: Option[] = useMemo(() => {
        if (selectedSubjectIds.length === 0) return [];
        const setSubs = new Set(selectedSubjectIds);

        const subjectMap: Record<string, string> = {};
        subjects.forEach(s => {
            subjectMap[s.id] = s.name;
        });

        return units
            .filter(u => {
                const sId = u.subjectId || u.parentId;
                return sId && setSubs.has(sId);
            })
            .map(u => {
                const sId = u.subjectId || u.parentId;
                const subjName = (sId && subjectMap[sId]) || 'Unknown';

                return {
                    id: u.id,
                    label: `${subjName} · ${u.name}`,
                };
            });
    }, [units, selectedSubjectIds, subjects]);

    const chapterOptions: Option[] = useMemo(() => {
        if (selectedUnitIds.length === 0) return [];
        const setUnits = new Set(selectedUnitIds);
        return chapters
            .filter(c => c.unitId && setUnits.has(c.unitId))
            .map(c => ({ id: c.id, label: c.name }));
    }, [chapters, selectedUnitIds]);

    // -------- HANDLERS FOR STEPS (chips) --------

    const toggleSubject = (id: string) => {
        setSelectedSubjectIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            }
            return [...prev, id];
        });
    };

    const toggleUnit = (id: string) => {
        setSelectedUnitIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            }
            return [...prev, id];
        });
    };

    const toggleChapter = (id: string) => {
        setSelectedChapterIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            }
            return [...prev, id];
        });
    };

    // -------- BUILD QUESTIONS AND GO TO MCQ QUIZ --------

    const handleStartQuiz = () => {
        if (selectedUnitIds.length === 0 && selectedChapterIds.length === 0) {
            Alert.alert(
                'Selection required',
                'Please select at least one Unit or Chapter to start the quiz.',
            );
            return;
        }

        let targetChapters: ChapterNode[] = [];

        if (selectedChapterIds.length > 0) {
            const setChap = new Set(selectedChapterIds);
            targetChapters = chapters.filter(c => setChap.has(c.id));
        } else if (selectedUnitIds.length > 0) {
            const setUnits = new Set(selectedUnitIds);
            targetChapters = chapters.filter(
                c => c.unitId && setUnits.has(c.unitId),
            );
        }

        const collected: DemoQuestionType[] = [];

        targetChapters.forEach(ch => {
            (ch.questions || []).forEach((qObj, idx) => {
                collected.push({
                    ...qObj,
                    // ✅ ensure unique id across the whole quiz (avoids duplicate-key warnings later)
                    id: qObj.id || `${ch.id}_${idx}`,
                });
            });
        });

        if (collected.length === 0) {
            Alert.alert(
                'No questions',
                'No MCQs found for the selected filters. Please try a different selection.',
            );
            return;
        }

        // 🔹 Go to unified MCQQuizScreen
        navigation.navigate('MCQQuiz', {
            questions: collected,
            title: `Custom MCQ Quiz (${collected.length} Qs)`,
        });
    };

    const nothingSelected =
        selectedUnitIds.length === 0 && selectedChapterIds.length === 0;

    // -------- UI --------

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Custom MCQ Quiz</Text>
                <Text style={styles.subtitle}>
                    Step-by-step: choose Subjects → Units → Chapters to build your quiz and
                    solve it in the MCQ screen.
                </Text>

                {loadingMeta ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" />
                        <Text style={styles.centerText}>Loading structure...</Text>
                    </View>
                ) : (
                    <>
                        {/* STEP 1: SUBJECTS */}
                        <View style={styles.stepCard}>
                            <View style={styles.stepHeaderRow}>
                                <View
                                    style={[
                                        styles.stepCircle,
                                        selectedSubjectIds.length > 0 && styles.stepCircleActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.stepCircleText,
                                            selectedSubjectIds.length > 0 && {
                                                color: '#FFFFFF',
                                            },
                                        ]}
                                    >
                                        1
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.stepTitle}>Choose Subjects</Text>
                                    <Text style={styles.stepSubtitleText}>
                                        You can pick one or more subjects.
                                    </Text>
                                </View>
                                <Text style={styles.stepCount}>{selectedSubjectIds.length}</Text>
                            </View>

                            <View style={styles.chipContainer}>
                                {subjectOptions.map((opt, index) => (
                                    <Chip
                                        key={`${opt.id}-sub-${index}`}   // 🔑 unique key
                                        label={opt.label}
                                        selected={selectedSubjectIds.includes(opt.id)}
                                        onPress={() => toggleSubject(opt.id)}
                                    />
                                ))}
                                {subjectOptions.length === 0 && (
                                    <Text style={styles.emptyText}>No subjects found.</Text>
                                )}
                            </View>
                        </View>

                        {/* STEP 2: UNITS */}
                        <View style={styles.stepCard}>
                            <View style={styles.stepHeaderRow}>
                                <View
                                    style={[
                                        styles.stepCircle,
                                        selectedUnitIds.length > 0 && styles.stepCircleActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.stepCircleText,
                                            selectedUnitIds.length > 0 && {
                                                color: '#FFFFFF',
                                            },
                                        ]}
                                    >
                                        2
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.stepTitle}>Choose Units</Text>
                                    <Text style={styles.stepSubtitleText}>
                                        Units are filtered based on selected subjects.
                                    </Text>
                                </View>
                                <Text style={styles.stepCount}>{selectedUnitIds.length}</Text>
                            </View>

                            {selectedSubjectIds.length === 0 ? (
                                <Text style={styles.helperText}>
                                    Select at least one subject above to see its units.
                                </Text>
                            ) : (
                                <View style={styles.chipContainer}>
                                    {unitOptions.map((opt, index) => (
                                        <Chip
                                            key={`${opt.id}-unit-${index}`}   // 🔑 unique key
                                            label={opt.label}
                                            selected={selectedUnitIds.includes(opt.id)}
                                            onPress={() => toggleUnit(opt.id)}
                                        />
                                    ))}
                                    {unitOptions.length === 0 && (
                                        <Text style={styles.emptyText}>
                                            No units found for the selected subjects.
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>

                        {/* STEP 3: CHAPTERS */}
                        <View style={styles.stepCard}>
                            <View style={styles.stepHeaderRow}>
                                <View
                                    style={[
                                        styles.stepCircle,
                                        selectedChapterIds.length > 0 && styles.stepCircleActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.stepCircleText,
                                            selectedChapterIds.length > 0 && {
                                                color: '#FFFFFF',
                                            },
                                        ]}
                                    >
                                        3
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.stepTitle}>
                                        Choose Chapters (optional)
                                    </Text>
                                    <Text style={styles.stepSubtitleText}>
                                        Narrow further by selecting specific chapters.
                                    </Text>
                                </View>
                                <Text style={styles.stepCount}>{selectedChapterIds.length}</Text>
                            </View>

                            {selectedUnitIds.length === 0 ? (
                                <Text style={styles.helperText}>
                                    Select at least one unit above to see its chapters.
                                </Text>
                            ) : (
                                <View style={styles.chipContainer}>
                                    {chapterOptions.map((opt, index) => (
                                        <Chip
                                            key={`${opt.id}-chap-${index}`}   // 🔑 unique key
                                            label={opt.label}
                                            selected={selectedChapterIds.includes(opt.id)}
                                            onPress={() => toggleChapter(opt.id)}
                                        />
                                    ))}
                                    {chapterOptions.length === 0 && (
                                        <Text style={styles.emptyText}>
                                            No chapters found for the selected units.
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Sticky bottom button */}
            {!loadingMeta && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.loadBtn, nothingSelected && { opacity: 0.4 }]}
                        disabled={nothingSelected}
                        onPress={handleStartQuiz}
                    >
                        <Text style={styles.loadBtnText}>Start Quiz</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

// -------- STYLES --------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
    },

    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
        color: '#111827',
    },
    subtitle: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
    },
    centerText: {
        marginTop: 8,
        fontSize: 13,
        color: '#6B7280',
    },

    stepCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
    },
    stepHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    stepCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        backgroundColor: '#F9FAFB',
    },
    stepCircleActive: {
        backgroundColor: '#6D28D9',
        borderColor: '#6D28D9',
    },
    stepCircleText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4B5563',
    },
    stepTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    stepSubtitleText: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    stepCount: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
        marginLeft: 8,
    },

    helperText: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 4,
    },
    emptyText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },

    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 6,
    },
    chip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#F9FAFB',
        marginRight: 6,
        marginBottom: 6,
    },
    chipSelected: {
        backgroundColor: '#6D28D9',
        borderColor: '#6D28D9',
    },
    chipDisabled: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
    },
    chipText: {
        fontSize: 12,
        color: '#374151',
    },
    chipTextSelected: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    chipTextDisabled: {
        color: '#9CA3AF',
    },

    footer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
    },
    loadBtn: {
        backgroundColor: '#6D28D9',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    loadBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});

//This script is fully accessible via firebase
// src/screens/MCQ/CustomMCQselectScreen.tsx
// import React, { useEffect, useMemo, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     ActivityIndicator,
//     ScrollView,
//     Alert,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// import { db } from '../../firebase';
// import { collection, getDocs, query, where } from 'firebase/firestore';

// // 🔹 Reuse shared Question type (same as MCQQuiz + Result)
// import { Question as DemoQuestionType } from '../../data/demo';

// type Props = NativeStackScreenProps<RootStackParamList, 'CustomMCQQuiz'>;

// type RawQuestion = {
//     id?: string;
//     q: string;
//     options: string[];
//     correctIndex: number;
//     explanation?: string;
// };

// type SubjectNode = {
//     id: string;
//     name: string;
//     type: 'subject';
//     order?: number;
// };

// type UnitNode = {
//     id: string;
//     name: string;
//     type: 'unit';
//     parentId: string; // subjectId
//     subjectId?: string;
//     order?: number;
// };

// type ChapterNode = {
//     id: string;
//     name: string;
//     type: 'chapter';
//     parentId: string; // unitId
//     subjectId?: string;
//     unitId?: string;
//     questions?: RawQuestion[];
// };

// type Option = { id: string; label: string };

// // Simple pill chip
// function Chip({
//     label,
//     selected,
//     disabled,
//     onPress,
// }: {
//     label: string;
//     selected: boolean;
//     disabled?: boolean;
//     onPress: () => void;
// }) {
//     return (
//         <TouchableOpacity
//             activeOpacity={0.8}
//             disabled={disabled}
//             onPress={onPress}
//             style={[
//                 styles.chip,
//                 selected && styles.chipSelected,
//                 disabled && styles.chipDisabled,
//             ]}
//         >
//             <Text
//                 numberOfLines={1}
//                 style={[
//                     styles.chipText,
//                     selected && styles.chipTextSelected,
//                     disabled && styles.chipTextDisabled,
//                 ]}
//             >
//                 {label}
//             </Text>
//         </TouchableOpacity>
//     );
// }

// export default function CustomMCQQuizScreen({ navigation }: Props) {
//     const [loadingMeta, setLoadingMeta] = useState(true);
//     const [subjects, setSubjects] = useState<SubjectNode[]>([]);
//     const [units, setUnits] = useState<UnitNode[]>([]);
//     const [chapters, setChapters] = useState<ChapterNode[]>([]);

//     const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
//     const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
//     const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);

//     // -------- LOAD SUBJECTS / UNITS / CHAPTERS --------

//     useEffect(() => {
//         const loadAll = async () => {
//             try {
//                 setLoadingMeta(true);
//                 const colRef = collection(db, 'nodes');

//                 const [subSnap, unitSnap] = await Promise.all([
//                     getDocs(query(colRef, where('type', '==', 'subject'))),
//                     getDocs(query(colRef, where('type', '==', 'unit'))),
//                 ]);

//                 const subjectsData: SubjectNode[] = subSnap.docs.map(d => {
//                     const data = d.data() as any;
//                     return {
//                         id: d.id,
//                         name: data.name ?? '',
//                         type: 'subject',
//                         order: data.order,
//                     };
//                 });

//                 const unitsData: UnitNode[] = unitSnap.docs.map(d => {
//                     const data = d.data() as any;
//                     return {
//                         id: d.id,
//                         name: data.name ?? '',
//                         type: 'unit',
//                         parentId: data.parentId || data.subjectId || '',
//                         subjectId: data.subjectId ?? data.parentId,
//                         order: data.order,
//                     };
//                 });

//                 const unitsById: Record<string, UnitNode> = {};
//                 unitsData.forEach(u => {
//                     unitsById[u.id] = u;
//                 });

//                 const chapSnap = await getDocs(
//                     query(colRef, where('type', '==', 'chapter')),
//                 );
//                 const chaptersData: ChapterNode[] = chapSnap.docs.map(d => {
//                     const data = d.data() as any;
//                     let subjectId: string | undefined = data.subjectId;
//                     const unitId: string | undefined = data.unitId ?? data.parentId;

//                     if (!subjectId && unitId && unitsById[unitId]) {
//                         subjectId =
//                             unitsById[unitId].subjectId ?? unitsById[unitId].parentId;
//                     }

//                     return {
//                         id: d.id,
//                         name: data.name ?? '',
//                         type: 'chapter',
//                         parentId: data.parentId || unitId || '',
//                         subjectId,
//                         unitId,
//                         questions: data.questions || [],
//                     };
//                 });

//                 setSubjects(subjectsData);
//                 setUnits(unitsData);
//                 setChapters(chaptersData);
//             } catch (err) {
//                 console.error('[CustomMCQQuiz] Error loading structure', err);
//             } finally {
//                 setLoadingMeta(false);
//             }
//         };

//         loadAll();
//     }, []);

//     // When subjects change: keep only units that still belong to selected subjects
//     useEffect(() => {
//         if (selectedSubjectIds.length === 0) {
//             setSelectedUnitIds([]);
//             setSelectedChapterIds([]);
//             return;
//         }

//         const subjectSet = new Set(selectedSubjectIds);

//         setSelectedUnitIds(prevUnits => {
//             const nextUnits = prevUnits.filter(uid => {
//                 const u = units.find(x => x.id === uid);
//                 if (!u) return false;
//                 const sId = u.subjectId || u.parentId;
//                 return !!sId && subjectSet.has(sId);
//             });
//             return nextUnits;
//         });
//     }, [selectedSubjectIds.join(','), units]);

//     // When units change: keep only chapters that still belong to selected units
//     useEffect(() => {
//         if (selectedUnitIds.length === 0) {
//             setSelectedChapterIds([]);
//             return;
//         }

//         const unitSet = new Set(selectedUnitIds);
//         setSelectedChapterIds(prevChaps => {
//             const nextChaps = prevChaps.filter(cid => {
//                 const c = chapters.find(x => x.id === cid);
//                 if (!c) return false;
//                 return !!c.unitId && unitSet.has(c.unitId);
//             });
//             return nextChaps;
//         });
//     }, [selectedUnitIds.join(','), chapters]);

//     // -------- OPTIONS (for chips) --------

//     const subjectOptions: Option[] = useMemo(
//         () =>
//             subjects
//                 .slice()
//                 .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
//                 .map(s => ({ id: s.id, label: s.name })),
//         [subjects],
//     );

//     const unitOptions: Option[] = useMemo(() => {
//         if (selectedSubjectIds.length === 0) return [];
//         const setSubs = new Set(selectedSubjectIds);

//         const subjectMap: Record<string, string> = {};
//         subjects.forEach(s => {
//             subjectMap[s.id] = s.name;
//         });

//         return units
//             .filter(u => {
//                 const sId = u.subjectId || u.parentId;
//                 return sId && setSubs.has(sId);
//             })
//             .map(u => {
//                 const sId = u.subjectId || u.parentId;
//                 const subjName = (sId && subjectMap[sId]) || 'Unknown';
//                 return {
//                     id: u.id,
//                     label: `${subjName} · ${u.name}`,
//                 };
//             });
//     }, [units, selectedSubjectIds, subjects]);

//     const chapterOptions: Option[] = useMemo(() => {
//         if (selectedUnitIds.length === 0) return [];
//         const setUnits = new Set(selectedUnitIds);
//         return chapters
//             .filter(c => c.unitId && setUnits.has(c.unitId))
//             .map(c => ({ id: c.id, label: c.name }));
//     }, [chapters, selectedUnitIds]);

//     // -------- HANDLERS FOR STEPS (chips) --------

//     const toggleSubject = (id: string) => {
//         setSelectedSubjectIds(prev => {
//             if (prev.includes(id)) {
//                 return prev.filter(x => x !== id);
//             }
//             return [...prev, id];
//         });
//     };

//     const toggleUnit = (id: string) => {
//         setSelectedUnitIds(prev => {
//             if (prev.includes(id)) {
//                 return prev.filter(x => x !== id);
//             }
//             return [...prev, id];
//         });
//     };

//     const toggleChapter = (id: string) => {
//         setSelectedChapterIds(prev => {
//             if (prev.includes(id)) {
//                 return prev.filter(x => x !== id);
//             }
//             return [...prev, id];
//         });
//     };

//     // -------- BUILD QUESTIONS AND GO TO MCQ QUIZ --------

//     const handleStartQuiz = () => {
//         if (selectedUnitIds.length === 0 && selectedChapterIds.length === 0) {
//             Alert.alert(
//                 'Selection required',
//                 'Please select at least one Unit or Chapter to start the quiz.',
//             );
//             return;
//         }

//         let targetChapters: ChapterNode[] = [];

//         if (selectedChapterIds.length > 0) {
//             const setChap = new Set(selectedChapterIds);
//             targetChapters = chapters.filter(c => setChap.has(c.id));
//         } else if (selectedUnitIds.length > 0) {
//             const setUnits = new Set(selectedUnitIds);
//             targetChapters = chapters.filter(
//                 c => c.unitId && setUnits.has(c.unitId),
//             );
//         }

//         const collected: DemoQuestionType[] = [];

//         targetChapters.forEach(ch => {
//             const qs = ch.questions || [];
//             qs.forEach((qObj, idx) => {
//                 const options = qObj.options || [];
//                 const correctIndex =
//                     typeof qObj.correctIndex === 'number' ? qObj.correctIndex : 0;

//                 collected.push({
//                     id: qObj.id || `${ch.id}_${idx}`,
//                     q: qObj.q,
//                     options,
//                     correctIndex,
//                     explanation: qObj.explanation,
//                 });
//             });
//         });

//         if (collected.length === 0) {
//             Alert.alert(
//                 'No questions',
//                 'No MCQs found for the selected filters. Please try a different selection.',
//             );
//             return;
//         }

//         // 🔹 Go to unified MCQQuizScreen (same as chapter/full-subject flow)
//         navigation.navigate('MCQQuiz', {
//             questions: collected,
//             title: `Custom MCQ Quiz (${collected.length} Qs)`,
//         });
//     };

//     const nothingSelected =
//         selectedUnitIds.length === 0 && selectedChapterIds.length === 0;

//     // -------- UI --------

//     return (
//         <View style={styles.container}>
//             <ScrollView
//                 contentContainerStyle={styles.scrollContent}
//                 keyboardShouldPersistTaps="handled"
//             >
//                 <Text style={styles.title}>Custom MCQ Quiz</Text>
//                 <Text style={styles.subtitle}>
//                     Step-by-step: choose Subjects → Units → Chapters to build your quiz and
//                     solve it in the MCQ screen.
//                 </Text>

//                 {loadingMeta ? (
//                     <View style={styles.center}>
//                         <ActivityIndicator size="large" />
//                         <Text style={styles.centerText}>Loading structure...</Text>
//                     </View>
//                 ) : (
//                     <>
//                         {/* STEP 1: SUBJECTS */}
//                         <View style={styles.stepCard}>
//                             <View style={styles.stepHeaderRow}>
//                                 <View
//                                     style={[
//                                         styles.stepCircle,
//                                         selectedSubjectIds.length > 0 &&
//                                         styles.stepCircleActive,
//                                     ]}
//                                 >
//                                     <Text style={styles.stepCircleText}>1</Text>
//                                 </View>
//                                 <View style={{ flex: 1 }}>
//                                     <Text style={styles.stepTitle}>Choose Subjects</Text>
//                                     <Text style={styles.stepSubtitleText}>
//                                         You can pick one or more subjects.
//                                     </Text>
//                                 </View>
//                                 <Text style={styles.stepCount}>
//                                     {selectedSubjectIds.length}
//                                 </Text>
//                             </View>

//                             <View style={styles.chipContainer}>
//                                 {subjectOptions.map(opt => (
//                                     <Chip
//                                         key={opt.id}
//                                         label={opt.label}
//                                         selected={selectedSubjectIds.includes(opt.id)}
//                                         onPress={() => toggleSubject(opt.id)}
//                                     />
//                                 ))}
//                                 {subjectOptions.length === 0 && (
//                                     <Text style={styles.emptyText}>No subjects found.</Text>
//                                 )}
//                             </View>
//                         </View>

//                         {/* STEP 2: UNITS */}
//                         <View style={styles.stepCard}>
//                             <View style={styles.stepHeaderRow}>
//                                 <View
//                                     style={[
//                                         styles.stepCircle,
//                                         selectedUnitIds.length > 0 &&
//                                         styles.stepCircleActive,
//                                     ]}
//                                 >
//                                     <Text style={styles.stepCircleText}>2</Text>
//                                 </View>
//                                 <View style={{ flex: 1 }}>
//                                     <Text style={styles.stepTitle}>Choose Units</Text>
//                                     <Text style={styles.stepSubtitleText}>
//                                         Units are filtered based on selected subjects.
//                                     </Text>
//                                 </View>
//                                 <Text style={styles.stepCount}>
//                                     {selectedUnitIds.length}
//                                 </Text>
//                             </View>

//                             {selectedSubjectIds.length === 0 ? (
//                                 <Text style={styles.helperText}>
//                                     Select at least one subject above to see its units.
//                                 </Text>
//                             ) : (
//                                 <View style={styles.chipContainer}>
//                                     {unitOptions.map(opt => (
//                                         <Chip
//                                             key={opt.id}
//                                             label={opt.label}
//                                             selected={selectedUnitIds.includes(opt.id)}
//                                             onPress={() => toggleUnit(opt.id)}
//                                         />
//                                     ))}
//                                     {unitOptions.length === 0 && (
//                                         <Text style={styles.emptyText}>
//                                             No units found for the selected subjects.
//                                         </Text>
//                                     )}
//                                 </View>
//                             )}
//                         </View>

//                         {/* STEP 3: CHAPTERS */}
//                         <View style={styles.stepCard}>
//                             <View style={styles.stepHeaderRow}>
//                                 <View
//                                     style={[
//                                         styles.stepCircle,
//                                         selectedChapterIds.length > 0 &&
//                                         styles.stepCircleActive,
//                                     ]}
//                                 >
//                                     <Text style={styles.stepCircleText}>3</Text>
//                                 </View>
//                                 <View style={{ flex: 1 }}>
//                                     <Text style={styles.stepTitle}>
//                                         Choose Chapters (optional)
//                                     </Text>
//                                     <Text style={styles.stepSubtitleText}>
//                                         Narrow further by selecting specific chapters.
//                                     </Text>
//                                 </View>
//                                 <Text style={styles.stepCount}>
//                                     {selectedChapterIds.length}
//                                 </Text>
//                             </View>

//                             {selectedUnitIds.length === 0 ? (
//                                 <Text style={styles.helperText}>
//                                     Select at least one unit above to see its chapters.
//                                 </Text>
//                             ) : (
//                                 <View style={styles.chipContainer}>
//                                     {chapterOptions.map(opt => (
//                                         <Chip
//                                             key={opt.id}
//                                             label={opt.label}
//                                             selected={selectedChapterIds.includes(opt.id)}
//                                             onPress={() => toggleChapter(opt.id)}
//                                         />
//                                     ))}
//                                     {chapterOptions.length === 0 && (
//                                         <Text style={styles.emptyText}>
//                                             No chapters found for the selected units.
//                                         </Text>
//                                     )}
//                                 </View>
//                             )}
//                         </View>
//                     </>
//                 )}
//             </ScrollView>

//             {/* Sticky bottom button */}
//             {!loadingMeta && (
//                 <View style={styles.footer}>
//                     <TouchableOpacity
//                         style={[styles.loadBtn, nothingSelected && { opacity: 0.4 }]}
//                         disabled={nothingSelected}
//                         onPress={handleStartQuiz}
//                     >
//                         <Text style={styles.loadBtnText}>Start Quiz</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </View>
//     );
// }

// // -------- STYLES --------

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F3F4F6',
//     },
//     scrollContent: {
//         paddingHorizontal: 16,
//         paddingTop: 16,
//         paddingBottom: 24,
//     },

//     title: {
//         fontSize: 20,
//         fontWeight: '700',
//         marginBottom: 4,
//         color: '#111827',
//     },
//     subtitle: {
//         fontSize: 13,
//         color: '#6B7280',
//         marginBottom: 12,
//     },

//     center: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 32,
//     },
//     centerText: {
//         marginTop: 8,
//         fontSize: 13,
//         color: '#6B7280',
//     },

//     stepCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 14,
//         paddingHorizontal: 14,
//         paddingVertical: 12,
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//         marginBottom: 12,
//     },
//     stepHeaderRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 8,
//     },
//     stepCircle: {
//         width: 22,
//         height: 22,
//         borderRadius: 11,
//         borderWidth: 1,
//         borderColor: '#9CA3AF',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: 8,
//         backgroundColor: '#F9FAFB',
//     },
//     stepCircleActive: {
//         backgroundColor: '#6D28D9',
//         borderColor: '#6D28D9',
//     },
//     stepCircleText: {
//         fontSize: 12,
//         fontWeight: '700',
//         color: '#F9FAFB',
//     },
//     stepTitle: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: '#111827',
//     },
//     stepSubtitleText: {
//         fontSize: 11,
//         color: '#9CA3AF',
//     },
//     stepCount: {
//         fontSize: 13,
//         fontWeight: '600',
//         color: '#4B5563',
//         marginLeft: 8,
//     },

//     helperText: {
//         fontSize: 11,
//         color: '#9CA3AF',
//         marginTop: 4,
//     },
//     emptyText: {
//         fontSize: 12,
//         color: '#9CA3AF',
//         marginTop: 4,
//     },

//     chipContainer: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         marginTop: 6,
//     },
//     chip: {
//         paddingHorizontal: 10,
//         paddingVertical: 6,
//         borderRadius: 999,
//         borderWidth: 1,
//         borderColor: '#D1D5DB',
//         backgroundColor: '#F9FAFB',
//         marginRight: 6,
//         marginBottom: 6,
//     },
//     chipSelected: {
//         backgroundColor: '#6D28D9',
//         borderColor: '#6D28D9',
//     },
//     chipDisabled: {
//         backgroundColor: '#F3F4F6',
//         borderColor: '#E5E7EB',
//     },
//     chipText: {
//         fontSize: 12,
//         color: '#374151',
//     },
//     chipTextSelected: {
//         color: '#FFFFFF',
//         fontWeight: '600',
//     },
//     chipTextDisabled: {
//         color: '#9CA3AF',
//     },

//     footer: {
//         paddingHorizontal: 16,
//         paddingBottom: 16,
//         paddingTop: 8,
//         borderTopWidth: 1,
//         borderTopColor: '#E5E7EB',
//         backgroundColor: '#F9FAFB',
//     },
//     loadBtn: {
//         backgroundColor: '#6D28D9',
//         paddingVertical: 14,
//         borderRadius: 12,
//         alignItems: 'center',
//     },
//     loadBtnText: {
//         color: '#fff',
//         fontWeight: '600',
//         fontSize: 15,
//     },
// });
