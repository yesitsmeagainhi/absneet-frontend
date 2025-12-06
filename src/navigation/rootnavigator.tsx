// // src/navigation/RootNavigator.tsx
// import React from 'react';
// import LoginScreen from '../screens/Auth/LoginScreen';
// import SignUpScreen from '../screens/Auth/SignUpScreen';
// import HomeTabs from './HomeScreen';
// import VideoPlayerScreen from '../screens/Content/VideoPlayerScreen';
// import PdfViewerScreen from '../screens/Content/PdfViewerScreen'; // ✅ use viewer, not list

// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SubjectDetailScreen from '../screens/Subject/SubjectDetailScreen';
// import UnitsScreen from '../screens/StudyMaterial/UnitsScreen';
// import ChaptersScreen from '../screens/StudyMaterial/ChaptersScreen';
// import SelectUnitsOrChaptersScreen from '../screens/MCQ/SelectUnitsOrChaptersScreen';
// import CustomMCQQuiz from '../screens/MCQ/CustomMCQselectScreen';
// import CustomMCQSolve from '../screens/MCQ/CustomMCQSolveScreen';
// import MCQQuizScreen from '../screens/MCQ/MCQQuizScreen';
// import ResultScreen from '../screens/MCQ/ResultScreen';
// import ReviewAnswersScreen from '../screens/MCQ/ReviewAnswersScreen';

// import PYQSubjectsScreen from '../screens/Papers/PYQSubjectsScreen';
// import PYQYearsScreen from '../screens/PYQ/PYQYearsScreen';
// import PYQPapersScreen from '../screens/Papers/PYQPapersScreen';
// import PYQPdfPapersScreen from '../screens/PYQ/PYQPdfPapersScreen';
// import DemoMCQQuizScreen from '../screens/MCQ/DemoMCQQuizScreen';
// import HelpScreen from '../screens/Home/HelpScreen';
// import ContentTabs from './ContentTabs';
// import NewsTestScreen from '../screens/NewsTestScreen';
// import type { Question } from '../data/demo';
// import MockTestPapersScreen from '../screens/Papers/MostTestPapersScreen';

// export type CustomMcqQuestionParam = {
//     id: string;
//     question: string;
//     options: { A: string; B: string; C: string; D: string };
//     correctOption: 'A' | 'B' | 'C' | 'D';
//     subjectId?: string;
//     unitId?: string;
//     chapterId?: string;
// };

// export type RootStackParamList = {
//     Login: undefined;
//     SignUp: undefined;
//     HomeTabs: undefined;
//     NewsTest: undefined;
//     Help: undefined;
//     SubjectDetail: { subjectId: string };
//     Units: { subjectId: string };
//     Chapters: { subjectId: string; unitId: string };
//     ContentTabs: { subjectId: string; unitId: string; chapterId: string };
//     SelectUnitsOrChapters: { subjectId: string };
//     DemoMCQQuiz: { subjectId: string };
//     // MCQQuiz: {
//     //     subjectId: string;
//     //     chapterId: string;
//     //     unitId: string;
//     //     selectedQIds?: string[];
//     // };
//     MCQQuiz: {
//         subjectId?: string;
//         unitId?: string;
//         chapterId?: string;
//         title?: string;         // e.g. 'Physics – NEET 2023'
//         questions?: Question[]; // when using PYQ mode
//         explanation?: string;
//     };
//     VideoPlayer: { title: string; url: string };
//     CustomMCQQuiz: { subjectId?: string } | undefined;
//     MockTestPapers: undefined;
//     CustomMCQSolve: { questions: CustomMcqQuestionParam[] };
//     // ✅ single, consistent route for the viewer
//     PDFViewer: { title: string; url: string };
//     PYQSubjects: undefined;
//     PYQPapers: { subjectId: string; subjectName: string };
//     PYQYears: { subjectId: string; subjectName: string };
//     PYQQuiz: {
//         subjectId: string;
//         subjectName: string;
//         paperId: string;
//         title: string;
//         year: number;
//         exam: string;
//         questions: any[]; // or Question[] from your demo.ts
//     };
//     PYQPdfPapers: undefined;
//     // Result: { title: string, correct: number; total: number; answers: any[], questions: any[] };
//     // PYQSubjects: { subjectName: string };
//     // PYQPapers: { subjectId: string, subjectName: string };
//     Result: {
//         title?: string;
//         correct: number;
//         total: number;
//         questions: Question[];
//         answers: number[]; // index chosen per question (-1 for not answered)
//     };

