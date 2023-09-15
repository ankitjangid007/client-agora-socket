// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA5nQ8K6g1jbEQJh7bc7AmakZ2zJUASL1M",
  authDomain: "fir-learning-5f5f2.firebaseapp.com",
  projectId: "fir-learning-5f5f2",
  storageBucket: "fir-learning-5f5f2.appspot.com",
  messagingSenderId: "238186255490",
  appId: "1:238186255490:web:56313479a7515c7b2d909b",
  measurementId: "G-V7787KGSH5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
