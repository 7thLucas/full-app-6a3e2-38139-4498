import type { Request, Response } from "express";
import { MealPlanService } from "./meal-plan.service";

export async function getCurrentPlan(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const plan = await MealPlanService.getOrCreateCurrentPlan(userId);
    return res.json({ success: true, data: plan });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getRecentPlans(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const limit = Math.min(Number(req.query.limit) || 8, 20);
    const plans = await MealPlanService.getRecentPlans(userId, limit);
    return res.json({ success: true, data: plans });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function generatePlan(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const preferences = req.body ?? {};
    const plan = await MealPlanService.generateMealPlan(userId, preferences);
    return res.json({ success: true, data: plan });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function toggleFavorite(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { weekStart, date, mealType } = req.body;
    const plan = await MealPlanService.toggleFavorite(userId, weekStart, date, mealType);
    return res.json({ success: true, data: plan });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function getPreferences(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const prefs = await MealPlanService.getPreferences(userId);
    return res.json({ success: true, data: prefs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function updatePreferences(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const prefs = await MealPlanService.upsertPreferences(userId, req.body);
    return res.json({ success: true, data: prefs });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function getShoppingList(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { weekStart } = req.params;
    const list = await MealPlanService.getShoppingList(userId, weekStart);
    return res.json({ success: true, data: list });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function generateShoppingList(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { weekStart } = req.body;
    const list = await MealPlanService.generateShoppingList(userId, weekStart);
    return res.json({ success: true, data: list });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

export async function toggleShoppingItem(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { weekStart, itemName } = req.body;
    const list = await MealPlanService.toggleShoppingItem(userId, weekStart, itemName);
    return res.json({ success: true, data: list });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
