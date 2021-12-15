// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBH89ygjackFZVdrDLF5VRH1u3ojig0oBM",
    authDomain: "twitter-clone-1fc8a.firebaseapp.com",
    projectId: "twitter-clone-1fc8a",
    storageBucket: "twitter-clone-1fc8a.appspot.com",
    messagingSenderId: "24697757729",
    appId: "1:24697757729:web:bf04ace2a49a2c046f8360",
    measurementId: "G-49N98TSLVS"
  };

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };