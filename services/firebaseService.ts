import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRtc-t1Fe1vmXXRGQOtU5kNmaa0J8QLiI",
  authDomain: "moizic.firebaseapp.com",
  projectId: "moizic",
  storageBucket: "moizic.firebasestorage.app",
  messagingSenderId: "928612020325",
  appId: "1:928612020325:web:0dfbcf8b2c1517232c968c",
  measurementId: "G-H96DBC3JWZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);