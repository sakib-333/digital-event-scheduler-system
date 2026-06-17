import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/dashboard"
)({
  component: DashboardPage,
});

function DashboardPage() {
  return <h1>Dashboard</h1>;
}