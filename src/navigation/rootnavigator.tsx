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


// src/navigation/RootNavigator.tsx
import React from 'react';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import HomeTabs from './HomeScreen';
import VideoPlayerScreen from '../screens/Content/VideoPlayerScreen';
import PdfViewerScreen from '../screens/Content/PdfViewerScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import type { Question } from '../data/demo';
import MockTestPapersScreen from '../screens/Papers/MostTestPapersScreen';

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
    VideoPlayer: { title: string; url: string };
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

export default function RootNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',

                // 🌙 Global dark header theme
                headerStyle: { backgroundColor: '#0F172A' },
                headerTintColor: '#F9FAFB', // back arrow + icons
                headerTitleStyle: {
                    color: '#F9FAFB',
                    fontSize: 16,
                    fontWeight: '700',
                },
                headerShadowVisible: false, // remove bottom line
                // headerBackTitleVisible: false,
            }}
        >
            {/* Main app tabs (no header, uses its own) */}
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
                    title: route.params?.title || 'PDF',
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
        </Stack.Navigator>
    );
}
