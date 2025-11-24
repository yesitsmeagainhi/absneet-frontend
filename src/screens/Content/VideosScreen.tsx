// // //src/screens/Content/VideosScreen.tsx
// // import React from 'react';
// // import { View, Text, FlatList } from 'react-native';
// // import { SUBJECTS } from '../../data/demo';
// // import { useRoute } from '@react-navigation/native';


// // export default function VideosScreen() {
// //     const { params }: any = useRoute();
// //     const { subjectId, unitId, chapterId } = params;
// //     const subject = SUBJECTS.find(s => s.id === subjectId);
// //     const unit = subject?.units.find(u => u.id === unitId);
// //     const chapter = unit?.chapters.find(c => c.id === chapterId);

// //     if (!subjectId || !unitId || !chapterId || !chapter) {
// //         return (
// //             <View style={{ flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
// //                 <Text>Missing selection. Go back and pick a chapter.</Text>
// //             </View>
// //         );
// //     }

// //     return (
// //         <View style={{ flex: 1, padding: 16 }}>
// //             <FlatList
// //                 data={chapter.videos}
// //                 keyExtractor={(v) => v.id}
// //                 renderItem={({ item }) => <Text style={{ padding: 10 }}>{item.title}</Text>}
// //                 ListEmptyComponent={<Text>No videos available for this chapter.</Text>}
// //             />
// //         </View>
// //     );
// // }

// // src/screens/Content/VideosScreen.tsx
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
// import { useRoute } from '@react-navigation/native';

// import { db } from '../../firebase';
// import { doc, getDoc } from 'firebase/firestore';

// type Video = {
//     id: string;
//     title: string;
//     url: string;
// };

// type ChapterDoc = {
//     name: string;
//     videos?: Video[];
// };

// export default function VideosScreen() {
//     const { params }: any = useRoute();
//     const { subjectId, unitId, chapterId } = params || {};

//     const [chapter, setChapter] = useState<ChapterDoc | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const load = async () => {
//             try {
//                 if (!chapterId) {
//                     setError('No chapter selected.');
//                     setLoading(false);
//                     return;
//                 }
//                 const ref = doc(db, 'nodes', chapterId);
//                 const snap = await getDoc(ref);
//                 if (!snap.exists()) {
//                     setError('Chapter not found.');
//                 } else {
//                     setChapter(snap.data() as ChapterDoc);
//                 }
//             } catch (e: any) {
//                 console.error('[VideosScreen] load error', e);
//                 setError('Failed to load videos.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         load();
//     }, [chapterId]);

//     if (loading) {
//         return (
//             <View style={styles.center}>
//                 <ActivityIndicator />
//                 <Text style={{ marginTop: 8 }}>Loading videos…</Text>
//             </View>
//         );
//     }

//     if (error || !subjectId || !unitId || !chapterId) {
//         return (
//             <View style={styles.center}>
//                 <Text>{error || 'Missing chapter selection.'}</Text>
//             </View>
//         );
//     }

//     const videos = chapter?.videos || [];

//     return (
//         <View style={{ flex: 1, padding: 16 }}>
//             <FlatList
//                 data={videos}
//                 keyExtractor={v => v.id}
//                 ListEmptyComponent={
//                     <Text>No videos available for this chapter.</Text>
//                 }
//                 renderItem={({ item }) => (
//                     <TouchableOpacity
//                         style={styles.row}
//                         // later: open video player (WebView / YouTube / custom)
//                         onPress={() => {
//                             console.log('Play video:', item.url);
//                         }}
//                     >
//                         <Text>{item.title}</Text>
//                     </TouchableOpacity>
//                 )}
//             />
//         </View>
//     );
// }

// const styles = {
//     row: {
//         padding: 10,
//         borderWidth: 1,
//         borderColor: '#eee',
//         borderRadius: 10,
//         marginBottom: 10,
//     },
//     center: {
//         flex: 1,
//         padding: 16,
//         alignItems: 'center' as const,
//         justifyContent: 'center' as const,
//     },
// };
// src/screens/Content/VideosScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/RootNavigator';

// 🔹 Static data instead of Firestore
import {
  SUBJECTS,
  Subject,
  Unit,
  Chapter,
} from '../../data/demo';

import { useTheme } from '../../theme/ThemeContext';   // ✅ theme hook

type Nav = NativeStackNavigationProp<RootStackParamList>;

type DemoVideo = {
  id: string;
  title: string;
  url: string;
  provider?: 'youtube' | 'drive' | 'other';
};

