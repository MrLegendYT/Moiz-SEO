import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
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

// Ensure app is initialized exactly once
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize and export Auth using the specific app instance
// Pinned to 11.1.0 in index.html to avoid "Component auth not registered" version mismatch errors
export const auth: Auth = getAuth(app);

// Safe analytics initialization
isSupported().then(supported => {
  if (supported) {
    getAnalytics(app);
  }
}).catch(err => {
  console.warn("Firebase Analytics initialization skipped:", err);
});