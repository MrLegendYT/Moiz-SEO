import { RankingData } from "../types";

// Simple string hash for deterministic "randomness"
const getHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const simulateSerpCheck = (url: string, keyword: string): Omit<RankingData, 'id' | 'lastChecked'> => {
  const combined = url.toLowerCase() + keyword.toLowerCase();
  const hash = getHash(combined);
  
  // Position between 1 and 99 based on hash
  const position = (hash % 98) + 1;
  // Change between -5 and +5 based on hash
  const change = (hash % 11) - 5;

  return {
    keyword,
    url,
    position,
    change
  };
};