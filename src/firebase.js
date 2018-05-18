// Import the Firebase modules that you need in your app.
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";

// Initalize and export Firebase.

const config = {
  apiKey: "AIzaSyBuQ-ORQVLPTnFAE_Odz5-xZFlvIAJ0XQc",
  authDomain: "croissant-evaluator.firebaseapp.com",
  databaseURL: "https://croissant-evaluator.firebaseio.com",
  projectId: "croissant-evaluator",
  storageBucket: "croissant-evaluator.appspot.com",
  messagingSenderId: "774260640907",
};

export default firebase.initializeApp(config);