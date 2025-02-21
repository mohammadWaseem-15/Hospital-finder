import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut 
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export { auth, provider };