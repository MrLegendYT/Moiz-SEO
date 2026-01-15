
import React from 'react';
import { NavItem } from '../types';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  TrendingUp, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavItem;
  setActiveTab: (tab: NavItem) => void;
  userName: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userName, onLogout }) => {
  const menuItems = [
    { id: 'dashboard' as NavItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'keywords' as NavItem, label: 'Keywords', icon: Search },
    { id: 'audit' as NavItem, label: 'Audit', icon: FileText },
    { id: 'rankings' as NavItem, label: 'Rankings', icon: TrendingUp },
    { id: 'settings' as NavItem, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar (1024px and above) */}
      <div className="hidden lg:flex w-72 h-screen bg-zinc-950 border-r border-zinc-800 flex-col fixed left-0 top-0 z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-zinc-600">
            MOIZ SEO
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 relative group overflow-hidden ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' 
                  : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
            >
              <item.icon size={22} className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-500`} />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-900 bg-zinc-950/50">
          <div className="flex items-center gap-4 px-2 mb-6 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition-transform duration-500">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-zinc-100 truncate">{userName}</span>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Public Account</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-5 py-3 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all duration-300 font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Bottom Navigation (Below 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800 flex items-center justify-around px-6 py-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] rounded-t-[2.5rem]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-500 relative px-4 py-2 rounded-2xl ${
              activeTab === item.id ? 'text-blue-500 scale-110' : 'text-zinc-500 active:scale-95'
            }`}
          >
            <item.icon size={24} />
            <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute -top-1 w-1 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
