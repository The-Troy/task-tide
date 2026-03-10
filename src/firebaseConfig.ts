// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJaFjeiyWye4BX8ME01wF5JpRsUAzu8AE",
  authDomain: "task-tide-001.firebaseapp.com",
  projectId: "task-tide-001",
  storageBucket: "task-tide-001.firebasestorage.app",
  messagingSenderId: "571180722907",
  appId: "1:571180722907:web:d5f9bd49c7a2f1bbf2bafe",
  measurementId: "G-RSBB2MDKYL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);