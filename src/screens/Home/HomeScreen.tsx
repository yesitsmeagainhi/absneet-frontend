// // src/screens/Home/HomeScreen.tsx
// import React, { useMemo, useCallback } from 'react';
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
// import { RootStackParamList } from '../../navigation/rootnavigator';
// import { useTheme } from '../../theme/ThemeContext';

// import { SUBJECTS, Subject } from '../../data/demo';

// type Nav = NativeStackNavigationProp<RootStackParamList>;

// type HomeBanner = {
//   id: string;
//   imageUri: string;
//   link: string; // http(s) URL or internal route name
// };

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

// export default function HomeScreen() {
//   const nav = useNavigation<Nav>();
//   const { isDark, toggleTheme } = useTheme();

//   const subjects: Subject[] = SUBJECTS;
//   const firstSubjectId = subjects[0]?.id;
//   const isSubjectDependentDisabled = !firstSubjectId;

//   const styles = useMemo(() => createStyles(isDark), [isDark]);

//   const handleBannerPress = useCallback((banner: HomeBanner) => {
//     if (!banner.link) return;

//     // External link
//     if (banner.link.startsWith('http')) {
//       Linking.openURL(banner.link).catch(err => {
//         console.warn('Failed to open URL:', err);
//       });
//       return;
//     }

//     // Internal navigation – treat link as route name (uncomment when needed)
//     // nav.navigate(banner.link as keyof RootStackParamList);
//   }, []);

//   return (
//     <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
//       <ScrollView
//         style={styles.screen}
//         contentContainerStyle={styles.c}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Top app bar */}
//         <View style={styles.topBar}>
//           <View>
//             <Text style={styles.appTitle}>ABS NEET</Text>
//             <Text style={styles.appSubtitle}>NEET Practice App</Text>
//           </View>

//           <View style={styles.topRightRow}>
//             {/* Theme toggle */}
//             <Pressable onPress={toggleTheme} style={styles.themeToggle}>
//               <Text style={styles.themeToggleText}>
//                 {isDark ? '☀️ Light' : '🌙 Dark'}
//               </Text>
//             </Pressable>

//             <View style={styles.neetBadge}>
//               <Text style={styles.neetBadgeText}>NEET 2025</Text>
//             </View>
//           </View>
//         </View>

//         {/* Banner slider */}
//         <View style={styles.bannerWrap}>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.bannerScroll}
//           >
//             {HOME_BANNERS.map(b => (
//               <Pressable
//                 key={b.id}
//                 android_ripple={{ color: isDark ? '#E5E7EB' : '#1E293B' }}
//                 onPress={() => handleBannerPress(b)}
//                 style={({ pressed }) => [
//                   styles.bannerCard,
//                   pressed && styles.bannerCardPressed,
//                 ]}
//               >
//                 <Image
//                   source={{ uri: b.imageUri }}
//                   style={styles.bannerImage}
//                   resizeMode="cover"
//                 />
//               </Pressable>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Subjects row */}
//         <View style={styles.sectionHeaderRow}>
//           <Text style={styles.sectionTitle}>Your Subjects</Text>
//           {!!subjects.length && (
//             <Text style={styles.sectionMeta}>{subjects.length} loaded</Text>
//           )}
//         </View>

//         {subjects.length === 0 ? (
//           <View style={styles.empty}>
//             <Text style={styles.emptyTitle}>No subjects in demo data.</Text>
//             <Text style={styles.emptySubtitle}>
//               Add entries in <Text style={styles.emptyHighlight}>SUBJECTS</Text>{' '}
//               inside <Text style={styles.emptyHighlight}>src/data/demo.ts</Text>.
//             </Text>
//           </View>
//         ) : (
//           <FlatList
//             data={subjects}
//             keyExtractor={s => s.id}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingRight: 16 }}
//             renderItem={({ item }) => (
//               <Pressable
//                 style={({ pressed }) => [
//                   styles.subjectCard,
//                   pressed && styles.subjectCardPressed,
//                 ]}
//                 onPress={() =>
//                   nav.navigate('SubjectDetail', { subjectId: item.id })
//                 }
//               >
//                 <Text style={styles.subjectTitle}>{item.name}</Text>
//                 <Text style={styles.subjectMeta}>
//                   {item.units?.length ?? 0} units
//                 </Text>
//               </Pressable>
//             )}
//           />
//         )}

