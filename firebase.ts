
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

/**
 * FIREBASE CONFIGURATION
 * 
 * In a production environment, these values should be loaded from environment variables
 * (e.g., process.env.REACT_APP_FIREBASE_API_KEY) to ensure security and flexibility.
 * 
 * Current configuration uses hardcoded values for demonstration purposes.
 */

const firebaseConfig = {
  apiKey: "AIzaSyBzKWT3P544B-Kah6_00a72zZ3kG9wc6Aw",
  authDomain: "tripp-couch-studio.firebaseapp.com",
  projectId: "tripp-couch-studio",
  storageBucket: "tripp-couch-studio.firebasestor1age.app.",
  messagingSenderId: "542529423806",
  appId: "1:542529423806:web:643fc003b65c18c9a951ef"
};

// Initialize Firebase only once
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Export initialized services
export const auth = app.auth();
export const db = app.firestore();

export default app;
