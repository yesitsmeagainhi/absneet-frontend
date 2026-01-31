// // // src/screens/Home/HomeScreen.tsx
// // import React, { useMemo, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   FlatList,
// //   ScrollView,
// //   Image,
// //   Pressable,
// //   Linking,
// // } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { RootStackParamList } from '../../navigation/rootnavigator';
// // import { useTheme } from '../../theme/ThemeContext';

// // import { SUBJECTS, Subject } from '../../data/demo';

// // type Nav = NativeStackNavigationProp<RootStackParamList>;

// // type HomeBanner = {
// //   id: string;
// //   imageUri: string;
// //   link: string; // http(s) URL or internal route name
// // };

// // const HOME_BANNERS: HomeBanner[] = [
// //   {
// //     id: 'b1',
// //     imageUri:
// //       'https://images.pexels.com/photos/5496463/pexels-photo-5496463.jpeg?auto=compress&cs=tinysrgb&w=800',
// //     link: 'https://absedu.in',
// //   },
// //   {
// //     id: 'b2',
// //     imageUri:
// //       'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
// //     link: 'https://absedu.in/blog/neet-tips',
// //   },
// // ];

// // export default function HomeScreen() {
// //   const nav = useNavigation<Nav>();
// //   const { isDark, toggleTheme } = useTheme();

// //   const subjects: Subject[] = SUBJECTS;
// //   const firstSubjectId = subjects[0]?.id;
// //   const isSubjectDependentDisabled = !firstSubjectId;

// //   const styles = useMemo(() => createStyles(isDark), [isDark]);

// //   const handleBannerPress = useCallback((banner: HomeBanner) => {
// //     if (!banner.link) return;

// //     // External link
// //     if (banner.link.startsWith('http')) {
// //       Linking.openURL(banner.link).catch(err => {
// //         console.warn('Failed to open URL:', err);
// //       });
// //       return;
// //     }

// //     // Internal navigation – treat link as route name (uncomment when needed)
// //     // nav.navigate(banner.link as keyof RootStackParamList);
// //   }, []);

// //   return (
// //     <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
// //       <ScrollView
// //         style={styles.screen}
// //         contentContainerStyle={styles.c}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         {/* Top app bar */}
// //         <View style={styles.topBar}>
// //           <View>
// //             <Text style={styles.appTitle}>ABS NEET</Text>
// //             <Text style={styles.appSubtitle}>NEET Practice App</Text>
// //           </View>

// //           <View style={styles.topRightRow}>
// //             {/* Theme toggle */}
// //             <Pressable onPress={toggleTheme} style={styles.themeToggle}>
// //               <Text style={styles.themeToggleText}>
// //                 {isDark ? '☀️ Light' : '🌙 Dark'}
// //               </Text>
// //             </Pressable>

// //             <View style={styles.neetBadge}>
// //               <Text style={styles.neetBadgeText}>NEET 2025</Text>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Banner slider */}
// //         <View style={styles.bannerWrap}>
// //           <ScrollView
// //             horizontal
// //             showsHorizontalScrollIndicator={false}
// //             contentContainerStyle={styles.bannerScroll}
// //           >
// //             {HOME_BANNERS.map(b => (
// //               <Pressable
// //                 key={b.id}
// //                 android_ripple={{ color: isDark ? '#E5E7EB' : '#1E293B' }}
// //                 onPress={() => handleBannerPress(b)}
// //                 style={({ pressed }) => [
// //                   styles.bannerCard,
// //                   pressed && styles.bannerCardPressed,
// //                 ]}
// //               >
// //                 <Image
// //                   source={{ uri: b.imageUri }}
// //                   style={styles.bannerImage}
// //                   resizeMode="cover"
// //                 />
// //               </Pressable>
// //             ))}
// //           </ScrollView>
// //         </View>

// //         {/* Subjects row */}
// //         <View style={styles.sectionHeaderRow}>
// //           <Text style={styles.sectionTitle}>Your Subjects</Text>
// //           {!!subjects.length && (
// //             <Text style={styles.sectionMeta}>{subjects.length} loaded</Text>
// //           )}
// //         </View>

// //         {subjects.length === 0 ? (
// //           <View style={styles.empty}>
// //             <Text style={styles.emptyTitle}>No subjects in demo data.</Text>
// //             <Text style={styles.emptySubtitle}>
// //               Add entries in <Text style={styles.emptyHighlight}>SUBJECTS</Text>{' '}
// //               inside <Text style={styles.emptyHighlight}>src/data/demo.ts</Text>.
// //             </Text>
// //           </View>
// //         ) : (
// //           <FlatList
// //             data={subjects}
// //             keyExtractor={s => s.id}
// //             horizontal
// //             showsHorizontalScrollIndicator={false}
// //             contentContainerStyle={{ paddingRight: 16 }}
// //             renderItem={({ item }) => (
// //               <Pressable
// //                 style={({ pressed }) => [
// //                   styles.subjectCard,
// //                   pressed && styles.subjectCardPressed,
// //                 ]}
// //                 onPress={() =>
// //                   nav.navigate('SubjectDetail', { subjectId: item.id })
// //                 }
// //               >
// //                 <Text style={styles.subjectTitle}>{item.name}</Text>
// //                 <Text style={styles.subjectMeta}>
// //                   {item.units?.length ?? 0} units
// //                 </Text>
// //               </Pressable>
// //             )}
// //           />
// //         )}

// //         {/* Practice modes / quick actions */}
// //         <View style={styles.sectionHeaderRow}>
// //           <Text style={styles.sectionTitle}>Practice Modes</Text>
// //           <Text style={styles.sectionMeta}>Choose how you want to study</Text>
// //         </View>

// //         <View style={styles.cardGrid}>
// //           {/* Custom MCQ as per Subject */}
// //           <Pressable
// //             style={({ pressed }) => [
// //               styles.modeCard,
// //               styles.modeCardPrimary,
// //               isSubjectDependentDisabled && styles.modeCardDisabled,
// //               pressed &&
// //               !isSubjectDependentDisabled &&
// //               styles.modeCardPrimaryPressed,
// //             ]}
// //             disabled={isSubjectDependentDisabled}
// //             onPress={() =>
// //               firstSubjectId &&
// //               nav.navigate('CustomMCQQuiz', { subjectId: firstSubjectId })
// //             }
// //           >
// //             <Text style={styles.modeEmoji}>🧠</Text>
// //             <Text style={styles.modeTitlePrimary}>Custom MCQ Quiz</Text>
// //             <Text style={styles.modeTextPrimary}>
// //               Build a quiz from selected topics of a subject.
// //             </Text>
// //             {isSubjectDependentDisabled && (
// //               <Text style={styles.modeHintPrimary}>
// //                 Add at least one subject to begin.
// //               </Text>
// //             )}
// //           </Pressable>

// //           {/* Previous Year MCQ – mixed exam */}
// //           <Pressable
// //             style={({ pressed }) => [
// //               styles.modeCard,
// //               styles.modeCardAccent,
// //               pressed && styles.modeCardAccentPressed,
// //             ]}
// //             onPress={() => nav.navigate('PYQSubjects')}
// //           >
// //             <Text style={styles.modeEmoji}>📜</Text>
// //             <Text style={styles.modeTitle}>Previous Year MCQ</Text>
// //             <Text style={styles.modeText}>
// //               Solve full NEET-style mixed MCQ sets (Physics + Chemistry + Bio).
// //             </Text>
// //             <Text style={styles.modeHint}>Best for real exam practice</Text>
// //           </Pressable>

// //           {/* Previous Year MCQ Papers PDF */}
// //           <Pressable
// //             style={({ pressed }) => [
// //               styles.modeCard,
// //               styles.modeCardNeutral,
// //               pressed && styles.modeCardNeutralPressed,
// //             ]}
// //             onPress={() => nav.navigate('PYQPdfPapers')}
// //           >
// //             <Text style={styles.modeEmoji}>📂</Text>
// //             <Text style={styles.modeTitle}>PYQ Papers (PDF)</Text>
// //             <Text style={styles.modeText}>
// //               Download complete NEET papers in PDF for offline solving.
// //             </Text>
// //             <Text style={styles.modeHint}>Use with OMR sheets</Text>
// //           </Pressable>

// //           {/* Mock Test Papers */}
// //           <Pressable
// //             style={({ pressed }) => [
// //               styles.modeCard,
// //               styles.modeCardNeutral,
// //               pressed && styles.modeCardNeutralPressed,
// //             ]}
// //             onPress={() => nav.navigate('MockTestPapers')}
// //           >
// //             <Text style={styles.modeEmoji}>📝</Text>
// //             <Text style={styles.modeTitle}>Mock Test Papers</Text>
// //             <Text style={styles.modeText}>
// //               Attempt full-length mock tests and track improvement.
// //             </Text>
// //             <Text style={styles.modeHint}>Perfect for weekend practice</Text>
// //           </Pressable>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // /** 🎨 Themed styles – dark & light with safe area */
// // const createStyles = (isDark: boolean) =>
// //   StyleSheet.create({
// //     safeArea: {
// //       flex: 1,
// //       backgroundColor: isDark ? '#020617' : '#F3F4F6',
// //     },
// //     screen: {
// //       flex: 1,
// //       backgroundColor: isDark ? '#020617' : '#F3F4F6',
// //     },
// //     c: {
// //       padding: 16,
// //       gap: 16,
// //       paddingBottom: 28,
// //     },

// //     // Top bar
// //     topBar: {
// //       flexDirection: 'row',
// //       alignItems: 'center',
// //       justifyContent: 'space-between',
// //       marginBottom: 6,
// //     },
// //     topRightRow: {
// //       flexDirection: 'row',
// //       alignItems: 'center',
// //       gap: 8,
// //     },
// //     appTitle: {
// //       fontSize: 18,
// //       fontWeight: '800',
// //       color: isDark ? '#F9FAFB' : '#111827',
// //     },
// //     appSubtitle: {
// //       fontSize: 12,
// //       color: isDark ? '#9CA3AF' : '#6B7280',
// //       marginTop: 2,
// //     },
// //     neetBadge: {
// //       paddingHorizontal: 10,
// //       paddingVertical: 4,
// //       borderRadius: 999,
// //       backgroundColor: '#22C55E',
// //     },
// //     neetBadgeText: {
// //       color: '#022C22',
// //       fontSize: 11,
// //       fontWeight: '700',
// //     },

// //     themeToggle: {
// //       paddingHorizontal: 10,
// //       paddingVertical: 4,
// //       borderRadius: 999,
// //       borderWidth: 1,
// //       borderColor: isDark ? '#4B5563' : '#CBD5F5',
// //       backgroundColor: isDark ? '#020617' : '#EFF6FF',
// //     },
// //     themeToggleText: {
// //       fontSize: 11,
// //       fontWeight: '600',
// //       color: isDark ? '#E5E7EB' : '#1D4ED8',
// //     },

// //     // Banner slider
// //     bannerWrap: {
// //       marginBottom: 4,
// //     },
// //     bannerScroll: {
// //       paddingRight: 16,
// //     },
// //     bannerCardPressed: {
// //       transform: [{ scale: 0.97 }],
// //       opacity: 0.9,
// //     },
// //     bannerCard: {
// //       width: 320,
// //       height: 150,
// //       marginRight: 12,
// //       borderRadius: 18,
// //       overflow: 'hidden',
// //       backgroundColor: isDark ? '#020617' : '#FFFFFF',
// //       borderWidth: 1,
// //       borderColor: isDark ? '#38BDF8' : '#E5E7EB',
// //       shadowColor: '#000',
// //       shadowOpacity: isDark ? 0.3 : 0.08,
// //       shadowRadius: 6,
// //       shadowOffset: { width: 0, height: 3 },
// //       elevation: 2,
// //     },
// //     bannerImage: {
// //       width: '100%',
// //       height: '100%',
// //     },

// //     // Sections
// //     sectionHeaderRow: {
// //       flexDirection: 'row',
// //       alignItems: 'center',
// //       marginTop: 8,
// //       marginBottom: 6,
// //       justifyContent: 'space-between',
// //     },
// //     sectionTitle: {
// //       fontSize: 15,
// //       fontWeight: '600',
// //       color: isDark ? '#E5E7EB' : '#111827',
// //     },
// //     sectionMeta: {
// //       fontSize: 12,
// //       color: isDark ? '#9CA3AF' : '#6B7280',
// //     },

// //     empty: {
// //       borderWidth: 1,
// //       borderColor: isDark ? '#1F2937' : '#E5E7EB',
// //       borderRadius: 12,
// //       padding: 14,
// //       backgroundColor: isDark ? '#020617' : '#FFFFFF',
// //       marginBottom: 8,
// //     },
// //     emptyTitle: {
// //       color: isDark ? '#9CA3AF' : '#4B5563',
// //       fontWeight: '500',
// //     },
// //     emptySubtitle: {
// //       color: isDark ? '#9CA3AF' : '#6B7280',
// //       marginTop: 4,
// //       fontSize: 12,
// //     },
// //     emptyHighlight: {
// //       fontWeight: '700',
// //       color: isDark ? '#E5E7EB' : '#111827',
// //     },

