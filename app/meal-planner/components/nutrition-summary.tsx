import { useConfigurables } from "~/modules/configurables";
import type { MealPlan } from "~/meal-planner/hooks/use-meal-plan";

interface NutritionSummaryProps {
  plan: MealPlan;
}

function NutritionRing({ value, max, color, label, unit }: {
  value: number; max: number; color: string; label: string; unit: string;
}) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const dash = pct * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            strokeWidth="6"
            className="stroke-muted"
          />
          <circle
            cx="32" cy="32" r={radius}
            fill="none"
            strokeWidth="6"
            stroke={color}
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-bold text-foreground">{value}</span>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}<br/>{unit}</span>
    </div>
  );
}

export function NutritionSummary({ plan }: NutritionSummaryProps) {
  const { config, loading } = useConfigurables();
  if (loading || !config.enableNutrition) return null;

  // Compute weekly totals
  let totalCal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0, totalFiber = 0;
  let mealCount = 0;
  for (const day of plan.days) {
    for (const meal of day.meals) {
      if (meal.nutrition) {
        totalCal += meal.nutrition.calories;
        totalProtein += meal.nutrition.protein;
        totalCarbs += meal.nutrition.carbs;
        totalFat += meal.nutrition.fat;
        totalFiber += meal.nutrition.fiber;
        mealCount++;
      }
    }
  }

  const days = plan.days.length || 1;
  const avgCal = Math.round(totalCal / days);
  const avgProtein = Math.round(totalProtein / days);
  const avgCarbs = Math.round(totalCarbs / days);
  const avgFat = Math.round(totalFat / days);
  const avgFiber = Math.round(totalFiber / days);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="font-semibold text-foreground text-base mb-4">Daily Avg Nutrition</h3>
      <div className="flex items-center justify-around flex-wrap gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl font-bold text-primary">{avgCal}</div>
          <div className="text-xs text-muted-foreground">kcal / day</div>
        </div>
        <NutritionRing value={avgProtein} max={150} color="var(--primary)" label="Protein" unit="g" />
        <NutritionRing value={avgCarbs} max={300} color="var(--secondary)" label="Carbs" unit="g" />
        <NutritionRing value={avgFat} max={80} color="#F59E0B" label="Fat" unit="g" />
        <NutritionRing value={avgFiber} max={35} color="#10B981" label="Fiber" unit="g" />
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-3">
        Based on {mealCount} meal{mealCount !== 1 ? "s" : ""} across {days} day{days !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
