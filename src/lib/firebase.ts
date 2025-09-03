
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
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
const db = getFirestore(app);
const auth = getAuth(app);

if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
            console.warn('The current browser does not support all of the features required to enable persistence.');
        }
    });
}


export { app, db, auth };

