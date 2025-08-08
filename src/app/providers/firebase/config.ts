import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAo-QyFspEyrxTTUYRDNM5Yp1g59VHg458",
  authDomain: "auth-provider-f657a.firebaseapp.com",
  projectId: "auth-provider-f657a",
  storageBucket: "auth-provider-f657a.firebasestorage.app",
  messagingSenderId: "35255857583",
  appId: "1:35255857583:web:46478ae79eeb747f963f5a",
  measurementId: "G-Y5M7C3NTPL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
