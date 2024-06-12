// import { initializeApp } from 'firebase/app';
// import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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



// const docRef = doc(db, "groups", "Si1");
// const docSnap = await getDoc(docRef);
// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
// } else {
//   // docSnap.data() will be undefined in this case
//   console.log("No such document!");
// }

export { db, collection, getDocs, setDoc, doc  };