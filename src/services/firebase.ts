// Web SDK – only for the admin site (not the RN app)
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCK0KP5tmOAToJ5QnFTtO93waviKYeQ2sw",
    authDomain: "absneet.firebaseapp.com",
    projectId: "absneet",
    storageBucket: "absneet.firebasestorage.app",
    messagingSenderId: "574619272932",
    appId: "1:574619272932:web:8a8b2ef33f6406b2b78ef1",
    measurementId: "G-Z94EE4T6CZ"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
