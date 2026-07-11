import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { signInAdmin, useAdminAuth } from "@/lib/admin-auth";

export const Route = createFileRoute("/soi/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  component: AdminLogin,
});

function safeNext(next: string): string | null {
  if (!next) return null;
  // Only allow same-origin relative paths.
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

function AdminLogin() {
  const navigate = useNavigate();
  const { status } = useAdminAuth();
  const { next } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    const dest = safeNext(next);
    if (dest) {
      window.location.href = dest;
    } else {
      navigate({ to: "/soi/dashboard" });
    }
  }, [status, next, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await signInAdmin(email, password);
      if (!res.ok) { toast.error(res.error); return; }
      toast.success("Welcome back");
      // useAdminAuth effect will redirect once role is verified.
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[var(--ivory)] via-[var(--champagne)] to-[var(--blush)]/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Logo className="h-14 w-auto mx-auto" />
          <p className="font-script text-2xl text-gold mt-2">Admin Portal</p>
        </div>
        <form onSubmit={submit} className="glass-panel rounded-3xl p-8 gold-border space-y-4">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full gradient-gold flex items-center justify-center mb-2"><Lock className="h-5 w-5 text-white" /></div>
            <h1 className="font-serif text-2xl">Sign In</h1>
            <p className="text-xs text-muted-foreground mt-1">Restricted access</p>
          </div>
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Email</span>
            <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-[var(--gold)] outline-none text-sm" />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Password</span>
            <input type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-[var(--gold)] outline-none text-sm" />
          </label>
          <button type="submit" disabled={busy} className="w-full px-6 py-3 rounded-full text-sm font-semibold btn-gold disabled:opacity-60">
            {busy ? "Please wait…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}