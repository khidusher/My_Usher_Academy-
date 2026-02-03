
import { GoogleGenAI } from "@google/genai";

export const getMentorFeedback = async (
  code: string, 
  error: string, 
  context: string,
  userName: string
) => {
  // Use a safety check for process.env while strictly adhering to the provided key source
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
  
  const ai = new GoogleGenAI({ apiKey: apiKey || '' });
  
  const prompt = `
    You are "Kofi the Python Mentor", a friendly and warm Ghanaian programming teacher.
    The learner, ${userName}, is working on this challenge: "${context}".
    They wrote this code:
    \`\`\`python
    ${code}
    \`\`\`
    It produced this error or outcome: "${error}".
    
    Provide a short, encouraging hint (max 3 sentences) in a friendly Ghanaian tone. 
    Use local expressions like "Chale", "Akwaaba", or "Don't worry kraa". 
    Don't give the direct answer, just guide them.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Keep trying, you are doing great!";
  } catch (e) {
    console.error("Gemini API Error:", e);
    return "Ei, I'm having a little trouble connecting to the network. But don't give up, check your code again!";
  }
};
