import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


export default function SubjectChip({ label, onPress }: { label: string; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.chip} onPress={onPress}><Text>{label}</Text></TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    chip: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        minWidth: 72,
        alignItems: 'center',
        marginRight: 12,
    },
});