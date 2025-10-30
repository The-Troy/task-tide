// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZi_rFwn1VgXaoaaSqteO8D1ZK2qUrwJQ",
  authDomain: "wekasmart-3700d.firebaseapp.com",
  projectId: "wekasmart-3700d",
  storageBucket: "wekasmart-3700d.firebasestorage.app",
  messagingSenderId: "282509481703",
  appId: "1:282509481703:web:dff5dc31f1698f6747f442",
  measurementId: "G-2XPS8VZ8H8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
