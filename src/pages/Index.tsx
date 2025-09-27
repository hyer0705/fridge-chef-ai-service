import { useState } from "react";
import { ChefHat, Zap, RotateCcw, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import IngredientInput from "@/components/IngredientInput";
import PreferenceInputs from "@/components/PreferenceInputs";
import RecipeCard from "@/components/RecipeCard";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import { generateRecipesFromGemini } from "@/lib/gemini";

interface Recipe {
  name: string;
  time: string;
  difficulty: string;
  ingredientsUsed: string[];
  steps: string[];
  nutrition: string;
  servings: string;
}

const Index = () => {
  const [ingredients, setIngredients] = useState(["돼지고기", "김치", "양파"]);
  const [weather, setWeather] = useState("비 오는 날");
  const [mood, setMood] = useState("따뜻하고 얼큰한");
  const [servings, setServings] = useState("2");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const addIngredient = (ingredient: string) => {
    setIngredients([...ingredients, ingredient]);
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredientToRemove));
  };

  const resetAllInputs = () => {
    setIngredients([]);
    setWeather("");
    setMood("");
    setServings("1");
    setRecipes([]);
    setError(null);
    toast({
      title: "입력이 초기화되었습니다",
      description: "새로운 재료로 다시 시작해보세요!",
    });
  };

  const generateRecipes = async () => {
    if (ingredients.length < 1) {
      setError("레시피를 생성하려면 최소 1개 이상의 재료를 입력해야 합니다.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);

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
      4. "ingredientsUsed": 제공된 재료 목록 중 실제로 사용된 재료들의 배열. 각 재료는 반드시 수량과 단위를 포함해야 합니다.
      5. "steps": 단계별 요리 방법 (최대 6단계, 각 단계는 2문장 이하로 간결하게)
      6. "nutrition": 예상 영양 정보 (칼로리 포함, 예: "약 450kcal")
      7. "servings": 추천 인원 수 (예: "${servings}인분")
      
      전체 응답은 반드시 유효한 JSON 형식이어야 하며, 루트 요소는 "recipes"라는 키를 가진 배열입니다.
    `;

    try {
      const responseText = await generateRecipesFromGemini(prompt);

      // Gemini API는 종종 응답에 ```json ... ``` 마크다운을 포함하므로, 순수 JSON만 추출
      const jsonString = responseText.match(/```json([\s\S]*?)```/)?.[1] || responseText;

      const parsedResponse = JSON.parse(jsonString);
      const generatedRecipes = parsedResponse.recipes;

      setRecipes(generatedRecipes);
      toast({
        title: "레시피가 완성되었습니다! 🍳",
        description: `${generatedRecipes.length}가지 맛있는 요리를 제안드려요.`,
      });
    } catch (e) {
      console.error(e);
      setError("레시피 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
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
            <IngredientInput ingredients={ingredients} onAddIngredient={addIngredient} onRemoveIngredient={removeIngredient} />

            <PreferenceInputs
              weather={weather}
              mood={mood}
              servings={servings}
              onWeatherChange={setWeather}
              onMoodChange={setMood}
              onServingsChange={setServings}
            />
          </div>

          <div className="mt-8 text-center flex flex-col md:flex-row justify-center items-center gap-4">
            <Button
              onClick={generateRecipes}
              disabled={isLoading || ingredients.length < 1}
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

          {error && (
            <ErrorState
              message={error}
              onRetry={() => {
                setError(null);
                generateRecipes();
              }}
            />
          )}

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
