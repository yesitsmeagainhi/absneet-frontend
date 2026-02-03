// src/screens/Auth/SignUpScreen.tsx
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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

// Firestore imports
import firestore from '@react-native-firebase/firestore';
import { db } from '../../services/firebase.native';

// Firebase Auth
import auth from '@react-native-firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

type FormErrors = {
  number?: string;
  pass?: string;
  city?: string;
};

// Color constants
const BLUE = Colors.primary;       // #074e87
const ORANGE = Colors.accent;      // #fc720a

// City suggestions
const CITY_OPTIONS = [
  'Mumbai',
  'Thane',
  'Navi Mumbai',
  'Pune',
  'Bangalore',
  'Hyderabad',
  'Delhi',
  'Kolkata',
  'Chennai',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Indore',
  'Nagpur',
  'Nalasopara',
  'Bhayandar',
  'Vasai',
];

export default function SignUpScreen({ navigation }: Props) {
  const [number, setNumber] = useState('');
  const [pass, setPass] = useState('');
  const [edu, setEdu] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
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

  // Filtered city suggestions
  const filteredCities = useMemo(() => {
    const q = city.trim().toLowerCase();
    if (q.length < 2) return [];
    return CITY_OPTIONS.filter(c => c.toLowerCase().includes(q));
  }, [city]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const trimmedNumber = number.trim();
    const trimmedPass = pass.trim();
    const trimmedCity = city.trim();

    setGlobalError(null);

    // Mobile validation
    if (!trimmedNumber) {
      newErrors.number = 'Mobile number is required.';
    } else if (!/^\d+$/.test(trimmedNumber)) {
      newErrors.number = 'Mobile number should contain only digits.';
    } else if (trimmedNumber.length !== 10) {
      newErrors.number = 'Mobile number must be exactly 10 digits.';
    }

    // Password validation
    if (!trimmedPass) {
      newErrors.pass = 'Password is required.';
    } else if (trimmedPass.length < 6) {
      newErrors.pass = 'Password should be at least 6 characters.';
    }

    // City validation
    if (!trimmedCity) {
      newErrors.city = 'Please enter your city.';
    }

    // Education is now optional - no validation needed

    setErrors(newErrors);

    const errorCount = Object.keys(newErrors).length;
    if (errorCount > 0) {
      const message = errorCount === 1
        ? Object.values(newErrors)[0] || 'Please check your input.'
        : 'Please fill in all required fields correctly.';
      setGlobalError(message);
      triggerShake();
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    const mobile = number.trim();
    const password = pass.trim();
    const education = edu.trim(); // Optional, can be empty
    const cityName = city.trim();
    const email = `${mobile}@topinexam.app`;

    try {
      setLoading(true);

      // Create user in Firebase Auth
      const cred = await auth().createUserWithEmailAndPassword(email, password);
      const { uid } = cred.user;

      // Save profile in Firestore
      await db.collection('users').doc(uid).set({
        uid,
        mobile,
        education: education || null, // Store null if empty
        city: cityName,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      setErrors({});
      setGlobalError(null);

      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeTabs' }],
      });
    } catch (err: any) {
      console.warn('SignUp error:', err);

      let msg = 'Something went wrong. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This mobile number is already registered. Please login.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Use at least 6 characters.';
      }

      setGlobalError(msg);
      triggerShake();
      Alert.alert('Sign up failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (value: string) => {
    setCity(value);
    setShowCitySuggestions(false);
    setErrors(prev => ({ ...prev, city: undefined }));
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
                <Text style={styles.formTitle}>Create Account</Text>
                <Text style={styles.formSubtitle}>
                  Get ready to start your preparation journey
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
                    placeholder="Create a strong password"
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
                {pass.length > 0 && pass.length < 6 && !errors.pass && (
                  <Text style={styles.hintText}>
                    <Icon name="information-outline" size={12} color={ORANGE} /> Min 6 characters required
                  </Text>
                )}
              </View>

              {/* Current Education - Optional */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Icon name="book-open-outline" size={14} color={BLUE} /> Current Education{' '}
                  <Text style={styles.optionalTag}>(Optional)</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'edu' && styles.inputWrapperFocused,
                  ]}
                >
                  <TextInput
                    placeholder="e.g. 12th Science, NEET Aspirant"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    value={edu}
                    onFocus={() => setFocusedField('edu')}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={setEdu}
                  />
                </View>
              </View>

              {/* City */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  <Icon name="map-marker-outline" size={14} color={BLUE} /> City
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === 'city' && styles.inputWrapperFocused,
                    errors.city && styles.inputWrapperError,
                  ]}
                >
                  <TextInput
                    placeholder="Enter your city"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    value={city}
                    onFocus={() => {
                      setFocusedField('city');
                      setShowCitySuggestions(true);
                    }}
                    onBlur={() => {
                      setFocusedField(null);
                      setTimeout(() => setShowCitySuggestions(false), 150);
                    }}
                    onChangeText={txt => {
                      setCity(txt);
                      setShowCitySuggestions(true);
                      if (errors.city) setErrors(prev => ({ ...prev, city: undefined }));
                      if (globalError) setGlobalError(null);
                    }}
                  />
                  {city.length > 0 && (
                    <Pressable onPress={() => setCity('')} style={styles.clearBtn}>
                      <Icon name="close-circle" size={18} color="#9CA3AF" />
                    </Pressable>
                  )}
                </View>
                {errors.city && <Text style={styles.fieldError}>{errors.city}</Text>}

                {showCitySuggestions && filteredCities.length > 0 && (
                  <Animated.View style={styles.suggestionsBox}>
                    {filteredCities.slice(0, 5).map(c => (
                      <Pressable
                        key={c}
                        onPress={() => handleCitySelect(c)}
                        style={({ pressed }) => [
                          styles.suggestionItem,
                          pressed && styles.suggestionItemPressed,
                        ]}
                      >
                        <Icon name="map-marker" size={16} color={ORANGE} />
                        <Text style={styles.suggestionText}>{c}</Text>
                      </Pressable>
                    ))}
                  </Animated.View>
                )}
              </View>

              {/* Sign Up Button - Orange (Primary action for new users) */}
              <Pressable
                onPress={handleSignUp}
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
                    <Text style={styles.loadingText}>Creating account...</Text>
                  </View>
                ) : (
                  <>
                    <Icon name="account-plus" size={20} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Create Account</Text>
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

              {/* Login Link - Blue */}
              <Pressable
                onPress={() => navigation.navigate('Login')}
                style={({ pressed }) => [
                  styles.secondaryBtn,
                  pressed && styles.secondaryBtnPressed,
                ]}
              >
                <Icon name="login" size={18} color={BLUE} />
                <Text style={styles.secondaryBtnText}>Already have an account? Login</Text>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: 'center',
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  logoInner: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
  },
  logoAccent: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ORANGE,
    borderWidth: 2,
    borderColor: '#EFF6FF',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandTop: {
    color: BLUE,
  },
  brandExam: {
    color: ORANGE,
  },
  tagline: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  taglineSubtext: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '400',
    textAlign: 'center',
  },

  // Form Card
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    borderTopWidth: 3,
    borderTopColor: ORANGE,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  formSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
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
    marginBottom: 16,
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
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  optionalTag: {
    fontSize: 11,
    fontWeight: '400',
    color: ORANGE,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 14,
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
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  clearBtn: {
    marginRight: 12,
    padding: 4,
  },
  validIcon: {
    marginRight: 12,
  },
  fieldError: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  hintText: {
    fontSize: 11,
    color: ORANGE,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },

  // City Suggestions
  suggestionsBox: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionItemPressed: {
    backgroundColor: '#FFF7ED',
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  // Primary Button - Orange for SignUp
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: ORANGE,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
    shadowColor: ORANGE,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  primaryBtnPressed: {
    backgroundColor: Colors.accentDark,
    transform: [{ scale: 0.98 }],
  },
  primaryBtnDisabled: {
    opacity: 0.8,
  },
  primaryBtnText: {
    fontSize: 15,
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
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerTextWrap: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: BLUE,
    borderRadius: 12,
  },
  dividerText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Secondary Button - Blue for Login
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: BLUE,
    borderRadius: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(7, 78, 135, 0.06)',
  },
  secondaryBtnPressed: {
    backgroundColor: 'rgba(7, 78, 135, 0.14)',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: BLUE,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
