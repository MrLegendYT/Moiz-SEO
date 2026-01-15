
import React, { useState } from 'react';
import { 
  FileText, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  Type as FontIcon, 
  Layers 
} from 'lucide-react';
import { analyzeContent } from '../services/geminiService';
import { ContentAudit } from '../types';

const ContentAnalyzer: React.FC = () => {
  const [content, setContent] = useState('');
  const [audit, setAudit] = useState<ContentAudit | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeContent(content);
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
        <h1 className="text-3xl font-bold text-white">Content Optimizer</h1>
        <p className="text-zinc-400 mt-1">Audit your text for SEO, readability, and engagement.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <label className="block text-sm font-medium text-zinc-400 mb-2">Paste your content here</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing or paste your article content..."
              className="w-full h-80 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all resize-none"
            />
            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs text-zinc-500">{content.length} characters</span>
              <button
                onClick={handleAudit}
                disabled={loading || content.length < 50}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Run SEO Audit'}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {audit ? (
            <div className="animate-in slide-in-from-right-4 duration-500">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-6">
                  <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center bg-zinc-950 ${getScoreColor(audit.score)}`}>
                    <span className="text-3xl font-bold">{audit.score}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Score</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Audit Results</h2>
                    <p className="text-zinc-400 text-sm">Analysis complete for "{audit.title || 'Untitled Content'}"</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <FontIcon size={16} />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Meta Title</h4>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{audit.title}</p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-purple-400 mb-2">
                    <Layers size={16} />
                    <h4 className="text-xs font-bold uppercase tracking-wider">Headings Structure</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {audit.headings.slice(0, 5).map((h, i) => (
                      <span key={i} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded truncate max-w-[120px]">
                        {h}
                      </span>
                    ))}
                    {audit.headings.length > 5 && <span className="text-[10px] text-zinc-500">+{audit.headings.length - 5} more</span>}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4 text-emerald-400">
                  <Lightbulb size={20} />
                  <h3 className="font-semibold text-white">Actionable Recommendations</h3>
                </div>
                <ul className="space-y-4">
                  {audit.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-3 items-start group">
                      <div className="mt-1 p-0.5 rounded-full bg-zinc-800 group-hover:bg-blue-600/30 transition-colors">
                        <CheckCircle2 className="text-blue-500" size={16} />
                      </div>
                      <span className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-12 text-center text-zinc-600">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="font-medium">No audit data yet</p>
              <p className="text-sm mt-1">Submit your content to see detailed SEO insights and score.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentAnalyzer;
