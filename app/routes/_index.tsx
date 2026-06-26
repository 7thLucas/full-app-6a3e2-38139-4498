import { useEffect, useState } from "react";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useNavigate } from "react-router";
import { getUserFromRequest } from "~/modules/authentication/authentication.server";
import { useAuth } from "~/modules/authentication";
import { useConfigurables } from "~/modules/configurables";
import { AppHeader } from "~/meal-planner/components/app-header";
import { GeneratePlanForm } from "~/meal-planner/components/generate-plan-form";
import { WeeklyPlanner } from "~/meal-planner/components/weekly-planner";
import { ShoppingListPanel } from "~/meal-planner/components/shopping-list";
import { NutritionSummary } from "~/meal-planner/components/nutrition-summary";
import { useMealPlan } from "~/meal-planner/hooks/use-meal-plan";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = getUserFromRequest(request);
  if (!user) return redirect("/auth/login");
  return null;
}

export default function IndexPage() {
  const { user } = useAuth();
  const { config, loading: configLoading } = useConfigurables();
  const navigate = useNavigate();

  const {
    plan,
    preferences,
    shoppingList,
    loading,
    generating,
    error,
    fetchCurrentPlan,
    generatePlan,
    toggleFavorite,
    fetchPreferences,
    fetchShoppingList,
    generateShoppingList,
    toggleShoppingItem,
  } = useMealPlan();

  const [activeTab, setActiveTab] = useState<"plan" | "shopping">("plan");

  useEffect(() => {
    fetchCurrentPlan();
    fetchPreferences();
  }, [fetchCurrentPlan, fetchPreferences]);

  useEffect(() => {
    if (plan?.weekStart && config.enableShoppingList) {
      fetchShoppingList(plan.weekStart);
    }
  }, [plan?.weekStart, config.enableShoppingList, fetchShoppingList]);

  async function handleGenerate(prefs: any) {
    await generatePlan(prefs);
  }

  if (configLoading) return null;

  const heroHeading = config.heroHeading ?? "What's for dinner tonight?";
  const heroSubheading = config.heroSubheading ?? "Let AI do the thinking. You do the eating.";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Hero area */}
        <div className="text-center py-4 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {heroHeading}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">{heroSubheading}</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Generate form */}
        <GeneratePlanForm
          preferences={preferences}
          generating={generating}
          onGenerate={handleGenerate}
        />

        {/* Plan content */}
        {loading && !plan && (
          <div className="text-center py-12 text-muted-foreground text-sm animate-pulse">
            Loading your meal plan…
          </div>
        )}

        {plan && plan.isGenerated && (
          <>
            {/* Nutrition summary */}
            {config.enableNutrition && (
              <NutritionSummary plan={plan} />
            )}

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border">
              <button
                onClick={() => setActiveTab("plan")}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === "plan"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Weekly Plan
              </button>
              {config.enableShoppingList && (
                <button
                  onClick={() => setActiveTab("shopping")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    activeTab === "shopping"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Shopping List
                </button>
              )}
            </div>

            {activeTab === "plan" && (
              <WeeklyPlanner
                plan={plan}
                onToggleFavorite={toggleFavorite}
              />
            )}

            {activeTab === "shopping" && config.enableShoppingList && (
              <ShoppingListPanel
                list={shoppingList}
                weekStart={plan.weekStart}
                loading={loading}
                onGenerate={generateShoppingList}
                onToggle={toggleShoppingItem}
              />
            )}
          </>
        )}

        {plan && !plan.isGenerated && !loading && (
          <div className="text-center py-12 space-y-2">
            <p className="text-muted-foreground text-base">No meal plan generated yet.</p>
            <p className="text-muted-foreground text-sm">Fill in your preferences above and hit Generate.</p>
          </div>
        )}
      </main>
    </div>
  );
}