export default function VideosScreen() {
  const route = useRoute<any>();
  const { subjectId, unitId, chapterId } = route.params ?? {};

  const navigation = useNavigation<Nav>();

  const { isDark } = useTheme();                                  // ✅ read theme
  const styles = useMemo(() => createStyles(isDark), [isDark]);   // ✅ themed styles

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      if (!subjectId || !unitId || !chapterId) {
        setError('Missing chapter selection.');
        setChapter(null);
        return;
      }

      // 1️⃣ Find subject
      const subject: Subject | undefined = SUBJECTS.find(
        s => s.id === subjectId,
      );
      if (!subject) {
        setError('Subject not found in demo data.');
        setChapter(null);
        return;
      }

      // 2️⃣ Find unit in subject
      const unit: Unit | undefined = subject.units.find(
        u => u.id === unitId,
      );
      if (!unit) {
        setError('Unit not found in demo data.');
        setChapter(null);
        return;
      }

      // 3️⃣ Find chapter in unit
      const ch: Chapter | undefined = unit.chapters.find(
        c => c.id === chapterId,
      );
      if (!ch) {
        setError('Chapter not found in demo data.');
        setChapter(null);
        return;
      }

      setChapter(ch);
    } catch (e: any) {
      console.error('[VideosScreen] error loading from demo.ts', e);
      setError('Failed to load videos.');
      setChapter(null);
    } finally {
      setLoading(false);
    }
  }, [subjectId, unitId, chapterId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#4F46E5" />
        <Text style={styles.centerText}>Loading videos…</Text>
      </View>
    );
  }

  if (error || !subjectId || !unitId || !chapterId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Missing chapter selection.'}</Text>
      </View>
    );
  }

  const videos: DemoVideo[] = (chapter?.videos || []) as DemoVideo[];

  return (
    <View style={styles.screen}>
      {videos.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No videos available</Text>
          <Text style={styles.emptyText}>
            This chapter doesn’t have any videos in the demo data yet.
          </Text>
          <Text style={styles.emptyHint}>
            You can add YouTube or Google Drive links in{' '}
            <Text style={{ fontWeight: '700' }}>chapter.videos</Text> inside{' '}
            <Text style={{ fontWeight: '700' }}>src/data/demo.ts</Text>.
          </Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={v => v.id}
          contentContainerStyle={{ paddingBottom: 12 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('VideoPlayer', {
                  title: item.title || `Video ${index + 1}`,
                  url: item.url,
                })
              }
            >
              <Text style={styles.videoIndex}>Video {index + 1}</Text>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.videoUrl} numberOfLines={1}>
                {item.url}
              </Text>
              {!!item.provider && (
                <Text style={styles.providerTag}>
                  {item.provider === 'youtube'
                    ? 'YouTube'
                    : item.provider === 'drive'
                      ? 'Google Drive'
                      : 'External link'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

/**
 * Theme-aware styles – dark by default, flips when isDark=false
 */
const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    // main wrapper
    screen: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
      padding: 16,
    },

    // video card
    row: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 10,
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
    },
    videoIndex: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 2,
      fontWeight: '500',
    },
    videoTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    videoUrl: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 6,
    },
    providerTag: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      fontSize: 10,
      fontWeight: '600',
      backgroundColor: isDark ? '#1D243A' : '#EEF2FF',
      color: '#4F46E5',
    },

    // loading / error states
    center: {
      flex: 1,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#0F172A' : '#F9FAFB',
    },
    centerText: {
      marginTop: 8,
      fontSize: 13,
      color: isDark ? '#E5E7EB' : '#4B5563',
      textAlign: 'center',
    },
    errorText: {
      marginTop: 8,
      fontSize: 13,
      color: '#F97373',
      textAlign: 'center',
    },

    // empty state
    emptyCard: {
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
    },
    emptyTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    emptyText: {
      fontSize: 13,
      color: isDark ? '#E5E7EB' : '#4B5563',
      marginBottom: 6,
    },
    emptyHint: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
  });

//Last uodated 22-11-25
// src/screens/Content/VideosScreen.tsx
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// import { db } from '../../firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { RootStackParamList } from '../../navigation/RootNavigator';

// type Video = {
//   id: string;
//   title: string;
//   url: string;
// };

// type ChapterDoc = {
//   name: string;
//   videos?: Video[];
// };

// export default function VideosScreen() {
//   const { params }: any = useRoute();
//   const { subjectId, unitId, chapterId } = params || {};

//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//   const [chapter, setChapter] = useState<ChapterDoc | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         if (!chapterId) {
//           setError('No chapter selected.');
//           setLoading(false);
//           return;
//         }
//         const ref = doc(db, 'nodes', chapterId);
//         const snap = await getDoc(ref);
//         if (!snap.exists()) {
//           setError('Chapter not found.');
//         } else {
//           setChapter(snap.data() as ChapterDoc);
//         }
//       } catch (e: any) {
//         console.error('[VideosScreen] load error', e);
//         setError('Failed to load videos.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, [chapterId]);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator />
//         <Text style={{ marginTop: 8 }}>Loading videos…</Text>
//       </View>
//     );
//   }

//   if (error || !subjectId || !unitId || !chapterId) {
//     return (
//       <View style={styles.center}>
//         <Text>{error || 'Missing chapter selection.'}</Text>
//       </View>
//     );
//   }

//   const videos = chapter?.videos || [];

//   return (
//     <View style={{ flex: 1, padding: 16 }}>
//       <FlatList
//         data={videos}
//         keyExtractor={v => v.id}
//         ListEmptyComponent={
//           <Text>No videos available for this chapter.</Text>
//         }
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.row}
//             onPress={() =>
//               navigation.navigate('VideoPlayer', {
//                 title: item.title,
//                 url: item.url,
//               })
//             }
//           >
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.url} numberOfLines={1}>
//               {item.url}
//             </Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   row: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#eee',
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   center: {
//     flex: 1,
//     padding: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   url: {
//     fontSize: 12,
//     color: '#555',
//   },
// });
