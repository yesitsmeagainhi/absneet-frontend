// src/components/NotificationBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
    count: number;
    size?: 'dot' | 'small' | 'medium';
    style?: object;
};

export default function NotificationBadge({ count, size = 'dot', style }: Props) {
    if (count <= 0) return null;

    // For dot size, just show a simple dot without count
    if (size === 'dot') {
        return (
            <View style={[styles.badge, styles.badgeDot, style]} />
        );
    }

    const isSmall = size === 'small';
    const displayCount = count > 99 ? '99+' : count.toString();

    return (
        <View
            style={[
                styles.badge,
                isSmall ? styles.badgeSmall : styles.badgeMedium,
                count > 9 && styles.badgeWide,
                style,
            ]}
        >
            <Text style={[styles.text, isSmall ? styles.textSmall : styles.textMedium]}>
                {displayCount}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeDot: {
        top: 6,
        right: 8,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#EEF2FF',
    },
    badgeSmall: {
        top: -4,
        right: -4,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    badgeMedium: {
        top: -6,
        right: -6,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    badgeWide: {
        paddingHorizontal: 6,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    textSmall: {
        fontSize: 10,
    },
    textMedium: {
        fontSize: 12,
    },
});
