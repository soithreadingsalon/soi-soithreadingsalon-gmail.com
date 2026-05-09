import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isAdmin } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  // Resolve auth client-side to avoid SSR mismatch.
  const [target, setTarget] = useState<string | null>(null);
  useEffect(() => {
    setTarget(isAdmin() ? "/admin/dashboard" : "/admin/login");
  }, []);
  if (!target) return null;
  return <Navigate to={target as "/admin/dashboard"} />;
}