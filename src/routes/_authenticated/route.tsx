import { createFileRoute, redirect } from "@tanstack/react-router";
import DashboardLayout from "@/layouts/DashboardLayout";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const user = await context.auth.waitForAuth();

    if (!user) {
      throw redirect({
        to: "/signin",
      });
    }
  },

  component: DashboardLayout,
});
