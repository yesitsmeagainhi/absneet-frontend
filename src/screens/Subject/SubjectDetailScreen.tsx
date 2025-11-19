// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/RootNavigator';


// export default function SubjectDetailScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'SubjectDetail'>) {
//     const { subjectId } = route.params;
//     return (
//         <View style={styles.c}>
//             <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Units', { subjectId })}>
//                 <Text>Study Material</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SelectUnitsOrChapters', { subjectId })}>
//                 <Text>Solve MCQ</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }
// const styles = StyleSheet.create({ c: { flex: 1, padding: 16, gap: 12 }, card: { borderWidth: 1, borderColor: '#ddd', padding: 16, borderRadius: 12 } });


// src/screens/SubjectDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'SubjectDetail'>;

export default function SubjectDetailScreen({ route, navigation }: Props) {
    const { subjectId } = route.params;

    return (
        <View style={styles.c}>
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('Units', { subjectId })}
            >
                <Text>Study Material</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('SelectUnitsOrChapters', { subjectId })}
            >
                <Text>Solve MCQ</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    c: { flex: 1, padding: 16, gap: 12 },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 16,
        borderRadius: 12,
    },
});
