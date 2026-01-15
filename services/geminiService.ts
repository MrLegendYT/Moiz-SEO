
import { GoogleGenAI, Type } from "@google/genai";
import { KeywordData, ContentAudit, RankingData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getKeywordIdeas = async (seed: string): Promise<KeywordData[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 8 high-potential SEO keywords related to "${seed}". For each keyword, provide: search volume (monthly estimate), keyword difficulty (0-100), search intent (Informational, Transactional, Commercial, Navigational), and estimated CPC in USD.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            keyword: { type: Type.STRING },
            volume: { type: Type.NUMBER },
            difficulty: { type: Type.NUMBER },
            intent: { type: Type.STRING },
            cpc: { type: Type.NUMBER }
          },
          required: ["keyword", "volume", "difficulty", "intent", "cpc"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]') as KeywordData[];
  } catch (e) {
    console.error("Failed to parse keyword ideas", e);
    return [];
  }
};

export const analyzeContent = async (text: string): Promise<ContentAudit> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Perform a deep SEO content audit on the following text: "${text.substring(0, 3000)}". Provide an overall SEO score (0-100), extract the title and meta description (if identifiable or suggest one), list heading tags structure, keyword density for the top 3 keywords, and at least 5 actionable SEO recommendations.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          headings: { type: Type.ARRAY, items: { type: Type.STRING } },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          keywordDensity: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                keyword: { type: Type.STRING },
                density: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["score", "title", "description", "headings", "recommendations", "keywordDensity"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}') as ContentAudit;
  } catch (e) {
    console.error("Failed to parse content analysis", e);
    throw new Error("Analysis failed");
  }
};

export const checkSerpPosition = async (url: string, keyword: string): Promise<Omit<RankingData, 'id' | 'lastChecked'>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Simulate a search engine results page analysis for the domain "${url}" and keyword "${keyword}". 
    Based on the current web authority of similar sites, estimate a realistic current ranking position (1-100), and a position change over the last 30 days (-20 to +20). Return as JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          keyword: { type: Type.STRING },
          url: { type: Type.STRING },
          position: { type: Type.NUMBER },
          change: { type: Type.NUMBER }
        },
        required: ["keyword", "url", "position", "change"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to check SERP position", e);
    throw new Error("SERP check failed");
  }
};
