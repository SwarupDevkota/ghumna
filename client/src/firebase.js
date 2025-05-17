// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_PKap9a_Yf04baiwpKqBVuPT2Ro94-zA",
  authDomain: "ghumnajaam-32ba3.firebaseapp.com",
  projectId: "ghumnajaam-32ba3",
  storageBucket: "ghumnajaam-32ba3.firebasestorage.app",
  messagingSenderId: "97355435903",
  appId: "1:97355435903:web:5141d00e55b3ceb876d44a",
  measurementId: "G-V7S0XDTN6P",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
