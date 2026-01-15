import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDRtc-t1Fe1vmXXRGQOtU5kNmaa0J8QLiI",
  authDomain: "moizic.firebaseapp.com",
  projectId: "moizic",
  storageBucket: "moizic.firebasestorage.app",
  messagingSenderId: "928612020325",
  appId: "1:928612020325:web:0dfbcf8b2c1517232c968c",
  measurementId: "G-H96DBC3JWZ"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth immediately to ensure it's registered before consumption
export const auth = getAuth(app);

// Initialize Analytics conditionally to prevent errors in private modes or ad-block environments
isSupported().then(supported => {
  if (supported) {
    getAnalytics(app);
  }
}).catch(err => {
  console.warn("Firebase Analytics not supported or blocked in this environment:", err);
});
