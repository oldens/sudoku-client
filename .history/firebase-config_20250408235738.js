import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA8p9fotwB6PaPY5Dd9QMuT-JJ5u4sksGU",
    authDomain: "is-demo-a27a0.firebaseapp.com",
    databaseURL: "https://is-demo-a27a0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "is-demo-a27a0",
    storageBucket: "is-demo-a27a0.firebasestorage.app",
    messagingSenderId: "378406934320",
    appId: "1:378406934320:web:b0dfc06ae26a17a6e89af5",
    measurementId: "G-46101HHH7Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, ref, set, onValue, signInWithPopup };
