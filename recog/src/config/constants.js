import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "API-KEY",
    authDomain: "AUTH-DOMAIN",
    databaseURL: "DATEBASE-URL",
    projectId: "PROJECT-ID",
    storageBucket: "STORAGE-BUCKET",
    messagingSenderId: "SENDER-ID",
    appId: "APP-ID"
  };

firebase.initializeApp(firebaseConfig); 
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const firebaseAuth = firebase.auth;
export const db = firebase.firestore().settings({
    timestampsInSnapshots: true
});

export const VISION_API = 'VISION-API-KEY'; 
