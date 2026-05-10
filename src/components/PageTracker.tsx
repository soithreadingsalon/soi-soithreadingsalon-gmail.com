import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("soi_sid");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("soi_sid", id);
  }
  return id;
}

export function PageTracker() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (path.startsWith("/soi")) return;
    const payload = {
      path,
      referrer: document.referrer || null,
      sessionId: getSessionId(),
    };
    fetch("/api/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }, [path]);

  return null;
}