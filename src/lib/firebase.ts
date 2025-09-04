
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'careercompass-ai-qno3f',
  appId: '1:622318145847:web:27fe6b36c6af9910c9cab2',
  storageBucket: 'careercompass-ai-qno3f.appspot.com',
  apiKey: 'AIzaSyDj6wXqbdgkCk2l3k6YrvoCqxCtzTWbCMg',
  authDomain: 'careercompass-ai-qno3f.firebaseapp.com',
  messagingSenderId: '622318145847',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
