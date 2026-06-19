import { createFileRoute } from "@tanstack/react-router";
import { DashboardOverview } from "@/components/dashboard/admin-dashboard";

export const Route = createFileRoute(
  "/_authenticated/dashboard"
)({
  component: DashboardPage,
});

function DashboardPage() {
  return <DashboardOverview />;
}
