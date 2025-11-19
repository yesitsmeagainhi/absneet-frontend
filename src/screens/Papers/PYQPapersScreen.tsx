import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';


export default function PYQPapersScreen({ route }: NativeStackScreenProps<RootStackParamList, 'PYQPapers'>) {
    const { subjectId } = route.params;
    const mock = [{ id: 'p1', title: `${subjectId.toUpperCase()} Paper 2023` }, { id: 'p2', title: `${subjectId.toUpperCase()} Paper 2022` }];
    return (
        <View style={{ flex: 1, padding: 16 }}>
            <FlatList data={mock} keyExtractor={p => p.id} renderItem={({ item }) => <Text style={{ padding: 12 }}>{item.title}</Text>} />
        </View>
    );
}