import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

import { DashboardPlaceholderPage } from "@/components/dashboard/admin-dashboard";

export const Route = createFileRoute("/_authenticated/users")({
  component: UsersPage,
});

function UsersPage() {
  return (
    <DashboardPlaceholderPage
      description="Manage institutional users, roles, departments, and access levels."
      icon={Users}
      title="Users"
    />
  );
}
