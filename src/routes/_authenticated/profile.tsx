import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";

import { DashboardPlaceholderPage } from "@/components/dashboard/admin-dashboard";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <DashboardPlaceholderPage
      description="View administrator details, contact information, and account preferences."
      icon={User}
      title="Profile"
    />
  );
}