// //     // Subject cards
// //     subjectCard: {
// //       minWidth: 130,
// //       minHeight: 80,
// //       paddingVertical: 10,
// //       paddingHorizontal: 12,
// //       borderRadius: 14,
// //       marginRight: 10,
// //       backgroundColor: isDark ? '#020617' : '#FFFFFF',
// //       borderWidth: 1,
// //       borderColor: isDark ? '#374151' : '#E5E7EB',
// //       shadowColor: '#000',
// //       shadowOpacity: isDark ? 0 : 0.06,
// //       shadowRadius: 5,
// //       shadowOffset: { width: 0, height: 2 },
// //       elevation: isDark ? 0 : 1,
// //     },
// //     subjectCardPressed: {
// //       backgroundColor: isDark ? '#111827' : '#EEF2FF',
// //       borderColor: isDark ? '#4B5563' : '#C7D2FE',
// //     },
// //     subjectTitle: {
// //       fontSize: 14,
// //       fontWeight: '600',
// //       color: isDark ? '#F9FAFB' : '#111827',
// //     },
// //     subjectMeta: {
// //       fontSize: 11,
// //       color: isDark ? '#9CA3AF' : '#6B7280',
// //       marginTop: 2,
// //     },

// //     // Practice modes grid
// //     cardGrid: {
// //       flexDirection: 'row',
// //       flexWrap: 'wrap',
// //       gap: 10,
// //     },
// //     modeCard: {
// //       flexBasis: '48%',
// //       borderRadius: 14,
// //       paddingVertical: 12,
// //       paddingHorizontal: 10,
// //       borderWidth: 1,
// //     },

// //     // Purple primary card
// //     modeCardPrimary: {
// //       backgroundColor: '#4F46E5',
// //       borderColor: '#4338CA',
// //     },
// //     modeCardPrimaryPressed: {
// //       backgroundColor: '#4338CA',
// //     },
// //     modeTitlePrimary: {
// //       fontSize: 14,
// //       fontWeight: '700',
// //       color: '#F9FAFB',
// //       marginBottom: 4,
// //     },
// //     modeTextPrimary: {
// //       fontSize: 12,
// //       color: '#E5E7EB',
// //     },
// //     modeHintPrimary: {
// //       fontSize: 11,
// //       color: '#E0E7FF',
// //       marginTop: 6,
// //     },

// //     // Accent card (Previous Year MCQ)
// //     modeCardAccent: {
// //       backgroundColor: isDark ? '#0F172A' : '#DBEAFE',
// //       borderColor: isDark ? '#38BDF8' : '#1D4ED8',
// //     },
// //     modeCardAccentPressed: {
// //       backgroundColor: isDark ? '#0B1220' : '#BFDBFE',
// //     },

// //     // Neutral cards (PDF, Mock)
// //     modeCardNeutral: {
// //       backgroundColor: isDark ? '#020617' : '#FFFFFF',
// //       borderColor: isDark ? '#374151' : '#E5E7EB',
// //     },
// //     modeCardNeutralPressed: {
// //       backgroundColor: isDark ? '#111827' : '#F3F4F6',
// //     },
// //     modeCardDisabled: {
// //       opacity: 0.5,
// //     },

// //     modeEmoji: {
// //       fontSize: 20,
// //       marginBottom: 4,
// //     },
// //     modeTitle: {
// //       fontSize: 14,
// //       fontWeight: '600',
// //       color: isDark ? '#F9FAFB' : '#111827',
// //       marginBottom: 4,
// //     },
// //     modeText: {
// //       fontSize: 12,
// //       color: isDark ? '#9CA3AF' : '#4B5563',
// //     },
// //     modeHint: {
// //       fontSize: 11,
// //       color: isDark ? '#9CA3AF' : '#6B7280',
// //       marginTop: 6,
// //     },// src/screens/Home/HomeScreen.tsx
// import React, {
//   useMemo,
//   useCallback,
//   useEffect,
//   useState,
// } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ScrollView,
//   Image,
//   Pressable,
//   Linking,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // 🔹 Firestore (React Native Firebase)
// import { db } from '../../services/firebase.native';

// import { RootStackParamList } from '../../navigation/rootnavigator';
// import { useTheme } from '../../theme/ThemeContext';
// import { SUBJECTS } from '../../data/demo';

// // Curved arrow asset
// const ArrowWaveUp = require('../../assets/intro/arrow_wave_up.png');

// type Nav = NativeStackNavigationProp<RootStackParamList>;

// type HomeBanner = {
//   id: string;
//   imageUri: string;
//   link: string; // http(s) URL or internal route name
// };

// // 🔑 bumped version so new build shows tips once
// const HOME_INTRO_KEY = 'absneet_home_intro_seen_v5';

// const HOME_BANNERS: HomeBanner[] = [
//   {
//     id: 'b1',
//     imageUri:
//       'https://images.pexels.com/photos/5496463/pexels-photo-5496463.jpeg?auto=compress&cs=tinysrgb&w=800',
//     link: 'https://absedu.in',
//   },
//   {
//     id: 'b2',
//     imageUri:
//       'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
//     link: 'https://absedu.in/blog/neet-tips',
//   },
// ];

// const TIP_CARD_HEIGHT = 150;      // approximate height of the tip card
// const WAVE_ARROW_HEIGHT = 80;     // approximate arrow image height

// // All tips in sequence
// const INTRO_STEPS = [
//   {
//     id: 'subjects',
//     title: 'Step 1 • Subjects section',
//     text:
//       'Here you will see all your subjects. Scroll this row and tap any subject to open its units, chapters, videos, PDFs and MCQs.',
//   },
//   {
//     id: 'custom_mcq',
//     title: 'Step 2 • Custom MCQ Quiz',
//     text:
//       'Use this mode when you want to build your own quiz from selected topics of a subject. Best for targeted practice on weak areas.',
//   },
//   {
//     id: 'pyq_mcq',
//     title: 'Step 3 • Previous Year MCQ',
//     text:
//       'This mode mixes questions from Physics, Chemistry and Biology like the actual NEET exam. Use it for full-pattern MCQ practice.',
//   },
//   {
//     id: 'pyq_pdf',
//     title: 'Step 4 • PYQ Papers (PDF)',
//     text:
//       'Here you can open and download complete Previous Year NEET papers in PDF format. Use them with OMR sheets for offline practice.',
//   },
//   {
//     id: 'mock_tests',
//     title: 'Step 5 • Mock Test Papers',
//     text:
//       'Mock tests simulate the real exam with full-length papers. Use them weekly to check your timing, accuracy and overall improvement.',
//   },
//   {
//     id: 'banners_theme',
//     title: 'Step 6 • Banners & Theme toggle',
//     text:
//       'Top banners show important links, offers and NEET tips. The icon on the top-right switches between Dark and Light mode anytime.',
//   },
// ] as const;

// type IntroStepId = (typeof INTRO_STEPS)[number]['id'];

// type SubjectItem = {
//   id: string;
//   name: string;
//   order: number;
//   slug?: string;
//   active?: boolean;
//   unitCount: number;
// };

// export default function HomeScreen() {
//   const nav = useNavigation<Nav>();
//   const { isDark, toggleTheme } = useTheme();

//   // 🔹 Subjects from Firestore (with unit count)
//   const [subjects, setSubjects] = useState<SubjectItem[]>([]);
//   const [subjectsLoading, setSubjectsLoading] = useState(true);
//   const [subjectsError, setSubjectsError] = useState<string | null>(null);

//   const firstSubjectId = subjects[0]?.id;
//   const isSubjectDependentDisabled = !firstSubjectId;

//   const styles = useMemo(() => createStyles(isDark), [isDark]);

//   // 🔹 anchors for dynamic positioning
//   const [anchors, setAnchors] = useState({
//     topAreaY: 0,      // bottom of top bar + banners
//     subjectsY: 0,     // bottom of subjects section
//     practiceY: 0,     // bottom of practice section (optional, still useful)
//     customMcqY: 0,    // center of Custom MCQ card
//     pyqMcqY: 0,       // center of Previous Year MCQ card
//     pyqPdfY: 0,       // center of PYQ PDF card
//     mockY: 0,         // center of Mock Test card
//   });

//   // 🔹 multi-step intro overlay
//   const [showIntro, setShowIntro] = useState(true);
//   const [introStep, setIntroStep] = useState(0); // index in INTRO_STEPS

//   // 🔥 Load subjects + unit counts from Firestore
//   useEffect(() => {
//     const loadSubjects = async () => {
//       try {
//         setSubjectsLoading(true);
//         setSubjectsError(null);

//         console.log('[HOME] loading subjects and units from Firestore...');

//         const nodesRef = db.collection('nodes');

//         // 1️⃣ subjects
//         const subjectsSnap = await nodesRef
//           .where('type', '==', 'subject')
//           .orderBy('order', 'asc')
//           .get();

//         // 2️⃣ units
//         const unitsSnap = await nodesRef
//           .where('type', '==', 'unit')
//           .get();

//         // 3️⃣ subjectId -> unitCount
//         const unitCounts: Record<string, number> = {};
//         unitsSnap.forEach(docSnap => {
//           const data = docSnap.data() as any;
//           const parentId = data.parentId as string | undefined;
//           if (!parentId) return;
//           unitCounts[parentId] = (unitCounts[parentId] ?? 0) + 1;
//         });

//         if (subjectsSnap.empty) {
//           console.log('[HOME] no Firestore subjects, using demo SUBJECTS');

//           const demoSubjects: SubjectItem[] = SUBJECTS.map((s, idx) => ({
//             id: s.id,
//             name: s.name,
//             order: idx,
//             unitCount: s.units?.length ?? 0,
//           }));

//           setSubjects(demoSubjects);
//         } else {
//           const items: SubjectItem[] = subjectsSnap.docs.map(docSnap => {
//             const data = docSnap.data() as any;
//             const id = docSnap.id;
//             return {
//               id,
//               name: data.name ?? data.title ?? 'Untitled subject',
//               order: data.order ?? 0,
//               slug: data.slug,
//               active: data.active ?? true,
//               unitCount: unitCounts[id] ?? 0,
//             };
//           });

//           setSubjects(items);
//           console.log('[HOME] subjects loaded:', items.length);
//         }
//       } catch (err) {
//         console.warn(
//           '[HOME] Failed to load subjects from Firestore, using demo data',
//           err,
//         );
//         setSubjectsError('Failed to load subjects from cloud. Showing demo data.');

//         const demoSubjects: SubjectItem[] = SUBJECTS.map((s, idx) => ({
//           id: s.id,
//           name: s.name,
//           order: idx,
//           unitCount: s.units?.length ?? 0,
//         }));
//         setSubjects(demoSubjects);
//       } finally {
//         setSubjectsLoading(false);
//       }
//     };

//     loadSubjects();
//   }, []);

//   // 🔹 Intro flag
//   useEffect(() => {
//     const loadIntroFlag = async () => {
//       try {
//         const flag = await AsyncStorage.getItem(HOME_INTRO_KEY);

//         console.log('[HOME_INTRO] flag =', flag);
//         // For now: always show tips from step 0
//         setIntroStep(0);
//         setShowIntro(true);

//         // If later you want "show only once", restore this:
//         // if (flag === '1') {
//         //   setShowIntro(false);
//         // } else {
//         //   setIntroStep(0);
//         //   setShowIntro(true);
//         // }
//       } catch (e) {
//         console.warn('Failed to read home intro flag:', e);
//         setIntroStep(0);
//         setShowIntro(true);
//       }
//     };
//     loadIntroFlag();
//   }, []);

//   const finishIntroForever = useCallback(async () => {
//     try {
//       await AsyncStorage.setItem(HOME_INTRO_KEY, '1');
//     } catch (e) {
//       console.warn('Failed to set home intro flag:', e);
//     }
//     setShowIntro(false);
//   }, []);

//   const handleIntroOk = useCallback(() => {
//     if (introStep < INTRO_STEPS.length - 1) {
//       setIntroStep(prev => prev + 1);
//     } else {
//       finishIntroForever();
//     }
//   }, [introStep, finishIntroForever]);

//   const handleIntroClose = useCallback(() => {
//     finishIntroForever();
//   }, [finishIntroForever]);

//   const handleBannerPress = useCallback((banner: HomeBanner) => {
//     if (!banner.link) return;

//     if (banner.link.startsWith('http')) {
//       Linking.openURL(banner.link).catch(err => {
//         console.warn('Failed to open URL:', err);
//       });
//       return;
//     }

