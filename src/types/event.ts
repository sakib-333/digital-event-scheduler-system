export type EventStatus = "approved" | "pending" | "canceled"


export type EventType = {
    id: string;
    created_at: string;

    title: string;
    description: string;
    category: string;

    event_type: "online" | "offline"; // replace with your actual enum values

    location: string;
    meeting_link: string | null;

    start_date: string; // YYYY-MM-DD
    end_date: string;   // YYYY-MM-DD

    start_time: string; // HH:mm:ss
    end_time: string;   // HH:mm:ss

    capacity: number;

    banner_image: string | null;

    organizer_name: string;
    created_by: string;
    status?: EventStatus;
    attendee_count?: number;

};