import { useEffect, useState } from "react";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useConfigurables } from "~/modules/configurables";
import { AppHeader } from "~/meal-planner/components/app-header";
import { useMealPlan } from "~/meal-planner/hooks/use-meal-plan";
import { Settings, Save, Loader2 } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

export default function PreferencesPage() {
  const { config, loading: configLoading } = useConfigurables();
  const { preferences, fetchPreferences, savePreferences, error } = useMealPlan();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const availableDiets = config.availableDiets ?? ["No Restriction", "Vegetarian", "Vegan", "Keto", "Paleo", "Gluten-Free"];
  const availableGoals = config.availableGoals ?? ["Eat Healthier", "Lose Weight", "Build Muscle", "Maintain Weight"];

  const [dietType, setDietType] = useState("No Restriction");
  const [healthGoal, setHealthGoal] = useState("Eat Healthier");
  const [allergiesInput, setAllergiesInput] = useState("");
  const [dislikedInput, setDislikedInput] = useState("");
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [calories, setCalories] = useState(2000);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  useEffect(() => {
    if (preferences) {
      setDietType(preferences.dietType ?? "No Restriction");
      setHealthGoal(preferences.healthGoal ?? "Eat Healthier");
      setAllergiesInput(preferences.allergies?.join(", ") ?? "");
      setDislikedInput(preferences.dislikedIngredients?.join(", ") ?? "");
      setIngredientsInput(preferences.availableIngredients?.join(", ") ?? "");
      setMealsPerDay(preferences.mealsPerDay ?? 3);
      setCalories(preferences.dailyCalorieTarget ?? 2000);
    }
  }, [preferences]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await savePreferences({
        dietType,
        healthGoal,
        allergies: allergiesInput.split(",").map((s) => s.trim()).filter(Boolean),
        dislikedIngredients: dislikedInput.split(",").map((s) => s.trim()).filter(Boolean),
        availableIngredients: ingredientsInput.split(",").map((s) => s.trim()).filter(Boolean),
        mealsPerDay,
        dailyCalorieTarget: calories,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // error shown via hook
    } finally {
      setSaving(false);
    }
  }

  if (configLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">My Preferences</h1>
        </div>

        <p className="text-sm text-muted-foreground">
          These preferences help the AI personalize every meal plan to your lifestyle and goals.
        </p>

        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {saved && (
          <div className="rounded-lg bg-secondary/10 border border-secondary/20 px-4 py-3 text-sm text-secondary font-medium">
            Preferences saved!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
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

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Meals Per Day</label>
              <select
                value={mealsPerDay}
                onChange={(e) => setMealsPerDay(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Daily Calorie Target</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                min={800}
                max={5000}
                step={50}
                className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Allergies / Foods to Avoid</label>
            <input
              type="text"
              value={allergiesInput}
              onChange={(e) => setAllergiesInput(e.target.value)}
              placeholder="e.g. peanuts, shellfish, gluten"
              className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
            <p className="text-[10px] text-muted-foreground">Comma-separated</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Ingredients I Dislike</label>
            <input
              type="text"
              value={dislikedInput}
              onChange={(e) => setDislikedInput(e.target.value)}
              placeholder="e.g. cilantro, mushrooms, anchovies"
              className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Ingredients I Usually Have</label>
            <textarea
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              placeholder="e.g. olive oil, garlic, eggs, pasta, canned tomatoes"
              rows={3}
              className="w-full rounded-lg border border-border bg-input text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
            />
            <p className="text-[10px] text-muted-foreground">
              AI prioritizes these so your meal plan uses what's already in your kitchen.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground font-semibold py-2.5 px-6 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={15} />
                Save Preferences
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
