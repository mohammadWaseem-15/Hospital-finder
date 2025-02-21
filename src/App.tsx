import { useState } from 'react';
import { User } from 'firebase/auth';
import Login from './components/Login';
import Map from './components/Map';
import { LogOut } from 'lucide-react';
import { logout } from './lib/firebase';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Hospital Finder</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.displayName}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <Map />
      </main>
    </div>
  );
}

export default App;