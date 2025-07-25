
import { GoogleGenAI } from "@google/genai";

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY environment variable not set.");
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

const generateMotivationalTip = async (topic: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    const prompt = `Generate a short, motivational, and encouraging tip for a group of friends doing a fitness challenge. The tip should be related to: "${topic}". Keep it concise, under 40 words, and positive. Address the group as "team" or "everyone".`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Failed to generate a tip. Keep up the great work!";
  }
};

export default {
  generateMotivationalTip,
};
