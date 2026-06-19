import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";

import { DashboardPlaceholderPage } from "@/components/dashboard/admin-dashboard";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <DashboardPlaceholderPage
      description="Configure dashboard preferences, scheduling rules, notifications, and integrations."
      icon={Settings}
      title="Settings"
    />
  );
}
