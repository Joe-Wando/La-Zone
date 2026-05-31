import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBHAr89_OxwfsuNh6RaNVUJ3RzyjSw0bIY",
  authDomain: "cine-app-14a67.firebaseapp.com",
  projectId: "cine-app-14a67",
  storageBucket: "cine-app-14a67.firebasestorage.app",
  messagingSenderId: "56094840520",
  appId: "1:56094840520:web:0cccd62dfab447aa79f7fd"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)