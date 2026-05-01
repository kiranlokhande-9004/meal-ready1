import { cn } from "@/lib/utils";

interface NeonRingProps {
  value: number;        // 0-100
  size?: number;
  stroke?: number;
  color?: "blue" | "violet" | "emerald" | "teal" | "pink";
  label?: string;
  sub?: string;
  className?: string;
}

const COLORS: Record<string, [string, string]> = {
  blue:    ["hsl(var(--neon-blue))",   "hsl(var(--neon-teal))"],
  violet:  ["hsl(var(--neon-violet))", "hsl(var(--neon-pink))"],
  emerald: ["hsl(var(--neon-emerald))", "hsl(var(--neon-teal))"],
  teal:    ["hsl(var(--neon-teal))",   "hsl(var(--neon-blue))"],
  pink:    ["hsl(var(--neon-pink))",   "hsl(var(--neon-violet))"],
};

export const NeonRing = ({
  value, size = 120, stroke = 10, color = "blue",
  label, sub, className,
}: NeonRingProps) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const id = `grad-${color}-${Math.random().toString(36).slice(2, 7)}`;
  const [a, b] = COLORS[color];

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 drop-shadow-[0_0_16px_hsl(var(--neon-teal)/0.25)]">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </linearGradient>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} stroke="hsl(var(--dash-border))" strokeWidth={stroke} fill="none" opacity={0.4} />
        <circle
          cx={size/2} cy={size/2} r={r}
          stroke={`url(#${id})`} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.2,1,.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-[10px] uppercase tracking-widest text-dash-muted font-medium">{label}</span>}
        {sub && <span className="text-lg font-display font-bold text-dash-foreground mt-0.5">{sub}</span>}
      </div>
    </div>
  );
};
