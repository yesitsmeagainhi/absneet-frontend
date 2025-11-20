// import React from 'react';
// import { View, Text } from 'react-native';
// export default function HelpScreen() { return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>Help</Text></View>; }
// src/screens/Help/HelpScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Linking,
    useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/rootnavigator'; // keep as in your project

// --------- Admin contact shown in the UI ----------
const PHONE = '+91XXXXXXXXXX';
const EMAIL = 'support@example.com';
const ADDRESS_LINE =
    'ABS Educational Solution, MINI MARKET \nBUILDING, 104-106, BP Rd, beside BASSEIN CATHOLIC BANK, Bhayandar, Venkateshwar Nagar, Bhayandar East, Mumbai, Mira Bhayandar, Maharashtra 401105';
const MAP_Q = encodeURIComponent(ADDRESS_LINE);

// 🔹 Apps Script config (fill with your real values)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/...';
const APPS_SCRIPT_TOKEN = '';

type Props = NativeStackScreenProps<RootStackParamList, 'Help'>;

const ACCENT = '#6D28D9';

export default function HelpScreen({ }: Props) {
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const scale = Math.min(Math.max(width / 390, 0.9), 1.12);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const n = name.trim();
        const e = email.trim();
        const m = message.trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

        if (!n || !e || !m) {
            Alert.alert('Missing info', 'Please fill all fields.');
            return false;
        }
        if (!emailOk) {
            Alert.alert('Invalid email', 'Please enter a valid email address.');
            return false;
        }
        if (m.length < 10) {
            Alert.alert('Message too short', 'Please add a few more details.');
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
            };

            const res = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const j = await res.json().catch(() => ({}));
            if (!j.ok) throw new Error(j.error || 'Email relay failed');

            setName('');
            setEmail('');
            setMessage('');
            Alert.alert(
                '✅ Message Sent',
                'Your message has been emailed to our support team.',
            );
        } catch (err: any) {
            console.error('Contact send error:', err);
            Alert.alert('Failed', String(err?.message || err));
        } finally {
            setLoading(false);
        }
    };

    const openDialer = () => Linking.openURL(`tel:${PHONE}`);
    const openWhatsApp = () =>
        Linking.openURL(
            `https://wa.me/${PHONE.replace(
                '+',
                '',
            )}?text=${encodeURIComponent('Hi ABS Team, I need help with...')}`,
        );
    const openEmail = () =>
        Linking.openURL(
            `mailto:${EMAIL}?subject=${encodeURIComponent('Support Request')}`,
        );
    const openMaps = () =>
        Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${MAP_Q}`,
        );

    const bottomPad = Math.max(insets.bottom, 10);

    return (
        <SafeAreaView style={styles.wrap}>
            <StatusBar barStyle="light-content" backgroundColor="#020617" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
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
                            <Icon name="phone" size={22 * scale} color="#22C55E" />
                            <Text style={[styles.quickLabel, { fontSize: 12 * scale }]}>
                                Call
                            </Text>
                            <Text style={[styles.quickValue, { fontSize: 14 * scale }]}>
                                {PHONE.replace('+91', '+91 ')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickCard}
                            onPress={openWhatsApp}
                            activeOpacity={0.8}
                        >
                            <Icon name="whatsapp" size={22 * scale} color="#22C55E" />
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
                            <Icon
                                name="email-outline"
                                size={22 * scale}
                                color="#60A5FA"
                            />
                            <Text style={[styles.quickLabel, { fontSize: 12 * scale }]}>
                                Email
                            </Text>
                            <Text
                                style={[styles.quickValue, { fontSize: 14 * scale }]}
                                numberOfLines={1}
                            >
                                {EMAIL}
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
                                color="#9CA3AF"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { fontSize: 16 * scale }]}
                                placeholder="Your Name"
                                placeholderTextColor="#6B7280"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <Icon
                                name="email"
                                size={20 * scale}
                                color="#9CA3AF"
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={[styles.input, { fontSize: 16 * scale }]}
                                placeholder="Your Email"
                                placeholderTextColor="#6B7280"
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
                                color="#9CA3AF"
                                style={styles.inputIconTop}
                            />
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.textarea,
                                    { fontSize: 16 * scale },
                                ]}
                                placeholder="How can we help you?"
                                placeholderTextColor="#6B7280"
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
                                    <Text
                                        style={[styles.submitText, { fontSize: 16 * scale }]}
                                    >
                                        Send Message
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <View style={styles.noteRow}>
                            <Icon
                                name="clock-outline"
                                size={18 * scale}
                                color="#9CA3AF"
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
                                color="#E5E7EB"
                            />
                            <Text style={[styles.infoText, { fontSize: 14 * scale }]}>
                                {ADDRESS_LINE}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Icon
                                name="calendar-clock"
                                size={20 * scale}
                                color="#E5E7EB"
                            />
                            <Text style={[styles.infoText, { fontSize: 14 * scale }]}>
                                Hours: 10:00 AM – 7:00 PM (Mon–Sat)
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flex: 1,
        backgroundColor: '#020617', // dark like Home / News
    },

    screenHeader: {
        marginBottom: 12,
    },
    screenTitle: {
        fontWeight: '700',
        color: '#F9FAFB',
    },
    screenSubtitle: {
        color: '#9CA3AF',
        marginTop: 2,
    },

    hero: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        padding: 12,
        borderRadius: 14,
        backgroundColor: '#020617',
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    heroIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 999,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    heroTitle: {
        fontWeight: '700',
        color: '#F9FAFB',
        marginBottom: 2,
    },
    heroText: {
        color: '#9CA3AF',
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
        backgroundColor: '#020617',
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    quickLabel: {
        color: '#9CA3AF',
        marginTop: 4,
    },
    quickValue: {
        color: '#F9FAFB',
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
        backgroundColor: '#1F2937',
    },
    dividerText: {
        marginHorizontal: 8,
        color: '#9CA3AF',
    },

    formCard: {
        backgroundColor: '#020617',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#1F2937',
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#1F2937',
        backgroundColor: '#020617',
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
        color: '#F9FAFB',
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
        color: '#9CA3AF',
    },

    infoCard: {
        backgroundColor: '#020617',
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: '#1F2937',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 8,
    },
    infoText: {
        color: '#E5E7EB',
        flex: 1,
    },
});
