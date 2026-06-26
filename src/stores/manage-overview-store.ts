import { create } from "zustand";

import manageEvents from "@/api/manage-events";
import manageUsers from "@/api/manage-users";
import type { EventStatus, EventType } from "@/types/event";

type EventCategoryStat = {
    category: string;
    count: number;
    percentage: number;
    value: string;
};

type EventStatusCounts = Record<EventStatus, number>;

type ManageOverviewStore = {
    approvalRate: number;
    approvalRateValue: string;
    cancelRate: number;
    cancelRateValue: string;
    pendingRate: number;
    pendingRateValue: string;
    totalEvents: number;
    totalUsers: number;
    eventStatusCounts: EventStatusCounts;
    eventsByCategory: EventCategoryStat[];
    isLoading: boolean;
    error: string | null;
};

const emptyEventStatusCounts: EventStatusCounts = {
    approved: 0,
    pending: 0,
    canceled: 0,
};

function formatCategoryName(category: string) {
    return category
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function getEventsByCategory(events: EventType[]): EventCategoryStat[] {
    if (events.length === 0) {
        return [];
    }

    const categoryCounts = events.reduce<Record<string, number>>((acc, event) => {
        const category = event.category?.trim() || "Uncategorized";
        acc[category] = (acc[category] ?? 0) + 1;
        return acc;
    }, {});

    return Object.entries(categoryCounts)
        .map(([category, count]) => {
            const percentage = Math.round((count / events.length) * 100);

            return {
                category: formatCategoryName(category),
                count,
                percentage,
                value: `${percentage}%`,
            };
        })
        .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

function getEventStatusCounts(events: EventType[]): EventStatusCounts {
    return events.reduce<EventStatusCounts>(
        (counts, event) => {
            if (event.status) {
                counts[event.status] += 1;
            }

            return counts;
        },
        { ...emptyEventStatusCounts },
    );
}

function getRate(count: number, total: number) {
    if (total === 0) {
        return 0;
    }

    return Math.round((count / total) * 100);
}

export const useManageOverviewStore = create<ManageOverviewStore>(() => ({
    approvalRate: 0,
    approvalRateValue: "0%",
    cancelRate: 0,
    cancelRateValue: "0%",
    pendingRate: 0,
    pendingRateValue: "0%",
    totalEvents: 0,
    totalUsers: 0,
    eventStatusCounts: { ...emptyEventStatusCounts },
    eventsByCategory: [],
    isLoading: false,
    error: null,
}));

async function loadOverviewStats() {
    useManageOverviewStore.setState({ isLoading: true, error: null });

    try {
        const [events, users] = await Promise.all([
            manageEvents.getAllEvents(),
            manageUsers.getAllUsers(),
        ]);
        const eventStatusCounts = getEventStatusCounts(events);
        const approvalRate = getRate(eventStatusCounts.approved, events.length);
        const cancelRate = getRate(eventStatusCounts.canceled, events.length);
        const pendingRate = getRate(eventStatusCounts.pending, events.length);

        useManageOverviewStore.setState({
            approvalRate,
            approvalRateValue: `${approvalRate}%`,
            cancelRate,
            cancelRateValue: `${cancelRate}%`,
            pendingRate,
            pendingRateValue: `${pendingRate}%`,
            totalEvents: events.length,
            totalUsers: users.length,
            eventStatusCounts,
            eventsByCategory: getEventsByCategory(events),
            isLoading: false,
        });
    } catch (error) {
        useManageOverviewStore.setState({
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to load overview stats.",
            isLoading: false,
        });
    }
}

void loadOverviewStats();
