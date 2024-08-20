import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDATeHQMFhNTDKEyJzYWsbiOwf8n0llagg",
  authDomain: "flashcard-saas-46ffa.firebaseapp.com",
  projectId: "flashcard-saas-46ffa",
  storageBucket: "flashcard-saas-46ffa.appspot.com",
  messagingSenderId: "988182053429",
  appId: "1:988182053429:web:3ec57910ebb7b4941ca77c",
  measurementId: "G-RZHGR48D73"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics, db };

