import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in .env file");
}

const genAI = new GoogleGenAI({ apiKey });

/**
 * Gemini API를 호출하여 레시피를 스트리밍 방식으로 생성하는 함수
 * @param prompt - API에 전달할 프롬프트
 * @param onChunk - 스트림 청크를 받을 때마다 호출되는 콜백 함수
 * @returns 완전한 레시피 텍스트
 */
export const generateRecipesFromGemini = async (prompt: string, onChunk?: (chunk: string, fullText: string) => void): Promise<string> => {
  try {
    const response = await genAI.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let fullText = "";

    for await (const chunk of response) {
      if (chunk.text) {
        fullText += chunk.text;
        onChunk?.(chunk.text, fullText);
      }
    }

    return fullText;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("AI 레시피 생성 중 오류가 발생했습니다.");
  }
};
