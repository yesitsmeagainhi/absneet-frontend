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
import React, { useEffect, useState } from 'react';
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

import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Video = {
  id: string;
  title: string;
  url: string;
};

type ChapterDoc = {
  name: string;
  videos?: Video[];
};

export default function VideosScreen() {
  const { params }: any = useRoute();
  const { subjectId, unitId, chapterId } = params || {};

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [chapter, setChapter] = useState<ChapterDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!chapterId) {
          setError('No chapter selected.');
          setLoading(false);
          return;
        }
        const ref = doc(db, 'nodes', chapterId);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setError('Chapter not found.');
        } else {
          setChapter(snap.data() as ChapterDoc);
        }
      } catch (e: any) {
        console.error('[VideosScreen] load error', e);
        setError('Failed to load videos.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [chapterId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading videos…</Text>
      </View>
    );
  }

  if (error || !subjectId || !unitId || !chapterId) {
    return (
      <View style={styles.center}>
        <Text>{error || 'Missing chapter selection.'}</Text>
      </View>
    );
  }

  const videos = chapter?.videos || [];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={videos}
        keyExtractor={v => v.id}
        ListEmptyComponent={
          <Text>No videos available for this chapter.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              navigation.navigate('VideoPlayer', {
                title: item.title,
                url: item.url,
              })
            }
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.url} numberOfLines={1}>
              {item.url}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
  },
  center: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  url: {
    fontSize: 12,
    color: '#555',
  },
});
