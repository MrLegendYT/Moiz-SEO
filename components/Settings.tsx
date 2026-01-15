
import React, { useState } from 'react';
import { User, Bell, Shield, Smartphone, Save } from 'lucide-react';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState(storageService.getSettings());
  const [saveStatus, setSaveStatus] = useState('');

  const handleToggle = async (id: string) => {
    const currentVal = settings[id] ?? false;
    const newStatus = !currentVal;
    
    if (newStatus) {
      try {
        // Request permission but don't block the UI toggle if it fails or is denied
        // Many web environments block direct Notification.requestPermission()
        await notificationService.requestPermission();
      } catch (err) {
        console.warn("Notification permission request failed", err);
      }
    }

    const updatedSettings = { ...settings, [id]: newStatus };
    setSettings(updatedSettings);
    storageService.saveSettings(updatedSettings);
  };

  const handleSave = () => {
    storageService.saveSettings(settings);
    setSaveStatus('Settings committed to cloud identity.');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Preferences</h1>
        <p className="text-zinc-400 mt-1">Configure your personal intelligence feed and tool behavior.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
              <User size={20} className="text-blue-500" />
              Identity Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Display Name</label>
                <input 
                  type="text" 
                  defaultValue="Moiz"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Account Email</label>
                <input 
                  type="email" 
                  disabled
                  defaultValue="user@moizseo.com"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
              <Bell size={20} className="text-purple-500" />
              Intelligence Alerts
            </h3>
            <div className="space-y-6">
              {[
                { id: 'email_alerts', label: 'Ranking Volatility Alerts', desc: 'Push notifications when tracked keywords jump or drop significantly.' },
                { id: 'weekly_report', label: 'Real-time Analytics Summary', desc: 'Receive a summary notification when scanning is complete.' },
                { id: 'product_updates', label: 'Feature Notifications', desc: 'Be the first to know about new AI tools and engine updates.' }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between group">
                  <div className="max-w-[80%]">
                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.label}</p>
                    <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle(item.id)}
                    className={`w-14 h-7 rounded-full transition-all duration-300 relative ${settings[item.id] ? 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-zinc-800'}`}
                  >
                    <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings[item.id] ? 'right-1.5 scale-110' : 'left-1.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            {saveStatus && <span className="text-emerald-400 text-sm font-bold animate-pulse">{saveStatus}</span>}
            <button 
              onClick={handleSave}
              className="ml-auto flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/20 active:scale-95"
            >
              <Save size={18} />
              Commit Changes
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <Shield size={20} className="text-rose-500" />
              App Security
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">Your data is stored locally within your browser's secure container and synced with your Firebase identity.</p>
            <div className="p-4 bg-black/50 border border-zinc-800 rounded-2xl flex items-center justify-between group hover:border-zinc-700 transition-colors">
              <span className="text-[10px] font-mono font-bold text-zinc-600 tracking-wider">SECURE_INSTANCE_ID</span>
              <span className="text-[10px] font-mono font-bold text-zinc-400">#4829A-Z</span>
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
              <Smartphone size={20} className="text-blue-500" />
              Device Status
            </h3>
            <div className="flex items-center gap-3 text-emerald-400 text-xs font-bold bg-emerald-400/5 p-3 rounded-xl border border-emerald-400/20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              System Online & Synchronized
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
