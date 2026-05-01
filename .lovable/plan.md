# NutriNest AI — Premium SaaS Build Plan

A polished, demo-ready meal planning SaaS with a light marketing site, a dark glassmorphic dashboard that mirrors your hero image, real auth, and AI-generated meal plans.

## Visual Direction

**Landing / Auth (Light)**
- Clean white background with soft emerald gradients
- Emerald → teal accent gradient on CTAs and highlights
- Generous whitespace, rounded-2xl cards, soft shadows, Inter font
- Subtle hover lifts and fade-in animations on scroll

**Dashboard (Dark, mirrors hero image)**
- Deep navy base (`hsl(230 35% 7%)`) with radial purple/teal glows in the background
- Frosted glass cards: low-opacity white fill, blurred backdrop, thin gradient border
- Neon accents: emerald, teal, blue, violet — used in rings, progress, and active states
- Circular SVG progress rings for nutrition (Calories blue, Protein violet, Carbs green) — exactly like the hero
- Sidebar with glowing active item indicator, pill-shaped nav buttons

## Pages

### 1. Landing (`/`)
- **Navbar** — logo, Features, How it works, Pricing, Sign in, "Get started" CTA
- **Hero** — headline "Personalized family meals, planned in seconds", subcopy, primary + secondary CTA, trust line. Right side: a real React-rendered mock of the dashboard (the same components used in the actual app) inside a tilted browser frame with the dark glass styling. This guarantees the hero matches the product UI exactly.
- **Features** — 4 cards: AI Meal Plans, Smart Grocery Lists, Family Profiles, Nutrition Tracking
- **How it works** — 3 steps with numbered glow badges
- **Pricing** — 3 tiers (Free, Family, Pro), Family highlighted with gradient border
- **Final CTA** band + Footer

### 2. Auth (`/auth`)
- Centered glass card on a soft gradient background
- Tabs: Sign in / Sign up
- Email + password, plus Google sign-in button
- Clear validation, toast feedback, redirect to `/dashboard` on success

### 3. Dashboard (`/dashboard`, protected)
Sidebar layout matching the hero:
- **Sidebar**: NutriNest AI logo, nav (Dashboard, Meal Plan, Grocery, Family, Nutrition, Settings), user chip at bottom
- **Topbar**: page title, notifications bell with count, avatar
- **Overview** (default landing): "My Weekly Meals" carousel of 3 highlight cards (Breakfast / Lunch / Dinner with food image), Nutrition Stats card with 3 circular rings, Grocery List preview on the right
- **Meal Plan**: 7-day grid of cards, each showing B/L/D with image, "Regenerate week" button (calls AI)
- **Grocery List**: animated checklist grouped by category, progress bar, "Mark all" action
- **Family Profiles**: card grid, Add member modal (name, age, dietary preferences chips, allergies)
- **Nutrition**: daily totals with rings + weekly bar trend

## Interactions & Polish
- Skeleton loaders on every async section
- Toast (sonner) for create/update/regenerate
- Hover lift + glow on cards, smooth checkbox tick animation, animated count-up on numbers
- Fully responsive: sidebar collapses to icon rail on tablet, drawer on mobile; grids restack

## Backend (Lovable Cloud)
- **Auth**: Email/password + Google sign-in, session persisted, protected routes redirect to `/auth`
- **Tables**:
  - `profiles` (id → auth.users, full_name, avatar_url, created_at) — auto-created via trigger
  - `family_members` (id, user_id, name, age, dietary_prefs[], allergies[])
  - `meal_plans` (id, user_id, week_start, plan jsonb) — stores the 7-day plan
  - `grocery_items` (id, user_id, meal_plan_id, name, category, quantity, checked)
- RLS: every table is owner-scoped (`user_id = auth.uid()`)
- Leaked-password protection enabled

## AI (Lovable AI Gateway)
Edge function `generate-meal-plan`:
- Input: family members, dietary preferences, allergies
- Calls `google/gemini-3-flash-preview` with a tool-call schema returning a typed 7-day plan + grocery list
- Persists `meal_plans` and `grocery_items` rows, returns them to the client
- Handles 429 / 402 with friendly toasts

## Assets
- Generate 6–8 high-quality food photos (avocado toast, quinoa salad, grilled salmon, oats bowl, smoothie, stir-fry, etc.) via the image model, stored in `src/assets`, used on meal cards on both landing and dashboard so visuals match the product perfectly.

## Technical Notes
- React + Vite + Tailwind, design tokens added to `index.css` and `tailwind.config.ts` (HSL semantic tokens: emerald primary, teal accent, plus dashboard-only dark surface/glow tokens)
- Routes: `/`, `/auth`, `/dashboard` (with nested sections via tabs or sub-routes), `*` NotFound
- `ProtectedRoute` wrapper using `onAuthStateChange` + `getSession`
- Reusable `GlassCard`, `NeonRing`, `SidebarNav`, `MealCard`, `GroceryItem` components so the dashboard preview on the landing page is literally the same components

## Out of Scope (for this first build)
- Payments / real Pro tier (pricing is static)
- Email notifications, mobile app
- Multi-language

After approval I'll switch to build mode, enable Lovable Cloud, generate assets, scaffold the schema, and ship the three pages end-to-end.