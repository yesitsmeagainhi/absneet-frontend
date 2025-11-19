import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';


export default function ResultScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Result'>) {
    const { correct, total } = route.params;
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <Text>Score: {correct} / {total}</Text>
            <Button title="Review Answers" onPress={() => { /* TODO: implement review */ }} />
            <Button title="Back to Home" onPress={() => navigation.popToTop()} />
        </View>
    );
}