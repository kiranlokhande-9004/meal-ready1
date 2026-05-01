import { cn } from "@/lib/utils";
import { getMealImage } from "@/lib/meal-images";
import type { Meal } from "@/lib/meal-data";

export const MealCard = ({
  meal, slot, className, compact = false,
}: { meal: Meal; slot: "BREAKFAST" | "LUNCH" | "DINNER" | string; className?: string; compact?: boolean }) => (
  <div className={cn(
    "glass-card card-lift p-4 flex flex-col items-center text-center group",
    className
  )}>
    <div className={cn(
      "rounded-full overflow-hidden ring-2 ring-white/10 mb-3 bg-dash-surface",
      compact ? "h-16 w-16" : "h-24 w-24"
    )}>
      <img
        src={getMealImage(meal.image_key)}
        alt={meal.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <p className="text-[10px] uppercase tracking-widest text-dash-muted font-semibold">{slot}</p>
    <p className={cn("font-display font-semibold text-dash-foreground mt-1", compact ? "text-sm" : "text-base")}>
      {meal.name}
    </p>
    {!compact && meal.description && (
      <p className="text-xs text-dash-muted mt-1 line-clamp-2">{meal.description}</p>
    )}
  </div>
);
