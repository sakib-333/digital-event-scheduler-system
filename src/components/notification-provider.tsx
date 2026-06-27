import { useEffect } from "react";
import { supabase } from "@/supabase.config";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationStore } from "@/stores/manage-notifications-store";
import type { NotificationType } from "@/types/notification";
// import { toast } from "sonner"; // Uncomment if you use Sonner

interface NotificationProviderProps {
    children: React.ReactNode;
}

export default function NotificationProvider({
    children,
}: NotificationProviderProps) {
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        // Don't subscribe if user is not logged in
        if (!user?.uid) return;

        console.log("🟢 Notification listener started");

        const channel = supabase
            .channel(`notifications-${user.uid}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "notifications",
                    filter: `user_id=eq.${user.uid}`,
                },
                (payload) => {
                    console.log("🔔 New notification:", payload.new);

                    // Add notification to Zustand
                    useNotificationStore
                        .getState()
                        .addNotification(payload.new as NotificationType);

                    // Optional: Show toast
                    // toast.success((payload.new as NotificationType).title);
                }
            )
            .subscribe((status) => {
                console.log("Realtime Status:", status);
            });

        // Cleanup
        return () => {
            console.log("🔴 Notification listener stopped");

            supabase.removeChannel(channel);
        };
    }, [user?.uid]);

    return <>{children}</>;
}