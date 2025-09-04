
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    projectId: "careercompass-ai-qno3f",
    appId: "1:622318145847:web:27fe6b36c6af9910c9cab2",
    storageBucket: "careercompass-ai-qno3f.firebasestorage.app",
    apiKey: "AIzaSyDj6wXqbdgkCk2l3k6YrvoCqxCtzTWbCMg",
    authDomain: "careercompass-ai-qno3f.firebaseapp.com",
    messagingSenderId: "622318145847",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({})
});

const auth = getAuth(app);


export { app, db, auth };
