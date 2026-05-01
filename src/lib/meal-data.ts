export type Meal = { name: string; description: string; image_key: string };
export type DayPlan = {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  nutrition: { calories: number; protein: number; carbs: number; fats: number };
};
export type GroceryItem = { name: string; category: string; quantity: string };
export type MealPlanData = { days: DayPlan[]; grocery: GroceryItem[] };

export const SAMPLE_PLAN: MealPlanData = {
  days: [
    { day: "Monday",
      breakfast: { name: "Avocado Toast", description: "Sourdough, smashed avocado, microgreens", image_key: "avocado-toast" },
      lunch: { name: "Quinoa Salad", description: "Quinoa, feta, tomatoes, cucumber", image_key: "quinoa-salad" },
      dinner: { name: "Grilled Salmon", description: "With roasted seasonal veggies", image_key: "grilled-salmon" },
      nutrition: { calories: 1820, protein: 118, carbs: 198, fats: 68 } },
    { day: "Tuesday",
      breakfast: { name: "Berry Smoothie Bowl", description: "Mixed berries, granola, kiwi", image_key: "smoothie-bowl" },
      lunch: { name: "Caesar Salad", description: "Grilled chicken, romaine, parmesan", image_key: "caesar-salad" },
      dinner: { name: "Veggie Stir-Fry", description: "Tofu, peppers, broccoli, sesame", image_key: "stir-fry" },
      nutrition: { calories: 1760, protein: 112, carbs: 184, fats: 64 } },
    { day: "Wednesday",
      breakfast: { name: "Overnight Oats", description: "Oats, chia, banana, berries", image_key: "oats-bowl" },
      lunch: { name: "Quinoa Bowl", description: "Quinoa, roasted veg, tahini", image_key: "quinoa-salad" },
      dinner: { name: "Tomato Basil Pasta", description: "Spaghetti, fresh basil, parmesan", image_key: "pasta" },
      nutrition: { calories: 1900, protein: 96, carbs: 240, fats: 60 } },
    { day: "Thursday",
      breakfast: { name: "Avocado Toast", description: "With poached egg", image_key: "avocado-toast" },
      lunch: { name: "Stir-Fry Bowl", description: "Tofu and rainbow veggies", image_key: "stir-fry" },
      dinner: { name: "Grilled Salmon", description: "Lemon herb butter", image_key: "grilled-salmon" },
      nutrition: { calories: 1880, protein: 132, carbs: 176, fats: 72 } },
    { day: "Friday",
      breakfast: { name: "Smoothie Bowl", description: "Acai, granola, fresh fruit", image_key: "smoothie-bowl" },
      lunch: { name: "Caesar Salad", description: "Light dressing, croutons", image_key: "caesar-salad" },
      dinner: { name: "Family Pasta Night", description: "Tomato basil with parmesan", image_key: "pasta" },
      nutrition: { calories: 1950, protein: 102, carbs: 232, fats: 66 } },
    { day: "Saturday",
      breakfast: { name: "Overnight Oats", description: "Honey, almonds, berries", image_key: "oats-bowl" },
      lunch: { name: "Quinoa Salad", description: "Mediterranean style", image_key: "quinoa-salad" },
      dinner: { name: "Stir-Fry", description: "Ginger sesame tofu", image_key: "stir-fry" },
      nutrition: { calories: 1780, protein: 108, carbs: 198, fats: 62 } },
    { day: "Sunday",
      breakfast: { name: "Avocado Toast", description: "Brunch special", image_key: "avocado-toast" },
      lunch: { name: "Grilled Salmon", description: "Cold salmon flakes on greens", image_key: "grilled-salmon" },
      dinner: { name: "Pasta", description: "Slow-simmered tomato sauce", image_key: "pasta" },
      nutrition: { calories: 1850, protein: 124, carbs: 188, fats: 70 } },
  ],
  grocery: [
    { name: "Spinach", category: "Produce", quantity: "1 bag" },
    { name: "Avocados", category: "Produce", quantity: "5" },
    { name: "Cherry tomatoes", category: "Produce", quantity: "2 pints" },
    { name: "Cucumber", category: "Produce", quantity: "2" },
    { name: "Mixed berries", category: "Produce", quantity: "3 cups" },
    { name: "Bananas", category: "Produce", quantity: "1 bunch" },
    { name: "Salmon fillets", category: "Protein", quantity: "4" },
    { name: "Chicken breast", category: "Protein", quantity: "1 lb" },
    { name: "Firm tofu", category: "Protein", quantity: "2 blocks" },
    { name: "Feta cheese", category: "Dairy", quantity: "8 oz" },
    { name: "Parmesan", category: "Dairy", quantity: "4 oz" },
    { name: "Greek yogurt", category: "Dairy", quantity: "32 oz" },
    { name: "Quinoa", category: "Pantry", quantity: "2 cups" },
    { name: "Rolled oats", category: "Pantry", quantity: "1 lb" },
    { name: "Spaghetti", category: "Pantry", quantity: "1 box" },
    { name: "Almonds", category: "Pantry", quantity: "1 cup" },
    { name: "Sourdough bread", category: "Bakery", quantity: "1 loaf" },
  ],
};
