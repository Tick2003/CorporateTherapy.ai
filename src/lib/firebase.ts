import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailLink,
  isSignInWithEmailLink,
  signOut,
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
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    return { success: true };
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
}

// Note: This function needs to be implemented based on the desired authentication flow
// For now, it's a placeholder that will need to be updated according to requirements
export async function verifyOTP(email: string, code: string) {
  throw new Error('verifyOTP function needs to be implemented based on authentication requirements');
}

export async function logOut() {
  return signOut(auth);
}

export const signIn = signInWithEmailAndPassword;
export const sendMagicLink = signInWithEmailLink;
export { auth };