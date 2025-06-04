import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  sendEmailVerificationCode,
  verifyEmailWithCode
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

export async function signUp(email: string) {
  try {
    await sendEmailVerificationCode(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}

export async function verifyOTP(email: string, code: string) {
  try {
    await verifyEmailWithCode(auth, email, code);
    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
}

export async function logOut() {
  return signOut(auth);
}

export { auth };