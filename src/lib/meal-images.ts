import avocadoToast from "@/assets/meal-avocado-toast.jpg";
import quinoaSalad from "@/assets/meal-quinoa-salad.jpg";
import grilledSalmon from "@/assets/meal-grilled-salmon.jpg";
import oatsBowl from "@/assets/meal-oats-bowl.jpg";
import stirFry from "@/assets/meal-stir-fry.jpg";
import smoothieBowl from "@/assets/meal-smoothie-bowl.jpg";
import caesarSalad from "@/assets/meal-caesar-salad.jpg";
import pasta from "@/assets/meal-pasta.jpg";

export const MEAL_IMAGES: Record<string, string> = {
  "avocado-toast": avocadoToast,
  "quinoa-salad": quinoaSalad,
  "grilled-salmon": grilledSalmon,
  "oats-bowl": oatsBowl,
  "stir-fry": stirFry,
  "smoothie-bowl": smoothieBowl,
  "caesar-salad": caesarSalad,
  "pasta": pasta,
};

export const MEAL_IMAGE_KEYS = Object.keys(MEAL_IMAGES);
export const getMealImage = (key?: string) => (key && MEAL_IMAGES[key]) || avocadoToast;
