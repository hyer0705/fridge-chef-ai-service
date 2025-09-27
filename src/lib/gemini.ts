import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in .env file");
}

const genAI = new GoogleGenAI({ apiKey });

/**
 * Gemini API를 호출하여 레시피를 생성하는 함수
 * @param prompt - API에 전달할 프롬프트
 * @returns 생성된 레시피 텍스트
 */
export const generateRecipesFromGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("AI 레시피 생성 중 오류가 발생했습니다.");
  }
};
