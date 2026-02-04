import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StatusBar,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Linking,
    useWindowDimensions,
    Modal,
    Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/rootnavigator';
import { useTheme } from '../../theme/ThemeContext';

// 🔹 Apps Script config (no change)
const APPS_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycby-ewQdPXa09EeX_HObZzgs4ODyS8AmQ3y4e-kVZbAn-Zneri2OxK6Bc8WGZHV2Qqw/exec';
const APPS_SCRIPT_TOKEN = 'secure@009';

type Props = NativeStackScreenProps<RootStackParamList, 'Help'>;

const ACCENT = '#074e87'; // Primary Blue

type ContactConfig = {
    type?: string;
    supportPhone?: string;
    whatsappPhone?: string;
    supportEmail?: string;
    officeAddress?: string;
    officeHours?: string;
    mapsQueryOverride?: string;
};

export default function HelpScreen({}: Props) {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const scale = Math.min(Math.max(width / 390, 0.9), 1.12);

    const { isDark } = useTheme();
    const styles = useMemo(() => createStyles(isDark), [isDark]);
    const placeholderColor = isDark ? '#6B7280' : '#9CA3AF';

    // 🔹 Contact config from Firestore
    const [contactCfg, setContactCfg] = useState<ContactConfig>({});
    const [contactLoading, setContactLoading] = useState(true);
    const [contactError, setContactError] = useState<string | null>(null);

    // 🔹 Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // 🔹 Custom Modal state
    type ModalType = 'success' | 'error' | 'warning' | 'info';
    type ModalButton = { text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' };
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState<{
        type: ModalType;
        title: string;
        message: string;
        buttons: ModalButton[];
    }>({ type: 'info', title: '', message: '', buttons: [] });
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const showModal = (type: ModalType, title: string, msg: string, buttons: ModalButton[] = [{ text: 'OK' }]) => {
        setModalConfig({ type, title, message: msg, buttons });
        setModalVisible(true);
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
    };

    const hideModal = (callback?: () => void) => {
        Animated.parallel([
            Animated.timing(scaleAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]).start(() => {
            setModalVisible(false);
            callback?.();
        });
    };

    const getModalIcon = (type: ModalType) => {
        switch (type) {
            case 'success': return { name: 'check-circle', color: '#10B981', bg: '#D1FAE5' };
            case 'error': return { name: 'close-circle', color: '#EF4444', bg: '#FEE2E2' };
            case 'warning': return { name: 'alert-circle', color: '#F59E0B', bg: '#FEF3C7' };
            default: return { name: 'information', color: '#3B82F6', bg: '#DBEAFE' };
        }
    };

    // ✅ Subscribe to Firestore `nodes/contactInfo` in real-time
    useEffect(() => {
        const ref = firestore().collection('nodes').doc('contactInfo');

        const unsub = ref.onSnapshot(
            snap => {
                if (snap.exists()) {
                    const data = snap.data() as ContactConfig;
                    setContactCfg(data || {});
                    setContactError(null);
                } else {
                    console.warn('[Help] contactInfo doc not found in nodes collection');
                    setContactError('Contact details not configured yet.');
                }
                setContactLoading(false);
            },
            err => {
                console.error('[Help] Failed to load contact info:', err);
                setContactError('Failed to load contact details.');
                setContactLoading(false);
            },
        );

        return () => unsub();
    }, []);

    // 🔹 Derived values with safe fallbacks
    const supportPhone =
        contactCfg.supportPhone && contactCfg.supportPhone.trim().length > 0
            ? contactCfg.supportPhone.trim()
            : '+91XXXXXXXXXX';

    const whatsappPhone =
        contactCfg.whatsappPhone && contactCfg.whatsappPhone.trim().length > 0
            ? contactCfg.whatsappPhone.trim()
            : supportPhone;

    const supportEmail =
        contactCfg.supportEmail && contactCfg.supportEmail.trim().length > 0
            ? contactCfg.supportEmail.trim()
            : 'support@example.com';

    const officeAddress =
        contactCfg.officeAddress && contactCfg.officeAddress.trim().length > 0
            ? contactCfg.officeAddress.trim()
            : 'ABS Educational Solution, MINI MARKET \nBUILDING, 104-106, BP Rd, beside BASSEIN CATHOLIC BANK, Bhayandar, Venkateshwar Nagar, Bhayandar East, Mumbai, Mira Bhayandar, Maharashtra 401105';

    const officeHours =
        contactCfg.officeHours && contactCfg.officeHours.trim().length > 0
            ? contactCfg.officeHours.trim()
            : '10:00 AM – 7:00 PM (Mon–Sat)';

    const mapQuery = encodeURIComponent(
        (contactCfg.mapsQueryOverride && contactCfg.mapsQueryOverride.trim().length > 0
            ? contactCfg.mapsQueryOverride.trim()
            : officeAddress
        ).replace(/\n/g, ' '),
    );

    const validate = () => {
        const n = name.trim();
        const e = email.trim();
        const m = message.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

        // Check for missing fields and list them
        const missingFields: string[] = [];
        if (!n) missingFields.push('Name');
        if (!e) missingFields.push('Email');
        if (!m) missingFields.push('Message');

        if (missingFields.length > 0) {
            showModal(
                'warning',
                'Required Fields Missing',
                // `Please fill in the following:\n\n• ${missingFields.join('\n• ')}\n\n
                `All fields are required to submit your message.`,
                [{ text: 'Got it' }],
            );
            return false;
        }
        if (!emailOk) {
            showModal(
                'warning',
                'Invalid Email Address',
                'Please enter a valid email address\n(e.g., yourname@example.com)\n\nWe need this to respond to your query.',
                [{ text: 'Fix Email' }],
            );
            return false;
        }
        if (m.length < 10) {
            showModal(
                'info',
                'Message Too Short',
                'Please provide more details about your query so we can assist you better.\n\nMinimum 10 characters required.',
                [{ text: 'Add Details' }],
            );
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            // 1️⃣ Save to Firestore
            const ref = await firestore().collection('contactMessages').add({
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            // 2️⃣ Trigger email via Apps Script
            const payload = {
                token: APPS_SCRIPT_TOKEN,
                name: name.trim(),
                email: email.trim(),
                message: message.trim(),
                docId: ref.id,
                // Enhanced metadata
                platform: Platform.OS,
                osVersion: Platform.Version?.toString() || 'Unknown',
                appName: 'TOP IN EXAM',
                timestamp: new Date().toISOString(),
                subject: `Support Request from ${name.trim()}`,
            };

            const res = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const rawText = await res.text();
            console.log('[Help] Apps Script status =', res.status);
            console.log('[Help] Apps Script raw body =', rawText);

            let j: any = {};
            try {
                j = JSON.parse(rawText);
            } catch (e) {
                console.log('[Help] JSON parse failed:', e);
            }

            if (!j.ok) {
                throw new Error(j.error || 'Email relay failed');
            }

            const userName = name.trim().split(' ')[0];
            setName('');
            setEmail('');
            setMessage('');
            showModal(
                'success',
                'Message Sent Successfully!',
                `Thank you for reaching out, ${userName}!\n\nOur support team has received your message and will respond to your email within 24 hours (Mon-Sat).\n\nFor urgent queries, feel free to call or WhatsApp us.`,
                [{ text: 'Great!' }],
            );
        } catch (err: any) {
            console.error('Contact send error:', err);
            showModal(
                'error',
                'Message Failed',
                'We couldn\'t send your message right now. Please check your internet connection and try again.\n\nAlternatively, you can reach us via call or WhatsApp.',
                [
                    { text: 'Try Again', onPress: handleSubmit },
                    { text: 'OK', style: 'cancel' },
                ],
            );
        } finally {
            setLoading(false);
        }
    };

    const openDialer = () => Linking.openURL(`tel:${supportPhone}`);

    const openWhatsApp = () =>
        Linking.openURL(
            `https://wa.me/${whatsappPhone.replace(
                '+',
                '',
            )}?text=${encodeURIComponent('Hi ABS Team, I need help with...')}`,
        );

    const openEmail = () =>
        Linking.openURL(
            `mailto:${supportEmail}?subject=${encodeURIComponent('Support Request')}`,
        );

    const openMaps = () =>
        Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
        );

    const bottomPad = Math.max(insets.bottom, 10);

    // 🔹 Set white StatusBar immediately on mount
    useEffect(() => {
        StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(isDark ? '#0F172A' : '#FFFFFF');
            StatusBar.setTranslucent(false);
        }
    }, [isDark]);

    // 🔹 Also set white StatusBar when this screen is focused (for tab switches)
    useFocusEffect(
        useCallback(() => {
            StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
            if (Platform.OS === 'android') {
                StatusBar.setBackgroundColor(isDark ? '#0F172A' : '#FFFFFF');
                StatusBar.setTranslucent(false);
            }
        }, [isDark])
    );

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'left', 'right']}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.wrap}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        padding: 16,
                        paddingTop: 12,
                        paddingBottom: bottomPad + 16,
                    }}
                >
                    {/* Screen header */}
                    <View style={styles.screenHeader}>
                        <Text style={[styles.screenTitle, { fontSize: 18 * scale }]}>
                            Help & Support
                        </Text>
                        <Text style={[styles.screenSubtitle, { fontSize: 13 * scale }]}>
                            Got a doubt about admissions, courses or this app? Reach out to us
                            quickly.
                        </Text>
                    </View>

                    {/* Contact info loading/error */}
                    {contactLoading && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <ActivityIndicator size="small" color={ACCENT} />
                            <Text
                                style={[
                                    styles.screenSubtitle,
                                    { marginLeft: 8, fontSize: 12 * scale },
                                ]}
                            >
                                Loading contact details...
                            </Text>
                        </View>
                    )}

                    {contactError && !contactLoading && (
                        <Text
                            style={[
                                styles.screenSubtitle,
                                {
                                    color: '#F97373',
                                    marginBottom: 8,
                                    fontSize: 12 * scale,
                                },
                            ]}
                        >
                            {contactError}
                        </Text>
                    )}

                    {/* Hero / Intro */}
                    <View style={styles.hero}>
                        <View style={styles.heroIconWrap}>
                            <Icon name="headset" size={28 * scale} color={ACCENT} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.heroTitle, { fontSize: 16 * scale }]}>
                                We’re here to help
                            </Text>
                            <Text style={[styles.heroText, { fontSize: 14 * scale }]}>
                                Contact our support team via call, WhatsApp, email or visit our
                                office.
                            </Text>
                        </View>
                    </View>

                    {/* Quick contact actions */}
                    <View style={styles.quickGrid}>
                        <TouchableOpacity
                            style={styles.quickCard}
                            onPress={openDialer}
                            activeOpacity={0.8}
                        >
                            <Icon name="phone" size={22 * scale} color="#fc720a" />
                            <Text style={[styles.quickLabel, { fontSize: 12 * scale }]}>
                                Call
                            </Text>
                            <Text style={[styles.quickValue, { fontSize: 14 * scale }]}>
                                {supportPhone.replace('+91', '+91 ')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickCard}
                            onPress={openWhatsApp}
                            activeOpacity={0.8}
                        >
                            <Icon name="whatsapp" size={22 * scale} color="#fc720a" />
                            <Text style={[styles.quickLabel, { fontSize: 12 * scale }]}>
                                WhatsApp
                            </Text>
                            <Text style={[styles.quickValue, { fontSize: 14 * scale }]}>
                                Chat now
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickCard}
                            onPress={openEmail}
                            activeOpacity={0.8}
                        >
                            <Icon name="email-outline" size={22 * scale} color="#60A5FA" />
                            <Text style={[styles.quickLabel, { fontSize: 12 * scale }]}>
                                Email
                            </Text>
                            <Text
                                style={[styles.quickValue, { fontSize: 14 * scale }]}
                                numberOfLines={1}
                            >
                                {supportEmail}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickCard}
                            onPress={openMaps}
                            activeOpacity={0.8}
                        >
                            <Icon name="map-marker" size={22 * scale} color="#F97373" />
                            <Text style={[styles.quickLabel, { fontSize: 12 * scale }]}>
                                Directions
                            </Text>
                            <Text style={[styles.quickValue, { fontSize: 14 * scale }]}>
                                Open Maps
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={[styles.dividerText, { fontSize: 12 * scale }]}>
                            Send us a message
                        </Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Contact Form */}
                    <View style={styles.formCard}>
                        <View style={styles.inputRow}>
                            <Icon
                                name="account"
                                size={20 * scale}
                                color={placeholderColor}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { fontSize: 16 * scale }]}
                                placeholder="Your Name"
                                placeholderTextColor={placeholderColor}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <Icon
                                name="email"
                                size={20 * scale}
                                color={placeholderColor}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { fontSize: 16 * scale }]}
                                placeholder="Your Email"
                                placeholderTextColor={placeholderColor}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={[styles.inputRow, styles.multilineWrap]}>
                            <Icon
                                name="message-text-outline"
                                size={20 * scale}
                                color={placeholderColor}
                                style={styles.inputIconTop}
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.textarea,
                                    { fontSize: 16 * scale },
                                ]}
                                placeholder="How can we help you?"
                                placeholderTextColor={placeholderColor}
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.9}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <Icon
                                        name="send"
                                        size={18 * scale}
                                        color="#fff"
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text style={[styles.submitText, { fontSize: 16 * scale }]}>
                                        Send Message
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.noteRow}>
                            <Icon
                                name="clock-outline"
                                size={18 * scale}
                                color={placeholderColor}
                            />
                            <Text style={[styles.noteText, { fontSize: 13 * scale }]}>
                                Typical response within 24 hours (Mon–Sat)
                            </Text>
                        </View>
                    </View>

                    {/* Address / Info */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Icon
                                name="office-building-marker"
                                size={20 * scale}
                                color={isDark ? '#E5E7EB' : '#4B5563'}
                            />
                            <Text style={[styles.infoText, { fontSize: 14 * scale }]}>
                                {officeAddress}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon
                                name="calendar-clock"
                                size={20 * scale}
                                color={isDark ? '#E5E7EB' : '#4B5563'}
                            />
                            <Text style={[styles.infoText, { fontSize: 14 * scale }]}>
                                Hours: {officeHours}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* 🔹 Custom Styled Modal */}
            <Modal
                transparent
                visible={modalVisible}
                animationType="none"
                onRequestClose={() => hideModal()}
            >
                <Animated.View
                    style={[
                        styles.modalOverlay,
                        { opacity: opacityAnim },
                    ]}
                >
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        {/* Icon Header */}
                        <View
                            style={[
                                styles.modalIconContainer,
                                { backgroundColor: getModalIcon(modalConfig.type).bg },
                            ]}
                        >
                            <View style={[
                                styles.modalIconCircle,
                                { backgroundColor: getModalIcon(modalConfig.type).color },
                            ]}>
                                <Icon
                                    name={getModalIcon(modalConfig.type).name}
                                    size={32}
                                    color="#FFFFFF"
                                />
                            </View>
                        </View>

                        {/* Content */}
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{modalConfig.title}</Text>
                            <Text style={styles.modalMessage}>{modalConfig.message}</Text>
                        </View>

                        {/* Buttons */}
                        <View style={styles.modalButtonContainer}>
                            {modalConfig.buttons.map((btn, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={[
                                        styles.modalButton,
                                        btn.style === 'cancel' && styles.modalButtonCancel,
                                        btn.style === 'destructive' && styles.modalButtonDestructive,
                                        modalConfig.buttons.length === 1 && { flex: 1 },
                                    ]}
                                    onPress={() => hideModal(btn.onPress)}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.modalButtonText,
                                            btn.style === 'cancel' && styles.modalButtonTextCancel,
                                        ]}
                                    >
                                        {btn.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                </Animated.View>
            </Modal>
        </SafeAreaView>
    );
}
/** Theme-aware + SafeArea-aware styles */
const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: isDark ? '#0F172A' : '#FFFFFF', // white header for light mode
        },
        wrap: {
            flex: 1,
        },

        screenHeader: {
            marginBottom: 12,
        },
        screenTitle: {
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
        },
        screenSubtitle: {
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 2,
        },

        hero: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            padding: 12,
            borderRadius: 14,
            backgroundColor: isDark ? '#020617' : '#EFF6FF',
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#BFDBFE',
        },
        heroIconWrap: {
            width: 44,
            height: 44,
            borderRadius: 999,
            backgroundColor: isDark ? '#111827' : '#DBEAFE',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        },
        heroTitle: {
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
            marginBottom: 2,
        },
        heroText: {
            color: isDark ? '#9CA3AF' : '#4B5563',
        },

        quickGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 16,
        },
        quickCard: {
            flexBasis: '48%',
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 12,
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        quickLabel: {
            color: isDark ? '#9CA3AF' : '#6B7280',
            marginTop: 4,
        },
        quickValue: {
            color: isDark ? '#F9FAFB' : '#111827',
            fontWeight: '600',
            marginTop: 2,
        },

        dividerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 14,
        },
        divider: {
            flex: 1,
            height: 1,
            backgroundColor: isDark ? '#1F2937' : '#E5E7EB',
        },
        dividerText: {
            marginHorizontal: 8,
            color: isDark ? '#9CA3AF' : '#6B7280',
        },

        formCard: {
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderRadius: 14,
            padding: 12,
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
            marginBottom: 16,
        },
        inputRow: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#D1D5DB',
            backgroundColor: isDark ? '#020617' : '#F9FAFB',
            paddingHorizontal: 10,
            marginBottom: 10,
        },
        inputIcon: {
            marginRight: 6,
        },
        inputIconTop: {
            marginRight: 6,
            marginTop: 8,
        },
        input: {
            flex: 1,
            paddingVertical: 10,
            color: isDark ? '#F9FAFB' : '#111827',
        },
        multilineWrap: {
            alignItems: 'flex-start',
        },
        textarea: {
            minHeight: 100,
        },
        submitBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 6,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: ACCENT,
        },
        submitText: {
            color: '#FFFFFF',
            fontWeight: '600',
        },
        noteRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 8,
            gap: 6,
        },
        noteText: {
            color: isDark ? '#9CA3AF' : '#6B7280',
        },

        infoCard: {
            backgroundColor: isDark ? '#020617' : '#FFFFFF',
            borderRadius: 14,
            padding: 12,
            borderWidth: 1,
            borderColor: isDark ? '#1F2937' : '#E5E7EB',
            marginBottom: 16,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 8,
            gap: 8,
        },
        infoText: {
            color: isDark ? '#E5E7EB' : '#374151',
            flex: 1,
        },

        // 🔹 Custom Modal Styles
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
        },
        modalContainer: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            borderRadius: 24,
            width: '100%',
            maxWidth: 340,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 15,
        },
        modalIconContainer: {
            alignItems: 'center',
            paddingVertical: 24,
            paddingHorizontal: 20,
        },
        modalIconCircle: {
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
        },
        modalContent: {
            paddingHorizontal: 24,
            paddingBottom: 20,
            alignItems: 'center',
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: '700',
            color: isDark ? '#F9FAFB' : '#111827',
            textAlign: 'center',
            marginBottom: 12,
        },
        modalMessage: {
            fontSize: 14,
            color: isDark ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
            lineHeight: 22,
        },
        modalButtonContainer: {
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#E5E7EB',
        },
        modalButton: {
            flex: 1,
            paddingVertical: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: ACCENT,
        },
        modalButtonCancel: {
            backgroundColor: isDark ? '#374151' : '#F3F4F6',
        },
        modalButtonDestructive: {
            backgroundColor: '#EF4444',
        },
        modalButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
        },
        modalButtonTextCancel: {
            color: isDark ? '#D1D5DB' : '#4B5563',
        },
    });
