import { createFileRoute } from "@tanstack/react-router";
import { DashboardOverview } from "@/components/dashboard/admin-dashboard";
import { useAuthStore } from "@/stores/auth-store";

export const Route = createFileRoute(
  "/_authenticated/dashboard"
)({
  component: DashboardPage,
});

function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  return <DashboardOverview currentUserName={user?.name} />;
}
