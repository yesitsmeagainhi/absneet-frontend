// //src/screens/Content/McqIntroScreen.tsx
// import React from 'react';
// import { View, Text, Button } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';


// export default function McqIntroScreen() {
//     const route = useRoute<any>();
//     const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
//     const { subjectId, chapterId } = route.params ?? {};
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16 }}>
//             <Text>MCQ for selected chapter</Text>
//             <Button title="Start MCQ" onPress={() => nav.navigate('MCQQuiz', { subjectId, chapterId })} />
//         </View>
//     );
// }


// src/screens/Content/McqIntroScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

type Question = {
  id: string;
  q: string;
  options: string[];
  correctIndex: number;
};

type ChapterDoc = {
  name: string;
  questions?: Question[];
};

export default function McqIntroScreen() {
  const route = useRoute<any>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { subjectId, unitId, chapterId } = route.params ?? {};

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
        console.error('[McqIntroScreen] load error', e);
        setError('Failed to load MCQs.');
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
        <Text style={{ marginTop: 8 }}>Loading MCQs…</Text>
      </View>
    );
  }

  if (error || !subjectId || !chapterId) {
    return (
      <View style={styles.center}>
        <Text>{error || 'Missing chapter selection.'}</Text>
      </View>
    );
  }

  const count = chapter?.questions?.length || 0;

  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 16, marginBottom: 6 }}>
        {chapter?.name || 'MCQ for selected chapter'}
      </Text>
      <Text style={{ marginBottom: 12 }}>
        Total questions: {count}
      </Text>
      <Button
        title={count > 0 ? 'Start MCQ' : 'No MCQs available'}
        disabled={count === 0}
        onPress={() =>
          nav.navigate('MCQQuiz', {
            subjectId,
            unitId,
            chapterId,
          })
        }
      />
    </View>
  );
}

const styles = {
  center: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 16,
    gap: 12,
  },
};
