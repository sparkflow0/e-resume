// Use global firebase from CDN
// Cast to any to avoid TS errors since we don't have types installed
const firebase = (window as any).firebase;

if (!firebase) {
    console.error("Firebase SDK not loaded from CDN!");
}

const firebaseConfig = {
    apiKey: "AIzaSyDe3iVcf0LV95Dif8aMG8pfXLWzQj8ursw",
    authDomain: "e-resume-53ba6.firebaseapp.com",
    projectId: "e-resume-53ba6",
    storageBucket: "e-resume-53ba6.firebasestorage.app",
    messagingSenderId: "202681971684",
    appId: "1:202681971684:web:594635f0b25de5cbec4df1"
};

// Initialize Firebase
// Check if already initialized to avoid hot-reload errors
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

export const auth = app.auth();
export const db = app.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
