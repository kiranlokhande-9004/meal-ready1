import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Logo = ({ className, glow = false }: { className?: string; glow?: boolean }) => (
  <div className={cn("flex items-center gap-2 font-display font-bold", className)}>
    <span className={cn(
      "h-8 w-8 rounded-xl bg-gradient-brand flex items-center justify-center text-white",
      glow && "shadow-[0_0_24px_hsl(var(--neon-teal)/0.5)]"
    )}>
      <Sparkles className="h-4 w-4" />
    </span>
    <span className="tracking-tight">
      Nutri<span className="text-gradient-brand">Nest</span>
      <span className={cn("ml-1 text-xs font-bold align-super", glow ? "text-neon-teal" : "text-primary")}>AI</span>
    </span>
  </div>
);
