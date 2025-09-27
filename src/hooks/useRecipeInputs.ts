import { useReducer } from "react";

// 1. 상태의 형태(shape)를 정의합니다.
export interface RecipeInputState {
  ingredients: string[];
  weather: string;
  mood: string;
  servings: string;
}

// 2. 상태를 변경할 수 있는 액션들을 정의합니다.
type RecipeInputAction =
  | { type: "ADD_INGREDIENT"; payload: string }
  | { type: "REMOVE_INGREDIENT"; payload: string }
  | { type: "SET_WEATHER"; payload: string }
  | { type: "SET_MOOD"; payload: string }
  | { type: "SET_SERVINGS"; payload: string }
  | { type: "RESET_INPUTS" };

// 3. 초기 상태 값을 정의합니다.
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

// 4. 상태와 액션을 받아 새로운 상태를 반환하는 리듀서 함수를 정의합니다.
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

// 5. 리듀서 로직을 포함하는 커스텀 훅을 만들어 내보냅니다.
export const useRecipeInputs = () => {
  const [inputState, dispatch] = useReducer(recipeInputReducer, initialState);
  return { inputState, dispatch };
};
