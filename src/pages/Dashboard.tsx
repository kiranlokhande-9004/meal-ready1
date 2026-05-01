import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";
import { NeonRing } from "@/components/NeonRing";
import { MealCard } from "@/components/MealCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SAMPLE_PLAN, type MealPlanData } from "@/lib/meal-data";
import { getMealImage } from "@/lib/meal-images";
import {
  LayoutDashboard, Utensils, ShoppingBasket, Users, Activity,
  Settings as SettingsIcon, Bell, Mail, LogOut, Wand2, Plus, Trash2, Check, Loader2, Menu,
} from "lucide-react";

type Section = "overview" | "meals" | "grocery" | "family" | "nutrition";

interface FamilyMember { id: string; name: string; age: number | null; dietary_prefs: string[]; allergies: string[]; }
interface GroceryRow { id: string; name: string; category: string; quantity: string | null; checked: boolean; }

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [plan, setPlan] = useState<MealPlanData | null>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [grocery, setGrocery] = useState<GroceryRow[]>([]);
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [profileName, setProfileName] = useState<string>("");

  // Initial load
  useEffect(() => {
    if (!user) return;
    (async () => {
      setPlanLoading(true);
      const [planRes, groRes, famRes, profRes] = await Promise.all([
        supabase.from("meal_plans").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("grocery_items").select("*").order("category", { ascending: true }),
        supabase.from("family_members").select("*").order("created_at", { ascending: true }),
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      ]);
      setPlan((planRes.data?.plan as any) ?? SAMPLE_PLAN);
      setGrocery(groRes.data ?? []);
      setFamily(famRes.data ?? []);
      setProfileName(profRes.data?.full_name ?? user.email ?? "");
      setPlanLoading(false);
    })();
  }, [user]);

  const generate = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-meal-plan", {
        body: { family, preferences: "" },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setPlan((data.meal_plan.plan as MealPlanData));
      const { data: gro } = await supabase.from("grocery_items").select("*").order("category", { ascending: true });
      setGrocery(gro ?? []);
      toast.success("Fresh weekly plan ready!");
    } catch (e: any) {
      toast.error(e.message || "Could not generate plan");
    } finally {
      setGenerating(false);
    }
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  const NAV: { id: Section; label: string; icon: any }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "meals", label: "Meal Plan", icon: Utensils },
    { id: "grocery", label: "Grocery", icon: ShoppingBasket },
    { id: "family", label: "Family", icon: Users },
    { id: "nutrition", label: "Nutrition", icon: Activity },
  ];

  const titleMap: Record<Section, string> = {
    overview: "Dashboard", meals: "Meal Plan", grocery: "Grocery List",
    family: "Family Profiles", nutrition: "Nutrition",
  };

  return (
    <div className="min-h-screen dash-bg">
      <div className="container mx-auto py-6 md:py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className={cn(
            "col-span-12 lg:col-span-2 glass-card p-4 lg:sticky lg:top-6 lg:self-start lg:h-[calc(100vh-3rem)] flex flex-col",
            !sidebarOpen && "hidden lg:flex"
          )}>
            <div className="px-2 py-3"><Logo glow /></div>
            <nav className="flex flex-col gap-1 mt-4">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setSection(n.id); setSidebarOpen(false); }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    section === n.id
                      ? "bg-gradient-to-r from-white/15 to-white/5 text-dash-foreground border border-white/15 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.1)]"
                      : "text-dash-muted hover:text-dash-foreground hover:bg-white/5"
                  )}
                >
                  <n.icon className="h-4 w-4" />{n.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-3 px-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-neon-emerald to-neon-teal ring-2 ring-white/20" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-dash-foreground truncate">{profileName}</p>
                <button onClick={signOut} className="text-xs text-dash-muted hover:text-dash-foreground inline-flex items-center gap-1 transition-colors">
                  <LogOut className="h-3 w-3" /> Sign out
                </button>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="col-span-12 lg:col-span-10 flex flex-col gap-6">
            {/* Topbar */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button className="lg:hidden h-10 w-10 grid place-items-center rounded-full glass-card text-dash-foreground btn-press"
                  onClick={() => setSidebarOpen((o) => !o)}>
                  <Menu className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <h1 className="font-display text-2xl md:text-4xl font-bold text-dash-foreground tracking-tight truncate">{titleMap[section]}</h1>
                  <p className="text-sm text-dash-muted mt-1 hidden sm:block">Plan smarter. Eat better. Powered by AI.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Button onClick={generate} disabled={generating} className="bg-gradient-brand hover:opacity-95 shadow-glow btn-press hidden sm:inline-flex rounded-2xl h-11 px-5">
                  {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                  Regenerate week
                </Button>
                <button className="h-10 w-10 grid place-items-center rounded-full glass-card text-dash-muted hover:text-dash-foreground btn-press">
                  <Mail className="h-4 w-4" />
                </button>
                <button className="relative h-10 w-10 grid place-items-center rounded-full glass-card text-dash-muted hover:text-dash-foreground btn-press">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-neon-pink text-[10px] font-bold text-white grid place-items-center">2</span>
                </button>
              </div>
            </div>

            {section === "overview" && (
              <Overview plan={plan} loading={planLoading} grocery={grocery} setGrocery={setGrocery} />
            )}
            {section === "meals" && (
              <MealsSection plan={plan} loading={planLoading} onGenerate={generate} generating={generating} />
            )}
            {section === "grocery" && (
              <GrocerySection items={grocery} setItems={setGrocery} />
            )}
            {section === "family" && (
              <FamilySection family={family} setFamily={setFamily} userId={user!.id} />
            )}
            {section === "nutrition" && (
              <NutritionSection plan={plan} loading={planLoading} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Sections ---------------- */

const Overview = ({ plan, loading, grocery, setGrocery }: {
  plan: MealPlanData | null; loading: boolean; grocery: GroceryRow[]; setGrocery: (g: GroceryRow[]) => void;
}) => {
  const day = plan?.days[0];
  const totals = day?.nutrition;
  const top5 = grocery.slice(0, 6);

  const toggle = async (id: string, checked: boolean) => {
    setGrocery(grocery.map((g) => (g.id === id ? { ...g, checked } : g)));
    await supabase.from("grocery_items").update({ checked }).eq("id", id);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8 glass-card card-lift p-6 anim-fade-up">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold">My weekly meals</p>
          <span className="text-dash-muted">›</span>
        </div>
        {loading || !day ? (
          <div className="grid grid-cols-3 gap-3">{[0,1,2].map(i => <Skeleton key={i} className="h-44 rounded-2xl bg-white/5" />)}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MealCard meal={day.breakfast} slot="BREAKFAST" />
            <MealCard meal={day.lunch} slot="LUNCH" />
            <MealCard meal={day.dinner} slot="DINNER" />
          </div>
        )}
      </div>

      <div className="col-span-12 lg:col-span-4 glass-card card-lift p-6 anim-fade-up [animation-delay:80ms]">
        <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold mb-3">Grocery list</p>
        {top5.length === 0 ? (
          <p className="text-sm text-dash-muted">Generate a plan to populate your list.</p>
        ) : (
          <ul className="space-y-2">
            {top5.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-2xl px-3 py-2.5 bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all duration-200">
                <span className={cn("text-sm transition-all duration-200", item.checked ? "text-dash-muted line-through" : "text-dash-foreground")}>{item.name}</span>
                <button
                  onClick={() => toggle(item.id, !item.checked)}
                  aria-pressed={item.checked}
                  className="check-box btn-press"
                  data-checked={item.checked}
                >
                  <Check className="h-3 w-3 check-icon" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="col-span-12 glass-card card-lift p-6 anim-fade-up [animation-delay:160ms]">
        <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold mb-4">Nutrition stats</p>
        {!totals ? (
          <Skeleton className="h-32 rounded-2xl bg-white/5" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex justify-center"><NeonRing value={Math.min(100, (totals.calories/2200)*100)} color="blue" label="Calories" sub={`${totals.calories} kcal`} /></div>
            <div className="flex justify-center"><NeonRing value={Math.min(100, (totals.protein/150)*100)} color="violet" label="Protein" sub={`${totals.protein}g`} /></div>
            <div className="flex justify-center"><NeonRing value={Math.min(100, (totals.carbs/250)*100)} color="emerald" label="Carbs" sub={`${totals.carbs}g`} /></div>
            <div className="flex justify-center"><NeonRing value={Math.min(100, (totals.fats/80)*100)} color="pink" label="Fats" sub={`${totals.fats}g`} /></div>
          </div>
        )}
      </div>
    </div>
  );
};

const MealsSection = ({ plan, loading, onGenerate, generating }: {
  plan: MealPlanData | null; loading: boolean; onGenerate: () => void; generating: boolean;
}) => {
  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{Array.from({length:6}).map((_,i)=><Skeleton key={i} className="h-72 bg-white/5 rounded-2xl"/>)}</div>;
  if (!plan) return null;
  const slotMeta: Record<string, { label: string; color: string }> = {
    breakfast: { label: "Breakfast", color: "bg-neon-emerald/15 text-neon-emerald border-neon-emerald/25" },
    lunch:     { label: "Lunch",     color: "bg-neon-teal/15 text-neon-teal border-neon-teal/25" },
    dinner:    { label: "Dinner",    color: "bg-neon-violet/15 text-neon-violet border-neon-violet/25" },
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {plan.days.map((d, i) => {
          const perMeal = Math.round(d.nutrition.calories / 3);
          return (
            <div key={d.day} className="glass-card card-lift p-6 anim-fade-up" style={{ animationDelay: `${i*40}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-dash-muted font-semibold">Day {i+1}</p>
                  <p className="font-display text-xl font-bold text-dash-foreground mt-0.5">{d.day}</p>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gradient-brand text-white shadow-[0_0_20px_hsl(178_90%_50%/0.35)]">
                  {d.nutrition.calories} kcal
                </span>
              </div>

              <div className="space-y-2.5">
                {(["breakfast","lunch","dinner"] as const).map((slot) => {
                  const m = d[slot];
                  const meta = slotMeta[slot];
                  return (
                    <div key={slot} className="meal-pill">
                      <img
                        src={getMealImage(m.image_key)}
                        alt={m.name}
                        loading="lazy"
                        className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-md border uppercase tracking-wider", meta.color)}>
                          {meta.label}
                        </span>
                        <p className="text-sm font-medium text-dash-foreground truncate mt-1">{m.name}</p>
                      </div>
                      <span className="text-[11px] font-medium text-dash-muted px-2 py-1 rounded-full bg-white/[0.04] border border-white/5 shrink-0">
                        ~{perMeal} kcal
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-3 pt-3 border-t border-white/5">
                <span className="text-[11px] text-dash-muted">Protein <span className="text-dash-foreground font-semibold">{d.nutrition.protein}g</span></span>
                <span className="text-[11px] text-dash-muted">Carbs <span className="text-dash-foreground font-semibold">{d.nutrition.carbs}g</span></span>
                <span className="text-[11px] text-dash-muted">Fats <span className="text-dash-foreground font-semibold">{d.nutrition.fats}g</span></span>
              </div>
            </div>
          );
        })}
      </div>
      <Button onClick={onGenerate} disabled={generating} className="bg-gradient-brand hover:opacity-95 shadow-glow btn-press sm:hidden w-full h-12 rounded-2xl">
        {generating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
        Regenerate week
      </Button>
    </div>
  );
};

const GrocerySection = ({ items, setItems }: { items: GroceryRow[]; setItems: (g: GroceryRow[]) => void; }) => {
  const grouped = useMemo(() => {
    const m: Record<string, GroceryRow[]> = {};
    items.forEach((i) => { (m[i.category] ||= []).push(i); });
    return m;
  }, [items]);
  const done = items.filter((i) => i.checked).length;
  const pct = items.length ? (done / items.length) * 100 : 0;

  const toggle = async (id: string, checked: boolean) => {
    setItems(items.map((g) => (g.id === id ? { ...g, checked } : g)));
    await supabase.from("grocery_items").update({ checked }).eq("id", id);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 md:p-7">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold">Shopping progress</p>
            <p className="font-display text-2xl font-bold text-dash-foreground mt-1">
              {done}<span className="text-dash-muted text-base font-medium"> / {items.length} items</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-bold text-gradient-brand">{Math.round(pct)}%</p>
            <p className="text-[11px] text-dash-muted uppercase tracking-widest">complete</p>
          </div>
        </div>
        <Progress value={pct} className="h-2.5 bg-white/5 [&>div]:bg-gradient-brand" />
      </div>

      <div className="glass-card p-6 md:p-7">
        {items.length === 0 ? (
          <p className="text-sm text-dash-muted">Generate a meal plan to build your grocery list.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
            {Object.entries(grouped).map(([cat, list]) => {
              const catDone = list.filter((x) => x.checked).length;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-widest text-neon-teal font-semibold">{cat}</p>
                    <span className="text-[11px] text-dash-muted font-medium">{catDone}/{list.length}</span>
                  </div>
                  <ul className="space-y-2">
                    {list.map((it) => (
                      <li key={it.id} className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white/[0.03] border border-white/5 hover:border-white/15 hover:bg-white/[0.05] transition-all duration-200">
                        <div className="min-w-0">
                          <p className={cn("text-sm font-medium transition-all duration-200", it.checked ? "text-dash-muted line-through" : "text-dash-foreground")}>{it.name}</p>
                          {it.quantity && <p className="text-xs text-dash-muted mt-0.5">{it.quantity}</p>}
                        </div>
                        <button
                          onClick={() => toggle(it.id, !it.checked)}
                          aria-pressed={it.checked}
                          className="check-box btn-press"
                          data-checked={it.checked}
                        >
                          <Check className="h-3 w-3 check-icon" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const FamilySection = ({ family, setFamily, userId }: {
  family: FamilyMember[]; setFamily: (f: FamilyMember[]) => void; userId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", age: "", dietary: "", allergies: "" });

  const add = async () => {
    if (!draft.name.trim()) { toast.error("Name required"); return; }
    const row = {
      user_id: userId,
      name: draft.name.trim().slice(0, 80),
      age: draft.age ? parseInt(draft.age, 10) : null,
      dietary_prefs: draft.dietary.split(",").map((s) => s.trim()).filter(Boolean),
      allergies: draft.allergies.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const { data, error } = await supabase.from("family_members").insert(row).select().single();
    if (error) { toast.error(error.message); return; }
    setFamily([...family, data as any]);
    setDraft({ name: "", age: "", dietary: "", allergies: "" });
    setOpen(false);
    toast.success("Family member added");
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("family_members").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setFamily(family.filter((f) => f.id !== id));
    toast.success("Removed");
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold">Household</p>
          <p className="font-display text-xl font-bold text-dash-foreground mt-1">
            {family.length} {family.length === 1 ? "member" : "members"}
          </p>
          <p className="text-sm text-dash-muted mt-1">AI tailors meals around everyone's diet & allergies.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-brand hover:opacity-95 shadow-glow btn-press rounded-2xl h-11 px-5">
              <Plus className="h-4 w-4 mr-1.5" /> Add member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add family member</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5"><Label>Name</Label><Input value={draft.name} maxLength={80} onChange={(e)=>setDraft({...draft, name:e.target.value})} /></div>
              <div className="space-y-1.5"><Label>Age</Label><Input type="number" min={0} max={120} value={draft.age} onChange={(e)=>setDraft({...draft, age:e.target.value})} /></div>
              <div className="space-y-1.5"><Label>Dietary preferences <span className="text-muted-foreground font-normal">(comma-separated)</span></Label><Input placeholder="vegetarian, gluten-free" value={draft.dietary} onChange={(e)=>setDraft({...draft, dietary:e.target.value})} /></div>
              <div className="space-y-1.5"><Label>Allergies <span className="text-muted-foreground font-normal">(comma-separated)</span></Label><Input placeholder="peanuts, shellfish" value={draft.allergies} onChange={(e)=>setDraft({...draft, allergies:e.target.value})} /></div>
            </div>
            <DialogFooter><Button onClick={add} className="bg-gradient-brand hover:opacity-95 btn-press">Add member</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {family.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Users className="h-10 w-10 mx-auto text-neon-teal mb-3" />
          <p className="text-dash-foreground font-display text-lg">No family members yet</p>
          <p className="text-dash-muted text-sm mt-1">Add members so AI can tailor meals to everyone.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {family.map((m) => (
            <div key={m.id} className="glass-card card-lift p-5 anim-pop">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-neon-emerald to-neon-teal grid place-items-center text-white font-bold text-lg">
                    {m.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-dash-foreground">{m.name}</p>
                    {m.age != null && <p className="text-xs text-dash-muted">Age {m.age}</p>}
                  </div>
                </div>
                <button onClick={() => remove(m.id)} className="text-dash-muted hover:text-neon-pink transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {m.dietary_prefs.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {m.dietary_prefs.map((p) => (
                      <span key={p} className="text-[11px] px-2 py-0.5 rounded-full bg-neon-teal/15 text-neon-teal border border-neon-teal/25">{p}</span>
                    ))}
                  </div>
                )}
                {m.allergies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {m.allergies.map((p) => (
                      <span key={p} className="text-[11px] px-2 py-0.5 rounded-full bg-neon-pink/15 text-neon-pink border border-neon-pink/25">⚠ {p}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NutritionSection = ({ plan, loading }: { plan: MealPlanData | null; loading: boolean; }) => {
  if (loading || !plan) return <Skeleton className="h-96 bg-white/5 rounded-2xl" />;
  const avg = plan.days.reduce(
    (a, d) => ({
      calories: a.calories + d.nutrition.calories, protein: a.protein + d.nutrition.protein,
      carbs: a.carbs + d.nutrition.carbs, fats: a.fats + d.nutrition.fats,
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  const n = plan.days.length;
  const av = { calories: Math.round(avg.calories/n), protein: Math.round(avg.protein/n), carbs: Math.round(avg.carbs/n), fats: Math.round(avg.fats/n) };
  const max = Math.max(...plan.days.map((d) => d.nutrition.calories));

  const macros = [
    { key: "calories", label: "Calories", value: av.calories, unit: "kcal", goal: 2200, color: "from-neon-blue to-neon-teal", ring: "blue" as const },
    { key: "protein",  label: "Protein",  value: av.protein,  unit: "g",    goal: 150,  color: "from-neon-violet to-neon-pink", ring: "violet" as const },
    { key: "carbs",    label: "Carbs",    value: av.carbs,    unit: "g",    goal: 250,  color: "from-neon-emerald to-neon-teal", ring: "emerald" as const },
    { key: "fats",     label: "Fats",     value: av.fats,     unit: "g",    goal: 80,   color: "from-neon-pink to-neon-violet", ring: "pink" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {macros.map((m, i) => {
          const pct = Math.min(100, (m.value / m.goal) * 100);
          return (
            <div key={m.key} className="glass-card card-lift p-6 anim-fade-up" style={{ animationDelay: `${i*50}ms` }}>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold">{m.label}</p>
                <span className="text-[10px] font-medium text-dash-muted px-2 py-0.5 rounded-full bg-white/5 border border-white/5">avg/day</span>
              </div>
              <p className="font-display text-3xl font-bold text-dash-foreground mt-3">
                {m.value}<span className="text-base font-medium text-dash-muted ml-1">{m.unit}</span>
              </p>
              <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
                <div className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-700", m.color)} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[11px] text-dash-muted mt-2">Goal {m.goal}{m.unit} · {Math.round(pct)}%</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-6 md:p-7">
        <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold mb-4">Daily targets</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {macros.map((m) => (
            <div key={m.key} className="flex justify-center">
              <NeonRing value={Math.min(100, (m.value/m.goal)*100)} color={m.ring} label={m.label} sub={`${m.value}${m.unit === "kcal" ? " kcal" : m.unit}`} size={140} />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 md:p-7">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-dash-muted font-semibold">Calories per day</p>
            <p className="font-display text-lg font-bold text-dash-foreground mt-1">Weekly intake overview</p>
          </div>
          <p className="text-xs text-dash-muted">peak <span className="text-dash-foreground font-semibold">{max} kcal</span></p>
        </div>
        <div className="flex items-end gap-3 h-56">
          {plan.days.map((d, i) => {
            const h = (d.nutrition.calories / max) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-semibold text-dash-foreground opacity-0 group-hover:opacity-100 transition-opacity">{d.nutrition.calories}</span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-neon-emerald via-neon-teal to-neon-blue transition-all duration-700 hover:opacity-90 shadow-[0_-8px_24px_-8px_hsl(178_90%_50%/0.5)]"
                  style={{ height: `${h}%`, minHeight: 8, animationDelay: `${i*60}ms` }}
                />
                <span className="text-[11px] text-dash-muted font-medium">{d.day.slice(0,3)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