//     ReviewAnswers: {
//         title?: string;
//         questions: Question[];
//         answers: number[];
//     };
//     NewsScreen: {

//     }

// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function RootNavigator() {
//     return (
//         <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
//             {/* <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
//       <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} /> */}
//             <Stack.Screen
//                 name="HomeTabs"
//                 component={HomeTabs}
//                 options={{ headerShown: false }}
//             />
//             <Stack.Screen
//                 name="DemoMCQQuiz"
//                 component={DemoMCQQuizScreen}
//                 options={{ title: 'Demo MCQ Quiz' }}
//             />

//             <Stack.Screen name="NewsTest" component={NewsTestScreen} />
//             <Stack.Screen name="Help" component={HelpScreen} />
//             <Stack.Screen
//                 name="SubjectDetail"
//                 component={SubjectDetailScreen}
//                 options={{ title: 'Subject' }}
//             />
//             <Stack.Screen name="Units" component={UnitsScreen} options={{ title: 'Units' }} />
//             <Stack.Screen
//                 name="Chapters"
//                 component={ChaptersScreen}
//                 options={{ title: 'Chapters' }}
//             />
//             <Stack.Screen
//                 name="ContentTabs"
//                 component={ContentTabs}
//                 options={{ title: 'Study Material' }}
//             />

//             <Stack.Screen
//                 name="SelectUnitsOrChapters"
//                 component={SelectUnitsOrChaptersScreen}
//                 options={{ title: 'Solve MCQ' }}
//             />

//             <Stack.Screen
//                 name="CustomMCQQuiz"
//                 component={CustomMCQQuiz}
//                 options={{ title: 'Custom MCQ Quiz' }}
//             />
//             <Stack.Screen
//                 name="CustomMCQSolve"
//                 component={CustomMCQSolve}
//                 options={{ title: 'Solve MCQ Quiz' }}
//             />
//             <Stack.Screen name="MCQQuiz" component={MCQQuizScreen} options={{ title: 'MCQ' }} />
//             <Stack.Screen
//                 name="VideoPlayer"
//                 component={VideoPlayerScreen}
//                 options={{ title: 'Video' }}
//             />

//             {/* ✅ use PdfViewerScreen here */}
//             <Stack.Screen
//                 name="PDFViewer"
//                 component={PdfViewerScreen}
//                 options={({ route }) => ({
//                     title: route.params?.title || 'PDF',
//                 })}
//             />

//             <Stack.Screen
//                 name="Result"
//                 component={ResultScreen}
//                 options={{ title: 'Result' }}
//             />
//             <Stack.Screen
//                 name="ReviewAnswers"
//                 component={ReviewAnswersScreen}
//                 options={{ title: 'Review Answers' }}
//             />

//             <Stack.Screen
//                 name="PYQSubjects"
//                 component={PYQSubjectsScreen}
//                 options={{ title: 'Previous Year MCQ' }}
//             />
//             <Stack.Screen name="PYQYears" component={PYQYearsScreen} />
//             <Stack.Screen
//                 name="PYQPdfPapers"
//                 component={PYQPdfPapersScreen}
//                 options={{ title: 'Previous Year MCQ Papers' }}
//             />
//             <Stack.Screen
//                 name="PYQPapers"
//                 component={PYQPapersScreen}
//                 options={{ title: 'PYQ Papers' }}
//             />
//             <Stack.Screen
//                 name="MockTestPapers"
//                 component={MockTestPapersScreen}
//                 options={{ title: 'Mock Test Papers' }}
//             />

//         </Stack.Navigator>
//     );
// }



//Only dark themed 
// // src/navigation/RootNavigator.tsx
// import React from 'react';
// import LoginScreen from '../screens/Auth/LoginScreen';
// import SignUpScreen from '../screens/Auth/SignUpScreen';
// import HomeTabs from './HomeScreen';
// import VideoPlayerScreen from '../screens/Content/VideoPlayerScreen';
// import PdfViewerScreen from '../screens/Content/PdfViewerScreen';

// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SubjectDetailScreen from '../screens/Subject/SubjectDetailScreen';
// import UnitsScreen from '../screens/StudyMaterial/UnitsScreen';
// import ChaptersScreen from '../screens/StudyMaterial/ChaptersScreen';
// import SelectUnitsOrChaptersScreen from '../screens/MCQ/SelectUnitsOrChaptersScreen';
// import CustomMCQQuiz from '../screens/MCQ/CustomMCQselectScreen';
// import CustomMCQSolve from '../screens/MCQ/CustomMCQSolveScreen';
// import MCQQuizScreen from '../screens/MCQ/MCQQuizScreen';
// import ResultScreen from '../screens/MCQ/ResultScreen';
// import ReviewAnswersScreen from '../screens/MCQ/ReviewAnswersScreen';

// import PYQSubjectsScreen from '../screens/Papers/PYQSubjectsScreen';
// import PYQYearsScreen from '../screens/PYQ/PYQYearsScreen';
// import PYQPapersScreen from '../screens/Papers/PYQPapersScreen';
// import PYQPdfPapersScreen from '../screens/PYQ/PYQPdfPapersScreen';
// import DemoMCQQuizScreen from '../screens/MCQ/DemoMCQQuizScreen';
// import HelpScreen from '../screens/Home/HelpScreen';
// import ContentTabs from './ContentTabs';
// import NewsTestScreen from '../screens/NewsTestScreen';
// import type { Question } from '../data/demo';
// import MockTestPapersScreen from '../screens/Papers/MostTestPapersScreen';

// export type CustomMcqQuestionParam = {
//     id: string;
//     question: string;
//     options: { A: string; B: string; C: string; D: string };
//     correctOption: 'A' | 'B' | 'C' | 'D';
//     subjectId?: string;
//     unitId?: string;
//     chapterId?: string;
// };

