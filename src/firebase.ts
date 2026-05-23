import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDvxmzG3pch9sv51kNdoMzDlQmxXD_T0U4",
  authDomain: "thanudiarts-web.firebaseapp.com",
  projectId: "thanudiarts-web",
  storageBucket: "thanudiarts-web.firebasestorage.app",
  messagingSenderId: "763882926088",
  appId: "1:763882926088:web:be2252795583cf2f4c61bd",
  measurementId: "G-DMRQ6WZFJH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
