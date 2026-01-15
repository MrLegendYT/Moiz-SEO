/**
 * Gemini Service Disabled.
 * Using local deterministic services and public APIs to avoid AI API key requirements.
 */

export const getKeywordIdeas = async (query: string) => {
  // Returns empty to ensure components don't break, 
  // though components should primarily use local services now.
  return [];
};

export const analyzeContent = async (content: string) => {
  return {};
};

export const checkSerpPosition = async (url: string, keyword: string) => {
  return {};
};
