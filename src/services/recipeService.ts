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
  `;

  return prompt;
};

/**
 * Gemini API를 호출하여 레시피를 생성하고 파싱합니다.
 * @param params - 레시피 생성에 필요한 사용자 입력 값들.
 * @returns 생성된 레시피 객체 배열.
 * @throws API 호출 또는 JSON 파싱 실패 시 에러를 발생시킵니다.
 */
export const generateRecipes = async (params: RecipeGenerationParams): Promise<Recipe[]> => {
  if (params.ingredients.length < 1) {
    throw new Error("레시피를 생성하려면 최소 1개 이상의 재료를 입력해야 합니다.");
  }

  const prompt = createPrompt(params);

  try {
    const responseText = await generateRecipesFromGemini(prompt);

    // API가 때때로 markdown을 포함하는 경우를 대비한 안전 장치
    const jsonString = responseText.match(/```json([\s\S]*?)```/)?.[1] || responseText;

    const parsedResponse = JSON.parse(jsonString);

    if (!parsedResponse.recipes) {
      throw new Error("API 응답이 예상된 'recipes' 키를 포함하지 않습니다.");
    }

    return parsedResponse.recipes as Recipe[];
  } catch (error) {
    console.error("Error generating or parsing recipes:", error);
    // 에러를 다시 던져서 호출 측(커스텀 훅)에서 처리할 수 있도록 함
    throw new Error("레시피 생성 또는 응답 처리 중 문제가 발생했습니다.");
  }
};
