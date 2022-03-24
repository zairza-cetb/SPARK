import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth} from "firebase/auth"; 

const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_API_KEY}`,
  authDomain: "virque-6d662.firebaseapp.com",
  databaseURL: "https://virque-6d662-default-rtdb.firebaseio.com",
  projectId: `${process.env.REACT_APP_PROJECT_ID}`,
  storageBucket: "virque-6d662.appspot.com",
  messagingSenderId: "428804896137",
  appId: `${process.env.REACT_APP_ID}`,
  measurementId: "G-J5PJSYEH3J"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const dbs = getDatabase(app);
const authentication=getAuth(app);
export default authentication;