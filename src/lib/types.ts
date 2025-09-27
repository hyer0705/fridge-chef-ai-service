export interface Recipe {
  name: string;
  time: string;
  difficulty: string;
  ingredientsUsed: Array<{ name: string; quantity: string }>;
  steps: string[];
  nutrition: string;
  servings: string;
}

export interface RecipeGenerationParams {
  ingredients: string[];
  weather: string;
  mood: string;
  servings: string;
}
