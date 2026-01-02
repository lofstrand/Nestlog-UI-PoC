
import { GoogleGenAI } from "@google/genai";

// Fixed: Exclusively use process.env.API_KEY and direct string usage
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLayoutAdvice = async (currentContext: string) => {
  try {
    // Fixed: Using gemini-3-pro-preview for complex reasoning task (expert advice) with systemInstruction
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Current Context: ${currentContext}`,
      config: {
        systemInstruction: `You are an expert UI/UX designer and home management consultant. 
        The user is asking for suggestions on their home-management app layout ("Nestlog").
        Provide 3-5 specific, actionable layout or feature improvements to enhance user productivity in managing their home. 
        Keep the tone professional, encouraging, and focused on visual hierarchy, data density, and smart automation.`
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm currently unable to process your request. Please ensure your API key is configured correctly.";
  }
};

export const generateSmartDescription = async (name: string) => {
  try {
    // Fixed: Adhere to systemInstruction pattern for consistent output style
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Household name: "${name}"`,
      config: {
        systemInstruction: `Generate a short, professional, and inviting description (max 20 words) for a household in a home management app. Focus on its purpose as a living space or managed property.`
      },
    });
    return response.text;
  } catch (error) {
    return "";
  }
};

export const generatePropertyBio = async (property: any) => {
  try {
    // Fixed: Adhere to systemInstruction pattern
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Property: "${property.name}", City: ${property.address.city}, Year: ${property.constructionYear || 'unknown'}`,
      config: {
        systemInstruction: `Generate a 1-sentence property summary for a home management app. Mention the location and construction year. Keep it concise and professional.`
      },
    });
    return response.text;
  } catch (error) {
    return "";
  }
};

export const analyzeHouseholdHealth = async (households: any[]) => {
  try {
    // Fixed: Using gemini-3-pro-preview for data analysis task with systemInstruction
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Data: ${JSON.stringify(households)}`,
      config: {
        systemInstruction: `Analyze the following households and provide a brief 'Home Health Summary' (2 sentences max) and one 'Smart Tip' for maintenance.`
      },
    });
    return response.text;
  } catch (error) {
    return "Unable to analyze household health at this time.";
  }
};
