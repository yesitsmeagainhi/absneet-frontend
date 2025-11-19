import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SUBJECTS, PYQ_PAPERS } from '../../data/demo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PYQSubjects'>;

export default function PYQSubjectsScreen({ navigation }: Props) {
    // Optional: show how many PYQ papers each subject has
    const getPaperCount = (subjectId: string) =>
        PYQ_PAPERS.filter(p => p.subjectId === subjectId).length;

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList
                data={SUBJECTS}
                keyExtractor={s => s.id}
                renderItem={({ item }) => {
                    const count = getPaperCount(item.id);
                    return (
                        <TouchableOpacity
                            style={styles.row}
                            onPress={() =>
                                navigation.navigate('PYQPapers', {
                                    subjectId: item.id,
                                    subjectName: item.name,
                                })
                            }
                        >
                            <View>
                                <Text style={styles.subjectName}>{item.name}</Text>
                                <Text style={styles.subtitle}>
                                    {count > 0
                                        ? `${count} Previous Year Paper${count > 1 ? 's' : ''} available`
                                        : 'No PYQ papers added yet'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    subjectName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
});
