
export type User = {
  id: string;
  email: string;
  name: string;
};

export type KeywordData = {
  keyword: string;
  volume: number;
  difficulty: number;
  intent: 'Informational' | 'Transactional' | 'Commercial' | 'Navigational';
  cpc: number;
};

export type ContentAudit = {
  score: number;
  title: string;
  description: string;
  headings: string[];
  recommendations: string[];
  keywordDensity: { keyword: string; density: number }[];
};

export type RankingData = {
  id: string;
  keyword: string;
  url: string;
  position: number;
  change: number;
  lastChecked: string;
};

export type AnalyticsData = {
  organicTraffic: number;
  impressions: number;
  ctr: number;
  domainScore: number;
  trafficHistory: { name: string; traffic: number }[];
};

export type NavItem = 'dashboard' | 'keywords' | 'audit' | 'rankings' | 'settings';

export interface AppState {
  user: User | null;
  activeTab: NavItem;
  isLoading: boolean;
}
