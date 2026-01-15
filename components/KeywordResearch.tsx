import React, { useState, useEffect } from 'react';
import { Search, Loader2, BarChart3, Copy, DollarSign, Activity, ExternalLink, Trash2, Zap, AlertTriangle } from 'lucide-react';
import { getKeywordIdeas } from '../services/geminiService';
import { KeywordData } from '../types';
import { storageService } from '../services/storageService';

const KeywordResearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmbed, setShowEmbed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = storageService.getKeywords();
    if (saved.length > 0) setResults(saved);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const data = await getKeywordIdeas(query);
      if (data && data.length > 0) {
        setResults(data);
        storageService.saveKeywords(data);
      } else {
        setError("No keywords returned. Please check your topic or API configuration.");
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setError("Analysis failed. This is usually due to a missing or invalid API Key in the deployment settings.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text = results.map(r => r.keyword).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearResults = () => {
    setResults([]);
    storageService.saveKeywords([]);
    setError(null);
  };

  const getDifficultyColor = (diff: number) => {
    if (diff < 30) return 'text-emerald-400';
    if (diff < 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="space-y-10 pb-24 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Keyword Intelligence</h1>
          <p className="text-zinc-400 mt-2 text-lg">AI-powered discovery for competitive search terms.</p>
        </div>
        <button 
          onClick={() => setShowEmbed(!showEmbed)}
          className="flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm font-bold text-zinc-300 hover:text-white hover:border-blue-500/50 transition-all active:scale-95"
        >
          <ExternalLink size={18} />
          {showEmbed ? 'Hide Crawler' : 'Launch Google Crawler'}
        </button>
      </header>

      {showEmbed && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 animate-in slide-in-from-top-4 duration-500 shadow-2xl">
          <h3 className="text-xs font-black text-zinc-500 mb-6 uppercase tracking-[0.3em]">Google Custom Search Embed</h3>
          <div className="gcse-search"></div>
        </div>
      )}

      <form onSubmit={handleSearch} className="relative max-w-3xl group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Analyze a niche or topic (e.g. 'saas marketing')..."
          className="w-full h-[72px] bg-zinc-900 border border-zinc-800 rounded-[1.5rem] pl-16 pr-40 text-white text-lg focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all group-hover:border-zinc-700 font-medium"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={28} />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-3 top-3 bottom-3 px-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-[1.2rem] font-black transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95 min-w-[140px]"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} fill="currentColor" /> Research</>}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-1000">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              Intelligence Feed 
              <span className="text-xs bg-zinc-800 text-zinc-500 px-3 py-1 rounded-full">{results.length} found</span>
            </h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${copied ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                <Copy size={16} />
                {copied ? 'Copied' : 'Copy All'}
              </button>
              <button 
                onClick={clearResults}
                className="p-3 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-500/20 rounded-2xl transition-all"
                title="Wipe results"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-zinc-800/30 text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-6">Keyword Identifier</th>
                    <th className="px-8 py-6">Monthly Volume</th>
                    <th className="px-8 py-6">Difficulty</th>
                    <th className="px-8 py-6">Search Intent</th>
                    <th className="px-8 py-6">Est. CPC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {results.map((item, idx) => (
                    <tr 
                      key={idx} 
                      className="hover:bg-zinc-800/40 transition-all duration-300 group cursor-default"
                    >
                      <td className="px-8 py-6 font-bold text-zinc-100 group-hover:text-blue-400 transition-colors text-lg">{item.keyword}</td>
                      <td className="px-8 py-6 text-zinc-400">
                        <div className="flex items-center gap-3">
                          <Activity size={18} className="text-blue-500/50" />
                          <span className="font-mono text-sm">{item.volume.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className={`px-8 py-6 font-black text-sm ${getDifficultyColor(item.difficulty)}`}>
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${item.difficulty < 30 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                           {item.difficulty}%
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1.5 rounded-xl bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-zinc-700">
                          {item.intent}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-zinc-300">
                        <div className="flex items-center gap-1.5 font-bold">
                          <DollarSign size={16} className="text-emerald-500" />
                          {item.cpc.toFixed(2)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!results.length && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-[3rem] animate-in zoom-in-95 duration-1000">
          <div className="w-24 h-24 bg-zinc-900 rounded-[2rem] flex items-center justify-center mb-8 border border-zinc-800 shadow-2xl rotate-12">
            <BarChart3 className="text-zinc-600" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-zinc-200">Start Knowledge Gathering</h2>
          <p className="text-zinc-500 mt-3 max-w-md text-lg font-medium">
            Analyze topics to unlock search metrics, difficulty rankings, and intent mapping for your target niche.
          </p>
        </div>
      )}
    </div>
  );
};

export default KeywordResearch;