import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwyJMVfKR1XguC12QuYyfAVycmEX1f5O0",
  authDomain: "unnews-b0818.firebaseapp.com",
  projectId: "unnews-b0818",
  storageBucket: "unnews-b0818.firebasestorage.app",
  messagingSenderId: "843632495033",
  appId: "1:843632495033:web:97bae4ed05b458c76cce68",
  measurementId: "G-CTGB10GEV3",
};

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
