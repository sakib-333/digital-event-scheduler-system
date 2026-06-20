import { create } from "zustand";

import type { UserType } from "@/types/user";

type AuthStore = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
    clearUser: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));
