// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const {VITE_MEASUREMENT_ID:measurementId, VITE_APP_ID:appId, VITE_MESSAGING_SENDER_ID:messagingSenderId, VITE_STORAGE_BUCKET:storageBucket, VITE_PROJECT_ID:projectId, VITE_AUTH_DOMAIN:authDomain, VITE_API_KEY:apiKey} = import.meta.env
console.log("firebase env", apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId)
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);