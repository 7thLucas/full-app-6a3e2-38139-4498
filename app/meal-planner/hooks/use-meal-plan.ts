import { useState, useCallback } from "react";

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MealEntry {
  mealType: string;
  name: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  servings: number;
  nutrition?: NutritionInfo;
  isFavorited: boolean;
}

export interface DayPlan {
  date: string;
  meals: MealEntry[];
}

export interface MealPlan {
  _id: string;
  userId: string;
  weekStart: string;
  days: DayPlan[];
  dietType?: string;
  healthGoal?: string;
  allergies: string[];
  isGenerated: boolean;
  createdAt: string;
}

export interface UserPreferences {
  dietType: string;
  healthGoal: string;
  allergies: string[];
  dislikedIngredients: string[];
  availableIngredients: string[];
  mealsPerDay: number;
  dailyCalorieTarget: number;
}

export interface ShoppingItem {
  name: string;
  quantity?: string;
  unit?: string;
  category?: string;
  isChecked: boolean;
}

export interface ShoppingList {
  _id: string;
  weekStart: string;
  items: ShoppingItem[];
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message ?? "Request failed");
  }
  const data = await res.json();
  return data.data;
}

export function useMealPlan() {
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [recentPlans, setRecentPlans] = useState<MealPlan[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<MealPlan>("/api/meal-plans/current");
      setPlan(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRecentPlans = useCallback(async () => {
    try {
      const data = await apiFetch<MealPlan[]>("/api/meal-plans/recent");
      setRecentPlans(data);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const generatePlan = useCallback(async (prefs: Partial<UserPreferences> & { daysPerWeek?: number }) => {
    setGenerating(true);
    setError(null);
    try {
      const data = await apiFetch<MealPlan>("/api/meal-plans/generate", {
        method: "POST",
        body: JSON.stringify(prefs),
      });
      setPlan(data);
      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setGenerating(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (weekStart: string, date: string, mealType: string) => {
    try {
      const data = await apiFetch<MealPlan>("/api/meal-plans/favorite", {
        method: "POST",
        body: JSON.stringify({ weekStart, date, mealType }),
      });
      setPlan(data);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const fetchPreferences = useCallback(async () => {
    try {
      const data = await apiFetch<UserPreferences>("/api/meal-plans/preferences");
      if (data) setPreferences(data);
    } catch {
      // no prefs yet — that's fine
    }
  }, []);

  const savePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    try {
      const data = await apiFetch<UserPreferences>("/api/meal-plans/preferences", {
        method: "PUT",
        body: JSON.stringify(prefs),
      });
      setPreferences(data);
      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    }
  }, []);

  const fetchShoppingList = useCallback(async (weekStart: string) => {
    try {
      const data = await apiFetch<ShoppingList>(`/api/meal-plans/shopping/${weekStart}`);
      setShoppingList(data);
    } catch {
      // no list yet
    }
  }, []);

  const generateShoppingList = useCallback(async (weekStart: string) => {
    setLoading(true);
    try {
      const data = await apiFetch<ShoppingList>("/api/meal-plans/shopping/generate", {
        method: "POST",
        body: JSON.stringify({ weekStart }),
      });
      setShoppingList(data);
      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleShoppingItem = useCallback(async (weekStart: string, itemName: string) => {
    try {
      const data = await apiFetch<ShoppingList>("/api/meal-plans/shopping/toggle", {
        method: "POST",
        body: JSON.stringify({ weekStart, itemName }),
      });
      setShoppingList(data);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  return {
    plan,
    recentPlans,
    preferences,
    shoppingList,
    loading,
    generating,
    error,
    fetchCurrentPlan,
    fetchRecentPlans,
    generatePlan,
    toggleFavorite,
    fetchPreferences,
    savePreferences,
    fetchShoppingList,
    generateShoppingList,
    toggleShoppingItem,
  };
}
