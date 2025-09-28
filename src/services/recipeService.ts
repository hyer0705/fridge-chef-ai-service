// recipeService.ts
import { generateRecipesFromGemini } from "@/lib/gemini";
import type { Recipe, RecipeGenerationParams } from "@/lib/types";

/**
 * 사용자 입력을 기반으로 레시피 생성 프롬프트를 만듭니다.
 * @param params - 레시피 생성에 필요한 사용자 입력 값들.
 * @returns 생성된 프롬프트 문자열.
 */
const createPrompt = (params: RecipeGenerationParams): string => {
  const { ingredients, weather, mood, servings } = params;
  const prompt = `
    당신은 남은 재료를 활용하여 멋진 요리를 만드는 전문 셰프입니다. 아래 정보를 바탕으로 3가지 다양한 레시피를 제안해주세요.
    - 보유 재료: ${ingredients.join(", ")}
    - 날씨: ${weather}
    - 기분/맛 취향: ${mood}
    - 인원 수: ${servings}인분

    각 레시피는 다음 정보를 반드시 포함해야 합니다:
    1. "name": 요리 이름 (창의적이고 매력적으로)
    2. "time": 예상 조리 시간 (예: "약 30분")
    3. "difficulty": 난이도 ('초급', '중급', '고급' 중 하나)
    4. "ingredientsUsed": 제공된 재료 목록 중 실제로 사용된 재료들의 배열. 각 재료는 "name"과 "quantity" 키를 가진 객체여야 합니다. (예: [{"name": "돼지고기", "quantity": "200g"}])
    5. "steps": 단계별 요리 방법 (최대 6단계, 각 단계는 2문장 이하로 간결하게)
    6. "nutrition": 예상 영양 정보 (칼로리 포함, 예: "약 450kcal")
    7. "servings": 추천 인원 수 (예: "${servings}인분")
    
    전체 응답은 반드시 유효한 JSON 형식이어야 하며, 루트 요소는 "recipes"라는 키를 가진 배열입니다. 응답에 markdown (\`\`\`json) 래퍼를 포함하지 마세요.
    
    응답 형식:
    {
      "recipes": [
        {
          "name": "요리명",
          "time": "약 30분",
          "difficulty": "초급",
          "ingredientsUsed": [...],
          "steps": [...],
          "nutrition": "약 450kcal",
          "servings": "3인분"
        }
      ]
    }
  `;

  return prompt;
};

/**
 * JSON이 완전한지 확인하는 헬퍼 함수
 */
const isValidCompleteJSON = (text: string): boolean => {
  try {
    const parsed = JSON.parse(text);

    // recipes 키가 있는 경우
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.recipes)) {
      return true;
    }

    // 직접 배열인 경우 (AI가 recipes 키 없이 배열만 반환한 경우)
    if (Array.isArray(parsed) && parsed.length > 0) {
      // 첫 번째 요소가 레시피 객체인지 확인
      const firstItem = parsed[0];
      return firstItem && typeof firstItem === "object" && firstItem.name && firstItem.time && firstItem.difficulty;
    }

    return false;
  } catch {
    return false;
  }
};

/**
 * JSON 문자열을 정리하는 헬퍼 함수
 */
const cleanJsonString = (text: string): string => {
  const withoutMarkdown = text.replace(/```json\s*|\s*```/g, "").trim();

  let cleaned = withoutMarkdown;

  // 기본적인 JSON 구조 확인 및 수정
  if (cleaned.includes('"name"') && !cleaned.endsWith("}") && !cleaned.endsWith("]")) {
    const openBraces = (cleaned.match(/{/g) || []).length;
    const closeBraces = (cleaned.match(/}/g) || []).length;
    const openBrackets = (cleaned.match(/\[/g) || []).length;
    const closeBrackets = (cleaned.match(/\]/g) || []).length;

    // 필요한 만큼 닫는 괄호 추가
    for (let i = 0; i < openBrackets - closeBrackets; i++) {
      cleaned += "]";
    }
    for (let i = 0; i < openBraces - closeBraces; i++) {
      cleaned += "}";
    }
  }

  return cleaned;
};

/**
 * JSON 응답의 대략적인 완성도를 계산하는 함수
 * @param text - 현재까지 받은 텍스트
 * @returns 0-100 사이의 완성도 퍼센트
 */
