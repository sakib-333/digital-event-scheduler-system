import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import type { AuthContextType } from "./context/auth-context";

export const router = createRouter({
    routeTree,
    context: {
        auth: undefined! as AuthContextType,
    },
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
