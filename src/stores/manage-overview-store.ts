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

type CategoryDataItem = {
    name: string;
    value: number;
};

type AttendanceDataItem = {
    category: string;
    attendees: number;
    capacity: number;
};

type EventStatusCounts = Record<EventStatus, number>;

type MonthlyEventStat = {
    month: string;
    approved: number;
    pending: number;
    canceled: number;
};

type ManageOverviewStore = {
    approvalRate: number;
    approvalRateValue: string;
    cancelRate: number;
    cancelRateValue: string;
    pendingRate: number;
    pendingRateValue: string;
    totalEvents: number;
    totalUsers: number;
    attendanceData: AttendanceDataItem[];
    categoryData: CategoryDataItem[];
    eventStatusCounts: EventStatusCounts;
    eventsByCategory: EventCategoryStat[];
    monthlyEventData: MonthlyEventStat[];
    isLoading: boolean;
    error: string | null;
};

const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

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

function getCategoryData(eventsByCategory: EventCategoryStat[]): CategoryDataItem[] {
    return eventsByCategory.map((item) => ({
        name: item.category,
        value: item.count,
    }));
}

function getAttendanceData(
    attendanceByCategory: AttendanceDataItem[],
): AttendanceDataItem[] {
    return attendanceByCategory
        .map((item) => ({
            category: formatCategoryName(item.category || "Uncategorized"),
            attendees: item.attendees,
            capacity: item.capacity,
        }))
        .sort((a, b) => b.attendees - a.attendees || a.category.localeCompare(b.category));
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

function getMonthlyEventData(events: EventType[]): MonthlyEventStat[] {
    const monthlyEventData = monthNames.map((month) => ({
        month,
        approved: 0,
        pending: 0,
        canceled: 0,
    }));

    events.forEach((event) => {
        const eventDate = new Date(event.created_at);

        if (Number.isNaN(eventDate.getTime()) || !event.status) {
            return;
        }

        monthlyEventData[eventDate.getMonth()][event.status] += 1;
    });

    return monthlyEventData;
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
    attendanceData: [],
    categoryData: [],
    eventStatusCounts: { ...emptyEventStatusCounts },
    eventsByCategory: [],
    monthlyEventData: getMonthlyEventData([]),
    isLoading: false,
    error: null,
}));

async function loadOverviewStats() {
    useManageOverviewStore.setState({ isLoading: true, error: null });

    try {
        const [events, users, attendanceByCategory] = await Promise.all([
            manageEvents.getAllEvents(),
            manageUsers.getAllUsers(),
            manageEvents.getAttendanceByCategory(),
        ]);
        const eventStatusCounts = getEventStatusCounts(events);
        const approvalRate = getRate(eventStatusCounts.approved, events.length);
        const cancelRate = getRate(eventStatusCounts.canceled, events.length);
        const pendingRate = getRate(eventStatusCounts.pending, events.length);
        const eventsByCategory = getEventsByCategory(events);

        useManageOverviewStore.setState({
            approvalRate,
            approvalRateValue: `${approvalRate}%`,
            cancelRate,
            cancelRateValue: `${cancelRate}%`,
            pendingRate,
            pendingRateValue: `${pendingRate}%`,
            totalEvents: events.length,
            totalUsers: users.length,
            attendanceData: getAttendanceData(attendanceByCategory),
            categoryData: getCategoryData(eventsByCategory),
            eventStatusCounts,
            eventsByCategory,
            monthlyEventData: getMonthlyEventData(events),
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