const calculateProgress = (text: string): number => {
  const cleanText = text.replace(/```json\s*|\s*```/g, "").trim();

  // JSON 시작 감지
  const hasJsonStart = cleanText.startsWith("{") || cleanText.startsWith("[");
  if (!hasJsonStart) return 5;

  // 레시피 관련 키워드 감지
  const hasRecipesKey = cleanText.includes('"recipes"') || cleanText.includes('"name"');
  if (!hasRecipesKey) return 15;

  // 레시피 개수 추정 (name 키의 개수로 판단)
  const nameCount = (cleanText.match(/"name"\s*:/g) || []).length;
  const expectedRecipes = 3;

  if (nameCount === 0) return 25;

  // 각 레시피의 필드 완성도 체크
  const requiredFields = ["name", "time", "difficulty", "ingredientsUsed", "steps", "nutrition", "servings"];
  const totalExpectedFields = expectedRecipes * requiredFields.length;

  let foundFields = 0;
  requiredFields.forEach((field) => {
    const matches = cleanText.match(new RegExp(`"${field}"\\s*:`, "g"));
    foundFields += matches ? matches.length : 0;
  });

  const fieldProgress = Math.min(foundFields / totalExpectedFields, 1);

  // JSON 완전성 체크
  const openBraces = (cleanText.match(/{/g) || []).length;
  const closeBraces = (cleanText.match(/}/g) || []).length;
  const openBrackets = (cleanText.match(/\[/g) || []).length;
  const closeBrackets = (cleanText.match(/\]/g) || []).length;

  const isStructurallyComplete = openBraces === closeBraces && openBrackets === closeBrackets;

  // 기본 25% + 필드 완성도 65% + 구조 완전성 10%
  const progress = 25 + fieldProgress * 65 + (isStructurallyComplete ? 10 : 0);

  return Math.min(Math.round(progress), 100);
};

/**
 * 파싱된 JSON에서 레시피 배열을 추출하는 함수
 */
const extractRecipes = (parsedJson: any): Recipe[] => {
  // recipes 키가 있는 경우
  if (parsedJson.recipes && Array.isArray(parsedJson.recipes)) {
    return parsedJson.recipes as Recipe[];
  }

  // 직접 배열인 경우
  if (Array.isArray(parsedJson)) {
    return parsedJson as Recipe[];
  }

  throw new Error("응답에서 레시피 배열을 찾을 수 없습니다.");
};

/**
 * Gemini API를 스트리밍 방식으로 호출하여 레시피를 생성하고 파싱합니다.
 * @param params - 레시피 생성에 필요한 사용자 입력 값들.
 * @param onProgress - 진행률을 받는 선택적 콜백 함수 (0-100)
 * @returns 생성된 레시피 객체 배열.
 */
export const generateRecipes = async (params: RecipeGenerationParams, onProgress?: (progress: number) => void): Promise<Recipe[]> => {
  if (params.ingredients.length < 1) {
    throw new Error("레시피를 생성하려면 최소 1개 이상의 재료를 입력해야 합니다.");
  }

  const prompt = createPrompt(params);

  try {
    const responseText = await generateRecipesFromGemini(prompt, (chunk: string, fullText: string) => {
      // JSON 내용을 숨기고 진행률만 계산해서 전달
      const progress = calculateProgress(fullText);
      onProgress?.(progress);
    });

    const cleanedJsonString = cleanJsonString(responseText);

    if (!isValidCompleteJSON(cleanedJsonString)) {
      console.error("Invalid or incomplete JSON:", cleanedJsonString);
      throw new Error("AI 응답이 완전한 JSON 형식이 아닙니다. 다시 시도해주세요.");
    }

    const parsedResponse = JSON.parse(cleanedJsonString);

    // 레시피 배열 추출 (recipes 키가 있거나 직접 배열인 경우 모두 처리)
    const recipes = extractRecipes(parsedResponse);

    if (!recipes || recipes.length === 0) {
      throw new Error("생성된 레시피가 없습니다.");
    }

    // 완료 시 100% 진행률 전달
    onProgress?.(100);

    return recipes;
  } catch (error) {
    console.error("Error generating or parsing recipes:", error);

    if (error instanceof SyntaxError) {
      throw new Error("AI 응답을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("레시피 생성 중 알 수 없는 오류가 발생했습니다.");
  }
};
