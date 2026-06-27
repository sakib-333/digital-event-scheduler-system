import { supabase } from "@/supabase.config";
import type { NotificationType } from "@/types/notification";

// ─────────────────────────────────────────────────────
// Manage Notifications API Class
// ─────────────────────────────────────────────────────
class ManageNotifications {
    // ─── Get notifications by user ───
    async getNotifications(userId: string) {
        const { data, error } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data as NotificationType[];
    }

    // ─── Get unread count ───
    async getUnreadCount(userId: string) {
        const { count, error } = await supabase
            .from("notifications")
            .select("*", {
                count: "exact",
                head: true,
            })
            .eq("user_id", userId)
            .eq("is_read", false);

        if (error) {
            throw new Error(error.message);
        }

        return count ?? 0;
    }

    // ─── Mark notification as read ───
    async markAsRead(id: string) {
        const { error } = await supabase
            .from("notifications")
            .update({
                is_read: true,
            })
            .eq("id", id);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }

    // ─── Mark all notifications as read ───
    async markAllAsRead(userId: string) {
        const { error } = await supabase
            .from("notifications")
            .update({
                is_read: true,
            })
            .eq("user_id", userId)
            .eq("is_read", false);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }

    // ─── Delete notification ───
    async deleteNotification(id: string) {
        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", id);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }
}

const manageNotifications = new ManageNotifications();

export default manageNotifications;