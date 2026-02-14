export interface Meal {
  id?: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  estimatedCost: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisineType?: string;
  imageUrl?: string;
}

export interface MealRecommendation {
  id?: string;
  userId: string;
  receiptId: string;
  meal: Meal;
  matchedIngredients: string[]; // Ingredients from receipt
  matchScore: number; // 0-100, how well receipt items match
  potentialSavings: number; // Estimated savings vs buying new
  createdAt: Date;
  isFavorite: boolean;
}