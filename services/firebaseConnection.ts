import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeRFVSMT-LP16sncSOVWVEa2MXPlpSKBk",
  authDomain: "web-leve-saude.firebaseapp.com",
  projectId: "web-leve-saude",
  storageBucket: "web-leve-saude.firebasestorage.app",
  messagingSenderId: "264858601873",
  appId: "1:264858601873:web:f8c6375ff640ac9daa7230",
  measurementId: "G-WWTD5HKJ7J",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db };

