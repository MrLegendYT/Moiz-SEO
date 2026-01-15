
import React, { useState, useEffect } from 'react';
import { User, NavItem } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KeywordResearch from './components/KeywordResearch';
import ContentAnalyzer from './components/ContentAnalyzer';
import Settings from './components/Settings';
import Rankings from './components/Rankings';
import Auth from './components/Auth';
import { Bell, Search as SearchIcon } from 'lucide-react';
import { auth } from './services/firebaseService';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
        });
      } else {
        setUser(null);
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'keywords':
        return <KeywordResearch />;
      case 'audit':
        return <ContentAnalyzer />;
      case 'settings':
        return <Settings />;
      case 'rankings':
        return <Rankings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userName={user.name}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 md:ml-64 p-6 lg:p-12 relative overflow-y-auto h-screen custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          {/* Top Header Controls - Desktop Only */}
          <div className="hidden md:flex justify-end items-center gap-4 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="bg-zinc-900/50 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-xs w-56 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all focus:bg-zinc-900"
              />
            </div>
            <button className="p-2.5 bg-zinc-900/50 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:border-zinc-700 transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-black"></span>
            </button>
          </div>

          {/* Dynamic Content with Key-based Transition */}
          <div 
            key={activeTab} 
            className="mb-16 md:mb-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-500 fill-mode-both"
          >
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
