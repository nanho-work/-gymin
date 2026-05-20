import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

function hasFirebaseConfig() {
  return Object.values(firebaseConfig).every((value) => value && value !== "CHANGE_ME");
}

export function getFirebaseAuth() {
  if (!hasFirebaseConfig()) {
    throw new Error("Firebase 설정이 web/.env에 아직 입력되지 않았습니다.");
  }

  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }

  if (!firebaseAuth) {
    firebaseAuth = getAuth(firebaseApp);
  }

  return firebaseAuth;
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});
