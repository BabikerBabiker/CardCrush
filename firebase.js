import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const analytics = getAnalytics(app);
const db = getFirestore(app)

export { db };
