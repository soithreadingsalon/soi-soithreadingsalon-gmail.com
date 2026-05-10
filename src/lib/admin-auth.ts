import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminStatus = "loading" | "unauthenticated" | "forbidden" | "authenticated";

export async function signInAdmin(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function signUpAdmin(email: string, password: string) {
  // First user to sign up is auto-promoted to admin via DB trigger.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/admin/login` },
  });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const };
}

export async function signOutAdmin() {
  await supabase.auth.signOut();
}

async function checkAdminRole(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) return false;
  return !!data;
}

export function useAdminAuth() {
  const [status, setStatus] = useState<AdminStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const evaluate = async (userId: string | null, mail: string | null) => {
      if (!mounted) return;
      if (!userId) { setStatus("unauthenticated"); setEmail(null); return; }
      setEmail(mail);
      const ok = await checkAdminRole(userId);
      if (!mounted) return;
      setStatus(ok ? "authenticated" : "forbidden");
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      evaluate(session?.user?.id ?? null, session?.user?.email ?? null);
    });

    supabase.auth.getSession().then(({ data }) => {
      evaluate(data.session?.user?.id ?? null, data.session?.user?.email ?? null);
    });

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return { status, email };
}