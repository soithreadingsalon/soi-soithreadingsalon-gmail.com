import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { isAdmin, loginAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  useEffect(() => { if (isAdmin()) navigate({ to: "/admin/dashboard" }); }, [navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loginAdmin(u, p)) { toast.success("Welcome back"); navigate({ to: "/admin/dashboard" }); }
    else toast.error("Invalid credentials");
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
            <p className="text-xs text-muted-foreground mt-1">Demo: test123 / test123</p>
          </div>
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Username</span>
            <input value={u} onChange={(e) => setU(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-[var(--gold)] outline-none text-sm" />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Password</span>
            <input type="password" value={p} onChange={(e) => setP(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-[var(--gold)] outline-none text-sm" />
          </label>
          <button type="submit" className="w-full px-6 py-3 rounded-full text-sm font-semibold btn-gold">Sign In</button>
        </form>
      </div>
    </div>
  );
}