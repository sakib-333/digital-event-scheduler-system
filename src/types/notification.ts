export interface NotificationType {
    id: string;
    user_id: string;
    event_id: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}