//     // nav.navigate(banner.link as keyof RootStackParamList);
//   }, []);

//   const currentStep = INTRO_STEPS[introStep];

//   // 🔹 Position + arrow config for each step (dynamic using anchors)
//   const introPos = useMemo(() => {
//     if (!currentStep) return undefined;

//     const id = currentStep.id as IntroStepId;

//     switch (id) {
//       case 'subjects':
//         if (!anchors.subjectsY) return undefined;
//         return {
//           wrapper: { left: 16, right: 16, top: anchors.subjectsY + 8 },
//           arrowOnTop: true,
//           arrowOnBottom: false,
//           arrowAlign: 'center' as const,
//         };

//       case 'custom_mcq': {
//         const targetY = anchors.practiceY;
//         if (!anchors.practiceY || !anchors.subjectsY) return undefined;

//         const desiredTop =
//           targetY - (TIP_CARD_HEIGHT + WAVE_ARROW_HEIGHT + 16);
//         const minTop = anchors.subjectsY - 50;
//         const safeTop = Math.max(desiredTop, minTop);

//         return {
//           wrapper: { left: 16, right: 16, top: safeTop },
//           arrowOnTop: true,
//           arrowOnBottom: false,
//           arrowAlign: 'flex-start' as const,
//         };
//       }

//       case 'pyq_mcq': {
//         if (!anchors.practiceY || !anchors.subjectsY) return undefined;

//         const desiredTop = anchors.practiceY - TIP_CARD_HEIGHT - 16;
//         const minTop = anchors.subjectsY + 40;
//         const safeTop = Math.max(desiredTop, minTop);

//         return {
//           wrapper: { left: 16, right: 16, top: safeTop },
//           arrowOnTop: true,
//           arrowOnBottom: false,
//           arrowAlign: 'flex-end' as const,
//         };
//       }

//       case 'pyq_pdf': {
//         if (!anchors.practiceY || !anchors.subjectsY) return undefined;

//         const desiredTop = anchors.practiceY - TIP_CARD_HEIGHT - 406;
//         const minTop = anchors.subjectsY + 60;
//         const safeTop = Math.max(desiredTop, minTop);

//         return {
//           wrapper: { left: 16, right: 16, top: safeTop },
//           arrowOnTop: false,
//           arrowOnBottom: true,
//           arrowAlign: 'flex-start' as const,
//         };
//       }

//       case 'mock_tests': {
//         if (!anchors.practiceY || !anchors.subjectsY) return undefined;

//         const desiredTop = anchors.practiceY - TIP_CARD_HEIGHT - 106;
//         const minTop = anchors.subjectsY + 40;
//         const safeTop = Math.max(desiredTop, minTop);

//         return {
//           wrapper: { left: 16, right: 16, top: safeTop },
//           arrowOnTop: false,
//           arrowOnBottom: true,
//           arrowAlign: 'flex-end' as const,
//         };
//       }

//       case 'banners_theme':
//         if (!anchors.topAreaY) return undefined;
//         return {
//           wrapper: { left: 16, right: 16, top: anchors.topAreaY + 8 },
//           arrowOnTop: true,
//           arrowOnBottom: false,
//           arrowAlign: 'flex-end' as const,
//         };

//       default:
//         return undefined;
//     }
//   }, [currentStep, anchors]);

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
//       <View style={styles.root}>
//         <ScrollView
//           style={styles.screen}
//           contentContainerStyle={styles.c}
//           showsVerticalScrollIndicator={false}
//           scrollEnabled={!showIntro}
//         >
//           {/* Top app bar + banners (measured for topAreaY) */}
//           <View
//             onLayout={e => {
//               const { y, height } = e.nativeEvent.layout;
//               setAnchors(prev => ({ ...prev, topAreaY: y + height }));
//             }}
//           >
//             {/* Top app bar */}
//             <View style={styles.topBar}>
//               <View>
//                 <Text style={styles.appTitle}>ABS NEET</Text>
//                 <Text style={styles.appSubtitle}>NEET Practice App</Text>
//               </View>

//               <View style={styles.topRightRow}>
//                 {/* Theme toggle */}
//                 <Pressable onPress={toggleTheme} style={styles.themeToggle}>
//                   <Text style={styles.themeToggleText}>
//                     {isDark ? '☀️ Light' : '🌙 Dark'}
//                   </Text>
//                 </Pressable>

//                 <View style={styles.neetBadge}>
//                   <Text style={styles.neetBadgeText}>NEET 2025</Text>
//                 </View>
//               </View>
//             </View>

//             {/* Banner slider */}
//             <View style={styles.bannerWrap}>
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.bannerScroll}
//               >
//                 {HOME_BANNERS.map(b => (
//                   <Pressable
//                     key={b.id}
//                     android_ripple={{ color: isDark ? '#E5E7EB' : '#1E293B' }}
//                     onPress={() => handleBannerPress(b)}
//                     style={({ pressed }) => [
//                       styles.bannerCard,
//                       pressed && styles.bannerCardPressed,
//                     ]}
//                   >
//                     <Image
//                       source={{ uri: b.imageUri }}
//                       style={styles.bannerImage}
//                       resizeMode="cover"
//                     />
//                   </Pressable>
//                 ))}
//               </ScrollView>
//             </View>
//           </View>

//           {/* Subjects section (measured for subjectsY) */}
//           <View
//             onLayout={e => {
//               const { y, height } = e.nativeEvent.layout;
//               setAnchors(prev => ({ ...prev, subjectsY: y + height }));
//             }}
//           >
//             <View style={styles.sectionHeaderRow}>
//               <Text style={styles.sectionTitle}>Your Subjects</Text>
//               {!!subjects.length && !subjectsLoading && (
//                 <Text style={styles.sectionMeta}>{subjects.length} loaded</Text>
//               )}
//             </View>

//             {subjectsError && (
//               <Text style={styles.errorText}>{subjectsError}</Text>
//             )}

//             {subjectsLoading ? (
//               <View style={styles.empty}>
//                 <Text style={styles.emptyTitle}>Loading subjects…</Text>
//                 <Text style={styles.emptySubtitle}>
//                   Fetching from ABS NEET cloud.
//                 </Text>
//               </View>
//             ) : subjects.length === 0 ? (
//               <View style={styles.empty}>
//                 <Text style={styles.emptyTitle}>No subjects available.</Text>
//                 <Text style={styles.emptySubtitle}>
//                   Add entries in <Text style={styles.emptyHighlight}>SUBJECTS</Text>{' '}
//                   inside <Text style={styles.emptyHighlight}>src/data/demo.ts</Text>{' '}
//                   or create subject docs in Firestore.
//                 </Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={subjects}
//                 keyExtractor={s => s.id}
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={{ paddingRight: 16 }}
//                 renderItem={({ item }) => (
//                   <Pressable
//                     style={({ pressed }) => [
//                       styles.subjectCard,
//                       pressed && styles.subjectCardPressed,
//                     ]}
//                     onPress={() =>
//                       nav.navigate('SubjectDetail', { subjectId: item.id })
//                     }
//                   >
//                     <Text style={styles.subjectTitle}>{item.name}</Text>
//                     <Text style={styles.subjectMeta}>
//                       {item.unitCount} {item.unitCount === 1 ? 'unit' : 'units'}
//                     </Text>

//                   </Pressable>
//                 )}
//               />
//             )}
//           </View>

//           {/* Practice section (measured for practiceY) */}
//           <View
//             onLayout={e => {
//               const { y, height } = e.nativeEvent.layout;
//               setAnchors(prev => ({ ...prev, practiceY: y + height }));
//             }}
//           >
//             {/* Practice modes / quick actions */}
//             <View style={styles.sectionHeaderRow}>
//               <Text style={styles.sectionTitle}>Practice Modes</Text>
//               <Text style={styles.sectionMeta}>Choose how you want to study</Text>
//             </View>

//             <View style={styles.cardGrid}>
//               {/* Custom MCQ as per Subject */}
//               <Pressable
//                 onLayout={e => {
//                   const { y, height } = e.nativeEvent.layout;
//                   setAnchors(prev => ({ ...prev, customMcqY: y + height / 2 }));
//                 }}
//                 style={({ pressed }) => [
//                   styles.modeCard,
//                   styles.modeCardPrimary,
//                   isSubjectDependentDisabled && styles.modeCardDisabled,
//                   pressed &&
//                   !isSubjectDependentDisabled &&
//                   styles.modeCardPrimaryPressed,
//                 ]}
//                 disabled={isSubjectDependentDisabled}
//                 onPress={() =>
//                   firstSubjectId &&
//                   nav.navigate('CustomMCQQuiz', { subjectId: firstSubjectId })
//                 }
//               >
//                 <Text style={styles.modeEmoji}>🧠</Text>
//                 <Text style={styles.modeTitlePrimary}>Custom MCQ Quiz</Text>
//                 <Text style={styles.modeTextPrimary}>
//                   Build a quiz from selected topics of a subject.
//                 </Text>
//                 {isSubjectDependentDisabled && (
//                   <Text style={styles.modeHintPrimary}>
//                     Add at least one subject to begin.
//                   </Text>
//                 )}
//               </Pressable>

//               {/* Previous Year MCQ – mixed exam */}
//               <Pressable
//                 style={({ pressed }) => [
//                   styles.modeCard,
//                   styles.modeCardAccent,
//                   pressed && styles.modeCardAccentPressed,
//                 ]}
//                 onPress={() => nav.navigate('PYQSubjects')}
//               >
//                 <Text style={styles.modeEmoji}>📜</Text>
//                 <Text style={styles.modeTitle}>Previous Year MCQ</Text>
//                 <Text style={styles.modeText}>
//                   Solve full NEET-style mixed MCQ sets (Physics + Chemistry + Bio).
//                 </Text>
//                 <Text style={styles.modeHint}>Best for real exam practice</Text>
//               </Pressable>

//               {/* Previous Year MCQ Papers PDF */}
//               <Pressable
//                 style={({ pressed }) => [
//                   styles.modeCard,
//                   styles.modeCardNeutral,
//                   pressed && styles.modeCardNeutralPressed,
//                 ]}
//                 onPress={() => nav.navigate('PYQPdfPapers')}
//               >
//                 <Text style={styles.modeEmoji}>📂</Text>
//                 <Text style={styles.modeTitle}>PYQ Papers (PDF)</Text>
//                 <Text style={styles.modeText}>
//                   Download complete NEET papers in PDF for offline solving.
//                 </Text>
//                 <Text style={styles.modeHint}>Use with OMR sheets</Text>
//               </Pressable>

//               {/* Mock Test Papers */}
//               <Pressable
//                 style={({ pressed }) => [
//                   styles.modeCard,
//                   styles.modeCardNeutral,
//                   pressed && styles.modeCardNeutralPressed,
//                 ]}
//                 onPress={() => nav.navigate('MockTestPapers')}
//               >
//                 <Text style={styles.modeEmoji}>📝</Text>
//                 <Text style={styles.modeTitle}>Mock Test Papers</Text>
//                 <Text style={styles.modeText}>
//                   Attempt full-length mock tests and track improvement.
//                 </Text>
//                 <Text style={styles.modeHint}>Perfect for weekend practice</Text>
//               </Pressable>
//             </View>
//           </View>
//         </ScrollView>

//         {/* 🔹 Intro overlay with OK / Close + arrows */}
//         {showIntro && currentStep && introPos && (
//           <View style={styles.introOverlay} pointerEvents="box-none">
//             <View style={styles.introDim} />

//             <View
//               style={[
//                 styles.introCardWrapper,
//                 introPos.wrapper,
//               ]}
//               pointerEvents="box-none"
//             >
//               {/* Arrow TOP */}
//               {introPos.arrowOnTop && (
//                 <View
//                   style={[
//                     styles.arrowRow,
//                     { justifyContent: introPos.arrowAlign },
//                   ]}
//                   pointerEvents="none"
//                 >
//                   <Image
//                     source={ArrowWaveUp}
//                     style={styles.waveArrowImageTop}
//                   />
//                 </View>
//               )}

//               {/* Tip card */}
//               <View style={styles.introCard} pointerEvents="auto">
//                 <View style={styles.introHeaderRow}>
//                   <Text style={styles.introStepBadge}>
//                     {introStep + 1}/{INTRO_STEPS.length}
//                   </Text>
//                   <Text style={styles.introTitle}>{currentStep.title}</Text>
//                 </View>

//                 <Text style={styles.introText}>{currentStep.text}</Text>

//                 <View style={styles.introButtonsRow}>
//                   <Pressable
//                     onPress={handleIntroClose}
//                     style={({ pressed }) => [
//                       styles.introSecondaryBtn,
//                       pressed && styles.introSecondaryBtnPressed,
//                     ]}
//                   >
//                     <Text style={styles.introSecondaryText}>Close</Text>
//                   </Pressable>

