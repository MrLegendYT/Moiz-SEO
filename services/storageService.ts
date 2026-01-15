import { KeywordData, ContentAudit, RankingData, AnalyticsData } from '../types';

const STORAGE_KEYS = {
  KEYWORDS: 'moiz_seo_keywords',
  AUDITS: 'moiz_seo_audits',
  RANKINGS: 'moiz_seo_rankings',
  SETTINGS: 'moiz_seo_settings',
  ANALYTICS: 'moiz_seo_analytics'
};

const DEFAULT_ANALYTICS: AnalyticsData = {
  organicTraffic: 0,
  impressions: 0,
  ctr: 0,
  domainScore: 0,
  trafficHistory: [
    { name: 'Mon', traffic: 0 },
    { name: 'Tue', traffic: 0 },
    { name: 'Wed', traffic: 0 },
    { name: 'Thu', traffic: 0 },
    { name: 'Fri', traffic: 0 },
    { name: 'Sat', traffic: 0 },
    { name: 'Sun', traffic: 0 },
  ]
};

const DEFAULT_SETTINGS = {
  userName: 'Moiz',
  email_alerts: true,
  weekly_report: true,
  product_updates: false,
  notifications: true,
  theme: 'dark'
};

export const storageService = {
  saveKeywords: (data: KeywordData[]) => {
    localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(data));
  },
  getKeywords: (): KeywordData[] => {
    const data = localStorage.getItem(STORAGE_KEYS.KEYWORDS);
    return data ? JSON.parse(data) : [];
  },
  saveAudits: (data: ContentAudit[]) => {
    localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(data));
  },
  getAudits: (): ContentAudit[] => {
    const data = localStorage.getItem(STORAGE_KEYS.AUDITS);
    return data ? JSON.parse(data) : [];
  },
  saveRankings: (data: RankingData[]) => {
    localStorage.setItem(STORAGE_KEYS.RANKINGS, JSON.stringify(data));
  },
  getRankings: (): RankingData[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RANKINGS);
    return data ? JSON.parse(data) : [];
  },
  saveAnalytics: (data: AnalyticsData) => {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(data));
  },
  getAnalytics: (): AnalyticsData => {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return data ? JSON.parse(data) : DEFAULT_ANALYTICS;
  },
  clearAnalytics: () => {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(DEFAULT_ANALYTICS));
  },
  saveSettings: (settings: any) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
  getSettings: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const parsed = data ? JSON.parse(data) : {};
    return { ...DEFAULT_SETTINGS, ...parsed };
  }
};