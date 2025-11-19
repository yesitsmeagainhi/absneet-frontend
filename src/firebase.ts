
// firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 🔴 Use the config from your absneet project (Project settings → Web app)
const firebaseConfig = {
    apiKey: "AIzaSyCK0KP5tmOAToJ5QnFTtO93waviKYeQ2sw",
    authDomain: "absneet.firebaseapp.com",
    projectId: "absneet",
    storageBucket: "absneet.firebasestorage.app",
    messagingSenderId: "574619272932",
    appId: "1:574619272932:web:8a8b2ef33f6406b2b78ef1",
    measurementId: "G-Z94EE4T6CZ"
};
// ensure we don't init twice in dev reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Named export: db
export const db = getFirestore(app);

// optional default export if you want the app
export default app;