// export type RootStackParamList = {
//     Login: undefined;
//     SignUp: undefined;
//     HomeTabs: undefined;
//     NewsTest: undefined;
//     Help: undefined;
//     SubjectDetail: { subjectId: string };
//     Units: { subjectId: string };
//     Chapters: { subjectId: string; unitId: string };
//     ContentTabs: { subjectId: string; unitId: string; chapterId: string };
//     SelectUnitsOrChapters: { subjectId: string };
//     DemoMCQQuiz: { subjectId: string };
//     MCQQuiz: {
//         subjectId?: string;
//         unitId?: string;
//         chapterId?: string;
//         title?: string;
//         questions?: Question[];
//         explanation?: string;
//     };
//     VideoPlayer: { title: string; url: string };
//     CustomMCQQuiz: { subjectId?: string } | undefined;
//     MockTestPapers: undefined;
//     CustomMCQSolve: { questions: CustomMcqQuestionParam[] };
//     PDFViewer: { title: string; url: string };
//     PYQSubjects: undefined;
//     PYQPapers: { subjectId: string; subjectName: string };
//     PYQYears: { subjectId: string; subjectName: string };
//     PYQQuiz: {
//         subjectId: string;
//         subjectName: string;
//         paperId: string;
//         title: string;
//         year: number;
//         exam: string;
//         questions: any[];
//     };
//     PYQPdfPapers: undefined;
//     Result: {
//         title?: string;
//         correct: number;
//         total: number;
//         questions: Question[];
//         answers: number[];
//     };
//     ReviewAnswers: {
//         title?: string;
//         questions: Question[];
//         answers: number[];
//     };
//     NewsScreen: {};
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function RootNavigator() {
//     return (
//         <Stack.Navigator
//             screenOptions={{
//                 headerTitleAlign: 'center',

//                 // 🌙 Global dark header theme
//                 headerStyle: { backgroundColor: '#0F172A' },
//                 headerTintColor: '#F9FAFB', // back arrow + icons
//                 headerTitleStyle: {
//                     color: '#F9FAFB',
//                     fontSize: 16,
//                     fontWeight: '700',
//                 },
//                 headerShadowVisible: false, // remove bottom line
//                 // headerBackTitleVisible: false,
//             }}
//         >
//             {/* Main app tabs (no header, uses its own) */}
//             <Stack.Screen
//                 name="HomeTabs"
//                 component={HomeTabs}
//                 options={{ headerShown: false }}
//             />

//             <Stack.Screen
//                 name="DemoMCQQuiz"
//                 component={DemoMCQQuizScreen}
//                 options={{ title: 'Demo MCQ Quiz' }}
//             />

//             <Stack.Screen
//                 name="NewsTest"
//                 component={NewsTestScreen}
//                 options={{ title: 'News' }}
//             />

//             <Stack.Screen
//                 name="Help"
//                 component={HelpScreen}
//                 options={{ title: 'Help & Support' }}
//             />

//             <Stack.Screen
//                 name="SubjectDetail"
//                 component={SubjectDetailScreen}
//                 options={{ title: 'Subject' }}
//             />

//             <Stack.Screen
//                 name="Units"
//                 component={UnitsScreen}
//                 options={{ title: 'Units' }}
//             />

//             <Stack.Screen
//                 name="Chapters"
//                 component={ChaptersScreen}
//                 options={{ title: 'Chapters' }}
//             />

//             <Stack.Screen
//                 name="ContentTabs"
//                 component={ContentTabs}
//                 options={{ title: 'Study Material' }}
//             />

//             <Stack.Screen
//                 name="SelectUnitsOrChapters"
//                 component={SelectUnitsOrChaptersScreen}
//                 options={{ title: 'Solve MCQ' }}
//             />

//             <Stack.Screen
//                 name="CustomMCQQuiz"
//                 component={CustomMCQQuiz}
//                 options={{ title: 'Custom MCQ Quiz' }}
//             />

//             <Stack.Screen
//                 name="CustomMCQSolve"
//                 component={CustomMCQSolve}
//                 options={{ title: 'Solve MCQ Quiz' }}
//             />

//             <Stack.Screen
//                 name="MCQQuiz"
//                 component={MCQQuizScreen}
//                 options={{ title: 'MCQ Quiz' }}
//             />

//             <Stack.Screen
//                 name="VideoPlayer"
//                 component={VideoPlayerScreen}
//                 options={{ title: 'Video' }}
//             />

//             <Stack.Screen
//                 name="PDFViewer"
//                 component={PdfViewerScreen}
//                 options={({ route }) => ({
//                     title: route.params?.title || 'PDF',
//                 })}
//             />

//             <Stack.Screen
//                 name="Result"
//                 component={ResultScreen}
//                 options={{ title: 'Result' }}
//             />

//             <Stack.Screen
//                 name="ReviewAnswers"
//                 component={ReviewAnswersScreen}
//                 options={{ title: 'Review Answers' }}
//             />

//             <Stack.Screen
//                 name="PYQSubjects"
//                 component={PYQSubjectsScreen}
//                 options={{ title: 'Previous Year MCQ' }}
//             />

//             <Stack.Screen
//                 name="PYQYears"
//                 component={PYQYearsScreen}
//                 options={{ title: 'Select Year' }}
//             />

//             <Stack.Screen
//                 name="PYQPdfPapers"
//                 component={PYQPdfPapersScreen}
//                 options={{ title: 'Previous Year MCQ Papers' }}
//             />

//             <Stack.Screen
//                 name="PYQPapers"
//                 component={PYQPapersScreen}
//                 options={{ title: 'PYQ Papers' }}
//             />

//             <Stack.Screen
//                 name="MockTestPapers"
//                 component={MockTestPapersScreen}
//                 options={{ title: 'Mock Test Papers' }}
//             />
//         </Stack.Navigator>
//     );
// }
// src/navigation/RootNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar, ActivityIndicator, View, Text, StyleSheet } from 'react-native';

import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import HomeTabs from './HomeScreen';
import VideoPlayerScreen from '../screens/Content/VideoPlayerScreen';
import PdfViewerScreen from '../screens/Content/PdfViewerScreen';
import SubjectDetailScreen from '../screens/Subject/SubjectDetailScreen';
import UnitsScreen from '../screens/StudyMaterial/UnitsScreen';
import ChaptersScreen from '../screens/StudyMaterial/ChaptersScreen';
import SelectUnitsOrChaptersScreen from '../screens/MCQ/SelectUnitsOrChaptersScreen';
import CustomMCQQuiz from '../screens/MCQ/CustomMCQselectScreen';
import CustomMCQSolve from '../screens/MCQ/CustomMCQSolveScreen';
import MCQQuizScreen from '../screens/MCQ/MCQQuizScreen';
import ResultScreen from '../screens/MCQ/ResultScreen';
import ReviewAnswersScreen from '../screens/MCQ/ReviewAnswersScreen';
import PYQSubjectsScreen from '../screens/Papers/PYQSubjectsScreen';
import PYQYearsScreen from '../screens/PYQ/PYQYearsScreen';
import PYQPapersScreen from '../screens/Papers/PYQPapersScreen';
import PYQPdfPapersScreen from '../screens/PYQ/PYQPdfPapersScreen';
import DemoMCQQuizScreen from '../screens/MCQ/DemoMCQQuizScreen';
import HelpScreen from '../screens/Home/HelpScreen';
import ContentTabs from './ContentTabs';
import NewsTestScreen from '../screens/NewsTestScreen';
import MockTestPapersScreen from '../screens/Papers/MostTestPapersScreen';

import type { Question } from '../data/demo';
import { useTheme } from '../theme/ThemeContext';

// 🔹 Firebase Auth + AsyncStorage
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CustomMcqQuestionParam = {
    id: string;
    question: string;
    options: { A: string; B: string; C: string; D: string };
    correctOption: 'A' | 'B' | 'C' | 'D';
    subjectId?: string;
    unitId?: string;
    chapterId?: string;
};

export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    HomeTabs: undefined;
    NewsTest: undefined;
    Help: undefined;
    SubjectDetail: { subjectId: string };
    Units: { subjectId: string };
    Chapters: { subjectId: string; unitId: string };
    ContentTabs: { subjectId: string; unitId: string; chapterId: string };
    SelectUnitsOrChapters: { subjectId: string };
    DemoMCQQuiz: { subjectId: string };
    MCQQuiz: {
        subjectId?: string;
        unitId?: string;
        chapterId?: string;
        title?: string;
        questions?: Question[];
        explanation?: string;
    };
    VideoPlayer: {
        url?: string;
        title?: string;
        chapterId?: string;
        videoId?: string;
    };

    CustomMCQQuiz: { subjectId?: string } | undefined;
    MockTestPapers: undefined;
    CustomMCQSolve: { questions: CustomMcqQuestionParam[] };
    PDFViewer: { title: string; url: string };
    PYQSubjects: undefined;
    PYQPapers: { subjectId: string; subjectName: string };
    PYQYears: { subjectId: string; subjectName: string };
    PYQQuiz: {
        subjectId: string;
        subjectName: string;
        paperId: string;
        title: string;
        year: number;
        exam: string;
        questions: any[];
    };
    PYQPdfPapers: undefined;
    Result: {
        title?: string;
        correct: number;
        total: number;
        questions: Question[];
        answers: number[];
    };
    ReviewAnswers: {
        title?: string;
        questions: Question[];
        answers: number[];
    };
    NewsScreen: {};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// 🔐 Session TTL config
const LAST_LOGIN_KEY = 'abs_neet_last_login_at';
const SESSION_TTL_DAYS = 365;
const MS_IN_DAY = 1000 * 60 * 60 * 24;

export default function RootNavigator() {
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    const [initializing, setInitializing] = React.useState(true);
    const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null);

    // 🔥 Listen to Firebase Auth state + enforce 1-year TTL
    React.useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    const now = Date.now();
                    const stored = await AsyncStorage.getItem(LAST_LOGIN_KEY);

                    if (stored) {
                        const lastLogin = parseInt(stored, 10);
                        const diffDays = (now - lastLogin) / MS_IN_DAY;

                        if (diffDays > SESSION_TTL_DAYS) {
                            // ⛔ Session expired – sign out & clear stored date
                            await auth().signOut();
                            await AsyncStorage.removeItem(LAST_LOGIN_KEY);
                            setUser(null);
                            setInitializing(false);
                            return;
                        }
                    } else {
                        // first time seeing this user, set timestamp
                        await AsyncStorage.setItem(LAST_LOGIN_KEY, String(now));
                    }

                    // ✅ Valid, non-expired session
                    setUser(firebaseUser);
                } else {
                    setUser(null);
                }
            } catch (e) {
                console.warn('[RootNavigator] error in auth state / TTL check', e);
                // If something goes wrong, still let Firebase decide
                setUser(firebaseUser ?? null);
            } finally {
                setInitializing(false);
            }
        });

        return unsubscribe;
    }, []);

    const headerBg = isDark ? '#0F172A' : '#FFFFFF';
    const headerText = isDark ? '#F9FAFB' : '#111827';
    const screenBg = isDark ? '#020617' : '#F9FAFB';

    // 🔄 Small splash while we decide whether user is logged in
    if (initializing) {
        return (
            <View
                style={[
                    stylesInit.splash,
                    { backgroundColor: screenBg, paddingBottom: insets.bottom },
                ]}
            >
                <StatusBar
                    barStyle={isDark ? 'light-content' : 'dark-content'}
                    backgroundColor={headerBg}
                />
                <ActivityIndicator color={isDark ? '#E5E7EB' : '#4B5563'} />
                <Text style={[stylesInit.splashText, { color: headerText }]}>
                    Getting everything ready for your NEET prep…
                </Text>
            </View>
        );
    }

    return (
        <>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={headerBg}
            />
            <Stack.Navigator
                screenOptions={{
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: headerBg,
                    },
                    headerTintColor: headerText,
                    headerTitleStyle: {
                        color: headerText,
                        fontSize: 16,
                        fontWeight: '700',
                    },
                    headerShadowVisible: false,
                    contentStyle: {
                        backgroundColor: screenBg,
                        paddingBottom: insets.bottom,
                    },
                    statusBarStyle: isDark ? 'light' : 'dark',
                }}
            >
                {!user && (
                    <>
                        {/* Auth stack when not logged in */}
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="SignUp"
                            component={SignUpScreen}
                            options={{ headerShown: false }}
                        />
                    </>
                )}

                {user && (
                    <>
                        {/* Main app once logged in */}
                        <Stack.Screen
                            name="HomeTabs"
                            component={HomeTabs}
                            options={{ headerShown: false }}
                        />

                        <Stack.Screen
                            name="DemoMCQQuiz"
                            component={DemoMCQQuizScreen}
                            options={{ title: 'Demo MCQ Quiz' }}
                        />

                        <Stack.Screen
                            name="NewsTest"
                            component={NewsTestScreen}
                            options={{ title: 'News' }}
                        />

                        <Stack.Screen
                            name="Help"
                            component={HelpScreen}
                            options={{ title: 'Help & Support' }}
                        />

                        <Stack.Screen
                            name="SubjectDetail"
                            component={SubjectDetailScreen}
                            options={{ title: 'Subject' }}
                        />

                        <Stack.Screen
                            name="Units"
                            component={UnitsScreen}
                            options={{ title: 'Units' }}
                        />

                        <Stack.Screen
                            name="Chapters"
                            component={ChaptersScreen}
                            options={{ title: 'Chapters' }}
                        />

                        <Stack.Screen
                            name="ContentTabs"
                            component={ContentTabs}
                            options={{ title: 'Study Material' }}
                        />

                        <Stack.Screen
                            name="SelectUnitsOrChapters"
                            component={SelectUnitsOrChaptersScreen}
                            options={{ title: 'Solve MCQ' }}
                        />

                        <Stack.Screen
                            name="CustomMCQQuiz"
                            component={CustomMCQQuiz}
                            options={{ title: 'Custom MCQ Quiz' }}
                        />

                        <Stack.Screen
                            name="CustomMCQSolve"
                            component={CustomMCQSolve}
                            options={{ title: 'Solve MCQ Quiz' }}
                        />

                        <Stack.Screen
                            name="MCQQuiz"
                            component={MCQQuizScreen}
                            options={{ title: 'MCQ Quiz' }}
                        />

                        <Stack.Screen
                            name="VideoPlayer"
                            component={VideoPlayerScreen}
                            options={{ title: 'Video' }}
                        />

                        <Stack.Screen
                            name="PDFViewer"
                            component={PdfViewerScreen}
                            options={({ route }) => ({
                                title: route.params?.title || 'View PDF',
                            })}
                        />

                        <Stack.Screen
                            name="Result"
                            component={ResultScreen}
                            options={{ title: 'Result' }}
                        />

                        <Stack.Screen
                            name="ReviewAnswers"
                            component={ReviewAnswersScreen}
                            options={{ title: 'Review Answers' }}
                        />

                        <Stack.Screen
                            name="PYQSubjects"
                            component={PYQSubjectsScreen}
                            options={{ title: 'Previous Year MCQ' }}
                        />

                        <Stack.Screen
                            name="PYQYears"
                            component={PYQYearsScreen}
                            options={{ title: 'Select Year' }}
                        />

                        <Stack.Screen
                            name="PYQPdfPapers"
                            component={PYQPdfPapersScreen}
                            options={{ title: 'Previous Year MCQ Papers' }}
                        />

                        <Stack.Screen
                            name="PYQPapers"
                            component={PYQPapersScreen}
                            options={{ title: 'PYQ Papers' }}
                        />

                        <Stack.Screen
                            name="MockTestPapers"
                            component={MockTestPapersScreen}
                            options={{ title: 'Mock Test Papers' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </>
    );
}

const stylesInit = StyleSheet.create({
    splash: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    splashText: {
        marginTop: 8,
        fontSize: 13,
    },
});
