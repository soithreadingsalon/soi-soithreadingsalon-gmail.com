import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  const { status } = useAdminAuth();
  if (status === "loading") return null;
  const target = status === "authenticated" ? "/admin/dashboard" : "/admin/login";
  return <Navigate to={target as "/admin/dashboard"} />;
}