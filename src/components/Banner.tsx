import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function Banner({ title }: { title: string }) {
    return (
        <View style={styles.banner}><Text style={styles.txt}>{title}</Text></View>
    );
}
const styles = StyleSheet.create({
    banner: { backgroundColor: '#E4D5FF', padding: 16, borderRadius: 12, marginVertical: 8 },
    txt: { fontWeight: '600' },
});