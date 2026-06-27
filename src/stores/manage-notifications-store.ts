import { create } from "zustand";
import manageNotifications from "@/api/manage-notifications";
import type { NotificationType } from "@/types/notification";

interface NotificationStore {
    notifications: NotificationType[];
    unreadCount: number;
    loading: boolean;

    fetchNotifications: (userId: string) => Promise<void>;
    fetchUnreadCount: (userId: string) => Promise<void>;

    addNotification: (notification: NotificationType) => void;

    markAsRead: (id: string) => Promise<void>;

    markAllAsRead: (userId: string) => Promise<void>;

    deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>(
    (set, get) => ({
        notifications: [],
        unreadCount: 0,
        loading: false,

        fetchNotifications: async (userId) => {
            set({ loading: true });

            try {
                const notifications =
                    await manageNotifications.getNotifications(userId);

                set({
                    notifications,
                    loading: false,
                });
            } catch (error) {
                set({ loading: false });
                throw error;
            }
        },

        fetchUnreadCount: async (userId) => {
            const count =
                await manageNotifications.getUnreadCount(userId);

            set({
                unreadCount: count,
            });
        },

        addNotification: (notification) => {
            set((state) => ({
                notifications: [
                    notification,
                    ...state.notifications,
                ],
                unreadCount: state.unreadCount + 1,
            }));
        },

        markAsRead: async (id) => {
            await manageNotifications.markAsRead(id);

            set((state) => ({
                notifications: state.notifications.map((notification) =>
                    notification.id === id
                        ? {
                            ...notification,
                            is_read: true,
                        }
                        : notification
                ),
                unreadCount: Math.max(
                    0,
                    state.unreadCount - 1
                ),
            }));
        },

        markAllAsRead: async (userId) => {
            await manageNotifications.markAllAsRead(userId);

            set((state) => ({
                notifications: state.notifications.map((notification) => ({
                    ...notification,
                    is_read: true,
                })),
                unreadCount: 0,
            }));
        },

        deleteNotification: async (id) => {
            const notification = get().notifications.find(
                (notification) => notification.id === id
            );

            await manageNotifications.deleteNotification(id);

            set((state) => ({
                notifications: state.notifications.filter(
                    (notification) => notification.id !== id
                ),
                unreadCount:
                    notification && !notification.is_read
                        ? Math.max(0, state.unreadCount - 1)
                        : state.unreadCount,
            }));
        },
    })
);