import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

type OAuthClient = { name?: string; client_name?: string; redirect_uri?: string };
type AuthorizationDetails = {
  client?: OAuthClient;
  scopes?: string[];
  redirect_url?: string;
  redirect_to?: string;
};

// The Supabase auth.oauth namespace is beta; wrap the three methods we use so
// TypeScript doesn't complain about missing types.
type OAuthApi = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};
function oauthApi(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) {
      throw redirect({ to: "/soi/login", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 gold-border text-center">
        <h1 className="font-serif text-2xl mb-2">Authorization error</h1>
        <p className="text-sm text-muted-foreground">
          {String((error as Error)?.message ?? error)}
        </p>
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.client_name ?? details?.client?.name ?? "an external app";
  const redirectUri = details?.client?.redirect_uri;
  const scopes = details?.scopes ?? [];

  async function decide(approve: boolean) {
    setBusy(approve ? "approve" : "deny");
    setError(null);
    const api = oauthApi();
    const { data, error } = approve
      ? await api.approveAuthorization(authorization_id)
      : await api.denyAuthorization(authorization_id);
    if (error) {
      setBusy(null);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(null);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[var(--ivory)] via-[var(--champagne)] to-[var(--blush)]/30">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Logo className="h-14 w-auto mx-auto" />
          <p className="font-script text-2xl text-gold mt-2">Connect an app</p>
        </div>
        <div className="glass-panel rounded-3xl p-8 gold-border space-y-5">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full gradient-gold flex items-center justify-center mb-2">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-serif text-2xl">Connect {clientName}</h1>
            <p className="text-xs text-muted-foreground mt-1">
              This lets {clientName} use SOI Threading Salon as you.
            </p>
          </div>
          {redirectUri && (
            <div className="text-xs text-muted-foreground text-center break-all">
              Redirect: <span className="font-mono">{redirectUri}</span>
            </div>
          )}
          {scopes.length > 0 && (
            <div className="rounded-xl bg-card border border-border p-3 text-xs text-muted-foreground">
              <div className="uppercase tracking-wider mb-1">Requested access</div>
              <ul className="list-disc pl-4 space-y-0.5">
                {scopes.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs text-muted-foreground text-center">
            This does not bypass admin role checks or backend policies.
          </p>
          {error && (
            <p role="alert" className="text-xs text-destructive text-center">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => decide(false)}
              className="px-5 py-3 rounded-full text-sm font-semibold border border-border disabled:opacity-60"
            >
              {busy === "deny" ? "Cancelling…" : "Cancel"}
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => decide(true)}
              className="px-5 py-3 rounded-full text-sm font-semibold btn-gold disabled:opacity-60"
            >
              {busy === "approve" ? "Approving…" : "Approve"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}