//                   <Pressable
//                     onPress={handleIntroOk}
//                     style={({ pressed }) => [
//                       styles.introPrimaryBtn,
//                       pressed && styles.introPrimaryBtnPressed,
//                     ]}
//                   >
//                     <Text style={styles.introPrimaryText}>
//                       {introStep < INTRO_STEPS.length - 1 ? 'OK' : 'Done'}
//                     </Text>
//                   </Pressable>
//                 </View>
//               </View>

//               {/* Arrow BOTTOM */}
//               {introPos.arrowOnBottom && (
//                 <View
//                   style={[
//                     styles.arrowRow,
//                     { justifyContent: introPos.arrowAlign },
//                   ]}
//                   pointerEvents="none"
//                 >
//                   <Image
//                     source={ArrowWaveUp}
//                     style={styles.waveArrowImageBottom}
//                   />
//                 </View>
//               )}
//             </View>
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ---------- Styles ---------- */

// // const createStyles = (isDark: boolean) =>
// //   StyleSheet.create({
// //     safeArea: {
// //       flex: 1,
// //       backgroundColor: isDark ? '#020617' : '#F9FAFB',
// //     },
// //     root: {
// //       flex: 1,
// //     },
// //     screen: {
// //       flex: 1,
// //     },
// //     c: {
// //       paddingHorizontal: 16,
// //       paddingBottom: 24,
// //     },

// //     /* Top bar & banners */
// //     topBar: {
// //       flexDirection: 'row',
// //       justifyContent: 'space-between',
// //       alignItems: 'center',
// //       paddingVertical: 12,
// //     },
// //     appTitle: {
// //       fontSize: 20,
// //       fontWeight: '700',
// //       color: isDark ? '#F9FAFB' : '#111827',
// //     },
// //     appSubtitle: {
// //       fontSize: 12,
// //       color: isDark ? '#9CA3AF' : '#6B7280',
// //       marginTop: 2,
// //     },
// //     topRightRow: {
// //       flexDirection: 'row',
// //       alignItems: 'center',
// //       gap: 8,
// //     },
// //     themeToggle: {
// //       paddingHorizontal: 10,
// //       paddingVertical: 6,
// //       borderRadius: 999,
// //       borderWidth: 1,
// //       borderColor: isDark ? '#4B5563' : '#E5E7EB',
// //       marginRight: 8,
// //     },
// //     themeToggleText: {
// //       fontSize: 11,
// //       fontWeight: '600',
// //       color: isDark ? '#E5E7EB' : '#111827',
// //     },
// //     neetBadge: {
// //       backgroundColor: isDark ? '#22C55E33' : '#DCFCE7',
// //       paddingHorizontal: 10,
// //       paddingVertical: 6,
// //       borderRadius: 999,
// //     },
// //     neetBadgeText: {
// //       fontSize: 11,
// //       fontWeight: '600',
// //       color: isDark ? '#4ADE80' : '#166534',
// //     },

// //     bannerWrap: {
// //       marginTop: 4,
// //       marginBottom: 12,
// //     },
// //     bannerScroll: {
// //       paddingVertical: 4,
// //     },
// //     bannerCard: {
// //       width: 260,
// //       height: 120,
// //       borderRadius: 16,
// //       overflow: 'hidden',
// //       marginRight: 12,
// //       backgroundColor: isDark ? '#020617' : '#E5E7EB',
// //     },
// //     bannerCardPressed: {
// //       opacity: 0.8,
// //     },
// //     bannerImage: {
// //       width: '100%',
// //       height: '100%',
// //     },

// //     /* Sections */
// //     sectionHeaderRow: {
// //       flexDirection: 'row',
// //       justifyContent: 'space-between',
// //       alignItems: 'center',
// //       marginTop: 8,
// //       marginBottom: 4,
// //     },
// //     sectionTitle: {
// //       fontSize: 16,
// //       fontWeight: '600',
// //       color: isDark ? '#F9FAFB' : '#111827',
// //     },
// //     sectionMeta: {
// //       fontSize: 12,
// //       color: isDark ? '#9CA3AF' : '#6B7280',
// //     },
// //     errorText: {
// //       fontSize: 13,
// //       color: '#F97373',
// //       marginBottom: 4,
// //     },

// //     empty: {
// //       paddingVertical: 18,
// //       alignItems: 'center',
// //       justifyContent: 'center',
// //     },
// //     emptyTitle: {
// //       fontSize: 14,
// //       fontWeight: '600',
// //       color: isDark ? '#E5E7EB' : '#111827',
// //       marginBottom: 4,
// //     },
// //     emptySubtitle: {
// //       fontSize: 12,
// //       color: isDark ? '#9CA3AF' : '#6B7280',
// //       textAlign: 'center',
// //     },
// //     emptyHighlight: {
// //       fontWeight: '700',
// //       color: isDark ? '#E5E7EB' : '#111827',
// //     },

// //     /* Subjects */
// //     subjectCard: {
// //       paddingVertical: 10,
// //       paddingHorizontal: 12,
// //       borderRadius: 12,
// //       borderWidth: 1,
// //       borderColor: isDark ? '#1F2937' : '#E5E7EB',
// //       backgroundColor: isDark ? '#020617' : '#FFFFFF',
// //       marginRight: 10,
// //       minWidth: 130,
// //     },
// //     subjectCardPressed: {
// //       opacity: 0.85,
// //     },
// //     subjectTitle: {
// //       fontSize: 14,
// //       fontWeight: '600',
// //       color: isDark ? '#E5E7EB' : '#111827',
// //       marginBottom: 4,
// //     },
// //     subjectMeta: {
// //       fontSize: 12,
// //       color: isDark ? '#9CA3AF' : '#6B7280',
// //     },

// //     /* Practice cards */
// //     cardGrid: {
// //       marginTop: 8,
// //       flexDirection: 'row',
// //       flexWrap: 'wrap',
// //       justifyContent: 'space-between',
// //     },
// //     modeCard: {
// //       width: '48%',
// //       marginBottom: 12,
// //       padding: 12,
// //       borderRadius: 14,
// //       borderWidth: 1,
// //       borderColor: isDark ? '#1F2937' : '#E5E7EB',
// //       backgroundColor: isDark ? '#020617' : '#FFFFFF',
// //     },
// //     modeCardDisabled: {
// //       opacity: 0.5,
// //     },
// //     modeCardPrimary: {
// //       backgroundColor: isDark ? '#0F172A' : '#EEF2FF',
// //       borderColor: isDark ? '#4F46E5' : '#6366F1',
// //     },
// //     modeCardPrimaryPressed: {
// //       opacity: 0.9,
// //     },
// //     modeCardAccent: {
// //       backgroundColor: isDark ? '#022C22' : '#ECFDF5',
// //       borderColor: isDark ? '#059669' : '#10B981',
// //     },
// //     modeCardAccentPressed: {
// //       opacity: 0.9,
// //     },
// //     modeCardNeutral: {
// //       backgroundColor: isDark ? '#020617' : '#F9FAFB',
// //     },
// //     modeCardNeutralPressed: {
// //       opacity: 0.9,
// //     },
// //     modeEmoji: {
// //       fontSize: 22,
// //       marginBottom: 6,
// //     },
// //     modeTitlePrimary: {
// //       fontSize: 14,
// //       fontWeight: '700',
// //       color: isDark ? '#E5E7EB' : '#111827',
// //       marginBottom: 4,
// //     },
// //     modeTextPrimary: {
// //       fontSize: 12,
// //       color: isDark ? '#CBD5F5' : '#4B5563',
// //     },
// //     modeHintPrimary: {
// //       fontSize: 11,
// //       marginTop: 6,
// //       color: isDark ? '#A5B4FC' : '#4F46E5',
// //     },
// //     modeTitle: {
// //       fontSize: 14,
// //       fontWeight: '700',
// //       color: isDark ? '#E5E7EB' : '#111827',
// //       marginBottom: 4,
// //     },
// //     modeText: {
// //       fontSize: 12,
// //       color: isDark ? '#9CA3AF' : '#4B5563',
// //     },
// //     modeHint: {
// //       fontSize: 11,
// //       marginTop: 6,
// //       color: isDark ? '#E5E7EB' : '#6B7280',
// //     },

// //     /* Intro overlay */
// //     introOverlay: {
// //       ...StyleSheet.absoluteFillObject,
// //       justifyContent: 'flex-start',
// //     },
// //     introDim: {
// //       ...StyleSheet.absoluteFillObject,
// //       backgroundColor: 'rgba(15,23,42,0.6)',
// //     },
// //     introCardWrapper: {
// //       position: 'absolute',
// //     },
// //     arrowRow: {
// //       width: '100%',
// //       marginBottom: 2,
// //     },
// //     waveArrowImageTop: {
// //       width: 80,
// //       height: 80,
// //       resizeMode: 'contain',
// //     },
// //     waveArrowImageBottom: {
// //       width: 80,
// //       height: 80,
// //       resizeMode: 'contain',
// //       transform: [{ rotate: '180deg' }],
// //     },
// //     introCard: {
// //       borderRadius: 16,
// //       padding: 14,
// //       backgroundColor: isDark ? '#020617' : '#FFFFFF',
// //       borderWidth: 1,
// //       borderColor: isDark ? '#1F2937' : '#E5E7EB',
// //     },
// //     introHeaderRow: {
// //       flexDirection: 'row',
// //       alignItems: 'center',
// //       marginBottom: 6,
// //       gap: 8,
// //     },
// //     introStepBadge: {
// //       fontSize: 11,
// //       fontWeight: '700',
// //       paddingHorizontal: 8,
// //       paddingVertical: 2,
// //       borderRadius: 999,
// //       backgroundColor: isDark ? '#111827' : '#EEF2FF',
// //       color: isDark ? '#E5E7EB' : '#4F46E5',
// //     },
// //     introTitle: {
// //       fontSize: 14,
// //       fontWeight: '700',
// //       color: isDark ? '#F9FAFB' : '#111827',
// //       flex: 1,
// //     },
// //     introText: {
// //       fontSize: 12,
// //       color: isDark ? '#E5E7EB' : '#4B5563',
// //       marginBottom: 10,
// //     },
// //     introButtonsRow: {
// //       flexDirection: 'row',
// //       justifyContent: 'flex-end',
// //       gap: 8,
// //     },
// //     introSecondaryBtn: {
// //       paddingHorizontal: 12,
// //       paddingVertical: 6,
// //       borderRadius: 999,
// //       borderWidth: 1,
// //       borderColor: isDark ? '#4B5563' : '#D1D5DB',
// //       backgroundColor: 'transparent',
// //     },
// //     introSecondaryBtnPressed: {
// //       opacity: 0.8,
// //     },
// //     introSecondaryText: {
// //       fontSize: 12,
// //       color: isDark ? '#E5E7EB' : '#374151',
// //     },
// //     introPrimaryBtn: {
// //       paddingHorizontal: 14,
// //       paddingVertical: 6,
// //       borderRadius: 999,
// //       backgroundColor: isDark ? '#4F46E5' : '#2563EB',
// //     },
// //     introPrimaryBtnPressed: {
// //       opacity: 0.9,
// //     },
// //     introPrimaryText: {
// //       fontSize: 12,
// //       fontWeight: '600',
// //       color: '#FFFFFF',
// //     },
// //   });

// /** 🎨 Themed styles – dark & light with safe area */
// const createStyles = (isDark: boolean) =>
//   StyleSheet.create({
//     safeArea: {
//       flex: 1,
//       backgroundColor: isDark ? '#020617' : '#F3F4F6',
//     },
//     root: {
//       flex: 1,
//       position: 'relative',
//     },
//     screen: {
//       flex: 1,
//       backgroundColor: isDark ? '#020617' : '#F3F4F6',
//     },
//     c: {
//       padding: 16,
//       gap: 16,
//       paddingBottom: 28,
//     },

//     // Top bar
//     topBar: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       marginBottom: 6,
//     },
//     topRightRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 8,
//     },
//     appTitle: {
//       fontSize: 18,
//       fontWeight: '800',
//       color: isDark ? '#F9FAFB' : '#111827',
//     },
//     appSubtitle: {
//       fontSize: 12,
//       color: isDark ? '#9CA3AF' : '#6B7280',
//       marginTop: 2,
//     },
//     neetBadge: {
//       paddingHorizontal: 10,
//       paddingVertical: 4,
//       borderRadius: 999,
//       backgroundColor: '#22C55E',
//     },
//     neetBadgeText: {
//       color: '#022C22',
//       fontSize: 11,
//       fontWeight: '700',
//     },

