import { createHash } from "node:crypto";
import axios from "axios";
import { MealPlanModel } from "./meal-plan.model";
import { UserPreferencesModel } from "./user-preferences.model";
import { ShoppingListModel } from "./shopping-list.model";

const AGENTIC_SERVICE_URL = "https://api-micro-agentic.quantumbyte.ai";

function agentic_authHeaders(): Record<string, string> {
  const auth = process.env.QB_SCAFFOLDER_KEY;
  return auth ? { Authentication: auth } : {};
}

function llmIdempotencyKey(ks: string, message: string, schema: string, systemPrompt: string): string {
  return createHash("sha256")
    .update(ks)
    .update("\x00")
    .update(message)
    .update("\x00")
    .update(schema)
    .update("\x00")
    .update(systemPrompt)
    .digest("hex")
    .slice(0, 32);
}

async function callLLM(message: string, schema: object, systemPrompt?: string): Promise<unknown> {
  const ks = process.env._KEYSPACE ?? "";
  const schemaStr = JSON.stringify(schema);
  const systemPromptStr = systemPrompt ?? "";
  const form = new FormData();
  form.set("message", message);
  form.set("schema", schemaStr);
  if (systemPromptStr) form.set("system_prompt", systemPromptStr);

  const idempotencyKey = llmIdempotencyKey(ks, message, schemaStr, systemPromptStr);

  const response = await axios.post(`${AGENTIC_SERVICE_URL}/api/llm`, form, {
    headers: {
      "x-id-keyspace": ks,
      "idempotency-key": idempotencyKey,
      ...agentic_authHeaders(),
    },
    timeout: 90_000,
  });

  const data = response.data?.data ?? response.data;
  if (data?.response) return data.response;
  return data;
}

function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  // Monday as week start
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

