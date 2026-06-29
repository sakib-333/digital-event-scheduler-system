import { createFileRoute } from "@tanstack/react-router";
import { DashboardOverview } from "@/components/dashboard/admin-dashboard";
import { useAuthStore } from "@/stores/auth-store";
import { usePageTitle } from "@/utils";

export const Route = createFileRoute(
  "/_authenticated/dashboard"
)({
  component: DashboardPage,
});

function DashboardPage() {
  usePageTitle("Overview");
  const user = useAuthStore((state) => state.user);
  return <DashboardOverview currentUserName={user?.name} />;
}
