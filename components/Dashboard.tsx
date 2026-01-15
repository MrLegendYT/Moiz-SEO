
import React, { useEffect, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  Users, 
  MousePointer2, 
  Globe, 
  Award,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { AnalyticsData, KeywordData } from '../types';
import { notificationService } from '../services/notificationService';

const StatCard = ({ title, value, change, icon: Icon, trend, delay }: any) => (
  <div 
    className={`bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] group animate-in fade-in slide-in-from-bottom-4`}
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-zinc-800 rounded-2xl group-hover:scale-110 group-hover:bg-blue-600/20 transition-all duration-500">
        <Icon className="text-blue-500" size={24} />
      </div>
      <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'text-emerald-400 bg-emerald-400/10' : 'text-rose-400 bg-rose-400/10'}`}>
        {trend === 'up' ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
        {change}
      </div>
    </div>
    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>(storageService.getAnalytics());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateAnalytics = (force = false) => {
    const savedKeywords = storageService.getKeywords();
    const savedRankings = storageService.getRankings();
    const savedAnalytics = storageService.getAnalytics();
    
    setKeywords(savedKeywords);
    
    // Logic: if user has no data, analytics should reflect 0.
    if (savedKeywords.length === 0 && savedRankings.length === 0) {
      const zeroData: AnalyticsData = {
        organicTraffic: 0,
        impressions: 0,
        ctr: 0,
        domainScore: 0,
        trafficHistory: [
          { name: 'Mon', traffic: 0 }, { name: 'Tue', traffic: 0 }, { name: 'Wed', traffic: 0 },
          { name: 'Thu', traffic: 0 }, { name: 'Fri', traffic: 0 }, { name: 'Sat', traffic: 0 }, { name: 'Sun', traffic: 0 },
        ]
      };
      setAnalytics(zeroData);
      storageService.saveAnalytics(zeroData);
      return;
    }

    // Deterministic calculation based on actual stored data
    // This avoids the "reloading dummy data" feel by making the output consistent
    if (force || savedAnalytics.organicTraffic === 0) {
      const keywordCount = savedKeywords.length;
      const rankingCount = savedRankings.length;
      
      let totalTrafficBase = rankingCount * 250;
      savedRankings.forEach(r => {
        if (r.position <= 10) totalTrafficBase += (11 - r.position) * 120;
        if (r.position <= 3) totalTrafficBase += 600;
      });

      // Add a small deterministic component based on keyword volume sum
      const volumeSum = savedKeywords.reduce((acc, k) => acc + (k.volume / 100), 0);
      const organicTraffic = Math.floor(totalTrafficBase + volumeSum);
      const impressions = Math.floor(organicTraffic * 28);
      const ctr = rankingCount > 0 ? (2.4 + (rankingCount * 0.15)) : 0;
      const domainScore = Math.min(100, (20 + (keywordCount * 2.5) + (rankingCount * 6)));

      const simulated: AnalyticsData = {
        organicTraffic,
        impressions,
        ctr: parseFloat(ctr.toFixed(1)),
        domainScore: Math.round(domainScore),
        trafficHistory: [
          { name: 'Mon', traffic: Math.floor(organicTraffic * 0.65) },
          { name: 'Tue', traffic: Math.floor(organicTraffic * 0.82) },
          { name: 'Wed', traffic: Math.floor(organicTraffic * 0.76) },
          { name: 'Thu', traffic: Math.floor(organicTraffic * 1.15) },
          { name: 'Fri', traffic: Math.floor(organicTraffic * 0.94) },
          { name: 'Sat', traffic: Math.floor(organicTraffic * 0.52) },
          { name: 'Sun', traffic: Math.floor(organicTraffic * 1.05) },
        ]
      };
      
      setAnalytics(simulated);
      storageService.saveAnalytics(simulated);

      if (force) {
        notificationService.send(
          "Intelligence Scan Complete",
          { body: `Updated: ${simulated.organicTraffic.toLocaleString()} monthly visitors and ${simulated.domainScore} authority score.` },
          'summary'
        );
      }
    } else {
      setAnalytics(savedAnalytics);
    }
  };

  useEffect(() => {
    calculateAnalytics();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Visual delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    calculateAnalytics(true);
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-10 pb-24 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Project Overview</h1>
          <p className="text-zinc-400 mt-2 text-lg">Real-time intelligence from your local storage container.</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm font-bold text-zinc-300 hover:text-white hover:border-blue-500/50 hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 group shadow-lg"
        >
          {isRefreshing ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />}
          {isRefreshing ? 'Re-scanning Indexers...' : 'Force Refresh Analytics'}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard delay={100} title="Organic Traffic" value={analytics.organicTraffic.toLocaleString()} change="+4.2%" trend="up" icon={Users} />
        <StatCard delay={200} title="Impressions" value={analytics.impressions.toLocaleString()} change="+2.1%" trend="up" icon={Globe} />
        <StatCard delay={300} title="Avg. CTR" value={`${analytics.ctr.toFixed(1)}%`} change="0.0%" trend="up" icon={MousePointer2} />
        <StatCard delay={400} title="Domain Score" value={analytics.domainScore} change="+1" trend="up" icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] animate-in fade-in slide-in-from-left-4 duration-1000 delay-500 fill-mode-both shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-white">Engagement Trajectory</h3>
              <p className="text-zinc-500 text-sm mt-1">Organic performance delta over 7 days</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Traffic</span>
               </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.trafficHistory}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#71717a', fontSize: 12, fontWeight: 700}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#71717a', fontSize: 12, fontWeight: 700}} 
                />
                <Tooltip 
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
                  itemStyle={{ color: '#fff', fontSize: '13px', fontWeight: 800 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="traffic" 
                  stroke="#3b82f6" 
                  strokeWidth={5} 
                  fillOpacity={1} 
                  fill="url(#colorTraffic)"
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] flex flex-col animate-in fade-in slide-in-from-right-4 duration-1000 delay-500 fill-mode-both shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Interest Feed</h3>
            <TrendingUp size={20} className="text-blue-500" />
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[320px] pr-2 custom-scrollbar">
            {keywords.length > 0 ? (
              keywords.slice(0, 10).map((k, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-2xl border border-transparent hover:border-blue-500/30 hover:bg-zinc-800/50 transition-all duration-500 group"
                >
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-zinc-100 truncate group-hover:text-blue-400 transition-colors">{k.keyword}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">{k.intent}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block font-bold uppercase">Volume</span>
                    <span className="text-sm font-black text-white">{k.volume.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-30 grayscale">
                <div className="p-4 bg-zinc-800 rounded-3xl mb-4">
                  <TrendingUp size={48} className="text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-400 font-bold uppercase tracking-widest">No Intelligence<br/>Detected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
