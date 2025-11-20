import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
    label: string;
    onPress: () => void;
};

export default function SubjectChip({ label, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.chip} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    chip: {
        paddingHorizontal: 34,
        paddingVertical: 10,
        borderRadius: 999,
        backgroundColor: '#000000',  // solid black
        marginRight: 8,
        borderWidth: 1,              // white border
        borderColor: '#FFFFFF',
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',            // white text
    },
});
