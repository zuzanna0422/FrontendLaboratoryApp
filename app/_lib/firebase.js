// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1SLCgzghYTMyDBERfGFqExAKv8yM_Sew",
  authDomain: "frontendlaboratoryapp-827c6.firebaseapp.com",
  projectId: "frontendlaboratoryapp-827c6",
  storageBucket: "frontendlaboratoryapp-827c6.firebasestorage.app",
  messagingSenderId: "79925515136",
  appId: "1:79925515136:web:c8d157a23560e29c856765",
  measurementId: "G-HQJBTMDMF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);