//         {/* Practice modes / quick actions */}
//         <View style={styles.sectionHeaderRow}>
//           <Text style={styles.sectionTitle}>Practice Modes</Text>
//           <Text style={styles.sectionMeta}>Choose how you want to study</Text>
//         </View>

//         <View style={styles.cardGrid}>
//           {/* Custom MCQ as per Subject */}
//           <Pressable
//             style={({ pressed }) => [
//               styles.modeCard,
//               styles.modeCardPrimary,
//               isSubjectDependentDisabled && styles.modeCardDisabled,
//               pressed &&
//               !isSubjectDependentDisabled &&
//               styles.modeCardPrimaryPressed,
//             ]}
//             disabled={isSubjectDependentDisabled}
//             onPress={() =>
//               firstSubjectId &&
//               nav.navigate('CustomMCQQuiz', { subjectId: firstSubjectId })
//             }
//           >
//             <Text style={styles.modeEmoji}>🧠</Text>
//             <Text style={styles.modeTitlePrimary}>Custom MCQ Quiz</Text>
//             <Text style={styles.modeTextPrimary}>
//               Build a quiz from selected topics of a subject.
//             </Text>
//             {isSubjectDependentDisabled && (
//               <Text style={styles.modeHintPrimary}>
//                 Add at least one subject to begin.
//               </Text>
//             )}
//           </Pressable>

//           {/* Previous Year MCQ – mixed exam */}
//           <Pressable
//             style={({ pressed }) => [
//               styles.modeCard,
//               styles.modeCardAccent,
//               pressed && styles.modeCardAccentPressed,
//             ]}
//             onPress={() => nav.navigate('PYQSubjects')}
//           >
//             <Text style={styles.modeEmoji}>📜</Text>
//             <Text style={styles.modeTitle}>Previous Year MCQ</Text>
//             <Text style={styles.modeText}>
//               Solve full NEET-style mixed MCQ sets (Physics + Chemistry + Bio).
//             </Text>
//             <Text style={styles.modeHint}>Best for real exam practice</Text>
//           </Pressable>

//           {/* Previous Year MCQ Papers PDF */}
//           <Pressable
//             style={({ pressed }) => [
//               styles.modeCard,
//               styles.modeCardNeutral,
//               pressed && styles.modeCardNeutralPressed,
//             ]}
//             onPress={() => nav.navigate('PYQPdfPapers')}
//           >
//             <Text style={styles.modeEmoji}>📂</Text>
//             <Text style={styles.modeTitle}>PYQ Papers (PDF)</Text>
//             <Text style={styles.modeText}>
//               Download complete NEET papers in PDF for offline solving.
//             </Text>
//             <Text style={styles.modeHint}>Use with OMR sheets</Text>
//           </Pressable>

//           {/* Mock Test Papers */}
//           <Pressable
//             style={({ pressed }) => [
//               styles.modeCard,
//               styles.modeCardNeutral,
//               pressed && styles.modeCardNeutralPressed,
//             ]}
//             onPress={() => nav.navigate('MockTestPapers')}
//           >
//             <Text style={styles.modeEmoji}>📝</Text>
//             <Text style={styles.modeTitle}>Mock Test Papers</Text>
//             <Text style={styles.modeText}>
//               Attempt full-length mock tests and track improvement.
//             </Text>
//             <Text style={styles.modeHint}>Perfect for weekend practice</Text>
//           </Pressable>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /** 🎨 Themed styles – dark & light with safe area */
// const createStyles = (isDark: boolean) =>
//   StyleSheet.create({
//     safeArea: {
//       flex: 1,
//       backgroundColor: isDark ? '#020617' : '#F3F4F6',
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
//   });

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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from '../../navigation/rootnavigator';
import { useTheme } from '../../theme/ThemeContext';
import { SUBJECTS, Subject } from '../../data/demo';
// import ArrowWaveUp from '../../assets/intro/arrow_wave_up.png';

// ✅ correct
const ArrowWaveUp = require('../../assets/intro/arrow_wave_up.png');
type Nav = NativeStackNavigationProp<RootStackParamList>;

