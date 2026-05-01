import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DashboardPreview } from "@/components/DashboardPreview";
import {
  Sparkles, Utensils, ShoppingBasket, Users, Activity,
  ArrowRight, Check, Wand2, ListChecks, BarChart3,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="container mx-auto flex items-center justify-between h-16">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/auth">Sign in</Link></Button>
            <Button asChild size="sm" className="bg-gradient-brand hover:opacity-90 shadow-glow">
              <Link to="/auth">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto pt-16 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="anim-fade-up">
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-accent text-accent-foreground border border-primary/15">
              <Sparkles className="h-3.5 w-3.5" /> AI meal planning for busy families
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mt-5">
              Personalized family meals,{" "}
              <span className="text-gradient-brand">planned in seconds.</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-xl">
              NutriNest AI generates balanced weekly meal plans, smart grocery lists, and tracks your family's nutrition — so you can stop wondering what's for dinner.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button asChild size="lg" className="bg-gradient-brand hover:opacity-90 shadow-glow text-base h-12 px-7">
                <Link to="/auth">Start free <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
                <a href="#features">See how it works</a>
              </Button>
            </div>
            <div className="flex items-center gap-5 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> No credit card</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 7-day plans</div>
              <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Family ready</div>
            </div>
          </div>

          <div className="anim-fade-up [animation-delay:120ms] relative">
            <div className="absolute -inset-6 bg-gradient-brand opacity-20 blur-3xl rounded-[3rem]" />
            <div className="relative rotate-[-1deg] hover:rotate-0 transition-transform duration-500">
              <DashboardPreview compact />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">Features</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">Everything you need to eat better</h2>
            <p className="text-muted-foreground mt-4 text-lg">Beautifully simple tools that take meal planning off your plate.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Utensils, title: "AI Meal Plans", desc: "Personalized 7-day plans built around your family's preferences." },
              { icon: ShoppingBasket, title: "Smart Grocery Lists", desc: "Auto-generated, categorized, and ready to shop." },
              { icon: Users, title: "Family Profiles", desc: "Track allergies, diets, and tastes for everyone." },
              { icon: Activity, title: "Nutrition Tracking", desc: "Daily macros at a glance with beautiful insights." },
            ].map((f) => (
              <div key={f.title} className="group bg-card border border-border rounded-2xl p-6 shadow-soft hover:-translate-y-1 hover:shadow-glow transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center text-white mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 md:py-28 bg-secondary/40">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">How it works</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">From zero to plated in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Tell us about your family", desc: "Add members, allergies, and dietary preferences." },
              { icon: Wand2, title: "Generate your week", desc: "AI builds a balanced 7-day plan in seconds." },
              { icon: ListChecks, title: "Shop & cook", desc: "Get a smart grocery list and start cooking." },
            ].map((s, i) => (
              <div key={s.title} className="bg-card rounded-2xl border border-border p-7 shadow-soft relative overflow-hidden">
                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-brand opacity-10 blur-2xl" />
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-9 w-9 rounded-full bg-gradient-brand text-white grid place-items-center font-bold shadow-glow">{i + 1}</span>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="text-muted-foreground mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest">Pricing</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-3">Simple plans for every kitchen</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Free", price: "$0", desc: "Perfect to try it out.", features: ["3 AI plans / month", "Grocery lists", "1 family profile"], cta: "Get started", featured: false },
              { name: "Family", price: "$9", desc: "Most popular for households.", features: ["Unlimited AI plans", "Smart grocery lists", "Up to 6 profiles", "Nutrition tracking"], cta: "Start free trial", featured: true },
              { name: "Pro", price: "$19", desc: "For nutrition pros & coaches.", features: ["Everything in Family", "Custom macros", "Export plans (PDF)", "Priority support"], cta: "Contact sales", featured: false },
            ].map((p) => (
              <div
                key={p.name}
                className={`relative rounded-3xl p-7 shadow-soft ${
                  p.featured
                    ? "bg-card border-2 border-transparent [background:linear-gradient(hsl(var(--card)),hsl(var(--card)))_padding-box,var(--gradient-brand)_border-box] shadow-glow"
                    : "bg-card border border-border"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full bg-gradient-brand text-white">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-display font-extrabold">{p.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <p className="text-muted-foreground mt-1">{p.desc}</p>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Button asChild className={`w-full mt-7 ${p.featured ? "bg-gradient-brand hover:opacity-90 shadow-glow" : ""}`} variant={p.featured ? "default" : "outline"}>
                  <Link to="/auth">{p.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-24">
        <div className="container mx-auto">
          <div className="rounded-3xl p-10 md:p-14 bg-gradient-brand text-white text-center shadow-glow relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,white,transparent_50%)]" />
            <div className="relative">
              <BarChart3 className="h-10 w-10 mx-auto mb-4 opacity-80" />
              <h2 className="font-display text-3xl md:text-5xl font-extrabold">Eat better, starting tonight.</h2>
              <p className="mt-3 text-white/90 max-w-xl mx-auto">Join families who've reclaimed their evenings with AI meal planning.</p>
              <Button asChild size="lg" className="mt-7 bg-white text-primary hover:bg-white/90 h-12 px-8">
                <Link to="/auth">Get started free <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <Logo />
          <p>© {new Date().getFullYear()} NutriNest AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
