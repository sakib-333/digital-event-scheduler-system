import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";

import { DashboardPlaceholderPage } from "@/components/dashboard/admin-dashboard";

export const Route = createFileRoute("/_authenticated/manage-events")({
  component: ManageEventsPage,
});

function ManageEventsPage() {
  return (
    <DashboardPlaceholderPage
      description="Create, approve, update, and monitor university event submissions from one routed workspace."
      icon={CalendarCheck}
      title="Manage Events"
    />
  );
}
