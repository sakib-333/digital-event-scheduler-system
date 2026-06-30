import { create } from "zustand";

import manageUsers from "@/api/manage-users";
import type { UserType } from "@/types/user";
import { toast } from 'sonner';

type ManageUsersStore = {
    user: UserType | null;
    users: UserType[];
    isLoading: boolean;
    isUpdatingRole: boolean;
    updatingUserId: string | null;
    error: string | null;
    getAllUsers: () => Promise<void>;
    getUserById: (uid: string) => Promise<void>;
    userUserRole: (uid: string, userRole: NonNullable<UserType["user_role"]>) => Promise<void>;
};

export const useManageUsersStore = create<ManageUsersStore>((set) => ({
    user: null,
    users: [],
    isLoading: false,
    isUpdatingRole: false,
    updatingUserId: null,
    error: null,
    getAllUsers: async () => {
        set({ isLoading: true, error: null });

        try {
            const users = await manageUsers.getAllUsers();
            set({ users, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to load users.",
                isLoading: false,
            });
        }
    },

    getUserById: async (uid) => {
        set({ isLoading: true, error: null });

        try {
            const user = await manageUsers.getUserByUid(uid);
            set({ user, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to load user.",
                isLoading: false,
            });
        }
    },

    userUserRole: async (uid, userRole) => {
        set({ error: null, isUpdatingRole: true, updatingUserId: uid });

        try {
            const updatedUser = await manageUsers.updateUser(uid, {
                user_role: userRole,
            });

            set((state) => ({
                users: state.users.map((user) =>
                    user.uid === uid ? updatedUser : user,
                ),
                isUpdatingRole: false,
                updatingUserId: null,

            }));
            toast.success("User role updated!")
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to update user role.",
                isUpdatingRole: false,
                updatingUserId: null,
            });
            toast.error("Something went wrong. Please try again.")
        }
    },
}));