//     themeToggle: {
//       paddingHorizontal: 10,
//       paddingVertical: 4,
//       borderRadius: 999,
//       borderWidth: 1,
//       borderColor: isDark ? '#4B5563' : '#CBD5F5',
//       backgroundColor: isDark ? '#020617' : '#EFF6FF',
//     },
//     themeToggleText: {
//       fontSize: 11,
//       fontWeight: '600',
//       color: isDark ? '#E5E7EB' : '#1D4ED8',
//     },

//     // Banner slider
//     bannerWrap: {
//       marginBottom: 4,
//     },
//     bannerScroll: {
//       paddingRight: 16,
//     },
//     bannerCardPressed: {
//       transform: [{ scale: 0.97 }],
//       opacity: 0.9,
//     },
//     bannerCard: {
//       width: 320,
//       height: 150,
//       marginRight: 12,
//       borderRadius: 18,
//       overflow: 'hidden',
//       backgroundColor: isDark ? '#020617' : '#FFFFFF',
//       borderWidth: 1,
//       borderColor: isDark ? '#38BDF8' : '#E5E7EB',
//       shadowColor: '#000',
//       shadowOpacity: isDark ? 0.3 : 0.08,
//       shadowRadius: 6,
//       shadowOffset: { width: 0, height: 3 },
//       elevation: 2,
//     },
//     bannerImage: {
//       width: '100%',
//       height: '100%',
//     },

//     // Sections
//     sectionHeaderRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginTop: 8,
//       marginBottom: 6,
//       justifyContent: 'space-between',
//     },
//     sectionTitle: {
//       fontSize: 15,
//       fontWeight: '600',
//       color: isDark ? '#E5E7EB' : '#111827',
//     },
//     sectionMeta: {
//       fontSize: 12,
//       color: isDark ? '#9CA3AF' : '#6B7280',
//     },

//     errorText: {
//       fontSize: 11,
//       color: '#F97316',
//       marginBottom: 4,
//     },

//     empty: {
//       borderWidth: 1,
//       borderColor: isDark ? '#1F2937' : '#E5E7EB',
//       borderRadius: 12,
//       padding: 14,
//       backgroundColor: isDark ? '#020617' : '#FFFFFF',
//       marginBottom: 8,
//     },
//     emptyTitle: {
//       color: isDark ? '#9CA3AF' : '#4B5563',
//       fontWeight: '500',
//     },
//     emptySubtitle: {
//       color: isDark ? '#9CA3AF' : '#6B7280',
//       marginTop: 4,
//       fontSize: 12,
//     },
//     emptyHighlight: {
//       fontWeight: '700',
//       color: isDark ? '#E5E7EB' : '#111827',
//     },

//     // Subject cards
//     subjectCard: {
//       minWidth: 130,
//       minHeight: 80,
//       paddingVertical: 10,
//       paddingHorizontal: 12,
//       borderRadius: 14,
//       marginRight: 10,
//       backgroundColor: isDark ? '#020617' : '#FFFFFF',
//       borderWidth: 1,
//       borderColor: isDark ? '#374151' : '#E5E7EB',
//       shadowColor: '#000',
//       shadowOpacity: isDark ? 0 : 0.06,
//       shadowRadius: 5,
//       shadowOffset: { width: 0, height: 2 },
//       elevation: isDark ? 0 : 1,
//     },
//     subjectCardPressed: {
//       backgroundColor: isDark ? '#111827' : '#EEF2FF',
//       borderColor: isDark ? '#4B5563' : '#C7D2FE',
//     },
//     subjectTitle: {
//       fontSize: 14,
//       fontWeight: '600',
//       color: isDark ? '#F9FAFB' : '#111827',
//     },
//     subjectMeta: {
//       fontSize: 11,
//       color: isDark ? '#9CA3AF' : '#6B7280',
//       marginTop: 2,
//     },

//     // Practice modes grid
//     cardGrid: {
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       gap: 10,
//     },
//     modeCard: {
//       flexBasis: '48%',
//       borderRadius: 14,
//       paddingVertical: 12,
//       paddingHorizontal: 10,
//       borderWidth: 1,
//     },

//     // Purple primary card
//     modeCardPrimary: {
//       backgroundColor: '#4F46E5',
//       borderColor: '#4338CA',
//     },
//     modeCardPrimaryPressed: {
//       backgroundColor: '#4338CA',
//     },
//     modeTitlePrimary: {
//       fontSize: 14,
//       fontWeight: '700',
//       color: '#F9FAFB',
//       marginBottom: 4,
//     },
//     modeTextPrimary: {
//       fontSize: 12,
//       color: '#E5E7EB',
//     },
//     modeHintPrimary: {
//       fontSize: 11,
//       color: '#E0E7FF',
//       marginTop: 6,
//     },

//     // Accent card (Previous Year MCQ)
//     modeCardAccent: {
//       backgroundColor: isDark ? '#0F172A' : '#DBEAFE',
//       borderColor: isDark ? '#38BDF8' : '#1D4ED8',
//     },
//     modeCardAccentPressed: {
//       backgroundColor: isDark ? '#0B1220' : '#BFDBFE',
//     },

//     // Neutral cards (PDF, Mock)
//     modeCardNeutral: {
//       backgroundColor: isDark ? '#020617' : '#FFFFFF',
//       borderColor: isDark ? '#374151' : '#E5E7EB',
//     },
//     modeCardNeutralPressed: {
//       backgroundColor: isDark ? '#111827' : '#F3F4F6',
//     },
//     modeCardDisabled: {
//       opacity: 0.5,
//     },

//     modeEmoji: {
//       fontSize: 20,
//       marginBottom: 4,
//     },
//     modeTitle: {
//       fontSize: 14,
//       fontWeight: '600',
//       color: isDark ? '#F9FAFB' : '#111827',
//       marginBottom: 4,
//     },
//     modeText: {
//       fontSize: 12,
//       color: isDark ? '#9CA3AF' : '#4B5563',
//     },
//     modeHint: {
//       fontSize: 11,
//       color: isDark ? '#9CA3AF' : '#6B7280',
//       marginTop: 6,
//     },

//     // 🔹 Intro overlay
//     introOverlay: {
//       ...StyleSheet.absoluteFillObject,
//     },
//     introDim: {
//       ...StyleSheet.absoluteFillObject,
//       backgroundColor: 'rgba(15, 23, 42, 0.75)',
//     },
//     introCardWrapper: {
//       position: 'absolute',
//     },
//     introCard: {
//       borderRadius: 16,
//       padding: 14,
//       backgroundColor: isDark ? '#020617' : '#FFFFFF',
//       borderWidth: 1,
//       borderColor: isDark ? '#1F2937' : '#E5E7EB',
//     },
//     introHeaderRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 6,
//       gap: 8,
//     },
//     introStepBadge: {
//       fontSize: 11,
//       fontWeight: '700',
//       color: '#F9FAFB',
//       paddingHorizontal: 8,
//       paddingVertical: 3,
//       borderRadius: 999,
//       backgroundColor: '#4F46E5',
//     },
//     introTitle: {
//       fontSize: 14,
//       fontWeight: '700',
//       color: isDark ? '#F9FAFB' : '#111827',
//       flexShrink: 1,
//     },
//     introText: {
//       fontSize: 12,
//       color: isDark ? '#E5E7EB' : '#4B5563',
//       marginTop: 2,
//       lineHeight: 18,
//     },
//     introButtonsRow: {
//       flexDirection: 'row',
//       justifyContent: 'flex-end',
//       marginTop: 10,
//       gap: 8,
//     },
//     introSecondaryBtn: {
//       paddingHorizontal: 12,
//       paddingVertical: 6,
//       borderRadius: 999,
//       borderWidth: 1,
//       borderColor: isDark ? '#4B5563' : '#D1D5DB',
//       backgroundColor: isDark ? '#020617' : '#FFFFFF',
//     },
//     introSecondaryBtnPressed: {
//       backgroundColor: isDark ? '#111827' : '#F3F4F6',
//     },
//     introSecondaryText: {
//       fontSize: 11,
//       color: isDark ? '#E5E7EB' : '#4B5563',
//       fontWeight: '500',
//     },
//     introPrimaryBtn: {
//       paddingHorizontal: 14,
//       paddingVertical: 6,
//       borderRadius: 999,
//       backgroundColor: '#4F46E5',
//     },
//     introPrimaryBtnPressed: {
//       backgroundColor: '#4338CA',
//     },
//     introPrimaryText: {
//       fontSize: 11,
//       color: '#F9FAFB',
//       fontWeight: '600',
//     },

//     // 🔹 Arrow styles for curved PNG
//     arrowRow: {
//       width: '100%',
//       flexDirection: 'row',
//       marginTop: -40,
//       marginBottom: 0,
//     },
//     waveArrowImageTop: {
//       width: 90,
//       height: 90,
//       resizeMode: 'contain',
//       marginBottom: -10,
//     },
//     waveArrowImageBottom: {
//       width: 90,
//       height: 90,
//       resizeMode: 'contain',
//       transform: [{ rotate: '180deg' }],
//       marginTop: -10,
//     },
//   });

// // tipColumn: {
// //   alignItems: 'center',
// //   justifyContent: 'center',
// // },
// // tipBar: {
// //   width: 2,
// //   height: 22, // length of the bar between card and block
// //   backgroundColor: isDark ? '#E5E7EB' : '#111827',
// // },
// // arrowDown: {
// //   width: 0,
// //   height: 0,
// //   borderLeftWidth: 10,
// //   borderRightWidth: 10,
// //   borderTopWidth: 12,
// //   borderLeftColor: 'transparent',
// //   borderRightColor: 'transparent',
// //   borderTopColor: isDark ? '#020617' : '#FFFFFF',
// // },
// // arrowUp: {
// //   width: 0,
// //   height: 0,
// //   borderLeftWidth: 10,
// //   borderRightWidth: 10,
// //   borderBottomWidth: 12,
// //   borderLeftColor: 'transparent',
// //   borderRightColor: 'transparent',
// //   borderBottomColor: isDark ? '#020617' : '#FFFFFF',
// // },
// // });

// src/screens/Home/HomeScreen.tsx
import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Image,
  Pressable,
  Linking,
  BackHandler,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  StatusBar,
  Platform,
} from 'react-native';
import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// src/screens/Home/HomeScreen.tsx
import auth from '@react-native-firebase/auth';

// 🔹 Firestore (React Native Firebase)
import { db } from '../../services/firebase.native';

import { RootStackParamList } from '../../navigation/rootnavigator';
import { useTheme, Colors } from '../../theme/ThemeContext';
import { SUBJECTS } from '../../data/demo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNotifications } from '../../context/NotificationContext';
import NotificationBadge from '../../components/NotificationBadge';

// Curved arrow asset
const ArrowWaveUp = require('../../assets/intro/arrow_wave_up.png');

type Nav = NativeStackNavigationProp<RootStackParamList>;

// 🔑 bumped version so new build shows tips once
const HOME_INTRO_KEY = 'topinexam_home_intro_seen_v5';

const TIP_CARD_HEIGHT = 150;      // approximate height of the tip card
const WAVE_ARROW_HEIGHT = 80;     // approximate arrow image height
// 👈 change this string to whatever you really use in RootNavigator
const AUTH_ROOT_ROUTE = 'Auth'; // or 'Login', 'AuthStack', etc.

// All tips in sequence
const INTRO_STEPS = [
  {
    id: 'subjects',
    title: 'Step 1 • Subjects section',
    text:
      'Here you will see all your subjects. Scroll this row and tap any subject to open its units, chapters, videos, PDFs and MCQs.',
  },
  {
    id: 'custom_mcq',
    title: 'Step 2 • Custom MCQ Quiz',
    text:
      'Use this mode when you want to build your own quiz from selected topics of a subject. Best for targeted practice on weak areas.',
  },
  {
    id: 'pyq_mcq',
    title: 'Step 3 • Previous Year MCQ',
    text:
      'This mode mixes questions from Physics, Chemistry and Biology like the actual NEET exam. Use it for full-pattern MCQ practice.',
  },
  {
    id: 'pyq_pdf',
    title: 'Step 4 • PYQ Papers (PDF)',
    text:
      'Here you can open and download complete Previous Year NEET papers in PDF format. Use them with OMR sheets for offline practice.',
  },
  {
    id: 'mock_tests',
    title: 'Step 5 • Mock Test Papers',
    text:
      'Mock tests simulate the real exam with full-length papers. Use them weekly to check your timing, accuracy and overall improvement.',
  },
  {
    id: 'banners_theme',
    title: 'Step 6 • Banners & Theme toggle',
    text:
      'Top banners show important links, offers and NEET tips. The icon on the top-right switches between Dark and Light mode anytime.',
  },
] as const;

type IntroStepId = (typeof INTRO_STEPS)[number]['id'];

