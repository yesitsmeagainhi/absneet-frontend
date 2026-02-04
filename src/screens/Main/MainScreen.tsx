// src/screens/Main/MainScreen.tsx
import React, { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Linking,
  ActivityIndicator,
  StatusBar,
  Platform,
  useWindowDimensions,
  FlatList,
  BackHandler,
  Modal,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from '../../navigation/RootNavigator';
import { useTheme, Colors } from '../../theme/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useExam, Exam } from '../../context/ExamContext';
import NotificationBadge from '../../components/NotificationBadge';
import { db } from '../../services/firebase.native';
import auth from '@react-native-firebase/auth';

// Arrow image for intro tips
const ArrowWaveUp = require('../../assets/intro/arrow_wave_up.png');

// 🔑 Intro tips storage key for MainScreen
const MAIN_INTRO_KEY = 'topinexam_main_intro_seen_v1';

// Responsive sizing - using percentage-based positioning and auto-height cards

// All intro steps for MainScreen (Steps 1-3 of 6 total across both screens)
// Step 3 is the last step - user selects exam and proceeds to HomeScreen with its own tips
const TOTAL_INTRO_STEPS = 6; // 3 MainScreen + 3 HomeScreen
const MAIN_STEP_OFFSET = 0; // MainScreen starts at step 1

const INTRO_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome',
    text:
      'Welcome to Top In Exam! This app helps you prepare for competitive exams with MCQs, PYQs, Mock Tests and study materials.',
  },
  {
    id: 'banners',
    title: 'Banners',
    text:
      'Scroll through the banners to see important announcements, offers, and tips. Tap on any banner to learn more.',
  },
  {
    id: 'exams',
    title: 'Choose Your Exam',
    text:
      'Now tap on any exam card below to select the competitive exam you are preparing for. This will take you to the main app with customized content!',
  },
] as const;

type IntroStepId = (typeof INTRO_STEPS)[number]['id'];

type Nav = NativeStackNavigationProp<RootStackParamList>;

type BannerItem = {
  id: string;
  imageUrl: string;
  link: string;
  order: number;
  active: boolean;
};

type ExamDoc = {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  active: boolean;
  order: number;
};

