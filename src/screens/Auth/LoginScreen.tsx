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
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/rootnavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// ✅ Firebase Auth (React Native Firebase)
import auth from '@react-native-firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type FormErrors = {
    number?: string;
    pass?: string;
};

export default function LoginScreen({ navigation }: Props) {
    const [number, setNumber] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [showPass, setShowPass] = useState(false);

    const validate = (): boolean => {
        const trimmedNumber = number.trim();
        const trimmedPass = pass.trim();
        const newErrors: FormErrors = {};

        // 🔹 Mobile validation
        if (!trimmedNumber) {
            newErrors.number = 'Mobile number is required.';
        } else if (!/^\d+$/.test(trimmedNumber)) {
            newErrors.number = 'Mobile number should contain only digits.';
        } else if (trimmedNumber.length !== 10) {
            newErrors.number = 'Mobile number must be exactly 10 digits.';
        }

        // 🔹 Password validation
        if (!trimmedPass) {
            newErrors.pass = 'Password is required.';
        } else if (trimmedPass.length < 6) {
            newErrors.pass = 'Password should be at least 6 characters.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const hasMultiple = Object.keys(newErrors).length > 1;
            const firstErrorMsg =
                newErrors.number || newErrors.pass || 'Please check your details.';

            setGlobalError(
                hasMultiple
                    ? 'Input fields are missing or incorrect!'
                    : firstErrorMsg,
            );
            return false;
        }

        setGlobalError(null);
        return true;
    };
    const handleLogin = async () => {
        if (!validate()) return;

        const mobile = number.trim();
        const password = pass.trim();

        // ✅ Create a synthetic email from mobile for email/password auth
        const email = `${mobile}@absneet.app`;

        try {
            setLoading(true);
            setGlobalError(null);

            // ✅ Sign in using Firebase Auth
            await auth().signInWithEmailAndPassword(email, password);

            // ❌ NO navigation.reset / navigate here.
            // RootNavigator's onAuthStateChanged will set `user`
            // and automatically render the HomeTabs stack.
        } catch (err: any) {
            console.warn('Login FirebaseAuth error:', err);

            let msg =
                'Something went wrong while logging you in. Please try again.';

            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                msg = 'Invalid mobile number or password. Please check your details.';
                setErrors(prev => ({
                    ...prev,
                    pass: 'Invalid mobile number or password.',
                }));
            } else if (err.code === 'auth/too-many-requests') {
                msg = 'Too many attempts. Please wait a few minutes and try again.';
            }

            setGlobalError(msg);
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

                        {/* Global error banner */}
                        {globalError && (
                            <View style={styles.globalErrorBox}>
                                <Text style={styles.globalErrorText}>{globalError}</Text>
                            </View>
                        )}

                        {/* Mobile number */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                                placeholder="Enter your 10-digit number"
                                placeholderTextColor="#9CA3AF"
                                style={[
                                    styles.input,
                                    errors.number && styles.inputError,
                                ]}
                                keyboardType="number-pad"
                                maxLength={10}
                                value={number}
                                onChangeText={txt => {
                                    const onlyDigits = txt.replace(/[^0-9]/g, '');
                                    setNumber(onlyDigits);
                                    if (errors.number) {
                                        setErrors(prev => ({ ...prev, number: undefined }));
                                    }
                                    if (globalError) setGlobalError(null);
                                }}
                            />
                            {!!errors.number && (
                                <Text style={styles.errorText}>{errors.number}</Text>
                            )}
                        </View>

                        {/* Password */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Password</Text>

                            <View style={styles.passwordRow}>
                                <TextInput
                                    placeholder="Create a password (min 6 characters)"
                                    placeholderTextColor="#9CA3AF"
                                    style={[
                                        styles.input,
                                        styles.passwordInput,
                                        errors.pass && styles.inputError,
                                    ]}
                                    secureTextEntry={!showPass}   // 👈 toggle here
                                    autoCapitalize="none"
                                    value={pass}
                                    onChangeText={txt => {
                                        setPass(txt);
                                        if (errors.pass) {
                                            setErrors(prev => ({ ...prev, pass: undefined }));
                                        }
                                    }}
                                />

                                <Pressable
                                    onPress={() => setShowPass(prev => !prev)}
                                    style={styles.eyeButton}
                                    hitSlop={10}
                                >
                                    <Icon
                                        name={showPass ? 'eye-off-outline' : 'eye-outline'}
                                        size={20}
                                        color="#6B7280"
                                    />
                                </Pressable>
                            </View>

                            {!!errors.pass && (
                                <Text style={styles.errorText}>{errors.pass}</Text>
                            )}
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

    // global error banner
    globalErrorBox: {
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    globalErrorText: {
        fontSize: 12,
        color: '#B91C1C',
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
    inputError: {
        borderColor: '#F97373',
    },
    errorText: {
        marginTop: 4,
        fontSize: 11,
        color: '#DC2626',
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
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        paddingRight: 40, // space so text doesn't go under the eye icon
    },
    eyeButton: {
        position: 'absolute',
        right: 10,
        padding: 4,
    },
});
