
import { GoogleGenAI, Type } from "@google/genai";
import { KeywordData, ContentAudit } from "../types";

/**
 * Initialize the Google GenAI SDK.
 * The API key is sourced from process.env.API_KEY.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches keyword ideas using Gemini AI.
 * Fixed: Added query parameter to match usage in components/KeywordResearch.tsx.
 */
export const getKeywordIdeas = async (query: string): Promise<KeywordData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Research high-potential SEO keywords related to: "${query}". Provide a list of 10-15 keywords with volume, difficulty, intent, and CPC.`,
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
              intent: { 
                type: Type.STRING,
                enum: ['Informational', 'Transactional', 'Commercial', 'Navigational']
              },
              cpc: { type: Type.NUMBER },
            },
            required: ["keyword", "volume", "difficulty", "intent", "cpc"],
          },
        },
      },
    });

    const text = response.text.trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini getKeywordIdeas error:", error);
    return [];
  }
};

/**
 * Analyzes content for SEO using Gemini AI.
 * Updated to accept content parameter and return structured audit data.
 */
export const analyzeContent = async (content: string): Promise<Partial<ContentAudit>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a detailed SEO content audit for the following text: \n\n${content}`,
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
    const text = response.text.trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini analyzeContent error:", error);
    return {};
  }
};

/**
 * Checks SERP position for a keyword using Gemini AI.
 */
export const checkSerpPosition = async (url: string, keyword: string) => {
  // Placeholder for future SERP analysis integration.
  return {};
};
