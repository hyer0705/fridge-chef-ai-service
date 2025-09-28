import { useReducer } from "react";

export interface RecipeInputState {
  ingredients: string[];
  weather: string;
  mood: string;
  servings: string;
}

type RecipeInputAction =
  | { type: "ADD_INGREDIENT"; payload: string }
  | { type: "REMOVE_INGREDIENT"; payload: string }
  | { type: "SET_WEATHER"; payload: string }
  | { type: "SET_MOOD"; payload: string }
  | { type: "SET_SERVINGS"; payload: string }
  | { type: "RESET_INPUTS" };

const initialState: RecipeInputState = {
  ingredients: ["돼지고기", "김치", "양파"],
  weather: "비 오는 날",
  mood: "따뜻하고 얼큰한",
  servings: "2",
};

const emptyState: RecipeInputState = {
  ingredients: [],
  weather: "",
  mood: "",
  servings: "1",
};

const recipeInputReducer = (state: RecipeInputState, action: RecipeInputAction): RecipeInputState => {
  switch (action.type) {
    case "ADD_INGREDIENT":
      if (state.ingredients.includes(action.payload)) return state;
      return { ...state, ingredients: [...state.ingredients, action.payload] };
    case "REMOVE_INGREDIENT":
      return { ...state, ingredients: state.ingredients.filter((ing) => ing !== action.payload) };
    case "SET_WEATHER":
      return { ...state, weather: action.payload };
    case "SET_MOOD":
      return { ...state, mood: action.payload };
    case "SET_SERVINGS":
      return { ...state, servings: action.payload };
    case "RESET_INPUTS":
      return emptyState;
    default:
      return state;
  }
};

export const useRecipeInputs = () => {
  const [inputState, dispatch] = useReducer(recipeInputReducer, initialState);
  return { inputState, dispatch };
};
