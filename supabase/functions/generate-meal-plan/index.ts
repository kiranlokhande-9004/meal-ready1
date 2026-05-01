import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MEAL_IMAGE_KEYS = [
  "avocado-toast", "quinoa-salad", "grilled-salmon", "oats-bowl",
  "stir-fry", "smoothie-bowl", "caesar-salad", "pasta",
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return json({ error: "Unauthorized" }, 401);

    const { family = [], preferences = "" } = await req.json().catch(() => ({}));

    const familyDesc = family.length
      ? family.map((m: any) => `${m.name} (age ${m.age ?? "?"}, prefs: ${(m.dietary_prefs || []).join(", ") || "none"}, allergies: ${(m.allergies || []).join(", ") || "none"})`).join("; ")
      : "Solo adult, no restrictions";

    const systemPrompt = `You are a friendly, expert family nutritionist and meal planner. Always return data using the provided tool. Meals must be realistic, balanced, varied across the week, and respect dietary preferences and allergies.`;

    const userPrompt = `Generate a complete 7-day meal plan (Monday through Sunday) with breakfast, lunch, dinner for a family.
Family: ${familyDesc}.
Extra notes: ${preferences || "none"}.

Constraints:
- Use ONE of these image keys per meal (rotate for variety): ${MEAL_IMAGE_KEYS.join(", ")}.
- Provide realistic per-day total nutrition (calories 1600-2400, protein 80-160g, carbs 150-280g, fats 50-90g).
- Provide a consolidated grocery list (10-18 items) grouped by category (Produce, Protein, Dairy, Pantry, Bakery, Other).`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "save_meal_plan",
            description: "Save the generated 7-day meal plan and grocery list",
            parameters: {
              type: "object",
              properties: {
                days: {
                  type: "array", minItems: 7, maxItems: 7,
                  items: {
                    type: "object",
                    properties: {
                      day: { type: "string", enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
                      breakfast: meal(), lunch: meal(), dinner: meal(),
                      nutrition: {
                        type: "object",
                        properties: {
                          calories: { type: "number" }, protein: { type: "number" },
                          carbs: { type: "number" }, fats: { type: "number" },
                        },
                        required: ["calories","protein","carbs","fats"], additionalProperties: false,
                      },
                    },
                    required: ["day","breakfast","lunch","dinner","nutrition"], additionalProperties: false,
                  },
                },
                grocery: {
                  type: "array", minItems: 10, maxItems: 22,
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      category: { type: "string", enum: ["Produce","Protein","Dairy","Pantry","Bakery","Other"] },
                      quantity: { type: "string" },
                    },
                    required: ["name","category","quantity"], additionalProperties: false,
                  },
                },
              },
              required: ["days","grocery"], additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "save_meal_plan" } },
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) return json({ error: "Rate limit reached, try again in a moment." }, 429);
      if (aiRes.status === 402) return json({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }, 402);
      const t = await aiRes.text();
      console.error("AI error", aiRes.status, t);
      return json({ error: "AI generation failed" }, 500);
    }

    const aiJson = await aiRes.json();
    const call = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) return json({ error: "No plan returned" }, 500);
    const plan = JSON.parse(call.function.arguments);

    // Persist
    const today = new Date();
    const day = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((day + 6) % 7));
    const weekStart = monday.toISOString().slice(0, 10);

    const { data: planRow, error: planErr } = await supabase
      .from("meal_plans")
      .insert({ user_id: user.id, week_start: weekStart, plan })
      .select()
      .single();
    if (planErr) { console.error(planErr); return json({ error: planErr.message }, 500); }

    // Replace grocery for this week
    await supabase.from("grocery_items").delete().eq("user_id", user.id);
    const groceryRows = (plan.grocery || []).map((g: any) => ({
      user_id: user.id, meal_plan_id: planRow.id,
      name: g.name, category: g.category, quantity: g.quantity, checked: false,
    }));
    if (groceryRows.length) await supabase.from("grocery_items").insert(groceryRows);

    return json({ meal_plan: planRow, grocery: groceryRows });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function meal() {
  return {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      image_key: { type: "string", enum: MEAL_IMAGE_KEYS },
    },
    required: ["name","description","image_key"],
    additionalProperties: false,
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
