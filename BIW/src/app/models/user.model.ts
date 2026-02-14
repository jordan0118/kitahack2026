export interface UserPreferences {
  dietaryRestrictions: string[]; // e.g., ["vegetarian", "gluten-free"]
  allergies: string[];
  cuisinePreferences: string[];
  budgetLimit?: number;
  householdSize: number;
}

export interface User {
  id: string; // Firebase Auth UID
  email: string;
  displayName?: string;
  preferences: UserPreferences;
  totalSavings: number;
  receiptsCount: number;
  mealsCooked: number;
  createdAt: Date;
  lastActive: Date;
}