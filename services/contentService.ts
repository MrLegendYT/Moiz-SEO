import { ContentAudit } from "../types";

export const performLocalAudit = (text: string): ContentAudit => {
  const words = text.toLowerCase().match(/\w+/g) || [];
  const wordCount = words.length;
  
  // Frequency analysis
  const freq: Record<string, number> = {};
  const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'for', 'with', 'on', 'as', 'at', 'by', 'an', 'be', 'this', 'that']);
  
  words.forEach(w => {
    if (w.length > 3 && !stopWords.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  });

  const sortedFreq = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const keywordDensity = sortedFreq.map(([keyword, count]) => ({
    keyword,
    density: parseFloat(((count / wordCount) * 100).toFixed(2))
  }));

  // Structural detection (basic)
  const lines = text.split('\n');
  const potentialHeadings = lines.filter(l => l.length > 0 && l.length < 100 && (l.toUpperCase() === l || l.startsWith('#')));
  
  // Basic scoring logic
  let score = 40;
  if (wordCount > 300) score += 20;
  if (wordCount > 1000) score += 10;
  if (potentialHeadings.length > 2) score += 15;
  if (keywordDensity.length > 0 && keywordDensity[0].density < 5) score += 15;
  score = Math.min(100, score);

  const recommendations = [
    wordCount < 500 ? "Content length is low. Aim for 1,000+ words for better authority." : "Good content length detected.",
    potentialHeadings.length < 3 ? "Add more subheadings (H2, H3) to improve readability." : "Heading structure looks diverse.",
    keywordDensity.some(k => k.density > 4) ? "Keyword stuffing detected. Reduce top keyword frequency." : "Keyword density is within healthy limits.",
    "Ensure your primary keyword appears in the first 100 words.",
    "Add internal links to related high-value pages.",
    "Optimize images with descriptive ALT text containing secondary keywords."
  ];

  return {
    score,
    title: lines[0]?.substring(0, 60) || "Untitled Content",
    description: text.substring(0, 155) + "...",
    headings: potentialHeadings.length > 0 ? potentialHeadings : ["No clear headings detected"],
    recommendations,
    keywordDensity
  };
};