function getWeekDates(weekStart: string): string[] {
  const dates: string[] = [];
  const start = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export const MealPlanService = {
  async getOrCreateCurrentPlan(userId: string) {
    const weekStart = getWeekStart();
    let plan = await MealPlanModel.findOne({ userId, weekStart }).lean();
    if (!plan) {
      plan = await MealPlanModel.create({ userId, weekStart, days: [], isGenerated: false });
    }
    return plan;
  },

  async getPlanByWeek(userId: string, weekStart: string) {
    return MealPlanModel.findOne({ userId, weekStart }).lean();
  },

  async getRecentPlans(userId: string, limit = 8) {
    return MealPlanModel.find({ userId })
      .sort({ weekStart: -1 })
      .limit(limit)
      .lean();
  },

  async generateMealPlan(userId: string, preferences: {
    dietType?: string;
    healthGoal?: string;
    allergies?: string[];
    availableIngredients?: string[];
    mealsPerDay?: number;
    daysPerWeek?: number;
    dailyCalorieTarget?: number;
  }) {
    const weekStart = getWeekStart();
    const dates = getWeekDates(weekStart).slice(0, preferences.daysPerWeek ?? 7);
    const mealsPerDay = preferences.mealsPerDay ?? 3;
    const mealTypes = ["breakfast", "lunch", "dinner", "snack"].slice(0, mealsPerDay);

    const prompt = `Generate a ${dates.length}-day meal plan.
Diet: ${preferences.dietType ?? "No Restriction"}
Goal: ${preferences.healthGoal ?? "Eat Healthier"}
Allergies: ${preferences.allergies?.join(", ") || "None"}
Available ingredients: ${preferences.availableIngredients?.join(", ") || "Standard pantry"}
Meals per day: ${mealsPerDay} (${mealTypes.join(", ")})
Daily calorie target: ${preferences.dailyCalorieTarget ?? 2000} kcal

For each day (${dates.join(", ")}), provide ${mealsPerDay} meals.
Each meal must have: name, description, ingredients (array), instructions (array), prepTime (minutes), servings (number), nutrition (calories, protein, carbs, fat, fiber numbers).`;

    const schema = {
      type: "object",
      properties: {
        days: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string" },
              meals: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    mealType: { type: "string" },
                    name: { type: "string" },
                    description: { type: "string" },
                    ingredients: { type: "array", items: { type: "string" } },
                    instructions: { type: "array", items: { type: "string" } },
                    prepTime: { type: "number" },
                    servings: { type: "number" },
                    nutrition: {
                      type: "object",
                      properties: {
                        calories: { type: "number" },
                        protein: { type: "number" },
                        carbs: { type: "number" },
                        fat: { type: "number" },
                        fiber: { type: "number" },
                      },
                      required: ["calories", "protein", "carbs", "fat", "fiber"],
                    },
                  },
                  required: ["mealType", "name", "description", "ingredients", "instructions", "prepTime", "servings", "nutrition"],
                },
              },
            },
            required: ["date", "meals"],
          },
        },
      },
      required: ["days"],
    };

    const result = await callLLM(
      prompt,
      schema,
      "You are a professional nutritionist and chef. Generate realistic, healthy, and delicious meal plans. Always return valid JSON matching the schema exactly.",
    );

    const generatedDays = (result as any).days ?? [];

    // Assign correct dates and mealTypes
    const days = generatedDays.map((day: any, i: number) => ({
      date: dates[i] ?? day.date,
      meals: (day.meals ?? []).map((meal: any, j: number) => ({
        ...meal,
        mealType: mealTypes[j] ?? meal.mealType,
        isFavorited: false,
      })),
    }));

    const plan = await MealPlanModel.findOneAndUpdate(
      { userId, weekStart },
      {
        userId,
        weekStart,
        days,
        dietType: preferences.dietType,
        healthGoal: preferences.healthGoal,
        allergies: preferences.allergies ?? [],
        availableIngredients: preferences.availableIngredients ?? [],
        isGenerated: true,
      },
      { upsert: true, new: true }
    ).lean();

    return plan;
  },

  async toggleFavorite(userId: string, weekStart: string, date: string, mealType: string) {
    const plan = await MealPlanModel.findOne({ userId, weekStart });
    if (!plan) throw new Error("Plan not found");
    const day = plan.days.find((d) => d.date === date);
    if (!day) throw new Error("Day not found");
    const meal = day.meals.find((m) => m.mealType === mealType);
    if (!meal) throw new Error("Meal not found");
    (meal as any).isFavorited = !meal.isFavorited;
    await plan.save();
    return plan.toObject();
  },

  // User Preferences
  async getPreferences(userId: string) {
    return UserPreferencesModel.findOne({ userId }).lean();
  },

  async upsertPreferences(userId: string, data: Partial<{
    dietType: string;
    healthGoal: string;
    allergies: string[];
    dislikedIngredients: string[];
    availableIngredients: string[];
    mealsPerDay: number;
    dailyCalorieTarget: number;
  }>) {
    return UserPreferencesModel.findOneAndUpdate(
      { userId },
      { userId, ...data },
      { upsert: true, new: true }
    ).lean();
  },

  // Shopping list
  async generateShoppingList(userId: string, weekStart: string) {
    const plan = await MealPlanModel.findOne({ userId, weekStart }).lean();
    if (!plan) throw new Error("Meal plan not found");

    // Aggregate all ingredients
    const ingredientSet = new Map<string, { count: number }>();
    for (const day of plan.days) {
      for (const meal of day.meals) {
        for (const ing of meal.ingredients) {
          const key = ing.toLowerCase().trim();
          const existing = ingredientSet.get(key);
          if (existing) existing.count++;
          else ingredientSet.set(key, { count: 1 });
        }
      }
    }

    const items = Array.from(ingredientSet.entries()).map(([name]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      isChecked: false,
    }));

    const list = await ShoppingListModel.findOneAndUpdate(
      { userId, weekStart },
      { userId, mealPlanId: String(plan._id), weekStart, items },
      { upsert: true, new: true }
    ).lean();

    return list;
  },

  async getShoppingList(userId: string, weekStart: string) {
    return ShoppingListModel.findOne({ userId, weekStart }).lean();
  },

  async toggleShoppingItem(userId: string, weekStart: string, itemName: string) {
    const list = await ShoppingListModel.findOne({ userId, weekStart });
    if (!list) throw new Error("Shopping list not found");
    const item = list.items.find((i) => i.name.toLowerCase() === itemName.toLowerCase());
    if (!item) throw new Error("Item not found");
    (item as any).isChecked = !item.isChecked;
    await list.save();
    return list.toObject();
  },
};
