// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "cloundfilemanagement.firebaseapp.com",
  projectId: "cloundfilemanagement",
  storageBucket: "cloundfilemanagement.appspot.com",
  messagingSenderId: "637253169273",
  appId: "1:637253169273:web:4e133529e1f13d92f5e4a8",
  measurementId: "G-D7JSWE0XQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage}
//const analytics = getAnalytics(app);
