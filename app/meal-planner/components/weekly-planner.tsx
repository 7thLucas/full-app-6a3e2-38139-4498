import { MealCard } from "./meal-card";
import type { MealPlan } from "~/meal-planner/hooks/use-meal-plan";

interface WeeklyPlannerProps {
  plan: MealPlan;
  onToggleFavorite?: (weekStart: string, date: string, mealType: string) => void;
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function WeeklyPlanner({ plan, onToggleFavorite }: WeeklyPlannerProps) {
  if (!plan.days || plan.days.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">No meals planned yet.</p>
        <p className="text-sm mt-1">Generate your first meal plan above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {plan.days.map((day, i) => (
        <div key={day.date} className="space-y-3">
          {/* Day header */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary text-primary-foreground flex flex-col items-center justify-center shadow-sm">
              <span className="text-[10px] font-medium opacity-80">{DAY_NAMES[i] ?? ""}</span>
              <span className="text-sm font-bold leading-tight">{formatDate(day.date).split(" ")[1]}</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{DAY_NAMES[i] ?? "Day " + (i + 1)}</p>
              <p className="text-xs text-muted-foreground">{formatDate(day.date)}</p>
            </div>
          </div>

          {/* Meals grid */}
          {day.meals.length === 0 ? (
            <p className="text-xs text-muted-foreground pl-15">No meals for this day.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {day.meals.map((meal) => (
                <MealCard
                  key={meal.mealType}
                  meal={meal}
                  date={day.date}
                  weekStart={plan.weekStart}
                  onToggleFavorite={onToggleFavorite}
                  showNutrition
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
