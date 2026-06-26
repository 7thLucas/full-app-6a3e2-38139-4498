import { useState } from "react";
import { Heart, Clock, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import type { MealEntry } from "~/meal-planner/hooks/use-meal-plan";

interface MealCardProps {
  meal: MealEntry;
  date: string;
  weekStart: string;
  onToggleFavorite?: (weekStart: string, date: string, mealType: string) => void;
  showNutrition?: boolean;
}

const MEAL_EMOJI: Record<string, string> = {
  breakfast: "☀️",
  lunch: "🥗",
  dinner: "🍽️",
  snack: "🍎",
};

export function MealCard({ meal, date, weekStart, onToggleFavorite, showNutrition }: MealCardProps) {
  const { config, loading } = useConfigurables();
  const [expanded, setExpanded] = useState(false);

  if (loading) return null;
  const enableNutrition = config.enableNutrition ?? true;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">{MEAL_EMOJI[meal.mealType] ?? "🍴"}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {meal.mealType}
            </span>
          </div>
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{meal.name}</h3>
          {meal.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{meal.description}</p>
          )}
        </div>
        {onToggleFavorite && (
          <button
            onClick={() => onToggleFavorite(weekStart, date, meal.mealType)}
            className="shrink-0 p-1.5 rounded-full hover:bg-accent transition-colors"
            aria-label={meal.isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              size={16}
              className={meal.isFavorited ? "fill-primary text-primary" : "text-muted-foreground"}
            />
          </button>
        )}
      </div>

      {/* Meta chips */}
      <div className="px-4 pb-2 flex items-center gap-3">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock size={11} />
          {meal.prepTime}m
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users size={11} />
          {meal.servings} serving{meal.servings !== 1 ? "s" : ""}
        </span>
        {enableNutrition && meal.nutrition && (
          <span className="text-xs font-medium text-primary">
            {meal.nutrition.calories} kcal
          </span>
        )}
      </div>

      {/* Nutrition bar */}
      {enableNutrition && meal.nutrition && (
        <div className="px-4 pb-2">
          <div className="grid grid-cols-4 gap-1 text-center">
            {[
              { label: "Protein", value: meal.nutrition.protein, unit: "g", color: "bg-primary" },
              { label: "Carbs", value: meal.nutrition.carbs, unit: "g", color: "bg-secondary" },
              { label: "Fat", value: meal.nutrition.fat, unit: "g", color: "bg-accent" },
              { label: "Fiber", value: meal.nutrition.fiber, unit: "g", color: "bg-muted" },
            ].map((n) => (
              <div key={n.label} className="rounded-lg bg-muted/60 px-1 py-1">
                <div className="text-xs font-semibold text-foreground">{n.value}{n.unit}</div>
                <div className="text-[10px] text-muted-foreground">{n.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expand / collapse ingredients + instructions */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full px-4 py-2 flex items-center justify-between text-xs text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors border-t border-border"
      >
        <span>{expanded ? "Hide details" : "Show ingredients & steps"}</span>
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border">
          <div className="mt-3">
            <p className="text-xs font-semibold text-foreground mb-1.5">Ingredients</p>
            <div className="flex flex-wrap gap-1.5">
              {meal.ingredients.map((ing, i) => (
                <span key={i} className="text-xs bg-muted text-foreground px-2 py-0.5 rounded-full border border-border">
                  {ing}
                </span>
              ))}
            </div>
          </div>
          {meal.instructions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground mb-1.5">Instructions</p>
              <ol className="space-y-1">
                {meal.instructions.map((step, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="shrink-0 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-semibold">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
