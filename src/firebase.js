// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpyHNkR8ZG9AdDcy73WP0DmbdtkHUrZe0",
  authDomain: "sectionaryin.firebaseapp.com",
  projectId: "sectionaryin",
  storageBucket: "sectionaryin.firebasestorage.app",
  messagingSenderId: "1007442658580",
  appId: "1:1007442658580:web:7a20b8ab0d62b53d34ee01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);