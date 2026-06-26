import { Router } from "express";
import { requireAuth } from "~/modules/authentication/authentication.middleware";
import {
  getCurrentPlan,
  getRecentPlans,
  generatePlan,
  toggleFavorite,
  getPreferences,
  updatePreferences,
  getShoppingList,
  generateShoppingList,
  toggleShoppingItem,
} from "./meal-plan.controller";

const router = Router();

// Meal plans
router.get("/meal-plans/current", requireAuth, getCurrentPlan);
router.get("/meal-plans/recent", requireAuth, getRecentPlans);
router.post("/meal-plans/generate", requireAuth, generatePlan);
router.post("/meal-plans/favorite", requireAuth, toggleFavorite);

// Preferences
router.get("/meal-plans/preferences", requireAuth, getPreferences);
router.put("/meal-plans/preferences", requireAuth, updatePreferences);

// Shopping list
router.get("/meal-plans/shopping/:weekStart", requireAuth, getShoppingList);
router.post("/meal-plans/shopping/generate", requireAuth, generateShoppingList);
router.post("/meal-plans/shopping/toggle", requireAuth, toggleShoppingItem);

export default router;
