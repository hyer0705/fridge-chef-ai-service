import { ChefHat, Zap, RotateCcw, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import IngredientInput from "@/components/IngredientInput";
import PreferenceInputs from "@/components/PreferenceInputs";
import RecipeCard from "@/components/RecipeCard";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { useRecipeGenerator } from "@/hooks/useRecipeGenerator";
import { useRecipeInputs } from "@/hooks/useRecipeInputs";

const Index = () => {
  // 입력 상태와 관련된 로직은 모두 useRecipeInputs 훅으로 분리되었습니다.
  const { inputState, dispatch } = useRecipeInputs();
  
  // 출력(레시피 결과) 상태와 관련된 로직은 useRecipeGenerator 훅에 있습니다.
  const { recipes, isLoading, error, generate, clear } = useRecipeGenerator();

  const { toast } = useToast();

  const resetAllInputs = () => {
    dispatch({ type: "RESET_INPUTS" });
    clear(); // 레시피 결과 초기화
    toast({
      title: "입력이 초기화되었습니다",
      description: "새로운 재료로 다시 시작해보세요!",
    });
  };

  const handleGenerateClick = () => {
    generate(inputState);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm sticky top-0 z-10 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center">
            <ChefHat className="mr-3" size={32} />
            냉장고 속 식재료로 뭐 해먹지?
          </h1>
          <p className="text-center text-muted-foreground mt-2">AI가 당신의 냉장고를 맛있는 요리로 바꿔드려요 ✨</p>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {/* Input Section */}
        <div className="bg-card p-6 md:p-8 rounded-2xl shadow-lg mb-8 border border-border">
          <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">어떤 재료로 무엇을 만들어 볼까요?</h2>
          <p className="text-muted-foreground mb-6">냉장고 속 재료와 당신의 기분을 알려주세요. AI가 완벽한 레시피를 찾아드릴게요!</p>

          <div className="space-y-6">
            <IngredientInput
              ingredients={inputState.ingredients}
              onAddIngredient={(ingredient) => dispatch({ type: "ADD_INGREDIENT", payload: ingredient })}
              onRemoveIngredient={(ingredient) => dispatch({ type: "REMOVE_INGREDIENT", payload: ingredient })}
            />

            <PreferenceInputs
              weather={inputState.weather}
              mood={inputState.mood}
              servings={inputState.servings}
              onWeatherChange={(value) => dispatch({ type: "SET_WEATHER", payload: value })}
              onMoodChange={(value) => dispatch({ type: "SET_MOOD", payload: value })}
              onServingsChange={(value) => dispatch({ type: "SET_SERVINGS", payload: value })}
            />
          </div>

          <div className="mt-8 text-center flex flex-col md:flex-row justify-center items-center gap-4">
            <Button
              onClick={handleGenerateClick}
              disabled={isLoading || inputState.ingredients.length < 1}
              variant="chef"
              size="xl"
              className="w-full md:w-auto min-w-[200px]"
            >
              <Zap className="mr-2" size={20} />
              {isLoading ? "레시피 생성 중..." : "AI 레시피 생성"}
            </Button>
            <Button onClick={resetAllInputs} variant="outline" size="lg" className="w-full md:w-auto">
              <RotateCcw className="mr-2" size={18} />
              입력 초기화
            </Button>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center">
            <Sparkles className="mr-3 text-chef-orange" size={32} />
            AI 추천 레시피
          </h2>

          {isLoading && <LoadingState />}

          {error && <ErrorState message={error} onRetry={handleGenerateClick} />}

          {!isLoading && !error && recipes.length > 0 && (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {recipes.map((recipe, i) => (
                <RecipeCard key={`${i}_${Date.now()}`} recipe={recipe} />
              ))}
            </div>
          )}

          {!isLoading && !error && recipes.length === 0 && (
            <div className="text-center py-12 px-6 bg-card rounded-2xl shadow-md border border-border">
              <ChefHat className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">레시피를 기다리고 있어요</h3>
              <p className="text-muted-foreground">위에서 재료를 입력하고 'AI 레시피 생성' 버튼을 눌러주세요!</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-card border-t border-border">
        <div className="container mx-auto px-8 py-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="text-spice-red mr-2" size={20} />
            <span className="text-card-foreground font-medium">맛있는 요리로 행복한 하루 되세요!</span>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} 냉장고 털이 레시피. 음식물 쓰레기를 줄이고 맛있는 요리를 만들어보세요.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
