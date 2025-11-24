// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/rootnavigator';


// export default function LoginScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) {
//     const [number, setNumber] = useState('');
//     const [pass, setPass] = useState('');


//     return (
//         <View style={styles.c}>
//             <TextInput placeholder="Number" style={styles.inp} keyboardType="phone-pad" value={number} onChangeText={setNumber} />
//             <TextInput placeholder="Pass" style={styles.inp} secureTextEntry value={pass} onChangeText={setPass} />
//             <Button title="Login" onPress={() => navigation.replace('HomeTabs')} />
//             <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ marginTop: 8 }}>
//                 <Text>Sign Up</Text>
//             </TouchableOpacity>
//         </View>
//     );
// }
// const styles = StyleSheet.create({ c: { flex: 1, padding: 16, gap: 12, justifyContent: 'center' }, inp: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12 } });

// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/rootnavigator';

// 🔹 Firestore instance (same as SignUpScreen)
import { db } from '../../services/firebase.native';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [number, setNumber] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const mobile = number.trim();
        const password = pass.trim();

        if (!mobile || !password) {
            Alert.alert('Missing details', 'Please enter both mobile number and password.');
            return;
        }

        try {
            setLoading(true);

            // 🔎 Look for a user in the "authentication" collection
            const snap = await db
                .collection('authentication')
                .where('mobile', '==', mobile)
                .where('password', '==', password) // ⚠️ plain-text only for demo
                .limit(1)
                .get();

            if (snap.empty) {
                Alert.alert('Login failed', 'Invalid mobile number or password.');
                return;
            }

            // ✅ User found – you can also read profile with snap.docs[0].data()
            navigation.replace('HomeTabs');
        } catch (err: any) {
            console.warn('Login Firestore error:', err);
            Alert.alert(
                'Login error',
                err?.message || 'Something went wrong while logging you in.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            {/* Top colored header strip */}
            <View style={styles.headerStrip}>
                <Text style={styles.appTitle}>ABS NEET</Text>
                <Text style={styles.appSubtitle}>Focused NEET Practice App</Text>
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.card}>
                        <Text style={styles.heading}>Welcome back 👋</Text>
                        <Text style={styles.subheading}>
                            Login to continue your NEET preparation journey.
                        </Text>

                        {/* Mobile number */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                                placeholder="Enter your number"
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                                keyboardType="phone-pad"
                                value={number}
                                onChangeText={setNumber}
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                placeholder="Enter password"
                                placeholderTextColor="#9CA3AF"
                                style={styles.input}
                                secureTextEntry
                                value={pass}
                                onChangeText={setPass}
                            />
                        </View>

                        {/* Login button */}
                        <Pressable
                            onPress={handleLogin}
                            disabled={loading}
                            style={({ pressed }) => [
                                styles.primaryBtn,
                                pressed && !loading && styles.primaryBtnPressed,
                                loading && styles.primaryBtnDisabled,
                            ]}
                        >
                            {loading ? (
                                <ActivityIndicator color="#F9FAFB" />
                            ) : (
                                <Text style={styles.primaryBtnText}>Login</Text>
                            )}
                        </Pressable>

                        {/* Bottom link */}
                        <View style={styles.bottomRow}>
                            <Text style={styles.bottomText}>New to ABS NEET?</Text>
                            <Pressable onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.linkText}>Create account</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const GREEN = '#22C55E';
const PURPLE = '#4F46E5';

const styles = StyleSheet.create({
    flex: { flex: 1 },
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F7', // soft light grey / white
    },
    headerStrip: {
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: PURPLE,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    appTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    appSubtitle: {
        fontSize: 12,
        color: '#E5E7EB',
        marginTop: 4,
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingTop: 18,
        paddingBottom: 28,
        justifyContent: 'center',
    },

    card: {
        borderRadius: 18,
        padding: 18,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    subheading: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 4,
        marginBottom: 18,
    },

    fieldGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        color: '#111827',
        fontSize: 13,
        backgroundColor: '#F9FAFB',
    },

    primaryBtn: {
        marginTop: 10,
        borderRadius: 999,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: PURPLE,
    },
    primaryBtnPressed: {
        backgroundColor: '#4338CA',
    },
    primaryBtnDisabled: {
        opacity: 0.6,
    },
    primaryBtnText: {
        color: '#F9FAFB',
        fontWeight: '600',
        fontSize: 14,
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        gap: 4,
    },
    bottomText: {
        fontSize: 12,
        color: '#6B7280',
    },
    linkText: {
        fontSize: 12,
        fontWeight: '600',
        color: GREEN,
    },
});
