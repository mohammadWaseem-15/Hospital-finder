import { User } from 'firebase/auth';
import { signInWithGoogle } from '../lib/firebase';
import { MapPin } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
  setUser: (user: User) => void;
}

export default function Login({ setUser }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { user } = await signInWithGoogle();
      setUser(user);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(
        error.code === 'auth/popup-blocked'
          ? 'Popup was blocked. Trying redirect...'
          : error.code === 'auth/unauthorized-domain'
          ? 'This domain is not authorized for authentication. Please contact the administrator.'
          : 'Failed to sign in. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-8">
          <MapPin className="w-16 h-16 text-blue-500 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Hospital Finder</h1>
          <p className="text-gray-600 mt-2">Find nearby hospitals with just one click</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-blue-500 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        
        <p className="mt-4 text-sm text-gray-500">
          We'll help you locate the nearest hospitals in your area
        </p>
      </div>
    </div>
  );
}