import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth  } from "firebase/auth";
import firebase from "firebase/compat"

// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRM776zVz1DW9FzXflYUJVapF2dm7xROY",
    authDomain: "fitcheck-6c383.firebaseapp.com",
    databaseURL: "https://fitcheck-6c383-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fitcheck-6c383",
    storageBucket: "fitcheck-6c383.appspot.com",
    messagingSenderId: "764884969853",
    appId: "1:764884969853:web:2e38fb90d8878b2eb10414",
    measurementId: "G-B1SFXBM8JP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
