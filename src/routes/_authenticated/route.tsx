import { createFileRoute, redirect } from "@tanstack/react-router";
import DashboardLayout from "@/layouts/DashboardLayout";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({
        to: "/signin",
      });
    }
  },

  component: DashboardLayout,
});