// src/screens/Auth/LoginScreen.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Animated,
  Keyboard,
  Image,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../navigation/rootnavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/ThemeContext';

// Firebase Auth (React Native Firebase)
import auth from '@react-native-firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

type FormErrors = {
  number?: string;
  pass?: string;
};

// Color constants
const BLUE = Colors.primary;       // #074e87
const BLUE_DARK = Colors.primaryDark;
const ORANGE = Colors.accent;      // #fc720a

export default function LoginScreen({ navigation }: Props) {
  const [number, setNumber] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const formSlide = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Set StatusBar for this screen
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('#EFF6FF');
        StatusBar.setTranslucent(false);
      }
    }, [])
  );

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(formSlide, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Shake animation for errors
  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const validate = (): boolean => {
    const trimmedNumber = number.trim();
    const trimmedPass = pass.trim();
    const newErrors: FormErrors = {};

    setGlobalError(null);

    if (!trimmedNumber) {
      newErrors.number = 'Mobile number is required.';
    } else if (!/^\d+$/.test(trimmedNumber)) {
      newErrors.number = 'Mobile number should contain only digits.';
    } else if (trimmedNumber.length !== 10) {
      newErrors.number = 'Mobile number must be exactly 10 digits.';
    }

    if (!trimmedPass) {
      newErrors.pass = 'Password is required.';
    } else if (trimmedPass.length < 6) {
      newErrors.pass = 'Password should be at least 6 characters.';
    }

    setErrors(newErrors);

    const errorCount = Object.keys(newErrors).length;
    if (errorCount > 0) {
      const message = errorCount === 1
        ? Object.values(newErrors)[0] || 'Please check your input.'
        : 'Please fill in all fields correctly.';
      setGlobalError(message);
      triggerShake();
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    const mobile = number.trim();
    const password = pass.trim();
    const email = `${mobile}@topinexam.app`;

    try {
      setLoading(true);
      setGlobalError(null);

      await auth().signInWithEmailAndPassword(email, password);
    } catch (err: any) {
      console.warn('Login FirebaseAuth error:', err);

      let msg = 'Something went wrong while logging you in. Please try again.';

      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid mobile number or password. Please check your details.';
        setErrors(prev => ({ ...prev, pass: 'Invalid mobile number or password.' }));
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please wait a few minutes and try again.';
      } else if (err.code === 'auth/invalid-credential') {
        msg = 'Invalid credentials. Please check your mobile number and password.';
      }

      setGlobalError(msg);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.gradient}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          >
            {/* Hero Section */}
            <Animated.View
              style={[
                styles.heroSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }, { scale: logoScale }],
                },
              ]}
            >
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/images/logo.jpg')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />

                {/* <View style={styles.logoInner}>
                  <Icon name="school-outline" size={44} color="#FFFFFF" />
                </View> */}
                {/* <View style={styles.logoAccent} /> */}
              </View>
              <Text style={styles.brandName}>
                <Text style={styles.brandTop}>TOP IN </Text>
                <Text style={styles.brandExam}>EXAM</Text>
              </Text>
              <Text style={styles.tagline}>Master Your Entrance, Your Way</Text>
              <Text style={styles.taglineSubtext}>Subject-Wise Practice • Real Exam Questions • Custom MCQ Tests</Text>
            </Animated.View>

            {/* Form Card */}
            <Animated.View
              style={[
                styles.formCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: formSlide }, { translateX: shakeAnim }],
                },
              ]}
            >
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>Welcome Back!</Text>
                <Text style={styles.formSubtitle}>
                  Login to continue your preparation
                </Text>
              </View>

              {/* Error Banner */}
              {globalError && (
                <Animated.View style={[styles.errorBanner, { transform: [{ translateX: shakeAnim }] }]}>
                  <View style={styles.errorIconWrap}>
                    <Icon name="alert-circle" size={18} color="#FFFFFF" />
                  </View>
                  <Text style={styles.errorBannerText}>{globalError}</Text>
                </Animated.View>
              )}

              {/* Mobile Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Icon name="phone" size={14} color={BLUE} /> Mobile Number
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'number' && styles.inputWrapperFocused,
                    errors.number && styles.inputWrapperError,
                  ]}
                >
                  <View style={styles.countryCodeWrap}>
                    <Text style={styles.countryCode}>+91</Text>
                  </View>
                  <TextInput
                    placeholder="Enter 10-digit mobile"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={10}
                    value={number}
                    onFocus={() => setFocusedField('number')}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={txt => {
                      setNumber(txt.replace(/[^0-9]/g, ''));
                      if (errors.number) setErrors(prev => ({ ...prev, number: undefined }));
                      if (globalError) setGlobalError(null);
                    }}
                  />
                  {number.length === 10 && (
                    <View style={styles.validIcon}>
                      <Icon name="check-circle" size={20} color="#22C55E" />
                    </View>
                  )}
                </View>
                {errors.number && <Text style={styles.fieldError}>{errors.number}</Text>}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Icon name="lock-outline" size={14} color={BLUE} /> Password
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'pass' && styles.inputWrapperFocused,
                    errors.pass && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    style={[styles.input, styles.passwordInput]}
                    secureTextEntry={!showPass}
                    autoCapitalize="none"
                    value={pass}
                    onFocus={() => setFocusedField('pass')}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={txt => {
                      setPass(txt);
                      if (errors.pass) setErrors(prev => ({ ...prev, pass: undefined }));
                      if (globalError) setGlobalError(null);
                    }}
                  />
                  <Pressable onPress={() => setShowPass(p => !p)} style={styles.eyeBtn}>
                    <Icon
                      name={showPass ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>
                {errors.pass && <Text style={styles.fieldError}>{errors.pass}</Text>}
              </View>

              {/* Login Button - Blue */}
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
                  <View style={styles.loadingWrap}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text style={styles.loadingText}>Signing in...</Text>
                  </View>
                ) : (
                  <>
                    <Icon name="login" size={20} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Login</Text>
                  </>
                )}
              </Pressable>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerTextWrap}>
                  <Text style={styles.dividerText}>or</Text>
                </View>
                <View style={styles.dividerLine} />
              </View>

              {/* Sign Up Link - Orange */}
              <Pressable
                onPress={() => navigation.navigate('SignUp')}
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  pressed && styles.secondaryBtnPressed,
                ]}
              >
                <Icon name="account-plus-outline" size={18} color={ORANGE} />
                <Text style={styles.secondaryBtnText}>New here? Create Account</Text>
              </Pressable>
            </Animated.View>

            {/* Footer */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
              <Icon name="shield-check" size={16} color={ORANGE} />
              <Text style={styles.footerText}>Your data is secure with us</Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gradient: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    justifyContent: 'center',
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoInner: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoAccent: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ORANGE,
    borderWidth: 3,
    borderColor: '#EFF6FF',
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },

  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandTop: {
    color: BLUE,
  },
  brandExam: {
    color: ORANGE,
  },
  tagline: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 6,
    fontWeight: '500',
    textAlign: 'center',
  },
  taglineSubtext: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '400',
    textAlign: 'center',
  },

  // Form Card
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderTopWidth: 4,
    borderTopColor: BLUE,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },
  errorIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '500',
  },

  // Input Groups
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputWrapperFocused: {
    borderColor: BLUE,
    backgroundColor: '#FFFFFF',
    shadowColor: BLUE,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: '#F87171',
    backgroundColor: '#FEF2F2',
  },
  countryCodeWrap: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '600',
    color: BLUE,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 16,
    fontSize: 15,
    color: '#111827',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  validIcon: {
    marginRight: 12,
  },
  fieldError: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },

  // Primary Button - Blue
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: BLUE,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
    shadowColor: BLUE,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  primaryBtnPressed: {
    backgroundColor: BLUE_DARK,
    transform: [{ scale: 0.98 }],
  },
  primaryBtnDisabled: {
    opacity: 0.8,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerTextWrap: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: ORANGE,
    borderRadius: 12,
  },
  dividerText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Secondary Button - Orange
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(252, 114, 10, 0.08)',
  },
  secondaryBtnPressed: {
    backgroundColor: 'rgba(252, 114, 10, 0.18)',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: ORANGE,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
});
