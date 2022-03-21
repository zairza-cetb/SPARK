// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNwa2xrDEbPnBerqgiId3OAj1vPjJdTpQ",
  authDomain: "virque-605bf.firebaseapp.com",
  projectId: "virque-605bf",
  storageBucket: "virque-605bf.appspot.com",
  messagingSenderId: "598181189485",
  appId: "1:598181189485:web:d01edbf456cee23ac76c64",
  measurementId: "G-X4Y3WPEPFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);