import { useState, useCallback } from "react";
import { generateRecipes } from "@/services/recipeService";
import type { Recipe, RecipeGenerationParams } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export const useRecipeGenerator = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  const generate = useCallback(
    async (params: RecipeGenerationParams) => {
      if (params.ingredients.length < 1) {
        setError("레시피를 생성하려면 최소 1개 이상의 재료를 입력해야 합니다.");
        return;
      }

      setIsLoading(true);
      setIsStreaming(true);
      setError(null);
      setProgress(0);
      setRecipes([]);

      try {
        const generatedRecipes = await generateRecipes(params, (progressValue: number) => {
          // JSON 내용 대신 진행률만 받아서 상태 업데이트
          setProgress(progressValue);
        });

        setRecipes(generatedRecipes);
        setIsStreaming(false);
        setProgress(100);
        toast({
          title: "레시피가 완성되었습니다! 🍳",
          description: `${generatedRecipes.length}가지 맛있는 요리를 제안드려요.`,
        });
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
        setError(errorMessage);
        setIsStreaming(false);
        setProgress(0);
        toast({
          title: "오류 발생",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const clear = useCallback(() => {
    setRecipes([]);
    setError(null);
    setProgress(0);
    setIsStreaming(false);
  }, []);

  return {
    recipes,
    isLoading,
    error,
    progress,
    isStreaming,
    generate,
    clear,
  };
};
