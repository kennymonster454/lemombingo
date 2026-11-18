import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);

  try {
    const { username, password } = await req.json();
    const cleanUsername = String(username ?? "").trim().toLowerCase();
    if (!/^[a-z0-9_]{3,24}$/.test(cleanUsername) ||
        typeof password !== "string" || password.length < 1 || password.length > 256) {
      return response({ error: "Invalid username or password." }, 401);
    }

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!url || !serviceKey || !anonKey) {
      console.error("Username login function is missing required Supabase environment variables.");
      return response({ error: "Login service is temporarily unavailable." }, 500);
    }

    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const publicClient = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (profileError || !profile) return response({ error: "Invalid username or password." }, 401);

    const { data: userData, error: userError } = await admin.auth.admin.getUserById(profile.id);
    const email = userData?.user?.email;
    if (userError || !email) return response({ error: "Invalid username or password." }, 401);

    const { data, error } = await publicClient.auth.signInWithPassword({ email, password });
    if (error || !data.session) return response({ error: "Invalid username or password." }, 401);

    return response({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch (error) {
    console.error("Username login failed:", error instanceof Error ? error.message : "unknown error");
    return response({ error: "Login service is temporarily unavailable." }, 500);
  }
});
