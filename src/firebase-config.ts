import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const initFirebaseConfig = `${process.env.NEXT_PUBLIC_FIREBASE_CONFIG}`;
const firebaseConfig = JSON.parse(initFirebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
