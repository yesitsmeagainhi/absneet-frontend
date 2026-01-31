// src/screens/PDFViewerScreen.tsx
import React, { useMemo, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootStackParamList } from '../../navigation/rootnavigator';
import { useTheme, Colors } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PDFViewer'>;

// JavaScript to inject to disable downloads and right-click
const INJECTED_JS = `
(function() {
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Disable long press on mobile
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Hide download buttons in Google Docs viewer
    var style = document.createElement('style');
    style.innerHTML = \`
        /* Hide download/print buttons in Google Docs Viewer */
        .ndfHFb-c4YZDc-Wrber,
        .ndfHFb-c4YZDc-to915-LgbsSe,
        [aria-label="Download"],
        [aria-label="Print"],
        [data-tooltip="Download"],
        [data-tooltip="Print"],
        .goog-toolbar-button[aria-label*="download" i],
        .goog-toolbar-button[aria-label*="print" i],
        #download-button,
        #print-button,
        .download-button,
        .print-button {
            display: none !important;
            visibility: hidden !important;
        }

        /* For Google Drive embedded viewer */
        .drive-viewer-actions,
        [data-tooltip="Open in new window"],
        [aria-label="Open in new window"] {
            display: none !important;
        }
    \`;
    document.head.appendChild(style);

    // Disable keyboard shortcuts for download/print
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'P' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }
    });

    true;
})();
`;

export default function PDFViewerScreen({ route }: Props) {
    const { title, url } = route.params;
    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);
    const webViewRef = useRef<WebView>(null);

    // Convert URL to Google Docs Viewer URL for inline viewing
    const getViewerUrl = (pdfUrl: string): string => {
        // Check if it's already a Google Drive URL
        if (pdfUrl.includes('drive.google.com')) {
            // Extract file ID from various Google Drive URL formats
            let fileId = '';

            if (pdfUrl.includes('/file/d/')) {
                const match = pdfUrl.match(/\/file\/d\/([^\/\?]+)/);
                if (match) fileId = match[1];
            } else if (pdfUrl.includes('id=')) {
                const match = pdfUrl.match(/id=([^&]+)/);
                if (match) fileId = match[1];
            }

            if (fileId) {
                // Use Google Drive preview URL (no download option)
                return `https://drive.google.com/file/d/${fileId}/preview`;
            }
        }

        // For other URLs, use Google Docs Viewer
        return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;
    };

    const viewerUri = getViewerUrl(url);

    return (
        <View style={styles.container}>
            {/* Header with title */}
            {/* <View style={styles.header}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {title || 'PDF Viewer'}
                </Text>
                <Text style={styles.headerSubtitle}>View Only Mode</Text>
            </View> */}

            {/* PDF WebView */}
            <WebView
                ref={webViewRef}
                source={{ uri: viewerUri }}
                style={{ flex: 1 }}
                startInLoadingState
                javaScriptEnabled={true}
                domStorageEnabled={true}
                injectedJavaScript={INJECTED_JS}
                onMessage={() => {}} // Required for injectedJavaScript
                allowsFullscreenVideo={false}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={true}
                // Disable file downloads
                onShouldStartLoadWithRequest={(request) => {
                    // Block download URLs
                    if (request.url.includes('/uc?') && request.url.includes('export=download')) {
                        return false;
                    }
                    if (request.url.includes('download') && !request.url.includes('docs.google.com')) {
                        return false;
                    }
                    return true;
                }}
                renderLoading={() => (
                    <View style={styles.loader}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loaderText}>Loading PDF...</Text>
                    </View>
                )}
                renderError={() => (
                    <View style={styles.errorContainer}>
                        <Icon name="file-pdf-box" size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
                        <Text style={styles.errorTitle}>Unable to load PDF</Text>
                        <Text style={styles.errorText}>
                            The PDF could not be displayed. Please check your internet connection.
                        </Text>
                        <Pressable
                            style={styles.retryButton}
                            onPress={() => webViewRef.current?.reload()}
                        >
                            <Icon name="refresh" size={18} color="#FFFFFF" />
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </Pressable>
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
        header: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1E293B' : '#E5E7EB',
        },
        headerTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#111827',
        },
        headerSubtitle: {
            fontSize: 12,
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 2,
        },
        loader: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#020617' : '#F9FAFB',
        },
        loaderText: {
            marginTop: 12,
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        errorContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            backgroundColor: isDark ? '#020617' : '#F9FAFB',
        },
        errorTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#111827',
            marginTop: 16,
        },
        errorText: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
            marginTop: 8,
            marginBottom: 20,
        },
        retryButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 10,
            gap: 8,
        },
        retryButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#FFFFFF',
        },
    });
