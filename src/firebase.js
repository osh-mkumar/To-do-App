import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCmt1zS1-ApoyvWMBGUs89ujzY7s783UNs",
  authDomain: "to-do-app-11f4d.firebaseapp.com",
  projectId: "to-do-app-11f4d",
  storageBucket: "to-do-app-11f4d.firebasestorage.app",
  messagingSenderId: "416428052846",
  appId: "1:416428052846:web:47307d1cd9512ff709317f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
