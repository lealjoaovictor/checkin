import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBD120-DvcmxuGpqI9agbdmNo_8lRR-nBM",
  authDomain: "checkin-1211c.firebaseapp.com",
  projectId: "checkin-1211c",
  storageBucket: "checkin-1211c.firebasestorage.app",
  messagingSenderId: "105487822027",
  appId: "1:105487822027:web:f85148f62ccbbaca4b3f4e"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);