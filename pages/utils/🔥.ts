import { collection, getDocs, getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCO_t4uAQwfHVf1_lA5_hcNx3e3uFR6ehM",
  authDomain: "global-markets5000.firebaseapp.com",
  projectId: "global-markets5000",
  storageBucket: "global-markets5000.appspot.com",
  messagingSenderId: "1031126459557",
  appId: "1:1031126459557:web:2f15c612dd8b0ad859d94c",
  measurementId: "G-F7HNFQ6K9T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
