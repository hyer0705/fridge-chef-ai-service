import { useState, useCallback } from 'react';
import { generateRecipes } from '@/services/recipeService';
import type { Recipe, RecipeGenerationParams } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const useRecipeGenerator = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generate = useCallback(async (params: RecipeGenerationParams) => {
    // 입력값 검증은 서비스 레이어에서 처리하므로 여기서는 바로 로딩 상태로 진입
    if (params.ingredients.length < 1) {
        setError("레시피를 생성하려면 최소 1개 이상의 재료를 입력해야 합니다.");
        return;
    }

    setIsLoading(true);
    setError(null);
    // 새로운 레시피 생성 시도 시, 이전 결과는 초기화
    setRecipes([]); 

    try {
      const generatedRecipes = await generateRecipes(params);
      setRecipes(generatedRecipes);
      toast({
        title: "레시피가 완성되었습니다! 🍳",
        description: `${generatedRecipes.length}가지 맛있는 요리를 제안드려요.`,
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      toast({
        title: "오류 발생",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const clear = useCallback(() => {
    setRecipes([]);
    setError(null);
  }, []);

  return { recipes, isLoading, error, generate, clear };
};
