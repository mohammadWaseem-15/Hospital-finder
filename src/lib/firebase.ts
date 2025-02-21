import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  signOut, 
  User 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCLtdCKtq3QrqPExjqe2u7oLlx14VaYEeE",
  authDomain: "hospital-finder-84026.firebaseapp.com",
  projectId: "hospital-finder-84026",
  storageBucket: "hospital-finder-84026.appspot.com",
  messagingSenderId: "409222533042",
  appId: "1:409222533042:web:20d028aa6f8717b450deab",
  measurementId: "G-7YDPR69LJJ"
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<{ user: User }> => {
  try {
    return await signInWithPopup(auth, provider);
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') {
      return await signInWithRedirect(auth, provider);
    }
    throw error;
  }
};

export const logout = () => signOut(auth);