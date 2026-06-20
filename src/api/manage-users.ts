// manage-users.ts

import { supabase } from "@/supabase.config";
import type { UserType } from "@/types/user";

class ManageUsers {
    /* Create a new user */

    async createUser(user: UserType) {
        if ("user_role" in user) {
            throw new Error("user_role cannot be specified when creating a user.");
        }

        const { data, error } = await supabase
            .from("users")
            .insert(user)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /* Create a user only when the uid does not already exist */
    async ensureUserExists(user: UserType) {
        const existingUser = await this.getUserByUid(user.uid);

        if (existingUser) {
            return existingUser;
        }

        return this.createUser(user);
    }

    /* Update an existing user */
    async updateUser(
        uid: string,
        updates: Partial<Omit<UserType, "uid">>
    ) {
        const { data, error } = await supabase
            .from("users")
            .update(updates)
            .eq("uid", uid)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /* get user by uid without throwing when the user does not exist */
    async getUserByUid(uid: string) {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("uid", uid)
            .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /* Get all users */
    async getAllUsers() {

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}

const manageUsers = new ManageUsers()
export default manageUsers
