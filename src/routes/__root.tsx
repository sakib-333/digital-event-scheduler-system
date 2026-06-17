import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import type { AuthContextType } from "@/context/auth-context";

export const Route = createRootRouteWithContext<{
    auth: AuthContextType;
}>()({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <Outlet />
            <div className="fixed bottom-6 right-6 z-50">
                <ModeToggle />
            </div>
        </>
    );
}
