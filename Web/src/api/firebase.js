import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, signInWithCustomToken } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpN6cWoqhIRA-sfW06Zqqh83wnVaJlPWM",
  authDomain: "bookinghomestaychat.firebaseapp.com",
  databaseURL:
    "https://bookinghomestaychat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bookinghomestaychat",
  storageBucket: "bookinghomestaychat.firebasestorage.app",
  messagingSenderId: "106627164077",
  appId: "1:106627164077:web:4aed6c4fdffb681d3f2324",
  measurementId: "G-PFB8H80XC5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth, ref, onValue, signInWithCustomToken };
