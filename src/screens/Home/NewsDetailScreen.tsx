// src/screens/Home/NewsDetailScreen.tsx
import React, { useMemo, useEffect, useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    StatusBar,
    Platform,
    TouchableOpacity,
    useWindowDimensions,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RootStackParamList } from '../../navigation/rootnavigator';
import { useTheme, Colors } from '../../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;

export default function NewsDetailScreen({ route, navigation }: Props) {
    const { news } = route.params;
    const { isDark } = useTheme();
    const { width: screenWidth } = useWindowDimensions();
    const styles = useMemo(() => createStyles(isDark, screenWidth), [isDark, screenWidth]);

    // Image loading state
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    // Set white StatusBar for this screen
    useEffect(() => {
        StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(isDark ? '#0F172A' : '#FFFFFF');
            StatusBar.setTranslucent(false);
        }
    }, [isDark]);

    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(isDark ? '#0F172A' : '#FFFFFF');
                StatusBar.setTranslucent(false);
            }
        }, [isDark])
    );

    const coverImage = news.coverUrl || news.bannerUrl;
    const formattedDate = news.createdAt
        ? new Date(news.createdAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : '';

    // Get full content - prioritize content, then summary, then excerpt
    const fullContent = news.content || news.summary || news.excerpt || '';

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-left" size={24} color={isDark ? '#F9FAFB' : '#111827'} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>News</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Cover Image - Full Width */}
                    {coverImage && !imageError ? (
                        <View style={styles.imageContainer}>
                            {imageLoading && (
                                <View style={styles.imageLoader}>
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                </View>
                            )}
                            <Image
                                source={{ uri: coverImage }}
                                style={styles.coverImage}
                                onLoadStart={() => setImageLoading(true)}
                                onLoadEnd={() => setImageLoading(false)}
                                onError={() => {
                                    setImageLoading(false);
                                    setImageError(true);
                                }}
                            />
                        </View>
                    ) : (
                        <View style={styles.coverPlaceholder}>
                            <Icon name="newspaper-variant-outline" size={48} color={isDark ? '#4B5563' : '#D1D5DB'} />
                            <Text style={styles.coverPlaceholderText}>NEWS</Text>
                        </View>
                    )}

                    {/* Content Section */}
                    <View style={styles.contentSection}>
                        {/* Date & Author Row */}
                        <View style={styles.metaRow}>
                            {formattedDate && (
                                <View style={styles.dateChip}>
                                    <Icon name="calendar" size={14} color={Colors.primary} />
                                    <Text style={styles.dateText}>{formattedDate}</Text>
                                </View>
                            )}
                            {news.author && (
                                <View style={styles.authorChip}>
                                    <Icon name="account" size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
                                    <Text style={styles.authorText}>{news.author}</Text>
                                </View>
                            )}
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>{news.title}</Text>

                        {/* Subtitle */}
                        {news.subtitle && (
                            <Text style={styles.subtitle}>{news.subtitle}</Text>
                        )}

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Full Content */}
                        {fullContent ? (
                            <Text style={styles.content}>{fullContent}</Text>
                        ) : (
                            <Text style={styles.noContent}>No additional content available.</Text>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (isDark: boolean, screenWidth: number) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
        },
        container: {
            flex: 1,
            backgroundColor: isDark ? '#020617' : '#F3F4F6',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1E293B' : '#E5E7EB',
        },
        backButton: {
            padding: 4,
            marginRight: 12,
        },
        headerTitle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '600',
            color: isDark ? '#F9FAFB' : '#111827',
        },
        headerSpacer: {
            width: 36,
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingBottom: 32,
        },
        imageContainer: {
            width: screenWidth,
            minHeight: 200,
            maxHeight: 350,
            backgroundColor: isDark ? '#1E293B' : '#E5E7EB',
        },
        imageLoader: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#1E293B' : '#E5E7EB',
            zIndex: 1,
        },
        coverImage: {
            width: screenWidth,
            height: undefined,
            minHeight: 200,
            maxHeight: 350,
            aspectRatio: 16 / 9,
            resizeMode: 'contain',
            backgroundColor: isDark ? '#0F172A' : '#F3F4F6',
        },
        coverPlaceholder: {
            width: '100%',
            height: 180,
            backgroundColor: isDark ? '#1E293B' : '#E5E7EB',
            alignItems: 'center',
            justifyContent: 'center',
        },
        coverPlaceholderText: {
            fontSize: 16,
            fontWeight: '700',
            color: isDark ? '#4B5563' : '#9CA3AF',
            marginTop: 8,
        },
        contentSection: {
            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
            marginHorizontal: 0,
            marginTop: 0,
            padding: 20,
        },
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 12,
        },
        dateChip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: isDark ? '#0F172A' : '#EFF6FF',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
        },
        dateText: {
            fontSize: 12,
            fontWeight: '600',
            color: Colors.primary,
        },
        authorChip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        authorText: {
            fontSize: 13,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },
        title: {
            fontSize: 22,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
            lineHeight: 30,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 16,
            color: isDark ? '#D1D5DB' : '#4B5563',
            lineHeight: 24,
            marginBottom: 12,
        },
        divider: {
            height: 1,
            backgroundColor: isDark ? '#334155' : '#E5E7EB',
            marginVertical: 16,
        },
        content: {
            fontSize: 16,
            color: isDark ? '#E5E7EB' : '#374151',
            lineHeight: 26,
        },
        noContent: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
            fontStyle: 'italic',
            textAlign: 'center',
            paddingVertical: 20,
        },
    });
