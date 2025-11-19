import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/rootnavigator';


export default function SignUpScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'SignUp'>) {
    const [number, setNumber] = useState('');
    const [pass, setPass] = useState('');
    const [edu, setEdu] = useState('');
    const [city, setCity] = useState('');


    return (
        <View style={styles.c}>
            <TextInput placeholder="Number" style={styles.inp} value={number} onChangeText={setNumber} />
            <TextInput placeholder="Pass" style={styles.inp} secureTextEntry value={pass} onChangeText={setPass} />
            <TextInput placeholder="Current Education" style={styles.inp} value={edu} onChangeText={setEdu} />
            <TextInput placeholder="City" style={styles.inp} value={city} onChangeText={setCity} />
            <Button title="Create Account" onPress={() => navigation.replace('HomeTabs')} />
        </View>
    );
}
const styles = StyleSheet.create({ c: { flex: 1, padding: 16, gap: 12, justifyContent: 'center' }, inp: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12 } });