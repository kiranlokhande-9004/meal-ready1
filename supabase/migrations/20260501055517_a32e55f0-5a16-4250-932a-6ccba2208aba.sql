
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles select own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles insert own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Family members
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  dietary_prefs TEXT[] NOT NULL DEFAULT '{}',
  allergies TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fm select own" ON public.family_members FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "fm insert own" ON public.family_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fm update own" ON public.family_members FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "fm delete own" ON public.family_members FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER fm_touch BEFORE UPDATE ON public.family_members FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Meal plans
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  plan JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mp select own" ON public.meal_plans FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "mp insert own" ON public.meal_plans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mp update own" ON public.meal_plans FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "mp delete own" ON public.meal_plans FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX meal_plans_user_week_idx ON public.meal_plans (user_id, week_start DESC);

-- Grocery items
CREATE TABLE public.grocery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  quantity TEXT,
  checked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.grocery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gi select own" ON public.grocery_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "gi insert own" ON public.grocery_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gi update own" ON public.grocery_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "gi delete own" ON public.grocery_items FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX grocery_items_user_idx ON public.grocery_items (user_id, meal_plan_id);
CREATE TRIGGER gi_touch BEFORE UPDATE ON public.grocery_items FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
