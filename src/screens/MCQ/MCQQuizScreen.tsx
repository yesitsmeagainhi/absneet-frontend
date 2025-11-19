// import React, { useMemo, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';
// import { SUBJECTS } from '../../data/demo';


// export default function MCQQuizScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'MCQQuiz'>) {
//     const { subjectId, chapterId } = route.params;
//     const chapter = useMemo(() => SUBJECTS.find(s => s.id === subjectId)!.units.flatMap(u => u.chapters).find(c => c.id === chapterId)!, [subjectId, chapterId]);
//     const [idx, setIdx] = useState(0);
//     const [answers, setAnswers] = useState<number[]>([]);
//     const q = chapter.questions[idx];


//     if (!chapter.questions.length) {
//         return <View style={styles.c}><Text>No questions in this chapter.</Text></View>;
//     }


//     const select = (choice: number) => {
//         const next = [...answers];
//         next[idx] = choice;
//         if (idx + 1 < chapter.questions.length) {
//             setAnswers(next); setIdx(idx + 1);
//         } else {
//             const correct = chapter.questions.reduce((acc, qq, i) => acc + ((next[i] ?? -1) === qq.correctIndex ? 1 : 0), 0);
//             navigation.replace('Result', { correct, total: chapter.questions.length, answers: next.map((a, i) => ({ qid: chapter.questions[i].id, chosen: a })) });
//         }
//     };


//     return (
//         <View style={styles.c}>
//             <Text style={styles.h}>{idx + 1}/{chapter.questions.length}</Text>
//             <Text style={styles.q}>{q.q}</Text>
//             {q.options.map((opt, i) => (
//                 <TouchableOpacity key={i} style={styles.opt} onPress={() => select(i)}>
//                     <Text>{opt}</Text>
//                 </TouchableOpacity>
//             ))}
//         </View>
//     );
// }
// const styles = StyleSheet.create({
//     c: { flex: 1, padding: 16, gap: 10 },
//     h: { fontWeight: '700' },
//     q: { fontSize: 16, marginVertical: 8 },
//     opt: { borderWidth: 1, borderColor: '#ddd', padding: 14, borderRadius: 10 },
// });

// src/screens/MCQ/MCQQuizScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

type Props = NativeStackScreenProps<RootStackParamList, 'MCQQuiz'>;

type Question = {
    id: string;
    q: string;
    options: string[];
    correctIndex: number;
};

type ChapterDoc = {
    name?: string;
    questions?: Question[];
};

export default function MCQQuizScreen({ route, navigation }: Props) {
    const { subjectId, unitId, chapterId } = route.params;

    const [chapter, setChapter] = useState<ChapterDoc | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 🔹 Load chapter doc and its questions from Firestore
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
                    setLoading(false);
                    return;
                }

                const data = snap.data() as ChapterDoc;
                const qs = data.questions || [];

                setChapter(data);
                setQuestions(qs);
                setIdx(0);
                setAnswers(new Array(qs.length).fill(-1));
            } catch (e: any) {
                console.error('[MCQQuizScreen] load error', e);
                setError('Failed to load questions.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [chapterId]);

    // 🔹 Loading / error states
    if (loading) {
        return (
            <View style={styles.cCenter}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8 }}>Loading questions…</Text>
            </View>
        );
    }

    if (error || !subjectId || !unitId || !chapterId) {
        return (
            <View style={styles.cCenter}>
                <Text>{error || 'Missing selection. Go back and pick a chapter.'}</Text>
            </View>
        );
    }

    if (!questions.length) {
        return (
            <View style={styles.cCenter}>
                <Text>No questions in this chapter.</Text>
            </View>
        );
    }

    const q = questions[idx];

    const select = (choice: number) => {
        const next = [...answers];
        next[idx] = choice;

        if (idx + 1 < questions.length) {
            setAnswers(next);
            setIdx(idx + 1);
        } else {
            // compute score
            const correct = questions.reduce(
                (acc, qq, i) =>
                    acc + ((next[i] ?? -1) === qq.correctIndex ? 1 : 0),
                0,
            );

            // navigate to Result screen
            navigation.replace('Result', {
                correct,
                total: questions.length,
                answers: next.map((a, i) => ({
                    qid: questions[i].id,
                    chosen: a,
                })),
            });
        }
    };

    return (
        <View style={styles.c}>
            <Text style={styles.h}>
                {idx + 1}/{questions.length}
            </Text>
            {chapter?.name ? (
                <Text style={styles.chapterName}>{chapter.name}</Text>
            ) : null}
            <Text style={styles.q}>{q.q}</Text>

            {q.options.map((opt, i) => (
                <TouchableOpacity
                    key={i}
                    style={styles.opt}
                    onPress={() => select(i)}
                >
                    <Text>{opt}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    c: {
        flex: 1,
        padding: 16,
        gap: 10,
    },
    cCenter: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    h: {
        fontWeight: '700',
    },
    chapterName: {
        fontSize: 14,
        marginTop: 4,
        marginBottom: 4,
        color: '#555',
    },
    q: {
        fontSize: 16,
        marginVertical: 8,
    },
    opt: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 14,
        borderRadius: 10,
        marginBottom: 8,
    },
});
