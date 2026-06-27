import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell, BellDot } from "lucide-react";

import { useNotificationStore } from "@/stores/manage-notifications-store";
import { useAuthStore } from "@/stores/auth-store";

import { useEffect } from "react";
import moment from "moment";

export default function NotificationDialog() {
    const user = useAuthStore((state) => state.user);

    const {
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
    } = useNotificationStore();

    useEffect(() => {
        if (!user?.uid) return;

        fetchNotifications(user.uid);
    }, [user]);

    return (
        <Dialog>
            <DialogTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                >
                    {unreadCount > 0 ? (
                        <BellDot className="size-5" />
                    ) : (
                        <Bell className="size-5" />
                    )}

                    {unreadCount > 0 && (
                        <Badge
                            className="
                                absolute
                                -top-1
                                -right-1
                                h-5
                                min-w-5
                                rounded-full
                                p-0
                                flex
                                items-center
                                justify-center
                            "
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        Notifications
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-112.5 pr-4">

                    {notifications.length === 0 ? (
                        <div className="flex h-64 items-center justify-center text-muted-foreground">
                            No notifications found.
                        </div>
                    ) : (

                        <div className="space-y-3">

                            {notifications.map((notification) => (

                                <div
                                    key={notification.id}
                                    onClick={() => {
                                        if (!notification.is_read) {
                                            markAsRead(notification.id);
                                        }
                                    }}
                                    className={`
                                        cursor-pointer
                                        rounded-lg
                                        border
                                        p-4
                                        transition-all
                                        hover:bg-muted

                                        ${!notification.is_read
                                            ? "bg-primary/5 border-primary"
                                            : ""
                                        }
                                    `}
                                >

                                    <div className="flex justify-between">

                                        <h4 className="font-semibold">

                                            {notification.title}

                                        </h4>

                                        {!notification.is_read && (

                                            <Badge>

                                                New

                                            </Badge>

                                        )}

                                    </div>

                                    <p className="mt-1 text-sm text-muted-foreground">

                                        {notification.message}

                                    </p>

                                    <p className="mt-3 text-xs text-muted-foreground">

                                        {moment(notification.created_at).fromNow()}

                                    </p>

                                </div>

                            ))}

                        </div>

                    )}

                </ScrollArea>

            </DialogContent>

        </Dialog>
    );
}