import { ShoppingCart, RefreshCw, Check } from "lucide-react";
import type { ShoppingList as ShoppingListType } from "~/meal-planner/hooks/use-meal-plan";

interface ShoppingListProps {
  list: ShoppingListType | null;
  weekStart: string;
  loading: boolean;
  onGenerate: (weekStart: string) => void;
  onToggle: (weekStart: string, itemName: string) => void;
}

export function ShoppingListPanel({ list, weekStart, loading, onGenerate, onToggle }: ShoppingListProps) {
  const checkedCount = list?.items.filter((i) => i.isChecked).length ?? 0;
  const totalCount = list?.items.length ?? 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground text-base">Shopping List</h3>
          {totalCount > 0 && (
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
              {checkedCount}/{totalCount}
            </span>
          )}
        </div>
        <button
          onClick={() => onGenerate(weekStart)}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs text-primary hover:opacity-70 transition-opacity disabled:opacity-40 font-medium"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          {list ? "Refresh" : "Generate"}
        </button>
      </div>

      {!list && (
        <p className="text-sm text-muted-foreground">
          Generate your meal plan first, then create a shopping list here.
        </p>
      )}

      {list && list.items.length === 0 && (
        <p className="text-sm text-muted-foreground">Shopping list is empty.</p>
      )}

      {list && list.items.length > 0 && (
        <>
          {/* Progress bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all"
              style={{ width: `${Math.round((checkedCount / totalCount) * 100)}%` }}
            />
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {list.items.map((item) => (
              <button
                key={item.name}
                onClick={() => onToggle(weekStart, item.name)}
                className="w-full flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <div className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  item.isChecked
                    ? "bg-secondary border-secondary"
                    : "border-border bg-background"
                }`}>
                  {item.isChecked && <Check size={10} className="text-secondary-foreground" />}
                </div>
                <span className={`text-sm ${item.isChecked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {item.name}
                  {item.quantity && (
                    <span className="text-muted-foreground ml-1 text-xs">— {item.quantity} {item.unit ?? ""}</span>
                  )}
                </span>
              </button>
            ))}
          </div>

          {checkedCount === totalCount && totalCount > 0 && (
            <div className="text-center py-2 text-sm font-medium text-secondary">
              All done! Happy cooking!
            </div>
          )}
        </>
      )}
    </div>
  );
}
