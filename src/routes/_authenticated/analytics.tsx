import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

import { DashboardPlaceholderPage } from "@/components/dashboard/admin-dashboard";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <DashboardPlaceholderPage
      description="Review event volume, approval trends, category performance, and operational health."
      icon={BarChart3}
      title="Analytics"
    />
  );
}
