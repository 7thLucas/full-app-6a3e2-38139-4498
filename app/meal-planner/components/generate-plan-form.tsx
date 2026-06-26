import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import type { UserPreferences } from "~/meal-planner/hooks/use-meal-plan";

interface GeneratePlanFormProps {
  preferences: UserPreferences | null;
  generating: boolean;
  onGenerate: (prefs: Partial<UserPreferences> & { daysPerWeek?: number }) => void;
}

export function GeneratePlanForm({ preferences, generating, onGenerate }: GeneratePlanFormProps) {
  const { config, loading } = useConfigurables();

  const availableDiets = config.availableDiets ?? ["No Restriction", "Vegetarian", "Vegan", "Keto", "Paleo", "Gluten-Free"];
  const availableGoals = config.availableGoals ?? ["Eat Healthier", "Lose Weight", "Build Muscle", "Maintain Weight"];
  const mealsPerDayDefault = config.mealsPerDay ?? 3;
  const daysPerWeekDefault = config.daysPerWeek ?? 7;

  const [dietType, setDietType] = useState(preferences?.dietType ?? "No Restriction");
  const [healthGoal, setHealthGoal] = useState(preferences?.healthGoal ?? "Eat Healthier");
  const [allergiesInput, setAllergiesInput] = useState(preferences?.allergies?.join(", ") ?? "");
  const [ingredientsInput, setIngredientsInput] = useState(preferences?.availableIngredients?.join(", ") ?? "");
  const [mealsPerDay, setMealsPerDay] = useState(preferences?.mealsPerDay ?? mealsPerDayDefault);
  const [daysPerWeek, setDaysPerWeek] = useState(daysPerWeekDefault);
  const [calories, setCalories] = useState(preferences?.dailyCalorieTarget ?? 2000);

  if (loading) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onGenerate({
      dietType,
      healthGoal,
      allergies: allergiesInput.split(",").map((s) => s.trim()).filter(Boolean),
      availableIngredients: ingredientsInput.split(",").map((s) => s.trim()).filter(Boolean),
      mealsPerDay,
      daysPerWeek,
      dailyCalorieTarget: calories,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-primary" />
        <h2 className="font-semibold text-foreground text-base">
          {config.heroCta ?? "Generate My Meal Plan"}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Diet type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Diet Type</label>
          <select
            value={dietType}
            onChange={(e) => setDietType(e.target.value)}
            className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {availableDiets.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Health goal */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Health Goal</label>
          <select
            value={healthGoal}
            onChange={(e) => setHealthGoal(e.target.value)}
            className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {availableGoals.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Meals per day */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Meals Per Day</label>
          <select
            value={mealsPerDay}
            onChange={(e) => setMealsPerDay(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} meal{n !== 1 ? "s" : ""}</option>
            ))}
          </select>
        </div>

        {/* Days per week */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Days to Plan</label>
          <select
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>{n} day{n !== 1 ? "s" : ""}</option>
            ))}
          </select>
        </div>

        {/* Daily calories */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Daily Calorie Target</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(Number(e.target.value))}
            min={800}
            max={5000}
            step={100}
            className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Allergies */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Allergies / Avoid</label>
          <input
            type="text"
            value={allergiesInput}
            onChange={(e) => setAllergiesInput(e.target.value)}
            placeholder="e.g. nuts, shellfish, lactose"
            className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
          <p className="text-[10px] text-muted-foreground">Comma-separated</p>
        </div>
      </div>

      {/* Available ingredients */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Ingredients I Have (optional)</label>
        <textarea
          value={ingredientsInput}
          onChange={(e) => setIngredientsInput(e.target.value)}
          placeholder="e.g. chicken breast, rice, broccoli, olive oil"
          rows={2}
          className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
        />
        <p className="text-[10px] text-muted-foreground">AI will prioritize these when building your plan.</p>
      </div>

      <button
        type="submit"
        disabled={generating}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold py-2.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {generating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Generating your meal plan…
          </>
        ) : (
          <>
            <Sparkles size={16} />
            {config.heroCta ?? "Generate My Meal Plan"}
          </>
        )}
      </button>
    </form>
  );
}
