import { supabase } from "@/supabase.config";
import type { EventType } from "@/types/event";

// ─────────────────────────────────────────────────────
// Manage Events API Class
// Handles all database operations for events
// ─────────────────────────────────────────────────────
class ManageEvents {
    // ─── Create a new event ───
    async createEvent(event: Omit<EventType, "id" | "created_at">) {
        const { data, error } = await supabase
            .from("events")
            .insert(event)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // ─── Update an existing event ───
    async updateEvent(
        id: string,
        updates: Partial<Omit<EventType, "id" | "created_at" | "created_by">>
    ) {
        const { data, error } = await supabase
            .from("events")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // ─── Delete an event ───
    async deleteEvent(id: string) {
        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", id);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }

    // ─── Get an event by its ID ───
    async getEventById(id: string) {
        const { data, error } = await supabase
            .from("events")
            .select("*, event_participants(id)")
            .eq("id", id)
            .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        if (!data) {
            return data;
        }

        const event = data as EventType & { event_participants?: { id: string }[] };

        return {
            ...event,
            attendee_count: event.event_participants?.length ?? 0,
        } as EventType;
    }

    // ─── Get all events ───
    async getAllEvents() {
        const { data, error } = await supabase
            .from("events")
            .select("*, event_participants(id)")
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        const events = (data ?? []) as Array<
            EventType & { event_participants?: { id: string }[] }
        >;

        return events.map((event) => ({
            ...event,
            attendee_count: event.event_participants?.length ?? 0,
        })) as EventType[];
    }

    // ─── Get approved events ───
    async getApprovedEvents() {
        const { data, error } = await supabase
            .from("events")
            .select("*, event_participants(id)")
            .eq("status", "approved")
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        const events = (data ?? []) as Array<
            EventType & { event_participants?: { id: string }[] }
        >;

        return events.map((event) => ({
            ...event,
            attendee_count: event.event_participants?.length ?? 0,
        })) as EventType[];
    }

    // ─── Get events by creator user ID ───
    // Fetches all events created by a specific user
    // sorted by creation date in descending order
    async getEventsByUserId(userId: string) {
        const { data, error } = await supabase
            .from("events")
            .select("*, event_participants(id)")
            .eq("created_by", userId)
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        const events = (data ?? []) as Array<
            EventType & { event_participants?: { id: string }[] }
        >;

        return events.map((event) => ({
            ...event,
            attendee_count: event.event_participants?.length ?? 0,
        })) as EventType[];
    }

    // ─── Get attendance statistics grouped by category ───
    async getAttendanceByCategory() {
        const { data, error } = await supabase
            .from("events")
            .select("category, capacity, event_participants(id)");

        if (error) {
            throw new Error(error.message);
        }

        const events = (data ?? []) as Array<{
            category: string;
            capacity: number;
            event_participants?: { id: string }[];
        }>;

        const grouped = events.reduce<
            Record<
                string,
                {
                    category: string;
                    attendees: number;
                    capacity: number;
                }
            >
        >((acc, event) => {
            if (!acc[event.category]) {
                acc[event.category] = {
                    category: event.category,
                    attendees: 0,
                    capacity: 0,
                };
            }

            acc[event.category].capacity += Number(event.capacity);
            acc[event.category].attendees +=
                event.event_participants?.length ?? 0;

            return acc;
        }, {});

        return Object.values(grouped);
    }
}

// ─────────────────────────────────────────────────────
// Export singleton instance
// ─────────────────────────────────────────────────────
const manageEvents = new ManageEvents();
export default manageEvents;
