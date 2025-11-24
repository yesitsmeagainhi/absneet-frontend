// src/screens/Auth/SignUpScreen.tsx
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

// 🔹 Firestore imports
import firestore from '@react-native-firebase/firestore';
import { db } from '../../services/firebase.native'; // 👈 adjust path if your db export is elsewhere

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const [number, setNumber] = useState('');
  const [pass, setPass] = useState('');
  const [edu, setEdu] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!number.trim() || !pass.trim() || !edu.trim() || !city.trim()) {
      Alert.alert('Missing details', 'Please fill all fields before continuing.');
      return;
    }

    // 📛 WARNING (important in real app):
    // Storing raw passwords in Firestore is NOT secure.
    // For real auth, use Firebase Authentication and only store profile data in Firestore.
    try {
      setLoading(true);

      // 🔹 Create a document in a Firestore "authentication" collection
      // You can rename "authentication" to "users" / "authUsers" etc.
      await db.collection('authentication').add({
        mobile: number.trim(),
        password: pass.trim(), // ❗ not safe in production – use hashing / Firebase Auth instead
        education: edu.trim(),
        city: city.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      // After saving, go to main app
      navigation.replace('HomeTabs');
    } catch (err: any) {
      console.warn('SignUp Firestore error:', err);
      Alert.alert(
        'Sign up failed',
        err?.message || 'Something went wrong while creating your account.'
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
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                secureTextEntry
                value={pass}
                onChangeText={setPass}
              />
            </View>

            {/* Current education */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Current Education</Text>
              <TextInput
                placeholder="e.g. 11th Science, 12th Science, Dropper"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={edu}
                onChangeText={setEdu}
              />
            </View>

            {/* City */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>City</Text>
              <TextInput
                placeholder="e.g. Mumbai"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={city}
                onChangeText={setCity}
              />
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
