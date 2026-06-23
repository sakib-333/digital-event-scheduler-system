import { create } from "zustand";
import { toast } from "sonner";

import manageEvents from "@/api/manage-events";
import type { EventType } from "@/types/event";

// ─────────────────────────────────────────────────────
// Manage Events Store Type Definition
// Defines the shape of the events store with state and actions
// ─────────────────────────────────────────────────────
type ManageEventsStore = {
    events: EventType[];
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;

    getAllEvents: () => Promise<void>;
    getApprovedEvents: () => Promise<void>;
    getEventsByUserId: (userId: string) => Promise<void>;
    createEvent: (event: Omit<EventType, "id" | "created_at">) => Promise<boolean>;
    updateEvent: (
        id: string,
        updates: Partial<Omit<EventType, "id" | "created_at" | "created_by">>
    ) => Promise<boolean>;
    deleteEvent: (id: string) => Promise<boolean>;
};

export const useManageEventsStore = create<ManageEventsStore>((set) => ({
    // ─────────────────────────────────────────────────────
    // Initial State
    // ─────────────────────────────────────────────────────
    events: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,

    // ─────────────────────────────────────────────────────
    // Fetch All Events from Database
    // Loads all events without filtering by user
    // ─────────────────────────────────────────────────────
    getAllEvents: async () => {
        set({ isLoading: true, error: null });

        try {
            const events = await manageEvents.getAllEvents();
            set({ events, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to load events.",
                isLoading: false,
            });
            toast.error("Failed to load events.");
        }
    },

    // ─── Fetch Approved Events ───
    // Loads only events with approved status
    getApprovedEvents: async () => {
        set({ isLoading: true, error: null });

        try {
            const events = await manageEvents.getApprovedEvents();
            set({ events, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to load approved events.",
                isLoading: false,
            });
            toast.error("Failed to load approved events.");
        }
    },

    // ─── Fetch Events by User ID ───
    // Loads all events created by a specific user
    // Filtered by the user's ID and sorted by creation date
    getEventsByUserId: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
            const events = await manageEvents.getEventsByUserId(userId);
            set({ events, isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to load your events.",
                isLoading: false,
            });
            toast.error("Failed to load your events.");
        }
    },

    // ─── Create Event ───
    // Adds a new event to the database and updates the store
    // Prepends the new event to the events list for instant UI feedback
    createEvent: async (event) => {
        set({ isCreating: true, error: null });

        try {
            const newEvent = await manageEvents.createEvent(event);
            set((state) => ({
                events: [newEvent, ...state.events],
                isCreating: false,
            }));
            toast.success("Event created successfully!");
            return true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to create event.",
                isCreating: false,
            });
            toast.error("Failed to create event. Please try again.");
            return false;
        }
    },

    // ─── Update Event ───
    // Updates an existing event in the database
    // Updates the event in the store's events list by matching ID
    updateEvent: async (id, updates) => {
        set({ isUpdating: true, error: null });

        try {
            const updatedEvent = await manageEvents.updateEvent(id, updates);
            set((state) => ({
                events: state.events.map((event) =>
                    event.id === id ? updatedEvent : event
                ),
                isUpdating: false,
            }));
            toast.success("Event updated successfully!");
            return true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to update event.",
                isUpdating: false,
            });
            toast.error("Failed to update event. Please try again.");
            return false;
        }
    },

    // ─── Delete Event ───
    // Removes an event from the database
    // Filters out the deleted event from the store's events list
    deleteEvent: async (id) => {
        set({ isDeleting: true, error: null });

        try {
            await manageEvents.deleteEvent(id);
            set((state) => ({
                events: state.events.filter((event) => event.id !== id),
                isDeleting: false,
            }));
            toast.success("Event deleted successfully!");
            return true;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to delete event.",
                isDeleting: false,
            });
            toast.error("Failed to delete event. Please try again.");
            return false;
        }
    },
}));
