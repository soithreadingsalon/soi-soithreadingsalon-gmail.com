import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/soi-auth";

export const Route = createFileRoute("/soi/")({
  component: AdminIndex,
});

function AdminIndex() {
  const { status } = useAdminAuth();
  if (status === "loading") return null;
  const target = status === "authenticated" ? "/soi/dashboard" : "/soi/login";
  return <Navigate to={target as "/soi/dashboard"} />;
}