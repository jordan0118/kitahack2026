import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Meal {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  estimatedCost: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisineType?: string;
}

export interface MealRecommendation {
  id?: string;
  user_id?: string;
  receipt_id: string;
  meal: Meal;
  matched_ingredients: string[];
  match_score: number;
  potential_savings: number;
  is_favorite: boolean;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MealService {
  constructor(private supabase: SupabaseService) {}

  /**
   * Save AI-generated meal recommendation
   */
  async saveMealRecommendation(recommendation: Omit<MealRecommendation, 'id' | 'user_id' | 'created_at'>): Promise<string> {
    try {
      const userId = this.supabase.userId;
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await this.supabase.client
        .from('meal_recommendations')
        .insert([{
          ...recommendation,
          user_id: userId
        }])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Meal recommendation saved:', data.id);
      return data.id;
    } catch (error) {
      console.error('❌ Error saving meal recommendation:', error);
      throw new Error('Failed to save meal recommendation');
    }
  }

  /**
   * Get meal recommendations for current user
   */
  async getUserMealRecommendations(): Promise<MealRecommendation[]> {
    try {
      const userId = this.supabase.userId;
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await this.supabase.client
        .from('meal_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MealRecommendation[];
    } catch (error) {
      console.error('❌ Error fetching meal recommendations:', error);
      return [];
    }
  }

  /**
   * Get recommendations for specific receipt
   */
  async getRecommendationsForReceipt(receiptId: string): Promise<MealRecommendation[]> {
    try {
      const { data, error } = await this.supabase.client
        .from('meal_recommendations')
        .select('*')
        .eq('receipt_id', receiptId)
        .order('match_score', { ascending: false });

      if (error) throw error;
      return data as MealRecommendation[];
    } catch (error) {
      console.error('❌ Error fetching receipt recommendations:', error);
      return [];
    }
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(recommendationId: string, isFavorite: boolean): Promise<void> {
    try {
      const { error } = await this.supabase.client
        .from('meal_recommendations')
        .update({ is_favorite: isFavorite })
        .eq('id', recommendationId);

      if (error) throw error;
      console.log('✅ Favorite toggled:', recommendationId, isFavorite);
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
      throw new Error('Failed to update favorite status');
    }
  }

  /**
   * Get favorite meals
   */
  async getFavoriteMeals(): Promise<MealRecommendation[]> {
    try {
      const userId = this.supabase.userId;
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await this.supabase.client
        .from('meal_recommendations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false});

      if (error) throw error;
      return data as MealRecommendation[];
    } catch (error) {
      console.error('❌ Error fetching favorite meals:', error);
      return [];
    }
  }
}