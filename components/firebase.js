// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtzlF50e0h1T7S6XRJMNg9IfrAmkiUgUw",
  authDomain: "memory-c1718.firebaseapp.com",
  projectId: "memory-c1718",
  storageBucket: "memory-c1718.appspot.com", // Fixed typo
  messagingSenderId: "187173832338",
  appId: "1:187173832338:web:e6a5b9dfbd875bd8ff484b",
  measurementId: "G-VNDFC4P9LK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);