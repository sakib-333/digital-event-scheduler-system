import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";

import { DashboardPlaceholderPage } from "@/components/dashboard/admin-dashboard";

export const Route = createFileRoute("/_authenticated/my-events")({
  component: MyEventsPage,
});

function MyEventsPage() {
  return (
    <DashboardPlaceholderPage
      description="Track events assigned to you, review schedules, and keep campus bookings moving."
      icon={CalendarDays}
      title="My Events"
    />
  );
}
