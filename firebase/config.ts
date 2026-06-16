import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
// if (!apiKey) {
//   throw new Error(
//     "Missing VITE_FIREBASE_API_KEY. Add it to `.env.local` in the project root.",
//   )
// }

const firebaseConfig = {
  apiKey: "AIzaSyAgFGe8F0lcWl8OBE76Abgd7M08ktAN8Ms",
  authDomain: "backstreet-2dd6c.firebaseapp.com",
  projectId: "backstreet-2dd6c",
  storageBucket: "backstreet-2dd6c.firebasestorage.app",
  messagingSenderId: "565445804025",
  appId: "1:565445804025:web:8e9b6e2a72791456278728",
  measurementId: "G-0GV6JR2PX0",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
