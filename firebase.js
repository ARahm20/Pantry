import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
 apiKey: "AIzaSyDH-hRrYD9GTZkCowby8jaII15rEORttC4",
 authDomain: "pantry2-5196b.firebaseapp.com",
 projectId: "pantry2-5196b",
 storageBucket: "pantry2-5196b.appspot.com",
 messagingSenderId: "365652679618",
 appId: "1:365652679618:web:1b2cce0ae512a9861cd45b"
 };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };