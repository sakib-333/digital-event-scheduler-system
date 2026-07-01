import { supabase } from "@/supabase.config";

type EventParticipant = {
    id: string;
    created_at: string;
    user_id: string;
    event_id: string;
};

class ManageEventParticipants {
    async getParticipant(userId: string, eventId: string) {
        const { data, error } = await supabase
            .from("event_participants")
            .select("*")
            .eq("user_id", userId)
            .eq("event_id", eventId)
            .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        return data as EventParticipant | null;
    }

    async joinEvent(userId: string, eventId: string) {
        const { data, error } = await supabase
            .from("event_participants")
            .insert({ user_id: userId, event_id: eventId })
            .select("*")
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data as EventParticipant;
    }

    async leaveEvent(userId: string, eventId: string) {
        const { error } = await supabase
            .from("event_participants")
            .delete()
            .eq("user_id", userId)
            .eq("event_id", eventId);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }
}

const manageEventParticipants = new ManageEventParticipants();

export default manageEventParticipants;