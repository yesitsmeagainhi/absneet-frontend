

// src/screens/Auth/SignUpScreen.tsx
import React, { useState, useMemo } from 'react';
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

// 🔹 Firestore imports
import firestore from '@react-native-firebase/firestore';
import { db } from '../../services/firebase.native';

// ✅ Firebase Auth
import auth from '@react-native-firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

type FormErrors = {
  number?: string;
  pass?: string;
  edu?: string;
  city?: string;
};

// 🔹 City suggestions (you can extend this list anytime)
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

  // 🔹 Global error banner message
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Filtered city suggestions based on typed text
  const filteredCities = useMemo(() => {
    const q = city.trim().toLowerCase();
    if (q.length < 2) return [];
    return CITY_OPTIONS.filter(c =>
      c.toLowerCase().includes(q),
    );
  }, [city]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const trimmedNumber = number.trim();
    const trimmedPass = pass.trim();
    const trimmedEdu = edu.trim();
    const trimmedCity = city.trim();

    setGlobalError(null);

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

    // 🔹 Education validation
    if (!trimmedEdu) {
      newErrors.edu = 'Please enter your current course / class.';
    } else if (trimmedEdu.length < 3) {
      newErrors.edu = 'Education description looks too short.';
    }

    // 🔹 City validation
    if (!trimmedCity) {
      newErrors.city = 'Please enter your city.';
    }

    setErrors(newErrors);

    const errorKeys = Object.keys(newErrors);
    const errorCount = errorKeys.length;

    if (errorCount > 0) {
      let message: string;

      if (errorCount === 1) {
        const onlyError = (Object.values(newErrors)[0] as string) || '';
        message = onlyError || 'Please correct the highlighted field.';
      } else {
        message =
          'Some details look incorrect. Please correct the fields or check your input.';
      }

      setGlobalError(message);
      return false;
    }

    setGlobalError(null);
    return true;
  };

  const handleSignUp = async () => {
    if (!validate()) return;

    const mobile = number.trim();
    const password = pass.trim();
    const education = edu.trim();
    const cityName = city.trim();

    // ✅ synthetic email for Firebase Auth
    const email = `${mobile}@absneet.app`;

    try {
      setLoading(true);

      // 1️⃣ Create user in Firebase Auth
      const cred = await auth().createUserWithEmailAndPassword(email, password);
      const { uid } = cred.user;

      // 2️⃣ Save profile in Firestore (users/{uid})
      await db.collection('users').doc(uid).set({
        uid,
        mobile,
        education,
        city: cityName,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // reset errors & banner
      setErrors({});
      setGlobalError(null);

      // 3️⃣ Navigate into app
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeTabs' }],
      });
    } catch (err: any) {
      console.warn('SignUp FirebaseAuth/Firestore error:', err);

      let msg =
        'Something went wrong while creating your account. Please try again.';

      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this mobile number already exists. Please login.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }

      setGlobalError(msg);
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top colored header strip */}
      <View style={styles.headerStrip}>
        <Text style={styles.appTitle}>ABS NEET</Text>
        <Text style={styles.appSubtitle}>Join the NEET toppers community</Text>
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
            <Text style={styles.heading}>Create your account ✨</Text>
            <Text style={styles.subheading}>
              We’ll personalise your practice plan based on your details.
            </Text>

            {/* 🔴 Global error banner */}
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
                }}
              />
              {!!errors.number && (
                <Text style={styles.errorText}>{errors.number}</Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Create a password (min 6 characters)"
                placeholderTextColor="#9CA3AF"
                style={[
                  styles.input,
                  errors.pass && styles.inputError,
                ]}
                secureTextEntry
                autoCapitalize="none"
                value={pass}
                onChangeText={txt => {
                  setPass(txt);
                  if (errors.pass) {
                    setErrors(prev => ({ ...prev, pass: undefined }));
                  }
                }}
              />
              {!!errors.pass && (
                <Text style={styles.errorText}>{errors.pass}</Text>
              )}
            </View>

            {/* Current education */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Current Education</Text>
              <TextInput
                placeholder="e.g. 11th Science, 12th Science, Dropper"
                placeholderTextColor="#9CA3AF"
                style={[
                  styles.input,
                  errors.edu && styles.inputError,
                ]}
                value={edu}
                onChangeText={txt => {
                  setEdu(txt);
                  if (errors.edu) {
                    setErrors(prev => ({ ...prev, edu: undefined }));
                  }
                }}
              />
              {!!errors.edu && (
                <Text style={styles.errorText}>{errors.edu}</Text>
              )}
            </View>

            {/* City with suggestions */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                placeholder="e.g. Mumbai"
                placeholderTextColor="#9CA3AF"
                style={[
                  styles.input,
                  errors.city && styles.inputError,
                ]}
                value={city}
                onFocus={() => setShowCitySuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowCitySuggestions(false), 150);
                }}
                onChangeText={txt => {
                  setCity(txt);
                  setShowCitySuggestions(true);
                  if (errors.city) {
                    setErrors(prev => ({ ...prev, city: undefined }));
                  }
                }}
              />
              {!!errors.city && (
                <Text style={styles.errorText}>{errors.city}</Text>
              )}

              {showCitySuggestions && filteredCities.length > 0 && (
                <View style={styles.suggestionBox}>
                  {filteredCities.map(c => (
                    <Pressable
                      key={c}
                      onPress={() => handleCitySelect(c)}
                      style={({ pressed }) => [
                        styles.suggestionItem,
                        pressed && styles.suggestionItemPressed,
                      ]}
                    >
                      <Text style={styles.suggestionText}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Create account button */}
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
                <ActivityIndicator color="#F9FAFB" />
              ) : (
                <Text style={styles.primaryBtnText}>Create Account</Text>
              )}
            </Pressable>

            {/* Bottom link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account?</Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Login</Text>
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
    backgroundColor: '#F5F5F7',
  },
  headerStrip: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: GREEN,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#064E3B',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#064E3B',
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
    marginBottom: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    flexDirection: 'row',
    alignItems: 'flex-start',
    // subtle shadow for card feel
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  globalErrorText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
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

  // suggestions
  suggestionBox: {
    marginTop: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    maxHeight: 150,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  suggestionItemPressed: {
    backgroundColor: '#EEF2FF',
  },
  suggestionText: {
    fontSize: 13,
    color: '#111827',
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
