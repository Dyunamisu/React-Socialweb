// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBacbHR3xbDumNUQ41o9A4Vio55KcVjM_o",
  authDomain: "react-course-4f407.firebaseapp.com",
  projectId: "react-course-4f407",
  storageBucket: "react-course-4f407.appspot.com",
  messagingSenderId: "296949069671",
  appId: "1:296949069671:web:e9afdec5c4a7fa3cfa61c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider =new GoogleAuthProvider();
export const db = getFirestore(app);