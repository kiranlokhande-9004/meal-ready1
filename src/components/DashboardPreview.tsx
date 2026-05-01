import { Bell, Mail, LayoutDashboard, Utensils, ShoppingBasket, Users, Settings as SettingsIcon, Check } from "lucide-react";
import { NeonRing } from "./NeonRing";
import { MealCard } from "./MealCard";
import { Logo } from "./Logo";
import { SAMPLE_PLAN } from "@/lib/meal-data";
import { cn } from "@/lib/utils";

interface Props {
  compact?: boolean;       // smaller for hero
  className?: string;
}

/**
 * Reusable dashboard "screen" used both in the landing hero AND inside the
 * authenticated dashboard, so the marketing visual matches the real product 1:1.
 */
export const DashboardPreview = ({ compact = false, className }: Props) => {
  const day = SAMPLE_PLAN.days[0];
  const grocery = ["Spinach", "Almonds", "Oats", "Cherry tomatoes", "Salmon", "Sourdough"];
  const checked = new Set([0, 3]);

  return (
    <div className={cn(
      "dash-bg rounded-[2rem] p-4 md:p-6 border border-white/10 overflow-hidden",
      compact ? "shadow-2xl" : "min-h-[640px]",
      className
    )}>
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <aside className={cn(
          "col-span-3 glass-card p-3 flex flex-col gap-1",
          compact && "hidden md:flex md:col-span-3"
        )}>
          <div className="px-2 py-2"><Logo glow /></div>
          <NavRow icon={LayoutDashboard} label="Dashboard" active />
          <NavRow icon={Utensils} label="Meal Plan" />
          <NavRow icon={ShoppingBasket} label="Grocery" />
          <NavRow icon={Users} label="Family" />
          <NavRow icon={SettingsIcon} label="Settings" />
        </aside>

        {/* Main */}
        <section className={cn("col-span-12 md:col-span-9 flex flex-col gap-4")}>
          {/* Topbar */}
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-dash-foreground">Dashboard</h2>
            <div className="flex items-center gap-3">
              <button className="h-9 w-9 grid place-items-center rounded-full glass-card text-dash-muted">
                <Mail className="h-4 w-4" />
              </button>
              <button className="relative h-9 w-9 grid place-items-center rounded-full glass-card text-dash-muted">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-neon-pink text-[10px] font-bold text-white grid place-items-center">2</span>
              </button>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-neon-violet to-neon-pink ring-2 ring-white/20" />
            </div>
          </div>

          {/* Meals + Grocery */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-8 glass-card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold">My weekly meals</p>
                <span className="text-dash-muted">›</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <MealCard meal={day.breakfast} slot="BREAKFAST" compact={compact} />
                <MealCard meal={day.lunch} slot="LUNCH" compact={compact} />
                <MealCard meal={day.dinner} slot="DINNER" compact={compact} />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 glass-card p-4">
              <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold mb-3">Grocery list</p>
              <ul className="space-y-2">
                {grocery.map((item, i) => (
                  <li key={item} className="flex items-center justify-between rounded-xl px-3 py-2 bg-white/[0.03] border border-white/5">
                    <span className={cn("text-sm", checked.has(i) ? "text-dash-muted line-through" : "text-dash-foreground")}>
                      {item}
                    </span>
                    <span className={cn(
                      "h-5 w-5 rounded-md grid place-items-center border transition-colors",
                      checked.has(i)
                        ? "bg-gradient-brand border-transparent text-white"
                        : "border-white/15"
                    )}>
                      {checked.has(i) && <Check className="h-3 w-3" />}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nutrition */}
          <div className="glass-card p-4">
            <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold mb-3">Nutrition stats</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex justify-center">
                <NeonRing value={75} color="blue" label="Calories" sub={`${day.nutrition.calories}`} size={compact ? 100 : 130} />
              </div>
              <div className="flex justify-center">
                <NeonRing value={60} color="violet" label="Protein" sub={`${day.nutrition.protein}g`} size={compact ? 100 : 130} />
              </div>
              <div className="flex justify-center">
                <NeonRing value={85} color="emerald" label="Carbs" sub={`${day.nutrition.carbs}g`} size={compact ? 100 : 130} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const NavRow = ({ icon: Icon, label, active }: { icon: any; label: string; active?: boolean }) => (
  <button className={cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
    active
      ? "bg-gradient-to-r from-white/15 to-white/5 text-dash-foreground border border-white/15 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.1)]"
      : "text-dash-muted hover:text-dash-foreground hover:bg-white/5"
  )}>
    <Icon className="h-4 w-4" />
    {label}
  </button>
);
