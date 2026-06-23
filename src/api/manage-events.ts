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
            .select("*")
            .eq("id", id)
            .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // ─── Get all events ───
    async getAllEvents() {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // ─── Get approved events ───
    async getApprovedEvents() {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("status", "approved")
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // ─── Get events by creator user ID ───
    // Fetches all events created by a specific user
    // sorted by creation date in descending order
    async getEventsByUserId(userId: string) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("created_by", userId)
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}

// ─────────────────────────────────────────────────────
// Export singleton instance
// ─────────────────────────────────────────────────────
const manageEvents = new ManageEvents();
export default manageEvents;
