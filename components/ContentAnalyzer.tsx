import React, { useState } from 'react';
import { 
  FileText, 
  Loader2, 
  CheckCircle2, 
  Lightbulb, 
  Type as FontIcon, 
  Layers,
  Activity
} from 'lucide-react';
import { performLocalAudit } from '../services/contentService';
import { ContentAudit } from '../types';

const ContentAnalyzer: React.FC = () => {
  const [content, setContent] = useState('');
  const [audit, setAudit] = useState<ContentAudit | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    
    // Simulate processing time for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const result = performLocalAudit(content);
      setAudit(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-400';
    if (score >= 50) return 'text-amber-400 border-amber-400';
    return 'text-rose-400 border-rose-400';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Content Intelligence</h1>
        <p className="text-zinc-400 mt-1">Deep structural analysis and keyword density audit.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 shadow-xl">
            <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Content Input Field</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your article or copy here for an instant SEO audit..."
              className="w-full h-96 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all resize-none font-medium leading-relaxed"
            />
            <div className="mt-6 flex justify-between items-center">
              <div className="flex gap-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-800 px-3 py-1.5 rounded-lg">{content.length} chars</span>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-800 px-3 py-1.5 rounded-lg">{content.split(/\s+/).filter(x => x).length} words</span>
              </div>
              <button
                onClick={handleAudit}
                disabled={loading || content.length < 20}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Analyze Content'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {audit ? (
            <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] group-hover:bg-blue-600/20 transition-all" />
                <div className="flex items-center gap-8 relative z-10">
                  <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center bg-zinc-950 shadow-inner ${getScoreColor(audit.score)}`}>
                    <span className="text-4xl font-black">{audit.score}</span>
                    <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Score</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Audit Summary</h2>
                    <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                      Primary keyword focus: <span className="text-blue-400 font-bold">{audit.keywordDensity[0]?.keyword || 'None'}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
                  <div className="flex items-center gap-2 text-blue-400 mb-3">
                    <Activity size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Keyword Density</h4>
                  </div>
                  <div className="space-y-3">
                    {audit.keywordDensity.map((k, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm font-bold text-zinc-300">{k.keyword}</span>
                        <span className="text-xs font-mono text-zinc-500">{k.density}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
                  <div className="flex items-center gap-2 text-purple-400 mb-3">
                    <Layers size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Outline Status</h4>
                  </div>
                  <div className="space-y-2">
                    {audit.headings.slice(0, 3).map((h, i) => (
                      <p key={i} className="text-[11px] text-zinc-400 truncate font-medium">
                        • {h}
                      </p>
                    ))}
                    {audit.headings.length > 3 && <p className="text-[10px] text-zinc-600 font-bold">+{audit.headings.length - 3} more tags</p>}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6 text-emerald-400">
                  <Lightbulb size={24} />
                  <h3 className="text-lg font-bold text-white">Action Plan</h3>
                </div>
                <ul className="space-y-5">
                  {audit.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-4 items-start group">
                      <div className="mt-1 p-1 rounded-lg bg-zinc-800 group-hover:bg-blue-600 transition-all">
                        <CheckCircle2 className="text-blue-400 group-hover:text-white" size={14} />
                      </div>
                      <span className="text-sm text-zinc-400 leading-relaxed font-medium group-hover:text-zinc-100 transition-colors">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center text-zinc-600 bg-zinc-900/10">
              <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800 shadow-xl opacity-50">
                <FileText size={40} className="opacity-40" />
              </div>
              <p className="font-bold text-xl text-zinc-500">Awaiting content...</p>
              <p className="text-sm mt-2 text-zinc-600 max-w-xs mx-auto">Submit text to unlock readability scores, keyword density checks, and structural optimizations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentAnalyzer;