import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const initFirebaseConfig = `${process.env.NEXT_PUBLIC_FIREBASE_CONFIG}`;
const firebaseConfig = JSON.parse(initFirebaseConfig);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const initAuth = getAuth();
const initDb = getFirestore(app);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  connectFirestoreEmulator(initDb, "127.0.0.1", 8080);
  connectAuthEmulator(initAuth, "http://127.0.0.1:9099");
}

export const auth = initAuth;
export const db = initDb;
