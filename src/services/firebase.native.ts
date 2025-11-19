// // React Native Firebase (no initializeApp here)
// // import firestore from '@react-native-firebase/firestore';
// // import auth from '@react-native-firebase/auth';

// // export const db = firestore();
// // export const fbAuth = auth();
// // export default { db, fbAuth };
// import firestore from '@react-native-firebase/firestore';
// // import auth from '@react-native-firebase/auth'; // add only if installed & needed

// export const db = firestore();
// // export const fbAuth = auth(); // uncomment if you installed @react-native-firebase/auth
// export default { db };

import firestore from '@react-native-firebase/firestore';
export const db = firestore();
export default db;

