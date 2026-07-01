import { create } from "zustand";

import manageEventParticipants from "@/api/manage-event-participants";

type ManageEventParticipantsStore = {
    participantId: string | null;
    hasJoined: boolean;
    loading: boolean;
    error: string | null;

    checkParticipation: (userId: string, eventId: string) => Promise<void>;
    joinEvent: (userId: string, eventId: string) => Promise<boolean>;
    leaveEvent: (userId: string, eventId: string) => Promise<boolean>;
};

export const useManageEventParticipantsStore = create<ManageEventParticipantsStore>((set) => ({
    participantId: null,
    hasJoined: false,
    loading: false,
    error: null,

    checkParticipation: async (userId, eventId) => {
        set({ loading: true, error: null });

        try {
            const participant = await manageEventParticipants.getParticipant(userId, eventId);

            set({
                participantId: participant?.id ?? null,
                hasJoined: Boolean(participant),
                loading: false,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to check participation.",
                loading: false,
            });
        }
    },

    joinEvent: async (userId, eventId) => {
        set({ loading: true, error: null });

        try {
            const participant = await manageEventParticipants.joinEvent(userId, eventId);

            set({
                participantId: participant.id,
                hasJoined: true,
                loading: false,
            });

            return true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to join event.",
                loading: false,
            });

            return false;
        }
    },

    leaveEvent: async (userId, eventId) => {
        set({ loading: true, error: null });

        try {
            await manageEventParticipants.leaveEvent(userId, eventId);

            set({
                participantId: null,
                hasJoined: false,
                loading: false,
            });

            return true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to leave event.",
                loading: false,
            });

            return false;
        }
    },
}));