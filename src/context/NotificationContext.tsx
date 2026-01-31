// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import firestore from '@react-native-firebase/firestore';

type NotificationContextValue = {
    unreadCount: number;
    loading: boolean;
    refreshCount: () => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Subscribe to unread notifications count
        const unsubscribe = firestore()
            .collection('notifications')
            .where('read', '==', false)
            .onSnapshot(
                snapshot => {
                    setUnreadCount(snapshot.size);
                    setLoading(false);
                },
                error => {
                    console.error('[NotificationContext] Error:', error);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, []);

    const refreshCount = () => {
        // The onSnapshot listener will automatically update
        // This is just a placeholder for manual refresh if needed
    };

    return (
        <NotificationContext.Provider value={{ unreadCount, loading, refreshCount }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used inside NotificationProvider');
    }
    return context;
}
