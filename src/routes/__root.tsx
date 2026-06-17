import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContextType } from "@/context/auth-context";

export const Route = createRootRouteWithContext<{
    auth: AuthContextType;
}>()({
    component: RootComponent,
});

function RootComponent() {
    return <Outlet />;
}
