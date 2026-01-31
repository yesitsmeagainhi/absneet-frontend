// src/screens/Home/NotificationsScreen.tsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar,
    Platform,
    RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';

import { RootStackParamList } from '../../navigation/rootnavigator';
import { useTheme, Colors } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export type NotificationItem = {
    id: string;
    title: string;
    body: string;
    type: 'info' | 'success' | 'warning' | 'promo';
    read: boolean;
    createdAt: Date;
    data?: Record<string, any>;
};

export default function NotificationsScreen({ navigation }: Props) {
    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Set blue StatusBar
    useEffect(() => {
        StatusBar.setBarStyle('light-content');
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(isDark ? '#0F172A' : Colors.primary);
            StatusBar.setTranslucent(false);
        }
    }, [isDark]);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle('light-content');
            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(isDark ? '#0F172A' : Colors.primary);
                StatusBar.setTranslucent(false);
            }
        }, [isDark])
    );

    // Load notifications from Firestore
    useEffect(() => {
        setLoading(true);

        const unsubscribe = firestore()
            .collection('notifications')
            .orderBy('createdAt', 'desc')
            .limit(50)
            .onSnapshot(
                snapshot => {
                    const items: NotificationItem[] = snapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            title: data.title ?? 'Notification',
                            body: data.body ?? '',
                            type: data.type ?? 'info',
                            read: data.read ?? false,
                            createdAt: data.createdAt?.toDate() ?? new Date(),
                            data: data.data,
                        };
                    });
                    setNotifications(items);
                    setLoading(false);
                    setRefreshing(false);
                },
                error => {
                    console.error('[NotificationsScreen] Error loading:', error);
                    setLoading(false);
                    setRefreshing(false);
                }
            );

        return () => unsubscribe();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        // The onSnapshot will automatically update
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await firestore()
                .collection('notifications')
                .doc(notificationId)
                .update({ read: true });
        } catch (error) {
            console.error('[NotificationsScreen] Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const batch = firestore().batch();
            const unreadDocs = await firestore()
                .collection('notifications')
                .where('read', '==', false)
                .get();

            unreadDocs.docs.forEach(doc => {
                batch.update(doc.ref, { read: true });
            });

            await batch.commit();
        } catch (error) {
            console.error('[NotificationsScreen] Error marking all as read:', error);
        }
    };

    const getIconForType = (type: NotificationItem['type']) => {
        switch (type) {
            case 'success':
                return { name: 'check-circle', color: '#22C55E' };
            case 'warning':
                return { name: 'alert-circle', color: '#F59E0B' };
            case 'promo':
                return { name: 'tag', color: Colors.accent };
            default:
                return { name: 'information', color: Colors.primary };
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const icon = getIconForType(item.type);

        return (
            <TouchableOpacity
                style={[styles.notificationCard, !item.read && styles.unreadCard]}
                activeOpacity={0.7}
                onPress={() => {
                    if (!item.read) {
                        markAsRead(item.id);
                    }
                }}
            >
                <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
                    <Icon name={icon.name} size={24} color={icon.color} />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title} numberOfLines={1}>
                            {item.title}
                        </Text>
                        {!item.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.body} numberOfLines={2}>
                        {item.body}
                    </Text>
                    <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading notifications...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-left" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    {unreadCount > 0 && (
                        <TouchableOpacity
                            style={styles.markAllButton}
                            onPress={markAllAsRead}
                        >
                            <Text style={styles.markAllText}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {notifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon
                            name="bell-off-outline"
                            size={64}
                            color={isDark ? '#4B5563' : '#D1D5DB'}
                        />
                        <Text style={styles.emptyTitle}>No notifications</Text>
                        <Text style={styles.emptyText}>
                            You're all caught up! Check back later for updates.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor={Colors.primary}
                                colors={[Colors.primary]}
                            />
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: isDark ? '#0F172A' : Colors.primary,
        },
        container: {
            flex: 1,
            backgroundColor: isDark ? '#020617' : '#F3F4F6',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? '#0F172A' : Colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        backButton: {
            padding: 4,
            marginRight: 12,
        },
        headerTitle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '700',
            color: '#FFFFFF',
        },
        markAllButton: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 16,
        },
        markAllText: {
            fontSize: 12,
            fontWeight: '600',
            color: '#FFFFFF',
        },
        centered: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#020617' : '#F3F4F6',
        },
        loadingText: {
            marginTop: 12,
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        listContent: {
            padding: 16,
            paddingBottom: 32,
        },
        notificationCard: {
            flexDirection: 'row',
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#E5E7EB',
        },
        unreadCard: {
            borderLeftWidth: 3,
            borderLeftColor: Colors.primary,
        },
        iconContainer: {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        contentContainer: {
            flex: 1,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
        },
        title: {
            flex: 1,
            fontSize: 15,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#111827',
        },
        unreadDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: Colors.accent,
            marginLeft: 8,
        },
        body: {
            fontSize: 13,
            color: isDark ? '#D1D5DB' : '#4B5563',
            lineHeight: 18,
            marginBottom: 6,
        },
        time: {
            fontSize: 11,
            color: isDark ? '#9CA3AF' : '#9CA3AF',
        },
        emptyContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#111827',
            marginTop: 16,
        },
        emptyText: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
            marginTop: 8,
        },
    });
