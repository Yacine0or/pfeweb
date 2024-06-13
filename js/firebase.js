// import { initializeApp } from 'firebase/app';
// import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { collection, doc, getDocs, getFirestore, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCDkt1cjZcdIgC0CW8Ysbdu5YWQuaIOYR8",
  authDomain: "flutterfirebase-d1c32.firebaseapp.com",
  projectId: "flutterfirebase-d1c32",
  storageBucket: "flutterfirebase-d1c32.appspot.com",
  messagingSenderId: "596243185568",
  appId: "1:596243185568:web:017ee2a632219c06b3aec5",
  measurementId: "G-Q5HTZWQFS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { collection, db, doc, getDocs, setDoc };
 