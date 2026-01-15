import React, { useState, useEffect } from 'react';
import { NavItem } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import KeywordResearch from './components/KeywordResearch';
import ContentAnalyzer from './components/ContentAnalyzer';
import Settings from './components/Settings';
import Rankings from './components/Rankings';
import { Bell, Search as SearchIcon } from 'lucide-react';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavItem>('dashboard');
  const [settings, setSettings] = useState(storageService.getSettings());

  useEffect(() => {
    const handleStorageChange = () => {
      setSettings(storageService.getSettings());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'keywords':
        return <KeywordResearch />;
      case 'audit':
        return <ContentAnalyzer />;
      case 'settings':
        return <Settings onSettingsUpdate={setSettings} />;
      case 'rankings':
        return <Rankings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userName={settings.userName || 'Local User'}
      />
      
      <main className="flex-1 lg:ml-72 p-6 lg:p-12 relative overflow-y-auto h-screen custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <div className="hidden lg:flex justify-end items-center gap-4 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
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

          <div 
            key={activeTab} 
            className="mb-24 lg:mb-0 animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-500 fill-mode-both"
          >
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;