type SubjectItem = {
  id: string;
  name: string;
  order: number;
  slug?: string;
  active?: boolean;
  unitCount: number;
  chapterCount: number;
  color: string;  // Random color for the initial letter block
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

// Get a consistent color based on subject id (so it doesn't change on re-render)
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

// Get time-based greeting
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning,';
  if (hour < 17) return 'Good Afternoon,';
  return 'Good Evening,';
};

type BannerItem = {
  id: string;
  imageUrl: string;
  link: string;
  order: number;
  active: boolean;
};

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { isDark, toggleTheme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const { unreadCount } = useNotifications();

  // 🔹 Subjects from Firestore (with unit count)
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);
  // 🔹 Internal raw snapshot data for combining subjects + unitCounts
  const [rawSubjects, setRawSubjects] = useState<
    { id: string; data: any }[]
  >([]);
  const [unitCounts, setUnitCounts] = useState<Record<string, number>>({});
  const [chapterCounts, setChapterCounts] = useState<Record<string, number>>({});

  // 🔹 Banners from Firestore (nodes, type = 'banner')
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [bannersError, setBannersError] = useState<string | null>(null);
  const [bannersLoading, setBannersLoading] = useState(true); // 👈 loading flag
  const [brokenBannerIds, setBrokenBannerIds] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🔹 Logout overlay flag
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 🔹 Account popup state
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [userName, setUserName] = useState<string>('');

  const firstSubjectId = subjects[0]?.id;
  const isSubjectDependentDisabled = !firstSubjectId;

  const styles = useMemo(() => createStyles(isDark, screenWidth), [isDark, screenWidth]);

  // 🔹 Fetch user name from Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserName(data?.name || data?.displayName || currentUser.email || 'User');
        } else {
          // Fallback to email or display name from auth
          setUserName(currentUser.displayName || currentUser.email || 'User');
        }
      } catch (error) {
        console.log('[HomeScreen] Error fetching user name:', error);
        const currentUser = auth().currentUser;
        setUserName(currentUser?.displayName || currentUser?.email || 'User');
      }
    };

    fetchUserName();
  }, []);

  // 🔹 anchors for dynamic positioning (intro tips)
  const [anchors, setAnchors] = useState({
    topAreaY: 0,      // bottom of top bar + hgs
    subjectsY: 0,     // bottom of subjects section
    practiceY: 0,     // bottom of practice section
    customMcqY: 0,    // center of Custom MCQ card
    pyqMcqY: 0,       // center of Previous Year MCQ card
    pyqPdfY: 0,       // center of PYQ PDF card
    mockY: 0,         // center of Mock Test card
  });

  // 🔹 multi-step intro overlay
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0); // index in INTRO_STEPS

  // 🔥 Load subjects + unit counts from Firestore
  // 🔥 REAL-TIME subjects + unit counts from Firestore
  useEffect(() => {
    console.log('[HOME] subscribing to live subjects + units...');
    setSubjectsLoading(true);
    setSubjectsError(null);

    const nodesRef = db.collection('nodes');

    // 1️⃣ Live units → build subjectId -> count map
    const unsubscribeUnits = nodesRef
      .where('type', '==', 'unit')
      .onSnapshot(
        snapshot => {
          const counts: Record<string, number> = {};
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as any;
            const parentId = data.parentId as string | undefined;
            if (!parentId) return;
            counts[parentId] = (counts[parentId] ?? 0) + 1;
          });

          setUnitCounts(counts);
          console.log('[HOME] unitCounts =', counts);
        },
        error => {
          console.warn('[HOME] units onSnapshot error', error);
        },
      );

    // 2️⃣ Live chapters → build subjectId -> chapter count map
    const unsubscribeChapters = nodesRef
      .where('type', '==', 'chapter')
      .onSnapshot(
        snapshot => {
          const counts: Record<string, number> = {};
          snapshot.forEach(docSnap => {
            const data = docSnap.data() as any;
            const subjectId = data.subjectId as string | undefined;
            if (!subjectId) return;
            counts[subjectId] = (counts[subjectId] ?? 0) + 1;
          });

          setChapterCounts(counts);
          console.log('[HOME] chapterCounts =', counts);
        },
        error => {
          console.warn('[HOME] chapters onSnapshot error', error);
        },
      );

    // 2️⃣ Live subjects
    const unsubscribeSubjects = nodesRef
      .where('type', '==', 'subject')
      .orderBy('order', 'asc')
      .onSnapshot(
        snapshot => {
          console.log('[HOME] subjects snapshot size =', snapshot.size);

          if (snapshot.empty) {
            console.log('[HOME] no Firestore subjects, using demo SUBJECTS');

            // 🔁 fallback to local demo data
            const demoSubjects: SubjectItem[] = SUBJECTS.map((s, idx) => {
              // Count chapters across all units
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

            setRawSubjects([]);
            setSubjects(demoSubjects);
            setSubjectsLoading(false);
            return;
          }

          const docs = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            data: docSnap.data() as any,
          }));

          setRawSubjects(docs);
          setSubjectsLoading(false);
        },
        error => {
          console.warn(
            '[HOME] subjects onSnapshot error, falling back to demo SUBJECTS',
            error,
          );
          setSubjectsError(
            'Failed to load subjects from cloud. Showing demo data.',
          );

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

          setRawSubjects([]);
          setSubjects(demoSubjects);
          setSubjectsLoading(false);
        },
      );

    // 🔙 Clean up listeners when HomeScreen unmounts
    return () => {
      console.log('[HOME] unsubscribing from live subjects + units + chapters');
      unsubscribeUnits();
      unsubscribeChapters();
      unsubscribeSubjects();
    };
  }, []);
  // 🔁 Whenever rawSubjects, unitCounts, or chapterCounts change, build final subjects list
  useEffect(() => {
    if (!rawSubjects.length) {
      // When we are using demo subjects or no Firestore subjects,
      // subjects are already set in the onSnapshot callback.
      return;
    }

    const items: SubjectItem[] = rawSubjects.map(({ id, data }, idx) => ({
      id,
      name: data.name ?? data.title ?? 'Untitled subject',
      order: data.order ?? idx,
      slug: data.slug,
      active: data.active ?? true,
      unitCount: unitCounts[id] ?? 0,
      chapterCount: chapterCounts[id] ?? 0,
      color: getSubjectColor(id),
    }));

    setSubjects(items);
  }, [rawSubjects, unitCounts, chapterCounts]);

  // 🔥 REAL-TIME banners from Firestore (nodes type = 'banner')
  useEffect(() => {
    console.log('[HOME] subscribing to live banners...');
    setBannersLoading(true);
    setBannersError(null);

    const q = db
      .collection('nodes')
      .where('type', '==', 'banner')
      .orderBy('order', 'asc');

    const unsubscribe = q.onSnapshot(
      snapshot => {
        console.log('[HOME] banners snapshot size =', snapshot.size);

        if (snapshot.empty) {
          setBanners([]);
          setBannersLoading(false);
          return;
        }

        const items: BannerItem[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            imageUrl: data.imageUrl ?? '',
            link: data.link ?? '',
            order: data.order ?? 0,
            active: data.active ?? true,
          };
        });

        // Only active banners with image
        const activeItems = items.filter(b => b.active && b.imageUrl);
        setBanners(activeItems);
        setBrokenBannerIds([]);     // reset if we get fresh data

        setBannersLoading(false);
      },
      error => {
        console.warn('[HOME] banners onSnapshot error', error);
        setBannersError('Failed to load banners from cloud.');
        setBanners([]);
        setBannersLoading(false);
      },
    );

    // 🔙 clean up listener when screen unmounts
    return () => {
      console.log('[HOME] unsubscribing from live banners');
      unsubscribe();
    };
  }, []);

  // 🔹 Intro flag
  useEffect(() => {
    const loadIntroFlag = async () => {
      try {
        const flag = await AsyncStorage.getItem(HOME_INTRO_KEY);

        console.log('[HOME_INTRO] flag =', flag);
        // For now: always show tips from step 0
        // setIntroStep(0);
        // setShowIntro(true);

        // If later you want "show only once", restore this:
        if (flag === '1') {
          setShowIntro(false);
        } else {
          setIntroStep(0);
          setShowIntro(true);
        }
      } catch (e) {
        console.warn('Failed to read home intro flag:', e);
        setIntroStep(0);
        setShowIntro(true);
      }
    };
    loadIntroFlag();
  }, []);

  const finishIntroForever = useCallback(async () => {
    try {
      await AsyncStorage.setItem(HOME_INTRO_KEY, '1');
    } catch (e) {
      console.warn('Failed to set home intro flag:', e);
    }
    setShowIntro(false);
  }, []);

  // 🔄 Refresh handler for TOP IN EXAM badge
  const handleRefresh = useCallback(() => {
    if (isRefreshing) return; // prevent double-tap
    setIsRefreshing(true);
    // Trigger loading states to show visual feedback
    setSubjectsLoading(true);
    setBannersLoading(true);
    // The real-time listeners will set loading to false when data arrives
    // Add a fallback timeout in case data is already cached
    setTimeout(() => {
      setIsRefreshing(false);
      setSubjectsLoading(false);
      setBannersLoading(false);
    }, 800);
  }, [isRefreshing]);

  const handleIntroOk = useCallback(() => {
    if (introStep < INTRO_STEPS.length - 1) {
      setIntroStep(prev => prev + 1);
    } else {
      finishIntroForever();
    }
  }, [introStep, finishIntroForever]);

  const handleIntroClose = useCallback(() => {
    finishIntroForever();
  }, [finishIntroForever]);

  const handleBannerPress = useCallback((banner: BannerItem) => {
    if (!banner.link) return;

    if (banner.link.startsWith('http')) {
      Linking.openURL(banner.link).catch(err => {
        console.warn('Failed to open URL:', err);
      });
      return;
    }

    // Later you can route internally:
    // nav.navigate(banner.link as keyof RootStackParamList);
  }, []);

  const currentStep = INTRO_STEPS[introStep];

  // 🔹 Position + arrow config for each step (dynamic using anchors)
  const introPos = useMemo(() => {
    if (!currentStep) return undefined;

    const id = currentStep.id as IntroStepId;

    switch (id) {
      case 'subjects':
        if (!anchors.subjectsY) return undefined;
        return {
          wrapper: { left: 16, right: 16, top: anchors.subjectsY + 8 },
          arrowOnTop: true,
          arrowOnBottom: false,
          arrowAlign: 'center' as const,
        };

      case 'custom_mcq': {
        const targetY = anchors.practiceY;
        if (!anchors.practiceY || !anchors.subjectsY) return undefined;

        const desiredTop =
          targetY - (TIP_CARD_HEIGHT + WAVE_ARROW_HEIGHT + 16);
        const minTop = anchors.subjectsY - 50;
        const safeTop = Math.max(desiredTop, minTop);

        return {
          wrapper: { left: 16, right: 16, top: safeTop },
          arrowOnTop: true,
          arrowOnBottom: false,
          arrowAlign: 'flex-start' as const,
        };
      }

      case 'pyq_mcq': {
        if (!anchors.practiceY || !anchors.subjectsY) return undefined;

        const desiredTop = anchors.practiceY - TIP_CARD_HEIGHT - 16;
        const minTop = anchors.subjectsY + 40;
        const safeTop = Math.max(desiredTop, minTop);

        return {
          wrapper: { left: 16, right: 16, top: safeTop },
          arrowOnTop: true,
          arrowOnBottom: false,
          arrowAlign: 'flex-end' as const,
        };
      }

      case 'pyq_pdf': {
        if (!anchors.practiceY || !anchors.subjectsY) return undefined;

        const desiredTop = anchors.practiceY - TIP_CARD_HEIGHT - 406;
        const minTop = anchors.subjectsY + 60;
        const safeTop = Math.max(desiredTop, minTop);

        return {
          wrapper: { left: 16, right: 16, top: safeTop },
          arrowOnTop: false,
          arrowOnBottom: true,
          arrowAlign: 'flex-start' as const,
        };
      }

      case 'mock_tests': {
        if (!anchors.practiceY || !anchors.subjectsY) return undefined;

        const desiredTop = anchors.practiceY - TIP_CARD_HEIGHT - 106;
        const minTop = anchors.subjectsY + 40;
        const safeTop = Math.max(desiredTop, minTop);

        return {
          wrapper: { left: 16, right: 16, top: safeTop },
          arrowOnTop: false,
          arrowOnBottom: true,
          arrowAlign: 'flex-end' as const,
        };
      }

      case 'banners_theme':
        if (!anchors.topAreaY) return undefined;
        return {
          wrapper: { left: 16, right: 16, top: anchors.topAreaY + 8 },
          arrowOnTop: true,
          arrowOnBottom: false,
          arrowAlign: 'flex-end' as const,
        };

      default:
        return undefined;
    }
  }, [currentStep, anchors]);
  // 🔹 Logout handlers (custom overlay)
  const handleLogout = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    setShowLogoutConfirm(false);

    try {
      // ❗ Instead of AsyncStorage.clear(), remove only what you really need.
      // For example: clear the login timestamp so TTL resets.
      await AsyncStorage.removeItem('abs_neet_last_login_at');

      // If you store user email / tokens elsewhere, remove those keys too:
      // await AsyncStorage.multiRemove(['abs_neet_last_login_at', 'user_email', ...]);

      // 🔐 Sign out from Firebase – this will flip `user` to null in RootNavigator
      await auth().signOut();
    } catch (e) {
      console.warn('Failed to logout:', e);
    }
  }, []);

  const cancelLogout = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);


  // 🔹 Android back button → confirm exit
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit Top in Exam',
          'Are you sure you want to close the app?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Exit',
              style: 'destructive',
              onPress: () => BackHandler.exitApp(),
            },
          ],
        );
        return true; // prevent default back behaviour
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        subscription.remove();
      };
    }, []),
  );



  const renderFallbackBanner = () => (
    <View style={styles.bannerCard}>
      <View style={styles.bannerFallback}>
        <Text style={styles.bannerFallbackTitle}>NEET-Exam Practice</Text>
        <Text style={styles.bannerFallbackSubtitle}>
          Daily MCQs • PYQs • Mock Tests to help you crack NEET.
        </Text>
      </View>
    </View>
  );

  // 🔹 Set white StatusBar immediately on mount
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(isDark ? '#0F172A' : '#FFFFFF');
      StatusBar.setTranslucent(false);
    }
  }, [isDark]);

  // 🔹 Also set white StatusBar when this screen is focused (for tab switches)
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(isDark ? '#0F172A' : '#FFFFFF');
        StatusBar.setTranslucent(false);
      }
    }, [isDark])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.root}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.c}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!showIntro}
        >
          {/* Top app bar + banners (measured for topAreaY) */}
          <View
            onLayout={e => {
              const { y, height } = e.nativeEvent.layout;
              setAnchors(prev => ({ ...prev, topAreaY: y + height }));
            }}
          >
            {/* Header Container with white background */}
            <View style={styles.headerContainer}>
              {/* Top app bar - Modern Design */}
              <View style={styles.topBar}>
              {/* Left: NEET-EXAM badge - Tap to refresh */}
              <Pressable
                onPress={handleRefresh}
                style={({ pressed }) => [
                  styles.neetBadge,
                  pressed && styles.neetBadgePressed,
                  isRefreshing && styles.neetBadgeRefreshing,
                ]}
              >
                {isRefreshing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.neetBadgeText}>TOP IN EXAM</Text>
                )}
              </Pressable>

              {/* Right: Icons row */}
              <View style={styles.topRightRow}>
                {/* Theme toggle */}
                <Pressable
                  onPress={toggleTheme}
                  style={({ pressed }) => [
                    styles.headerIconBtn,
                    pressed && styles.headerIconBtnPressed,
                  ]}
                >
                  {isDark ? (
                    <Icon name="white-balance-sunny" size={20} color="#F59E0B" />
                  ) : (
                    <Icon name="moon-waxing-crescent" size={20} color="#374151" style={{ transform: [{ rotate: '+30deg' }] }} />
                  )}
                </Pressable>

                {/* Notification bell */}
                <Pressable
                  onPress={() => nav.navigate('Notifications')}
                  style={({ pressed }) => [
                    styles.headerIconBtn,
                    pressed && styles.headerIconBtnPressed,
                  ]}
                >
                  <Icon name="bell-outline" size={20} color={isDark ? '#9CA3AF' : '#374151'} />
                  <NotificationBadge count={unreadCount} />
                </Pressable>

                {/* Account button */}
                <Pressable
                  onPress={() => setShowAccountPopup(true)}
                  style={({ pressed }) => [
                    styles.accountBtn,
                    pressed && styles.accountBtnPressed,
                  ]}
                >
                  <Icon name="account-circle" size={32} color={Colors.accent} />
                </Pressable>
              </View>
            </View>

            {/* Greeting Section with Search Button */}
            <View style={styles.greetingRow}>
              {/* Left: Greeting Text */}
              <View style={styles.greetingTextContainer}>
                <Text style={styles.greetingText}>Ignite your potential,</Text>
                <Text style={styles.userName}>{'Student'}</Text>
              </View>

              {/* Right: Search Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.searchIconBtn,
                  pressed && styles.searchIconBtnPressed,
                ]}
                onPress={() => nav.navigate('Search')}
              >
                <Icon name="magnify" size={22} color="#FFFFFF" />
              </Pressable>
            </View>
            </View>
            {/* End of Header Container */}

            {/* Banner slider from Firestore */}
            <View style={styles.bannerWrap}>
              {bannersError && (
                <Text style={styles.bannerErrorText}>{bannersError}</Text>
              )}

              {bannersLoading ? (
                <View style={styles.bannerEmpty}>
                  <ActivityIndicator
                    size="small"
                    color={isDark ? '#E5E7EB' : '#4B5563'}
                  />
                  <Text style={[styles.bannerEmptyTitle, { marginTop: 6 }]}>
                    Loading banners…
                  </Text>
                </View>
              ) : banners.length === 0 ? (
                // 🔁 No banners from Firestore → show fallback promo banner
                renderFallbackBanner()
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.bannerScroll}
                >
                  {banners.map(b => {
                    const isBroken = brokenBannerIds.includes(b.id);

                    return (
                      <Pressable
                        key={b.id}
                        android_ripple={{ color: isDark ? '#E5E7EB' : '#1E293B' }}
                        onPress={() => handleBannerPress(b)}
                        style={({ pressed }) => [
                          styles.bannerCard,
                          pressed && styles.bannerCardPressed,
                        ]}
                      >
                        {/* 🔁 If image failed or URL empty → show text fallback */}
                        {!b.imageUrl || isBroken ? (
                          <View style={styles.bannerFallback}>
                            <Text style={styles.bannerFallbackTitle}>NEET-Exam Practice</Text>
                            <Text style={styles.bannerFallbackSubtitle}>
                              Practice MCQs, PYQs & Mock Tests every day.
                            </Text>
                          </View>
                        ) : (
                          <Image
                            source={{ uri: b.imageUrl }}
                            style={styles.bannerImage}
                            resizeMode="cover"
                            onError={() =>
                              setBrokenBannerIds(prev =>
                                prev.includes(b.id) ? prev : [...prev, b.id],
                              )
                            }
                          />
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}

            </View>
          </View>

          {/* Subjects section (measured for subjectsY) */}
          <View
            onLayout={e => {
              const { y, height } = e.nativeEvent.layout;
              setAnchors(prev => ({ ...prev, subjectsY: y + height }));
            }}
          >
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Your Subjects</Text>
              {!!subjects.length && !subjectsLoading && (
                <Pressable onPress={() => nav.navigate('SubjectView')}>
                  <Text style={styles.viewAllLink}>View All</Text>
                </Pressable>
              )}
            </View>

            {subjectsError && (
              <Text style={styles.errorText}>{subjectsError}</Text>
            )}

            {subjectsLoading ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Loading subjects…</Text>
                <Text style={styles.emptySubtitle}>
                  Fetching from Top in Exam cloud.
                </Text>
              </View>
            ) : subjects.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No subjects available.</Text>
                <Text style={styles.emptySubtitle}>
                  Add entries in{' '}
                  <Text style={styles.emptyHighlight}>SUBJECTS</Text> inside{' '}
                  <Text style={styles.emptyHighlight}>src/data/demo.ts</Text> or
                  create subject docs in Firestore.
                </Text>
              </View>
            ) : (
              <FlatList
                data={subjects}
                keyExtractor={s => s.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 16 }}
                renderItem={({ item }) => (
                  <Pressable
                    style={({ pressed }) => [
                      styles.subjectCard,
                      pressed && styles.subjectCardPressed,
                      { borderBottomColor: item.color },
                    ]}
                    onPress={() =>
                      nav.navigate('SubjectDetail', { subjectId: item.id })
                    }
                  >
                    {/* Icon container */}
                    <View style={[styles.subjectIconContainer, { backgroundColor: item.color + '20' }]}>
                      <Icon
                        name={getSubjectIcon(item.name, item.id)}
                        size={28}
                        color={item.color}
                      />
                    </View>

                    {/* Subject name */}
                    <Text style={styles.subjectTitle}>{item.name}</Text>

                    {/* Chapter count */}
                    <Text style={styles.subjectMeta}>
                      {item.chapterCount} {item.chapterCount === 1 ? 'Chapter' : 'Chapters'}
                    </Text>
                  </Pressable>
                )}
              />
            )}
          </View>

          {/* Practice section (measured for practiceY) */}
          <View
            onLayout={e => {
              const { y, height } = e.nativeEvent.layout;
              setAnchors(prev => ({ ...prev, practiceY: y + height }));
            }}
          >
            {/* Practice modes / quick actions */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Practice Modes</Text>
              {/* <Text style={styles.sectionMeta}>Choose how you want to study</Text> */}
            </View>

            <View style={styles.cardGrid}>
              {/* Custom MCQ as per Subject */}
              <Pressable
                onLayout={e => {
                  const { y, height } = e.nativeEvent.layout;
                  setAnchors(prev => ({
                    ...prev,
                    customMcqY: y + height / 2,
                  }));
                }}
                style={({ pressed }) => [
                  styles.modeCard,
                  styles.modeCardPrimary,
                  isSubjectDependentDisabled && styles.modeCardDisabled,
                  pressed &&
                  !isSubjectDependentDisabled &&
                  styles.modeCardPrimaryPressed,
                ]}
                disabled={isSubjectDependentDisabled}
                onPress={() =>
                  firstSubjectId &&
                  nav.navigate('CustomMCQQuiz', { subjectId: firstSubjectId })
                }
              >
                <Icon name="brain" size={24} color="#FFFFFF" style={styles.modeIcon} />
                <Text style={styles.modeTitlePrimary}>Custom MCQ Quiz</Text>
                <Text style={styles.modeTextPrimary}>
                  Target weak topics
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
                  pressed && styles.modeCardAccentPressed,
                ]}
                onPress={() => nav.navigate('PYQSubjects')}
              >
                <Icon name="calendar-clock" size={24} color="#EA580C" style={styles.modeIcon} />
                <Text style={styles.modeTitle}>Previous Year MCQ</Text>
                <Text style={styles.modeText}>
                  Real exam practice
                </Text>
                <Text style={styles.modeHint}></Text>
              </Pressable>

              {/* Previous Year MCQ Papers PDF */}
              <Pressable
                style={({ pressed }) => [
                  styles.modeCard,
                  styles.modeCardNeutral,
                  pressed && styles.modeCardNeutralPressed,
                ]}
                onPress={() => nav.navigate('PYQPdfPapers')}
              >
                <Icon name="file-pdf-box" size={24} color="#DC2626" style={styles.modeIcon} />
                <Text style={styles.modeTitle}>PYQ Papers (PDF)</Text>
                <Text style={styles.modeText}>
                  PDF library
                </Text>
                <Text style={styles.modeHint}>Use with OMR sheets</Text>
              </Pressable>

              {/* Mock Test Papers */}
              <Pressable
                style={({ pressed }) => [
                  styles.modeCard,
                  styles.modeCardNeutral,
                  pressed && styles.modeCardNeutralPressed,
                ]}
                onPress={() => nav.navigate('MockTestPapers')}
              >
                <Icon name="clipboard-text-clock-outline" size={24} color="#10B981" style={styles.modeIcon} />
                <Text style={styles.modeTitle}>Mock Test Papers</Text>
                <Text style={styles.modeText}>
                  Full-length papers
                </Text>
                <Text style={styles.modeHint}></Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* 🔹 Intro overlay with OK / Close + arrows */}
        {showIntro && currentStep && introPos && (
          <View style={styles.introOverlay} pointerEvents="box-none">
            <View style={styles.introDim} />

            <View
              style={[
                styles.introCardWrapper,
                introPos.wrapper,
              ]}
              pointerEvents="box-none"
            >
              {/* Arrow TOP */}
              {introPos.arrowOnTop && (
                <View
                  style={[
                    styles.arrowRow,
                    { justifyContent: introPos.arrowAlign },
                  ]}
                  pointerEvents="none"
                >
                  <Image
                    source={ArrowWaveUp}
                    style={styles.waveArrowImageTop}
                  />
                </View>
              )}

              {/* Tip card */}
              <View style={styles.introCard} pointerEvents="auto">
                <View style={styles.introHeaderRow}>
                  <Text style={styles.introStepBadge}>
                    {introStep + 1}/{INTRO_STEPS.length}
                  </Text>
                  <Text style={styles.introTitle}>{currentStep.title}</Text>
                </View>

                <Text style={styles.introText}>{currentStep.text}</Text>

                <View style={styles.introButtonsRow}>
                  <Pressable
                    onPress={handleIntroClose}
                    style={({ pressed }) => [
                      styles.introSecondaryBtn,
                      pressed && styles.introSecondaryBtnPressed,
                    ]}
                  >
                    <Text style={styles.introSecondaryText}>Close</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleIntroOk}
                    style={({ pressed }) => [
                      styles.introPrimaryBtn,
                      pressed && styles.introPrimaryBtnPressed,
                    ]}
                  >
                    <Text style={styles.introPrimaryText}>
                      {introStep < INTRO_STEPS.length - 1 ? 'OK' : 'Done'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Arrow BOTTOM */}
              {introPos.arrowOnBottom && (
                <View
                  style={[
                    styles.arrowRow,
                    { justifyContent: introPos.arrowAlign },
                  ]}
                  pointerEvents="none"
                >
                  <Image
                    source={ArrowWaveUp}
                    style={styles.waveArrowImageBottom}
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {/* 🔹 Account popup overlay */}
        {showAccountPopup && (
          <Pressable
            style={styles.accountOverlay}
            onPress={() => setShowAccountPopup(false)}
          >
            <View style={styles.accountPopup}>
              {/* User info */}
              <View style={styles.accountHeader}>
                <Icon name="account-circle" size={48} color={isDark ? '#93C5FD' : Colors.primary} />
                <Text style={styles.accountName}>{userName || 'User'}</Text>
                <Text style={styles.accountEmail}>{auth().currentUser?.email || ''}</Text>
              </View>

              {/* Divider */}
              <View style={styles.accountDivider} />

              {/* Logout option */}
              <Pressable
                onPress={() => {
                  setShowAccountPopup(false);
                  handleLogout();
                }}
                style={({ pressed }) => [
                  styles.accountOption,
                  pressed && styles.accountOptionPressed,
                ]}
              >
                <Icon name="logout" size={20} color={isDark ? '#F87171' : '#DC2626'} />
                <Text style={styles.accountOptionText}>Logout</Text>
              </Pressable>
            </View>
          </Pressable>
        )}

        {/* 🔹 Logout confirmation overlay */}
        {showLogoutConfirm && (
          <View style={styles.logoutOverlay}>
            <View style={styles.logoutCard}>
              <Text style={styles.logoutTitle}>Logout</Text>
              <Text style={styles.logoutMessage}>
                Do you really want to logout from
              </Text>

              <View style={styles.logoutButtonsRow}>
                <Pressable
                  onPress={cancelLogout}
                  style={({ pressed }) => [
                    styles.logoutSecondaryBtn,
                    pressed && styles.logoutSecondaryBtnPressed,
                  ]}
                >
                  <Text style={styles.logoutSecondaryText}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={confirmLogout}
                  style={({ pressed }) => [
                    styles.logoutPrimaryBtn,
                    pressed && styles.logoutPrimaryBtnPressed,
                  ]}
                >
                  <Text style={styles.logoutPrimaryText}>Logout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

/** 🎨 Themed styles – dark & light with safe area */
const createStyles = (isDark: boolean, screenWidth: number = 360) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    },
    root: {
      flex: 1,
      position: 'relative',
    },
    screen: {
      flex: 1,
      backgroundColor: isDark ? '#020617' : '#F3F4F6',
    },
    c: {
      paddingHorizontal: Math.max(12, screenWidth * 0.04),
      paddingTop: 0,
      gap: 16,
      paddingBottom: 28,
    },

    // Header container with white background
    headerContainer: {
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
      marginHorizontal: -Math.max(12, screenWidth * 0.04),
      paddingHorizontal: Math.max(12, screenWidth * 0.04),
      paddingBottom: 16,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      shadowColor: '#000',
      shadowOpacity: isDark ? 0 : 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: isDark ? 0 : 3,
    },

    // Top bar - Modern Design
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      marginBottom: 8,
    },
    // Greeting row with search button on right
    greetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 8,
      marginBottom: 12,
    },
    greetingTextContainer: {
      flex: 1,
    },
    greetingText: {
      fontSize: 24,
      fontWeight: '100',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    userName: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.primary,
      marginTop: -2,
    },
    greetingSubtext: {
      fontSize: 13,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 4,
    },
    // Search icon button (circular, on right of greeting)
    searchIconBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: Colors.primary,
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    searchIconBtnPressed: {
      backgroundColor: Colors.accent,
      transform: [{ scale: 0.95 }],
    },
    topRightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    headerIconBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#1E293B' : '#EEF2FF',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E0E7FF',
    },
    headerIconBtnPressed: {
      backgroundColor: isDark ? '#334155' : '#DBEAFE',
    },
    neetBadge: {
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: Colors.primary,
    },
    neetBadgeText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    neetBadgePressed: {
      opacity: 0.8,
      transform: [{ scale: 0.96 }],
    },
    neetBadgeRefreshing: {
      paddingHorizontal: 16,
    },

    themeToggle: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#CBD5F5',
      backgroundColor: isDark ? '#020617' : '#EFF6FF',
    },
    themeToggleText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#000000',
    },

    // Banner slider
    bannerWrap: {
      marginTop: 16,
      marginBottom: 4,
    },
    bannerScroll: {
      paddingRight: 16,
    },
    bannerCardPressed: {
      transform: [{ scale: 0.97 }],
      opacity: 0.9,
    },
    bannerCard: {
      width: Math.min(screenWidth * 0.85, 340),
      height: Math.max(140, screenWidth * 0.4),
      marginRight: 12,
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#38BDF8' : '#E5E7EB',
      shadowColor: '#000',
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    bannerImage: {
      width: '100%',
      height: '100%',
    },
    bannerErrorText: {
      fontSize: 11,
      color: '#F97316',
      marginBottom: 4,
    },
    bannerEmpty: {
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bannerEmptyTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: isDark ? '#E5E7EB' : '#111827',
    },
    bannerEmptySubtitle: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 2,
      textAlign: 'center',
    },
    bannerFallback: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 16,
      justifyContent: 'center',
      backgroundColor: isDark ? '#0F172A' : '#DBEAFE',
    },
    bannerFallbackTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    bannerFallbackSubtitle: {
      fontSize: 12,
      color: isDark ? '#E5E7EB' : '#1F2937',
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
      color: isDark ? '#E5E7EB' : '#111827',
    },
    sectionMeta: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    viewAllLink: {
      fontSize: 13,
      fontWeight: '600',
      color: Colors.primary,
    },

    errorText: {
      fontSize: 11,
      color: '#F97316',
      marginBottom: 4,
    },

    empty: {
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
      borderRadius: 12,
      padding: 14,
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      marginBottom: 8,
    },
    emptyTitle: {
      color: isDark ? '#9CA3AF' : '#4B5563',
      fontWeight: '500',
    },
    emptySubtitle: {
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 4,
      fontSize: 12,
    },
    emptyHighlight: {
      fontWeight: '700',
      color: isDark ? '#E5E7EB' : '#111827',
    },

    // Subject cards (horizontal scroll) - responsive width
    subjectCard: {
      width: Math.max(100, Math.min(screenWidth * 0.28, 120)),
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 10,
      borderRadius: 14,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E5E7EB',
      borderBottomWidth: 3,
      shadowColor: '#000',
      shadowOpacity: isDark ? 0 : 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: isDark ? 0 : 3,
    },
    subjectCardPressed: {
      backgroundColor: isDark ? '#334155' : '#F8FAFC',
      transform: [{ scale: 0.96 }],
    },
    subjectIconContainer: {
      width: Math.max(44, Math.min(screenWidth * 0.13, 52)),
      height: Math.max(44, Math.min(screenWidth * 0.13, 52)),
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    subjectTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
      textAlign: 'center',
      marginBottom: 4,
    },
    subjectMeta: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
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

    // Primary card (Blue)
    modeCardPrimary: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primaryDark,
    },
    modeCardPrimaryPressed: {
      backgroundColor: Colors.primaryDark,
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

    // Accent card (Previous Year MCQ) - Orange theme
    modeCardAccent: {
      backgroundColor: isDark ? '#1C1917' : '#FFF7ED',
      borderColor: isDark ? Colors.accent : Colors.accentDark,
    },
    modeCardAccentPressed: {
      backgroundColor: isDark ? '#292524' : '#FFEDD5',
    },

    // Neutral cards (PDF, Mock)
    modeCardNeutral: {
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderColor: isDark ? '#374151' : '#E5E7EB',
    },
    modeCardNeutralPressed: {
      backgroundColor: isDark ? '#111827' : '#F3F4F6',
    },
    modeCardDisabled: {
      opacity: 0.5,
    },

    modeEmoji: {
      fontSize: 20,
      marginBottom: 4,
    },
    modeIcon: {
      marginBottom: 6,
    },
    modeTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    modeText: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#4B5563',
    },
    modeHint: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 6,
    },

    // 🔹 Intro overlay
    introOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    introDim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
    },
    introCardWrapper: {
      position: 'absolute',
    },
    introCard: {
      borderRadius: 16,
      padding: 14,
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
    },
    introHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 6,
      gap: 8,
    },
    introStepBadge: {
      fontSize: 11,
      fontWeight: '700',
      color: '#F9FAFB',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: Colors.primary,
    },
    introTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      flexShrink: 1,
    },
    introText: {
      fontSize: 12,
      color: isDark ? '#E5E7EB' : '#4B5563',
      marginTop: 2,
      lineHeight: 18,
    },
    introButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10,
      gap: 8,
    },
    introSecondaryBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#D1D5DB',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
    },
    introSecondaryBtnPressed: {
      backgroundColor: isDark ? '#111827' : '#F3F4F6',
    },
    introSecondaryText: {
      fontSize: 11,
      color: isDark ? '#E5E7EB' : '#4B5563',
      fontWeight: '500',
    },
    introPrimaryBtn: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: Colors.primary,
    },
    introPrimaryBtnPressed: {
      backgroundColor: Colors.primaryDark,
    },
    introPrimaryText: {
      fontSize: 11,
      color: '#F9FAFB',
      fontWeight: '600',
    },

    // 🔹 Arrow styles for curved PNG
    arrowRow: {
      width: '100%',
      flexDirection: 'row',
      marginTop: -40,
      marginBottom: 0,
    },
    waveArrowImageTop: {
      width: 90,
      height: 90,
      resizeMode: 'contain',
      marginBottom: -10,
    },
    waveArrowImageBottom: {
      width: 90,
      height: 90,
      resizeMode: 'contain',
      transform: [{ rotate: '180deg' }],
      marginTop: -10,
    },

    // 🔹 Logout button (top bar)
    logoutBtn: {
      marginLeft: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#E5E7EB',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
    },
    logoutBtnPressed: {
      opacity: 0.9,
    },
    logoutText: {
      fontSize: 11,
      fontWeight: '600',
      color: isDark ? '#FCA5A5' : '#B91C1C',
    },

    // 🔹 Logout overlay
    logoutOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutCard: {
      width: '80%',
      maxWidth: 360,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 14,
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    logoutTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    logoutMessage: {
      fontSize: 13,
      color: isDark ? '#E5E7EB' : '#4B5563',
      marginBottom: 14,
    },
    logoutButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
    logoutSecondaryBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#D1D5DB',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
    },
    logoutSecondaryBtnPressed: {
      backgroundColor: isDark ? '#111827' : '#F3F4F6',
    },
    logoutSecondaryText: {
      fontSize: 12,
      color: isDark ? '#E5E7EB' : '#4B5563',
      fontWeight: '500',
    },
    logoutPrimaryBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: '#DC2626',
    },
    logoutPrimaryBtnPressed: {
      backgroundColor: '#B91C1C',
    },
    logoutPrimaryText: {
      fontSize: 12,
      color: '#FEF2F2',
      fontWeight: '600',
    },

    // Account button styles
    accountBtn: {
      padding: 4,
    },
    accountBtnPressed: {
      opacity: 0.7,
    },

    // Account popup overlay styles
    accountOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      paddingTop: 60,
      paddingRight: 16,
    },
    accountPopup: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      minWidth: 220,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    accountHeader: {
      alignItems: 'center',
      paddingBottom: 12,
    },
    accountName: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginTop: 8,
    },
    accountEmail: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 2,
    },
    accountDivider: {
      height: 1,
      backgroundColor: isDark ? '#334155' : '#E5E7EB',
      marginVertical: 12,
    },
    accountOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 8,
    },
    accountOptionPressed: {
      backgroundColor: isDark ? '#334155' : '#F3F4F6',
    },
    accountOptionText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#F87171' : '#DC2626',
      marginLeft: 12,
    },
  });
