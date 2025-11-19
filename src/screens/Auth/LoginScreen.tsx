import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/rootnavigator';


export default function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) {
    const [number, setNumber] = useState('');
    const [pass, setPass] = useState('');


    return (
        <View style={styles.c}>
            <TextInput placeholder="Number" style={styles.inp} keyboardType="phone-pad" value={number} onChangeText={setNumber} />
            <TextInput placeholder="Pass" style={styles.inp} secureTextEntry value={pass} onChangeText={setPass} />
            <Button title="Login" onPress={() => navigation.replace('HomeTabs')} />
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ marginTop: 8 }}>
                <Text>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({ c: { flex: 1, padding: 16, gap: 12, justifyContent: 'center' }, inp: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12 } });