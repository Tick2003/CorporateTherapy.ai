import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export async function signUp(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function sendMagicLink(email: string) {
  const actionCodeSettings = {
    url: `${window.location.origin}/auth/verify`,
    handleCodeInApp: true
  };
  return sendSignInLinkToEmail(auth, email, actionCodeSettings);
}

export async function verifyMagicLink(email: string) {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    return signInWithEmailLink(auth, email, window.location.href);
  }
  throw new Error('Invalid magic link');
}

export async function logOut() {
  return signOut(auth);
}

export { auth };