type HomeBanner = {
  id: string;
  imageUri: string;
  link: string; // http(s) URL or internal route name
};

// 🔑 bumped version so new build shows tips once
const HOME_INTRO_KEY = 'absneet_home_intro_seen_v5';

const HOME_BANNERS: HomeBanner[] = [
  {
    id: 'b1',
    imageUri:
      'https://images.pexels.com/photos/5496463/pexels-photo-5496463.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: 'https://absedu.in',
  },
  {
    id: 'b2',
    imageUri:
      'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=800&q=80',
    link: 'https://absedu.in/blog/neet-tips',
  },
];
const TIP_CARD_HEIGHT = 150;      // already using this
const WAVE_ARROW_HEIGHT = 80;     // approximate arrow image height

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

export default function HomeScreen() {
  const nav = useNavigation<Nav>();
  const { isDark, toggleTheme } = useTheme();

  const subjects: Subject[] = SUBJECTS;
  const firstSubjectId = subjects[0]?.id;
  const isSubjectDependentDisabled = !firstSubjectId;

  const styles = useMemo(() => createStyles(isDark), [isDark]);

  // 🔹 anchors for dynamic positioning
  // const [anchors, setAnchors] = useState({
  //   topAreaY: 0,     // bottom of top bar + banners
  //   subjectsY: 0,    // bottom of subjects section
  //   practiceY: 0,    // bottom of practice section
  // });
  const [anchors, setAnchors] = useState({
    topAreaY: 0,      // bottom of top bar + banners
    subjectsY: 0,     // bottom of subjects section
    practiceY: 0,     // bottom of practice section (optional, still useful)
    customMcqY: 0,    // center of Custom MCQ card
    pyqMcqY: 0,       // center of Previous Year MCQ card
    pyqPdfY: 0,       // center of PYQ PDF card
    mockY: 0,         // center of Mock Test card
  });

  // 🔹 multi-step intro overlay
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0); // index in INTRO_STEPS

  useEffect(() => {
    const loadIntroFlag = async () => {
      try {
        const flag = await AsyncStorage.getItem(HOME_INTRO_KEY);

        console.log('[HOME_INTRO] flag =', flag);
        // For now: always show tips from step 0
        setIntroStep(0);
        setShowIntro(true);

        // If later you want "show only once", restore this:
        // if (flag === '1') {
        //   setShowIntro(false);
        // } else {
        //   setIntroStep(0);
        //   setShowIntro(true);
        // }
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

  const handleBannerPress = useCallback((banner: HomeBanner) => {
    if (!banner.link) return;

    if (banner.link.startsWith('http')) {
      Linking.openURL(banner.link).catch(err => {
        console.warn('Failed to open URL:', err);
      });
      return;
    }

    // nav.navigate(banner.link as keyof RootStackParamList);
  }, []);

  const currentStep = INTRO_STEPS[introStep];

  // 🔹 Position + arrow config for each step (dynamic using anchors)
  const introPos = useMemo(() => {
    if (!currentStep) return undefined;
    const TIP_CARD_HEIGHT = 150; // approximate height of the tip card

    const id = currentStep.id as IntroStepId;

    switch (id) {
      case 'subjects':
        if (!anchors.subjectsY) return undefined;
        return {
          // tip card just BELOW the subjects section
          wrapper: { left: 16, right: 16, top: anchors.subjectsY + 8 },
          arrowOnTop: true,  // arrow points UP to the subjects row
          arrowOnBottom: false,
          arrowAlign: 'center' as const,
        };

      case 'custom_mcq':
        const targetY = anchors.practiceY;
        if (!anchors.practiceY || !anchors.subjectsY) return undefined;
        {
          // place card ABOVE the practice grid, arrow DOWN to left side
          // const desiredTop = anchors.practiceY - TIP_CARD_HEIGHT - 56;
          const desiredTop = targetY - (TIP_CARD_HEIGHT + WAVE_ARROW_HEIGHT + 16);

          const minTop = anchors.subjectsY - 50; // don't go too close to subjects
          const safeTop = Math.max(desiredTop, minTop);

          return {
            wrapper: { left: 16, right: 16, top: safeTop },
            arrowOnTop: true,
            arrowOnBottom: false,
            arrowAlign: 'flex-start' as const, // left cards
          };
        }

      case 'pyq_mcq':
        if (!anchors.practiceY || !anchors.subjectsY) return undefined;
        {
          const desiredTop = anchors.practiceY - TIP_CARD_HEIGHT - 16;
          const minTop = anchors.subjectsY + 40;
          const safeTop = Math.max(desiredTop, minTop);

          return {
            wrapper: { left: 16, right: 16, top: safeTop },
            arrowOnTop: true,
            arrowOnBottom: false,
            arrowAlign: 'flex-end' as const, // right cards
          };
        }

      case 'pyq_pdf':
        if (!anchors.practiceY || !anchors.subjectsY) return undefined;
        {
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

      case 'mock_tests':
        if (!anchors.practiceY || !anchors.subjectsY) return undefined;
        {
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
          // card just below the top area, arrow up to banners/theme toggle
          wrapper: { left: 16, right: 16, top: anchors.topAreaY + 8 },
          arrowOnTop: true,
          arrowOnBottom: false,
          arrowAlign: 'flex-end' as const,
        };

      default:
        return undefined;
    }
  }, [currentStep, anchors]);


  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.root}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.c}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!showIntro} // freeze scroll while tips visible
        >
          {/* Top app bar + banners (measured for topAreaY) */}
          <View
            onLayout={e => {
              const { y, height } = e.nativeEvent.layout;
              setAnchors(prev => ({ ...prev, topAreaY: y + height }));
            }}
          >
            {/* Top app bar */}
            <View style={styles.topBar}>
              <View>
                <Text style={styles.appTitle}>ABS NEET</Text>
                <Text style={styles.appSubtitle}>NEET Practice App</Text>
              </View>

              <View style={styles.topRightRow}>
                {/* Theme toggle */}
                <Pressable onPress={toggleTheme} style={styles.themeToggle}>
                  <Text style={styles.themeToggleText}>
                    {isDark ? '☀️ Light' : '🌙 Dark'}
                  </Text>
                </Pressable>

                <View style={styles.neetBadge}>
                  <Text style={styles.neetBadgeText}>NEET 2025</Text>
                </View>
              </View>
            </View>

            {/* Banner slider */}
            <View style={styles.bannerWrap}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bannerScroll}
              >
                {HOME_BANNERS.map(b => (
                  <Pressable
                    key={b.id}
                    android_ripple={{ color: isDark ? '#E5E7EB' : '#1E293B' }}
                    onPress={() => handleBannerPress(b)}
                    style={({ pressed }) => [
                      styles.bannerCard,
                      pressed && styles.bannerCardPressed,
                    ]}
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
              {!!subjects.length && (
                <Text style={styles.sectionMeta}>{subjects.length} loaded</Text>
              )}
            </View>

            {subjects.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No subjects in demo data.</Text>
                <Text style={styles.emptySubtitle}>
                  Add entries in <Text style={styles.emptyHighlight}>SUBJECTS</Text>{' '}
                  inside <Text style={styles.emptyHighlight}>src/data/demo.ts</Text>.
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
                      pressed && styles.subjectCardPressed,
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
              <Text style={styles.sectionMeta}>Choose how you want to study</Text>
            </View>

            <View style={styles.cardGrid}>
              {/* Custom MCQ as per Subject */}
              <Pressable
                onLayout={e => {
                  const { y, height } = e.nativeEvent.layout;
                  // store vertical center of this card
                  setAnchors(prev => ({ ...prev, customMcqY: y + height / 2 }));
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
                  pressed && styles.modeCardAccentPressed,
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
                  pressed && styles.modeCardNeutralPressed,
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
                  pressed && styles.modeCardNeutralPressed,
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
              {/* Arrow TOP (card below, arrow pointing up to block above) */}
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

              {/* Arrow BOTTOM (card above, arrow pointing down to block below) */}
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

      </View>
    </SafeAreaView>
  );
}

/** 🎨 Themed styles – dark & light with safe area */
const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDark ? '#020617' : '#F3F4F6',
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
      padding: 16,
      gap: 16,
      paddingBottom: 28,
    },

    // Top bar
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    topRightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    appTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    appSubtitle: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
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
      color: isDark ? '#E5E7EB' : '#1D4ED8',
    },

    // Banner slider
    bannerWrap: {
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
      width: 320,
      height: 150,
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

    // Subject cards
    subjectCard: {
      minWidth: 130,
      minHeight: 80,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 14,
      marginRight: 10,
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      shadowColor: '#000',
      shadowOpacity: isDark ? 0 : 0.06,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: isDark ? 0 : 1,
    },
    subjectCardPressed: {
      backgroundColor: isDark ? '#111827' : '#EEF2FF',
      borderColor: isDark ? '#4B5563' : '#C7D2FE',
    },
    subjectTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    subjectMeta: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280',
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

    // Purple primary card
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

    // Accent card (Previous Year MCQ)
    modeCardAccent: {
      backgroundColor: isDark ? '#0F172A' : '#DBEAFE',
      borderColor: isDark ? '#38BDF8' : '#1D4ED8',
    },
    modeCardAccentPressed: {
      backgroundColor: isDark ? '#0B1220' : '#BFDBFE',
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
      backgroundColor: '#4F46E5',
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
      backgroundColor: '#4F46E5',
    },
    introPrimaryBtnPressed: {
      backgroundColor: '#4338CA',
    },
    introPrimaryText: {
      fontSize: 11,
      color: '#F9FAFB',
      fontWeight: '600',
    },
    // 🔹 Wavy arrow styles
    waveColumn: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    waveSegment: {
      width: 28,
      height: 2,
      borderRadius: 999,
      backgroundColor: isDark ? '#FACC15' : '#F97316', // warm accent
      marginVertical: 2,
    },
    waveSegment1: {
      transform: [{ rotate: '-25deg' }], // first curve
    },
    waveSegment2: {
      transform: [{ rotate: '12deg' }],  // opposite curve
    },
    waveSegment3: {
      transform: [{ rotate: '-8deg' }],  // soft finish
    },
    // 🔹 Arrow styles
    arrowRowTop: {
      width: '100%',
      flexDirection: 'row',
      marginBottom: 6,   // gap between arrow and card when arrow is on TOP
    },

    arrowRowBottom: {
      width: '100%',
      flexDirection: 'row',
      marginTop: 12,     // bigger gap so arrow sits fully BELOW the card
    },

    tipColumn: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    tipBar: {
      width: 2,
      height: 22,
      backgroundColor: isDark ? '#E5E7EB' : '#111827',
    },
    arrowDown: {
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderTopWidth: 12,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: isDark ? '#020617' : '#FFFFFF',
    },
    arrowUp: {
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 12,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: isDark ? '#020617' : '#FFFFFF',
    },

    arrowRow: {
      width: '100%',
      flexDirection: 'row',
      // This controls how “close” the arrow sticks to the card
      marginTop: -40,   // pull upwards a bit
      marginBottom: 0,
    },

    waveArrowImageTop: {
      width: 90,
      height: 90,
      resizeMode: 'contain',
      // move image closer / further from the card
      marginBottom: -10,
    },

    waveArrowImageBottom: {
      width: 90,
      height: 90,
      resizeMode: 'contain',
      transform: [{ rotate: '180deg' }], // flip to point down
      marginTop: -10,
    },


    // tipColumn: {
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    // tipBar: {
    //   width: 2,
    //   height: 22, // length of the bar between card and block
    //   backgroundColor: isDark ? '#E5E7EB' : '#111827',
    // },
    // arrowDown: {
    //   width: 0,
    //   height: 0,
    //   borderLeftWidth: 10,
    //   borderRightWidth: 10,
    //   borderTopWidth: 12,
    //   borderLeftColor: 'transparent',
    //   borderRightColor: 'transparent',
    //   borderTopColor: isDark ? '#020617' : '#FFFFFF',
    // },
    // arrowUp: {
    //   width: 0,
    //   height: 0,
    //   borderLeftWidth: 10,
    //   borderRightWidth: 10,
    //   borderBottomWidth: 12,
    //   borderLeftColor: 'transparent',
    //   borderRightColor: 'transparent',
    //   borderBottomColor: isDark ? '#020617' : '#FFFFFF',
    // },
  });
