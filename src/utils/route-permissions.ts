// src/utils/route-permissions.ts
import { redirect } from "@tanstack/react-router";

import type { AuthContextType } from "@/context/auth-context";

export type UserRole = "admin" | "moderator" | "general";

type UserLike = {
    user_role?: string | null;
};

export function normalizeUserRole(role?: string | null): UserRole {
    if (role === "admin" || role === "moderator" || role === "general") {
        return role;
    }

    return "general";
}

export function canAccessRoute(
    user: UserLike | null | undefined,
    allowedRoles: UserRole[],
) {
    const role = normalizeUserRole(user?.user_role);

    return allowedRoles.includes(role);
}

export async function requireRouteRoles(
    auth: AuthContextType,
    allowedRoles: UserRole[],
) {
    const user = await auth.waitForAuth();

    if (!canAccessRoute(user, allowedRoles)) {
        await auth.signout();

        throw redirect({
            to: "/signin",
        });
    }

    return user;
}
