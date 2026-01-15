
import React, { useState, useEffect } from 'react';
import { Search, Loader2, TrendingUp, TrendingDown, Trash2, Globe, Plus, AlertCircle, Calendar } from 'lucide-react';
import { checkSerpPosition } from '../services/geminiService';
import { RankingData } from '../types';
import { storageService } from '../services/storageService';
import { notificationService } from '../services/notificationService';

const Rankings: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRankings(storageService.getRankings());
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !url.trim()) return;

    setLoading(true);
    try {
      const result = await checkSerpPosition(url, keyword);
      const newRanking: RankingData = {
        ...result,
        id: Math.random().toString(36).substr(2, 9),
        lastChecked: new Date().toLocaleDateString()
      };
      
      const updated = [newRanking, ...rankings];
      setRankings(updated);
      storageService.saveRankings(updated);
      setKeyword('');

      // Notify user about new ranking
      notificationService.send(
        `SERP Position Detected: #${newRanking.position}`,
        { body: `Domain ${newRanking.url} is ranking for "${newRanking.keyword}".` },
        'volatility'
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeRanking = (id: string) => {
    const updated = rankings.filter(r => r.id !== id);
    setRankings(updated);
    storageService.saveRankings(updated);
  };

  return (
    <div className="space-y-10 pb-24 md:pb-0">
      <header>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">SERP Tracking</h1>
        <p className="text-zinc-400 mt-2 text-lg">Precision monitoring for global search positions.</p>
      </header>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-700">
        <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Target Domain</label>
            <div className="relative group">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                required
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all text-sm font-medium"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Keyword</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input
                type="text"
                required
                placeholder="Target keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all text-sm font-medium"
              />
            </div>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[58px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3 text-sm"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Start Tracking</>}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rankings.length > 0 ? (
          rankings.map((r, idx) => (
            <div 
              key={r.id} 
              className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-blue-500/30 hover:bg-zinc-800/40 transition-all duration-500 animate-in slide-in-from-bottom-4 group"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h3 className="text-2xl font-extrabold text-white group-hover:text-blue-400 transition-colors">{r.keyword}</h3>
                  <div className="px-3 py-1 bg-zinc-800 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest border border-zinc-700">
                    {r.url}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
                   <div className="flex items-center gap-2 text-xs font-bold">
                     <Calendar size={14} />
                     Checked: {r.lastChecked}
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-center min-w-[80px]">
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-2">Position</p>
                  <p className="text-4xl font-black text-white group-hover:scale-110 transition-transform duration-500">#{r.position}</p>
                </div>
                
                <div className="text-center min-w-[80px]">
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-2">Volatility</p>
                  <div className={`flex items-center justify-center font-black text-lg ${r.change > 0 ? 'text-rose-400' : r.change < 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {r.change > 0 ? <TrendingDown size={20} className="mr-1.5" /> : r.change < 0 ? <TrendingUp size={20} className="mr-1.5" /> : null}
                    {Math.abs(r.change)}
                  </div>
                </div>

                <button 
                  onClick={() => removeRanking(r.id)}
                  className="p-4 bg-zinc-800/50 text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-2xl transition-all active:scale-90"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-[3rem] animate-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-zinc-800 shadow-2xl">
               <AlertCircle size={48} className="text-zinc-700" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-400">Target Keywords Empty</h2>
            <p className="text-zinc-500 mt-3 max-w-sm text-lg font-medium">Populate your tracker to start receiving precision position updates across the global web.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rankings;
