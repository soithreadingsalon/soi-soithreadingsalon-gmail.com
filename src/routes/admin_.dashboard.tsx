import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, MessageSquare, Tag, Scissors, Image as ImageIcon, Globe } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin_/dashboard")({
  component: () => <AdminLayout />,
});

// We render the page via a child routing pattern below using AdminPageWrapper