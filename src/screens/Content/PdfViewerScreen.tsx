// src/screens/PDFViewerScreen.tsx
import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';

import { RootStackParamList } from '../../navigation/rootnavigator';
import { useTheme } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PDFViewer'>;

export default function PDFViewerScreen({ route }: Props) {
    const { title, url } = route.params;
    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);

    // If direct PDF loading has issues on Android, you can wrap with Google Docs:
    // const uri = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
    const uri = url;

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri }}
                style={{ flex: 1 }}
                startInLoadingState
                renderLoading={() => (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={isDark ? '#E5E7EB' : '#4B5563'} />
                    </View>
                )}
            />
        </View>
    );
}

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#020617' : '#F9FAFB',
        },
        loader: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#020617' : '#F9FAFB',
        },
    });