export default function MainScreen() {
  const nav = useNavigation<Nav>();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const { setSelectedExam } = useExam();

  const styles = useMemo(() => createStyles(isDark, screenWidth), [isDark, screenWidth]);

  // Banner state
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannersError, setBannersError] = useState<string | null>(null);
  const [brokenBannerIds, setBrokenBannerIds] = useState<string[]>([]);

  // Exam state
  const [exams, setExams] = useState<ExamDoc[]>([]);
  const [examsLoading, setExamsLoading] = useState(true);
  const [examsError, setExamsError] = useState<string | null>(null);

  // Account popup state
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [userName, setUserName] = useState<string>('');

  // Logout confirmation state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 🔹 Custom Exit Modal state
  type ExitModalType = 'exit' | 'warning' | 'info';
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const exitScaleAnim = useRef(new Animated.Value(0)).current;
  const exitOpacityAnim = useRef(new Animated.Value(0)).current;

  const showExitModal = () => {
    setExitModalVisible(true);
    Animated.parallel([
      Animated.spring(exitScaleAnim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(exitOpacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const hideExitModal = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(exitScaleAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(exitOpacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setExitModalVisible(false);
      callback?.();
    });
  };

  // Fetch user name from Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserName(data?.name || data?.displayName || currentUser.email || 'User');
        } else {
          setUserName(currentUser.displayName || currentUser.email || 'User');
        }
      } catch (error) {
        console.log('[MainScreen] Error fetching user name:', error);
        const currentUser = auth().currentUser;
        setUserName(currentUser?.displayName || currentUser?.email || 'User');
      }
    };

    fetchUserName();
  }, []);

  // Intro tips state
  const [showIntro, setShowIntro] = useState(false);
  const [introStep, setIntroStep] = useState(0);

  // Load intro flag from AsyncStorage
  // Tips show only on first login - flag '1' means already seen
  useEffect(() => {
    const loadIntroFlag = async () => {
      try {
        const flag = await AsyncStorage.getItem(MAIN_INTRO_KEY);
        console.log('[MAIN_INTRO] flag =', flag);

        if (flag === '1') {
          // Already seen tips - don't show again
          setShowIntro(false);
        } else {
          // First time - show tips
          setIntroStep(0);
          setShowIntro(true);
        }
      } catch (e) {
        console.warn('Failed to read main intro flag:', e);
        setIntroStep(0);
        setShowIntro(true);
      }
    };
    loadIntroFlag();
  }, []);

  // Finish intro and save to AsyncStorage
  const finishIntroForever = useCallback(async () => {
    try {
      await AsyncStorage.setItem(MAIN_INTRO_KEY, '1');
    } catch (e) {
      console.warn('Failed to set main intro flag:', e);
    }
    setShowIntro(false);
  }, []);

  // Handle OK button on intro tips
  const handleIntroOk = useCallback(() => {
    if (introStep < INTRO_STEPS.length - 1) {
      setIntroStep(prev => prev + 1);
    } else {
      finishIntroForever();
    }
  }, [introStep, finishIntroForever]);

  // Handle Close button on intro tips
  const handleIntroClose = useCallback(() => {
    finishIntroForever();
  }, [finishIntroForever]);

  // Logout handlers
  const handleLogout = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    setShowLogoutConfirm(false);
    try {
      await AsyncStorage.removeItem('abs_neet_last_login_at');
      await auth().signOut();
    } catch (e) {
      console.warn('Failed to logout:', e);
    }
  }, []);

  const cancelLogout = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);

  // Android back button → confirm exit with custom modal
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        showExitModal();
        return true; // prevent default back behaviour
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        subscription.remove();
      };
    }, []),
  );

  // Current intro step
  const currentStep = INTRO_STEPS[introStep];

  // Position + arrow config for each step
  // Using percentage-based positioning for responsiveness
  // Horizontal padding scales with screen width
  const horizontalPadding = Math.max(16, screenWidth * 0.04);
  // Center position at ~35% from top (works across screen sizes)
  const centerTop = screenHeight * 0.35;
  // Max position to keep card above bottom navigation (~20% from bottom)
  const maxTop = screenHeight * 0.65;

  const introPos = useMemo(() => {
    if (!currentStep) return undefined;

    const id = currentStep.id as IntroStepId;

    switch (id) {
      case 'welcome':
        // Position near top, after header - use percentage with min/max bounds
        return {
          wrapper: { left: horizontalPadding, right: horizontalPadding, top: Math.min(Math.max(screenHeight * 0.18, 120), maxTop) },
          arrowOnTop: true,
          arrowOnBottom: false,
          arrowAlign: 'center' as const,
        };

      case 'banners':
        // Position in upper-middle area
        return {
          wrapper: { left: horizontalPadding, right: horizontalPadding, top: Math.min(Math.max(screenHeight * 0.32, 200), maxTop) },
          arrowOnTop: true,
          arrowOnBottom: false,
          arrowAlign: 'flex-start' as const,
        };

      case 'exams':
        // Position in center area with arrow pointing down to exams
        return {
          wrapper: { left: horizontalPadding, right: horizontalPadding, top: Math.min(centerTop, maxTop) },
          arrowOnTop: false,
          arrowOnBottom: true,
          arrowAlign: 'center' as const,
        };

      default:
        return undefined;
    }
  }, [currentStep, screenHeight, screenWidth, horizontalPadding, centerTop, maxTop]);

  // Set StatusBar for this screen
  useFocusEffect(
    useCallback(() => {
      // StatusBar.setBarStyle('dark-content');
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(isDark ? '#0F172A' : '#FFFFFF');
        StatusBar.setTranslucent(false);
      }
    }, [isDark])
  );

  // Fetch banners from Firestore
  useEffect(() => {
    setBannersLoading(true);
    setBannersError(null);

    const q = db
      .collection('nodes')
      .where('type', '==', 'banner')
      .orderBy('order', 'asc');

    const unsubscribe = q.onSnapshot(
      snapshot => {
        if (snapshot.empty) {
          setBanners([]);
          setBannersLoading(false);
          return;
        }

        const items: BannerItem[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data() as any;
          return {
            id: docSnap.id,
            imageUrl: data.imageUrl ?? '',
            link: data.link ?? '',
            order: data.order ?? 0,
            active: data.active ?? true,
          };
        });

        const activeItems = items.filter(b => b.active && b.imageUrl);
        setBanners(activeItems);
        setBrokenBannerIds([]);
        setBannersLoading(false);
      },
      error => {
        console.warn('[MainScreen] banners onSnapshot error', error);
        setBannersError('Failed to load banners.');
        setBanners([]);
        setBannersLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Fetch exams from Firestore (nodes collection with type: 'exam')
  useEffect(() => {
    setExamsLoading(true);
    setExamsError(null);

    console.log('[MainScreen] Fetching exams from nodes collection...');

    // Simple query - just filter by type, then filter/sort in JS
    // This avoids composite index requirement
    const q = db
      .collection('nodes')
      .where('type', '==', 'exam');

    const unsubscribe = q.onSnapshot(
      snapshot => {
        console.log('[MainScreen] Exams snapshot size:', snapshot.size);

        if (snapshot.empty) {
          console.log('[MainScreen] No exams found in Firestore');
          setExams([]);
          setExamsLoading(false);
          return;
        }

        const items: ExamDoc[] = snapshot.docs
          .map(docSnap => {
            const data = docSnap.data() as any;
            console.log('[MainScreen] Exam doc:', docSnap.id, data);
            return {
              id: docSnap.id,
              name: data.name ?? 'Exam',
              shortName: data.shortName ?? data.name ?? 'Exam',
              icon: data.icon ?? 'school',
              color: data.color ?? Colors.primary,
              active: data.active !== false, // default to true if not set
              order: data.order ?? 0,
            };
          })
          .filter(exam => exam.active) // Filter active in JS
          .sort((a, b) => a.order - b.order); // Sort in JS

        console.log('[MainScreen] Processed exams:', items.length);
        setExams(items);
        setExamsLoading(false);
      },
      error => {
        console.error('[MainScreen] exams onSnapshot error:', error);
        setExamsError('Failed to load exams. Check console for details.');
        setExams([]);
        setExamsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleBannerPress = useCallback((banner: BannerItem) => {
    if (!banner.link) return;
    if (banner.link.startsWith('http')) {
      Linking.openURL(banner.link).catch(err => {
        console.warn('Failed to open URL:', err);
      });
    }
  }, []);

  const handleExamSelect = async (exam: ExamDoc) => {
    await setSelectedExam({
      id: exam.id,
      name: exam.name,
      shortName: exam.shortName,
      icon: exam.icon,
      color: exam.color,
    });
    nav.reset({
      index: 0,
      routes: [{ name: 'HomeTabs' }],
    });
  };

  const renderFallbackBanner = () => (
    <View style={styles.bannerCard}>
      <View style={styles.bannerFallback}>
        <Text style={styles.bannerFallbackTitle}>TOP IN EXAM</Text>
        <Text style={styles.bannerFallbackSubtitle}>
          Select your exam to start practicing MCQs, PYQs & Mock Tests.
        </Text>
      </View>
    </View>
  );

  const renderExamCard = ({ item }: { item: ExamDoc }) => (
    <Pressable
      style={({ pressed }) => [
        styles.examCard,
        { borderColor: item.color },
        pressed && styles.examCardPressed,
      ]}
      onPress={() => handleExamSelect(item)}
    >
      <View style={[styles.examIconContainer, { backgroundColor: `${item.color}20` }]}>
        <Icon name={item.icon} size={32} color={item.color} />
      </View>
      <Text style={styles.examName}>{item.shortName}</Text>
      <Text style={styles.examFullName}>{item.name}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.root}>
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.c}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Container */}
          <View style={styles.headerContainer}>
            {/* Top bar */}
            <View style={styles.topBar}>
              {/* Left: App branding */}
              <View style={styles.brandContainer}>
                <Text style={styles.brandText}>
                  <Text style={{ color: Colors.primary }}>TOP IN </Text>
                  <Text style={{ color: Colors.accent }}>EXAM</Text>
                </Text>
              </View>

              {/* Right: Icons row */}
              <View style={styles.topRightRow}>
                {/* Theme toggle */}
                <Pressable
                  onPress={toggleTheme}
                  style={({ pressed }) => [
                    styles.headerIconBtn,
                    pressed && styles.headerIconBtnPressed,
                  ]}
                >
                  {isDark ? (
                    <Icon name="white-balance-sunny" size={20} color="#F59E0B" />
                  ) : (
                    <Icon name="moon-waxing-crescent" size={20} color="#374151" style={{ transform: [{ rotate: '+30deg' }] }} />
                  )}
                </Pressable>

                {/* Notification bell */}
                <Pressable
                  onPress={() => nav.navigate('Notifications')}
                  style={({ pressed }) => [
                    styles.headerIconBtn,
                    pressed && styles.headerIconBtnPressed,
                  ]}
                >
                  <Icon name="bell-outline" size={20} color={isDark ? '#9CA3AF' : '#374151'} />
                  <NotificationBadge count={unreadCount} />
                </Pressable>

                {/* Account button */}
                <Pressable
                  onPress={() => setShowAccountPopup(true)}
                  style={({ pressed }) => [
                    styles.accountIconBtn,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Icon name="account-circle" size={42} color={Colors.accent} />
                </Pressable>
              </View>
            </View>

            {/* Welcome Text */}
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Welcome to Top In Exam</Text>
              <Text style={styles.welcomeSubtitle}>Select your exam to get started</Text>
            </View>
          </View>

          {/* Banner slider from Firestore */}
          <View style={styles.bannerWrap}>
            {bannersError && (
              <Text style={styles.bannerErrorText}>{bannersError}</Text>
            )}

            {bannersLoading ? (
              <View style={styles.bannerEmpty}>
                <ActivityIndicator
                  size="small"
                  color={isDark ? '#E5E7EB' : '#4B5563'}
                />
                <Text style={[styles.bannerEmptyTitle, { marginTop: 6 }]}>
                  Loading banners...
                </Text>
              </View>
            ) : banners.length === 0 ? (
              renderFallbackBanner()
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bannerScroll}
              >
                {banners.map(b => {
                  const isBroken = brokenBannerIds.includes(b.id);

                  return (
                    <Pressable
                      key={b.id}
                      android_ripple={{ color: isDark ? '#E5E7EB' : '#1E293B' }}
                      onPress={() => handleBannerPress(b)}
                      style={({ pressed }) => [
                        styles.bannerCard,
                        pressed && styles.bannerCardPressed,
                      ]}
                    >
                      {!b.imageUrl || isBroken ? (
                        <View style={styles.bannerFallback}>
                          <Text style={styles.bannerFallbackTitle}>TOP IN EXAM</Text>
                          <Text style={styles.bannerFallbackSubtitle}>
                            Practice MCQs, PYQs & Mock Tests every day.
                          </Text>
                        </View>
                      ) : (
                        <Image
                          source={{ uri: b.imageUrl }}
                          style={styles.bannerImage}
                          resizeMode="cover"
                          onError={() =>
                            setBrokenBannerIds(prev =>
                              prev.includes(b.id) ? prev : [...prev, b.id],
                            )
                          }
                        />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Exams Section */}
          <View style={styles.examsSection}>
            <Text style={styles.sectionTitle}>Choose Your Exam</Text>
            <Text style={styles.sectionSubtitle}>
              Select the competitive exam you are preparing for
            </Text>

            {examsError && (
              <Text style={styles.errorText}>{examsError}</Text>
            )}

            {examsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading exams...</Text>
              </View>
            ) : exams.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="school-outline" size={48} color={isDark ? '#6B7280' : '#9CA3AF'} />
                <Text style={styles.emptyTitle}>No exams available</Text>
                <Text style={styles.emptySubtitle}>
                  Check back later for available exams
                </Text>
              </View>
            ) : (
              <FlatList
                data={exams}
                keyExtractor={item => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.examGrid}
                columnWrapperStyle={styles.examRow}
                renderItem={renderExamCard}
              />
            )}
          </View>
        </ScrollView>

        {/* Account popup overlay */}
        {showAccountPopup && (
          <Pressable
            style={styles.accountOverlay}
            onPress={() => setShowAccountPopup(false)}
          >
            <View style={styles.accountPopup}>
              {/* User info header */}
              <View style={styles.accountHeader}>
                <Icon name="account-circle" size={48} color={isDark ? '#93C5FD' : Colors.primary} /><Text style={styles.accountName}>{userName || 'User'}</Text>
                {/* <Text style={styles.accountName}>{userName || 'User'}</Text> */}
              </View>

              {/* Divider */}
              <View style={styles.accountDivider} />

              {/* Help & Support option */}
              <Pressable
                onPress={() => {
                  setShowAccountPopup(false);
                  nav.navigate('Help');
                }}
                style={({ pressed }) => [
                  styles.accountOption,
                  pressed && styles.accountOptionPressed,
                ]}
              >
                <Icon name="help-circle-outline" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <Text style={styles.accountOptionTextNormal}>Help & Support</Text>
              </Pressable>

              {/* Divider */}
              <View style={styles.accountDivider} />

              {/* Logout option */}
              <Pressable
                onPress={() => {
                  setShowAccountPopup(false);
                  handleLogout();
                }}
                style={({ pressed }) => [
                  styles.accountOption,
                  pressed && styles.accountOptionPressed,
                ]}
              >
                <Icon name="logout" size={20} color={isDark ? '#F87171' : '#DC2626'} />
                <Text style={styles.accountOptionText}>Logout</Text>
              </Pressable>
            </View>
          </Pressable>
        )}

        {/* Logout confirmation overlay */}
        {showLogoutConfirm && (
          <View style={styles.logoutOverlay}>
            <View style={styles.logoutCard}>
              <Text style={styles.logoutTitle}>Logout</Text>
              <Text style={styles.logoutMessage}>
                Do you really want to logout?
              </Text>

              <View style={styles.logoutButtonsRow}>
                <Pressable
                  onPress={cancelLogout}
                  style={({ pressed }) => [
                    styles.logoutSecondaryBtn,
                    pressed && styles.logoutSecondaryBtnPressed,
                  ]}
                >
                  <Text style={styles.logoutSecondaryText}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={confirmLogout}
                  style={({ pressed }) => [
                    styles.logoutPrimaryBtn,
                    pressed && styles.logoutPrimaryBtnPressed,
                  ]}
                >
                  <Text style={styles.logoutPrimaryText}>Logout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* 🔹 Custom Exit Confirmation Modal - Minimal */}
        <Modal
          transparent
          visible={exitModalVisible}
          animationType="none"
          onRequestClose={() => hideExitModal()}
        >
          <Animated.View
            style={[
              styles.exitModalOverlay,
              { opacity: exitOpacityAnim },
            ]}
          >
            <Animated.View
              style={[
                styles.exitModalContainer,
                { transform: [{ scale: exitScaleAnim }] },
              ]}
            >
              {/* Content */}
              <View style={styles.exitModalContent}>
                <Icon name="exit-to-app" size={28} color={isDark ? '#F87171' : '#DC2626'} style={{ marginBottom: 12 }} />
                <Text style={styles.exitModalTitle}>Exit App?</Text>
                <Text style={styles.exitModalMessage}>
                  Are you sure you want to close the app?
                </Text>
              </View>

              {/* Buttons */}
              <View style={styles.exitModalButtonContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.exitModalButton,
                    styles.exitModalButtonCancel,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => hideExitModal()}
                >
                  <Text style={styles.exitModalButtonTextCancel}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.exitModalButton,
                    styles.exitModalButtonExit,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => hideExitModal(() => BackHandler.exitApp())}
                >
                  <Text style={styles.exitModalButtonText}>Exit</Text>
                </Pressable>
              </View>
            </Animated.View>
          </Animated.View>
        </Modal>

        {/* Intro tips overlay */}
        {showIntro && currentStep && introPos && (
          <View style={styles.introOverlay} pointerEvents="box-none">
            {/* Dim background - allow touch through on 'exams' step so user can select exam */}
            <View
              style={styles.introDim}
              pointerEvents={currentStep.id === 'exams' ? 'none' : 'auto'}
            />

            <View
              style={[
                styles.introCardWrapper,
                introPos.wrapper,
              ]}
            >
              {/* Arrow TOP */}
              {introPos.arrowOnTop && (
                <View
                  style={[
                    styles.arrowRow,
                    { justifyContent: introPos.arrowAlign },
                  ]}
                  pointerEvents="none"
                >
                  <Image
                    source={ArrowWaveUp}
                    style={styles.waveArrowImageTop}
                  />
                </View>
              )}

              {/* Tip card */}
              <View style={styles.introCard} pointerEvents="auto">
                <View style={styles.introHeaderRow}>
                  <Text style={styles.introStepBadge}>
                    {MAIN_STEP_OFFSET + introStep + 1}/{TOTAL_INTRO_STEPS}
                  </Text>
                  <Text style={styles.introTitle}>{currentStep.title}</Text>
                </View>

                <Text style={styles.introText}>{currentStep.text}</Text>

                <View style={styles.introButtonsRow}>
                  <Pressable
                    onPress={handleIntroClose}
                    style={({ pressed }) => [
                      styles.introSecondaryBtn,
                      pressed && styles.introSecondaryBtnPressed,
                      // Hide Close button on 'exams' step - user must select an exam
                      currentStep.id === 'exams' && { display: 'none' },
                    ]}
                  >
                    <Text style={styles.introSecondaryText}>Close</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleIntroOk}
                    style={({ pressed }) => [
                      styles.introPrimaryBtn,
                      pressed && styles.introPrimaryBtnPressed,
                      // Hide OK button on 'exams' step - user must select an exam
                      currentStep.id === 'exams' && { display: 'none' },
                    ]}
                  >
                    <Text style={styles.introPrimaryText}>
                      {introStep < INTRO_STEPS.length - 1 ? 'OK' : 'Done'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Arrow BOTTOM */}
              {introPos.arrowOnBottom && (
                <View
                  style={[
                    styles.arrowRow,
                    { justifyContent: introPos.arrowAlign },
                  ]}
                  pointerEvents="none"
                >
                  <Image
                    source={ArrowWaveUp}
                    style={styles.waveArrowImageBottom}
                  />
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean, screenWidth: number = 360) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
    },
    root: {
      flex: 1,
      position: 'relative',
    },
    screen: {
      flex: 1,
      backgroundColor: isDark ? '#020617' : '#F3F4F6',
    },
    c: {
      paddingHorizontal: Math.max(12, screenWidth * 0.04),
      paddingTop: 0,
      paddingBottom: 28,
    },

    // Header container
    headerContainer: {
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
      marginHorizontal: -Math.max(12, screenWidth * 0.04),
      paddingHorizontal: Math.max(12, screenWidth * 0.04),
      paddingBottom: 20,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: '#000',
      shadowOpacity: isDark ? 0 : 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: isDark ? 0 : 3,
    },

    // Top bar
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    brandContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    brandText: {
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    topRightRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    headerIconBtn: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#1E293B' : '#EEF2FF',
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#E0E7FF',
    },
    headerIconBtnPressed: {
      backgroundColor: isDark ? '#334155' : '#DBEAFE',
    },
    accountIconBtn: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
    },
    accountBtn: {
      padding: 4,
    },
    accountBtnPressed: {
      opacity: 0.7,
    },

    // Welcome section
    welcomeSection: {
      marginTop: 16,
    },
    welcomeTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    welcomeSubtitle: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 4,
    },

    // Banner styles
    bannerWrap: {
      marginTop: 20,
      marginBottom: 4,
    },
    bannerScroll: {
      paddingRight: 16,
    },
    bannerCardPressed: {
      transform: [{ scale: 0.97 }],
      opacity: 0.9,
    },
    bannerCard: {
      width: Math.min(screenWidth * 0.85, 340),
      height: Math.max(140, screenWidth * 0.4),
      marginRight: 12,
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#38BDF8' : '#E5E7EB',
      shadowColor: '#000',
      shadowOpacity: isDark ? 0.3 : 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    bannerImage: {
      width: '100%',
      height: '100%',
    },
    bannerErrorText: {
      fontSize: 11,
      color: '#F97316',
      marginBottom: 4,
    },
    bannerEmpty: {
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bannerEmptyTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: isDark ? '#E5E7EB' : '#111827',
    },
    bannerFallback: {
      flex: 1,
      paddingHorizontal: 14,
      paddingVertical: 16,
      justifyContent: 'center',
      backgroundColor: isDark ? '#0F172A' : '#DBEAFE',
    },
    bannerFallbackTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    bannerFallbackSubtitle: {
      fontSize: 12,
      color: isDark ? '#E5E7EB' : '#1F2937',
    },

    // Exams section
    examsSection: {
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 13,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 16,
    },
    examGrid: {
      gap: 12,
    },
    examRow: {
      justifyContent: 'space-between',
    },
    examCard: {
      width: (screenWidth - 48) / 2,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      shadowColor: '#000',
      shadowOpacity: isDark ? 0 : 0.08,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: isDark ? 0 : 3,
    },
    examCardPressed: {
      transform: [{ scale: 0.96 }],
      opacity: 0.9,
    },
    examIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    examName: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 2,
    },
    examFullName: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },

    // Loading and empty states
    loadingContainer: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    emptyContainer: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginTop: 12,
    },
    emptySubtitle: {
      fontSize: 13,
      color: isDark ? '#6B7280' : '#9CA3AF',
      marginTop: 4,
    },
    errorText: {
      fontSize: 12,
      color: '#F97316',
      marginBottom: 8,
    },
    accountHeader: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
      gap: 8,
    },
    accountName: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
    },
    // Account popup
    accountOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      paddingTop: 60,
      paddingRight: 16,
    },
    accountPopup: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 12,
      paddingVertical: 8,
      paddingHorizontal: 4,
      minWidth: 180,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    accountOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 12,
    },
    accountOptionPressed: {
      backgroundColor: isDark ? '#334155' : '#F3F4F6',
    },
    accountOptionText: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#F87171' : '#DC2626',
      marginLeft: 4,
    },
    accountOptionTextNormal: {
      fontSize: 14,
      color: isDark ? '#E5E7EB' : '#374151',
      marginLeft: 4,
    },
    accountDivider: {
      height: 1,
      backgroundColor: isDark ? '#334155' : '#E5E7EB',
      marginVertical: 12,
      // marginHorizontal: 12,
    },

    // Logout overlay styles
    logoutOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutCard: {
      width: '80%',
      maxWidth: 360,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 14,
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    logoutTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      marginBottom: 4,
    },
    logoutMessage: {
      fontSize: 13,
      color: isDark ? '#E5E7EB' : '#4B5563',
      marginBottom: 14,
    },
    logoutButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
    logoutSecondaryBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#D1D5DB',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
    },
    logoutSecondaryBtnPressed: {
      backgroundColor: isDark ? '#111827' : '#F3F4F6',
    },
    logoutSecondaryText: {
      fontSize: 12,
      color: isDark ? '#E5E7EB' : '#4B5563',
      fontWeight: '500',
    },
    logoutPrimaryBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: '#DC2626',
    },
    logoutPrimaryBtnPressed: {
      backgroundColor: '#B91C1C',
    },
    logoutPrimaryText: {
      fontSize: 12,
      color: '#FEF2F2',
      fontWeight: '600',
    },

    // Intro overlay styles
    introOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    introDim: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
    },
    introCardWrapper: {
      position: 'absolute',
    },
    // Auto-height card with responsive padding
    introCard: {
      borderRadius: Math.max(14, screenWidth * 0.04),
      padding: Math.max(12, screenWidth * 0.04),
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
      borderWidth: 1,
      borderColor: isDark ? '#1F2937' : '#E5E7EB',
    },
    introHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Math.max(4, screenWidth * 0.015),
      gap: Math.max(6, screenWidth * 0.02),
    },
    // Responsive font sizes based on screen width
    introStepBadge: {
      fontSize: Math.max(10, Math.min(13, screenWidth * 0.03)),
      fontWeight: '700',
      color: '#F9FAFB',
      paddingHorizontal: Math.max(6, screenWidth * 0.02),
      paddingVertical: Math.max(2, screenWidth * 0.008),
      borderRadius: 999,
      backgroundColor: Colors.primary,
    },
    introTitle: {
      fontSize: Math.max(13, Math.min(17, screenWidth * 0.04)),
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      flexShrink: 1,
    },
    introText: {
      fontSize: Math.max(11, Math.min(15, screenWidth * 0.035)),
      color: isDark ? '#E5E7EB' : '#4B5563',
      marginTop: Math.max(2, screenWidth * 0.005),
      lineHeight: Math.max(16, Math.min(22, screenWidth * 0.05)),
    },
    introButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: Math.max(8, screenWidth * 0.025),
      gap: Math.max(6, screenWidth * 0.02),
    },
    introSecondaryBtn: {
      paddingHorizontal: Math.max(10, screenWidth * 0.03),
      paddingVertical: Math.max(5, screenWidth * 0.015),
      borderRadius: 999,
      borderWidth: 1,
      borderColor: isDark ? '#4B5563' : '#D1D5DB',
      backgroundColor: isDark ? '#020617' : '#FFFFFF',
    },
    introSecondaryBtnPressed: {
      backgroundColor: isDark ? '#111827' : '#F3F4F6',
    },
    introSecondaryText: {
      fontSize: Math.max(10, Math.min(13, screenWidth * 0.03)),
      color: isDark ? '#E5E7EB' : '#4B5563',
      fontWeight: '500',
    },
    introPrimaryBtn: {
      paddingHorizontal: Math.max(12, screenWidth * 0.035),
      paddingVertical: Math.max(5, screenWidth * 0.015),
      borderRadius: 999,
      backgroundColor: Colors.primary,
    },
    introPrimaryBtnPressed: {
      backgroundColor: Colors.primaryDark ?? '#1D4ED8',
    },
    introPrimaryText: {
      fontSize: Math.max(10, Math.min(13, screenWidth * 0.03)),
      color: '#F9FAFB',
      fontWeight: '600',
    },

    // Arrow styles for curved PNG - responsive sizing
    arrowRow: {
      width: '100%',
      flexDirection: 'row',
      marginTop: -Math.max(30, screenWidth * 0.1),
      marginBottom: 0,
    },
    waveArrowImageTop: {
      width: Math.max(70, Math.min(100, screenWidth * 0.25)),
      height: Math.max(70, Math.min(100, screenWidth * 0.25)),
      resizeMode: 'contain',
      marginBottom: -Math.max(8, screenWidth * 0.025),
    },
    waveArrowImageBottom: {
      width: Math.max(70, Math.min(100, screenWidth * 0.25)),
      height: Math.max(70, Math.min(100, screenWidth * 0.25)),
      resizeMode: 'contain',
      transform: [{ rotate: '180deg' }],
      marginTop: -Math.max(8, screenWidth * 0.025),
    },

    // 🔹 Custom Exit Modal Styles - Minimal
    exitModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    exitModalContainer: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 16,
      width: '100%',
      maxWidth: 300,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    exitModalContent: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 20,
      alignItems: 'center',
    },
    exitModalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: isDark ? '#F9FAFB' : '#111827',
      textAlign: 'center',
      marginBottom: 6,
    },
    exitModalMessage: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
    },
    exitModalButtonContainer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: isDark ? '#334155' : '#E5E7EB',
    },
    exitModalButton: {
      flex: 1,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    exitModalButtonCancel: {
      backgroundColor: 'transparent',
      borderRightWidth: 1,
      borderRightColor: isDark ? '#334155' : '#E5E7EB',
    },
    exitModalButtonExit: {
      backgroundColor: 'transparent',
    },
    exitModalButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#DC2626',
    },
    exitModalButtonTextCancel: {
      fontSize: 15,
      fontWeight: '500',
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
  });
