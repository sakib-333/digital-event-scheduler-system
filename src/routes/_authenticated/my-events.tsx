import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EventCard } from "@/components/event-card";
import { useAuth } from "@/context/auth-context";
import { useManageEventsStore } from "@/stores/manage-events-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/my-events")({
  component: MyEventsPage,
});

// ─────────────────────────────────────────────────────
// Event Category Type Definition
// ─────────────────────────────────────────────────────
type EventCategory =
  | "exam"
  | "contest"
  | "game"
  | "feast"
  | "tour"
  | "concert"
  | "others";

// ─────────────────────────────────────────────────────
// Event Categories Constant
// Used for filtering and category selection
// ─────────────────────────────────────────────────────
const EVENT_CATEGORIES: { labelKey: string; value: EventCategory }[] = [
  { labelKey: "routes.common.categories.exam", value: "exam" },
  { labelKey: "routes.common.categories.contest", value: "contest" },
  { labelKey: "routes.common.categories.game", value: "game" },
  { labelKey: "routes.common.categories.feast", value: "feast" },
  { labelKey: "routes.common.categories.tour", value: "tour" },
  { labelKey: "routes.common.categories.concert", value: "concert" },
  { labelKey: "routes.common.categories.others", value: "others" },
];

// ─────────────────────────────────────────────────────
// Event Status Type Definition
// ─────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────
// Event Controls Component
// Handles search and category filtering
// ─────────────────────────────────────────────────────
function EventControls({
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: {
  selectedCategory: EventCategory | "all";
  searchQuery: string;
  onCategoryChange: (category: EventCategory | "all") => void;
  onSearchChange: (query: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-card p-4 shadow-sm lg:flex-row">
      <label className="relative w-full flex-1">
        <Search
          className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="sr-only">{t("routes.myEvents.searchAria")}</span>
        <input
          className="h-10 w-full rounded-lg border border-transparent bg-muted pl-12 pr-4 text-base leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
          placeholder={t("routes.myEvents.searchPlaceholder")}
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
        <select
          className="h-10 rounded-lg border border-transparent bg-muted px-4 text-sm font-medium leading-5 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/50"
          value={selectedCategory}
          onChange={(e) =>
            onCategoryChange(e.target.value as EventCategory | "all")
          }
        >
          <option value="all">{t("routes.common.categories.all")}</option>
          {EVENT_CATEGORIES.map(({ labelKey, value }) => (
            <option key={value} value={value}>
              {t(labelKey)}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}


// ─────────────────────────────────────────────────────
// Main Events Page Component
// ─────────────────────────────────────────────────────
function MyEventsPage() {
  const { t } = useTranslation();
  // ─────────────────────────────────────────────────────
  // Get current user from auth context
  // ─────────────────────────────────────────────────────
  const { user } = useAuth();

  // ─────────────────────────────────────────────────────
  // Get events and loading state from store
  // ─────────────────────────────────────────────────────
  const { events, isLoading, getEventsByUserId } = useManageEventsStore();

  // ─────────────────────────────────────────────────────
  // Filter State: Track user's search and category selection
  // ─────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    EventCategory | "all"
  >("all");

  // ─────────────────────────────────────────────────────
  // Fetch user's events on component mount
  // ─────────────────────────────────────────────────────
  useEffect(() => {
    if (user?.uid) {
      getEventsByUserId(user.uid);
    }
  }, [user?.uid, getEventsByUserId]);

  // ─────────────────────────────────────────────────────
  // Filter Events Based on Search Query and Category
  // Performs case-insensitive search on title, organizer, and location
  // ─────────────────────────────────────────────────────
  const filteredEvents = events.filter((event) => {
    // ─── Category Filter ───
    const categoryMatch =
      selectedCategory === "all" || event.category === selectedCategory;

    // ─── Search Filter ───
    // Search across title, organizer name, and location
    const searchLower = searchQuery.toLowerCase();
    const searchMatch =
      event.title.toLowerCase().includes(searchLower) ||
      event.organizer_name.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower);

    return categoryMatch && searchMatch;
  });

  // ─────────────────────────────────────────────────────
  // Display loading spinner while fetching events
  // ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">{t("routes.myEvents.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold leading-10 text-foreground">
            {t("routes.myEvents.title")}
          </h1>
          <p className="mt-1 max-w-2xl text-base leading-6 text-muted-foreground">
            {t("routes.myEvents.description", { count: filteredEvents.length })}
          </p>
        </div>
        <Link to="/event/create-event">
          <Button className="h-11 gap-2 rounded-xl px-6 shadow-sm" type="button">
            <PlusCircle className="size-5" aria-hidden="true" />
            <span>{t("routes.myEvents.createNew")}</span>
          </Button>
        </Link>
      </header>

      <EventControls
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onCategoryChange={setSelectedCategory}
        onSearchChange={setSearchQuery}
      />

      {filteredEvents.length === 0 ? (
        <div className="rounded-lg border border-border/60 bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">
            {events.length === 0
              ? t("routes.myEvents.empty")
              : t("routes.myEvents.noMatches")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard
              event={event}
              key={event.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
