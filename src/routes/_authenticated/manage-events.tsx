import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  PlusCircle,
  Search,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useManageEventsStore } from "@/stores/manage-events-store";
import type { EventType } from "@/types/event";
import { requireRouteRoles } from "@/utils/route-permissions";

export const Route = createFileRoute("/_authenticated/manage-events")({
  beforeLoad: async ({ context }) => {
    await requireRouteRoles(context.auth, ["admin", "moderator"]);
  },
  component: ManageEventsPage,
});

/**
 * Main Page Component for managing events.
 * Connects to `useManageEventsStore` to load and mutate event statuses.
 */
function ManageEventsPage() {
  const { events, isLoading, getAllEvents, updateEvent, deleteEvent } =
    useManageEventsStore();

  // ─── Filter States ───
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all events on mount
  useEffect(() => {
    getAllEvents();
  }, [getAllEvents]);

  // Reset pagination when filters change to avoid empty pages
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  // ─── Mutator Actions ───
  const handleApprove = async (id: string) => {
    await updateEvent(id, { status: "approved" });
  };

  const handleCancel = async (id: string) => {
    await updateEvent(id, { status: "canceled" });
  };

  const handleDelete = async (id: string) => {
    // Confirmation is handled by the AlertDialog; call the store directly.
    await deleteEvent(id);
  };

  // ─── Client-Side Filtering ───
  const filteredEvents = events.filter((event) => {
    // 1. Search Query Filter (Title, ID, or Organizer)
    const query = searchQuery.toLowerCase().trim();
    if (query) {
      const matchTitle = event.title?.toLowerCase().includes(query);
      const matchId = event.id?.toLowerCase().includes(query);
      const matchOrganizer = event.organizer_name?.toLowerCase().includes(query);
      if (!matchTitle && !matchId && !matchOrganizer) {
        return false;
      }
    }

    // 2. Category Filter
    if (selectedCategory && selectedCategory !== "All Categories") {
      if (event.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    // 3. Status Filter
    if (selectedStatus && selectedStatus !== "All Status") {
      if (event.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }
    }

    return true;
  });

  // ─── Client-Side Pagination ───
  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE) || 1;
  const activePage = Math.min(currentPage, totalPages);

  const paginatedEvents = filteredEvents.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE,
  );

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(activePage * ITEMS_PER_PAGE, filteredEvents.length);

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-end gap-4 md:flex-row md:items-center">
        <Link to="/create-event">
          <Button className="h-11 gap-2 rounded-xl px-6 shadow-sm" type="button">
            <PlusCircle className="size-5" aria-hidden="true" />
            <span>Create New Event</span>
          </Button>
        </Link>
      </header>

      {/* Filter controls */}
      <ManageEventsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Data Table */}
      <ManageEventsTable
        events={paginatedEvents}
        isLoading={isLoading}
        onApprove={handleApprove}
        onCancel={handleCancel}
        onDelete={handleDelete}
        currentPage={activePage}
        totalPages={totalPages}
        totalResults={filteredEvents.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

/**
 * Filter header section allowing search and dropdown filtering.
 */
function ManageEventsFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}: {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  selectedStatus: string;
  onStatusChange: (val: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col items-center gap-4 lg:flex-row">
        <label className="relative w-full lg:flex-1">
          <Search
            className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="sr-only">Search events</span>
          <input
            className="h-10 w-full rounded-xl border border-border/60 bg-muted pl-10 pr-4 text-sm leading-5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
            placeholder="Search events by name, ID, or organizer..."
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto">
          <FilterSelect
            label="Category"
            value={selectedCategory}
            onValueChange={onCategoryChange}
            options={[
              "All Categories",
              "exam",
              "contest",
              "game",
              "feast",
              "tour",
              "concert",
              "others",
            ]}
          />
          <FilterSelect
            label="Status"
            value={selectedStatus}
            onValueChange={onStatusChange}
            options={["All Status", "Pending", "Approved", "Canceled"]}
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Dropdown filter selector component.
 */
function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (val: string) => void;
  options: string[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-xs font-semibold leading-4 text-muted-foreground"
        id={`${label}-filter-label`}
      >
        {label}
      </span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          aria-labelledby={`${label}-filter-label`}
          className="h-10 min-w-40 rounded-xl border-border/60 bg-muted px-4 text-sm leading-5 text-foreground shadow-none"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="start"
          className="border border-border bg-popover text-popover-foreground"
        >
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option === "exam" ||
                option === "contest" ||
                option === "game" ||
                option === "feast" ||
                option === "tour" ||
                option === "concert" ||
                option === "others"
                ? option.charAt(0).toUpperCase() + option.slice(1)
                : option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Event grid table displaying the loaded records.
 */
function ManageEventsTable({
  events,
  isLoading,
  onApprove,
  onCancel,
  onDelete,
  currentPage,
  totalPages,
  totalResults,
  startIndex,
  endIndex,
  onPageChange,
}: {
  events: EventType[];
  isLoading: boolean;
  onApprove: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border/60 bg-muted/60">
              {[
                "Event Name",
                "Organizer",
                "Start Date & Time",
                "End Date & Time",
                "Category",
                "Status",
                "Actions",
              ].map((heading) => (
                <th
                  className={cn(
                    "px-6 py-4 text-sm font-medium leading-5 text-muted-foreground",
                    heading === "Actions" && "text-right",
                  )}
                  key={heading}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              <tr>
                <td className="px-6 py-12 text-center" colSpan={7}>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner className="size-8 text-primary" />
                    <span className="text-sm text-muted-foreground">Loading events...</span>
                  </div>
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td className="px-6 py-12 text-center text-sm text-muted-foreground" colSpan={7}>
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <ManagedEventRow
                  event={event}
                  key={event.id}
                  onApprove={onApprove}
                  onCancel={onCancel}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <ManageEventsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={onPageChange}
      />
    </section>
  );
}

/**
 * Individual event row representation.
 */
function ManagedEventRow({
  event,
  onApprove,
  onCancel,
  onDelete,
}: {
  event: EventType;
  onApprove: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Wraps async mutator actions to handle load indicators properly.
  // Called only after the user confirms the AlertDialog.
  const handleAction = async (action: () => Promise<void>) => {
    setIsUpdating(true);
    try {
      await action();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr className={cn("transition-colors hover:bg-muted/40", isUpdating && "opacity-60")}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted flex items-center justify-center">
            {event.banner_image ? (
              <img
                alt={event.title}
                className="h-full w-full object-cover"
                src={event.banner_image}
              />
            ) : (
              <CalendarDays className="size-5 text-muted-foreground" aria-hidden="true" />
            )}
          </div>
          <span className="text-base font-semibold leading-6 text-foreground">
            {event.title}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm leading-5 text-foreground">
          {event.organizer_name}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm leading-5 text-foreground">{formatDate(event.start_date)}</span>
          <span className="text-xs leading-4 text-muted-foreground">
            {formatTime(event.start_time)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm leading-5 text-foreground">{formatDate(event.end_date)}</span>
          <span className="text-xs leading-4 text-muted-foreground">
            {formatTime(event.end_time)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-bold uppercase leading-4",
            getCategoryClassName(event.category),
          )}
        >
          {event.category}
        </span>
      </td>
      <td className="px-6 py-4">
        <EventStatusBadge status={event.status || "pending"} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">

          {/* ── Approve Confirmation Dialog ─────────────────────────────── */}
          {/* Visible only if the event has not already been approved */}
          {event.status?.toLowerCase() !== "approved" && (
            <AlertDialog>
              <AlertDialogTrigger>
                <ActionButton
                  label="Approve"
                  tone="success"
                  disabled={isUpdating}
                >
                  <Check className="size-5" aria-hidden="true" />
                </ActionButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  {/* Icon shown in the media slot */}
                  <AlertDialogMedia className="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <ShieldCheck />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Approve Event</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to approve{" "}
                    <strong className="text-foreground">{event.title}</strong>? This
                    will mark the event as approved and make it visible to attendees.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isUpdating}>
                    Cancel
                  </AlertDialogCancel>
                  {/* Confirm button triggers the actual store update */}
                  <AlertDialogAction
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isUpdating}
                    onClick={() => handleAction(() => onApprove(event.id))}
                  >
                    {isUpdating ? "Approving..." : "Yes, Approve"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* ── Cancel Confirmation Dialog ──────────────────────────────── */}
          {/* Visible only if the event has not already been canceled */}
          {event.status?.toLowerCase() !== "canceled" &&
            event.status?.toLowerCase() !== "cancelled" && (
              <AlertDialog>
                <AlertDialogTrigger>
                  <ActionButton
                    label="Cancel"
                    tone="warning"
                    disabled={isUpdating}
                  >
                    <CircleX className="size-5" aria-hidden="true" />
                  </ActionButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                      <XCircle />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Cancel Event</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel{" "}
                      <strong className="text-foreground">{event.title}</strong>? The
                      event will be marked as cancelled and attendees will be notified.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isUpdating}>
                      Go Back
                    </AlertDialogCancel>
                    {/* Confirm button triggers the store status update */}
                    <AlertDialogAction
                      className="bg-amber-500 hover:bg-amber-600 text-white"
                      disabled={isUpdating}
                      onClick={() => handleAction(() => onCancel(event.id))}
                    >
                      {isUpdating ? "Cancelling..." : "Yes, Cancel"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

          {/* ── Delete Confirmation Dialog ──────────────────────────────── */}
          {/* Always visible; permanently removes the event */}
          <AlertDialog>
            <AlertDialogTrigger>
              <ActionButton
                label="Delete"
                tone="destructive"
                disabled={isUpdating}
              >
                <Trash2 className="size-5" aria-hidden="true" />
              </ActionButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive">
                  <Trash2 />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete Event</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-foreground">{event.title}</strong>? This
                  action <strong>cannot be undone</strong> and all associated data
                  will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isUpdating}>
                  Keep Event
                </AlertDialogCancel>
                {/* Confirm button triggers the permanent store deletion */}
                <AlertDialogAction
                  variant="destructive"
                  disabled={isUpdating}
                  onClick={() => handleAction(() => onDelete(event.id))}
                >
                  {isUpdating ? "Deleting..." : "Yes, Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </td>
    </tr>
  );
}

/**
 * Status indicator badge with icon.
 */
function EventStatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const Icon =
    normalized === "approved"
      ? CheckCircle2
      : normalized === "pending"
        ? ClockStatusIcon
        : CircleX;

  return (
    <div className={cn("flex items-center gap-1", getStatusClassName(status))}>
      <Icon className="size-4" aria-hidden="true" />
      <span className="text-xs font-semibold leading-4">{getStatusLabel(status)}</span>
    </div>
  );
}

function ClockStatusIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-4 rounded-full border-2 border-current animate-pulse",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/**
 * Flexible, custom-styled Action Button supporting multiple tones.
 */
function ActionButton({
  children,
  label,
  tone,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  tone: "primary" | "destructive" | "muted" | "success" | "warning";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className={cn(
        "rounded-lg p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        tone === "primary" && "text-primary hover:bg-primary/10",
        tone === "success" && "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30",
        tone === "warning" && "text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30",
        tone === "destructive" && "text-destructive hover:bg-destructive/10",
        tone === "muted" && "text-muted-foreground hover:bg-muted",
      )}
      title={label}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

/**
 * Standard table pagination controls.
 */
function ManageEventsPagination({
  currentPage,
  totalPages,
  totalResults,
  startIndex,
  endIndex,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 bg-muted/30 px-6 py-4 sm:flex-row">
      <p className="text-xs font-semibold leading-4 text-muted-foreground">
        Showing <span className="text-foreground">{totalResults > 0 ? startIndex : 0}</span> to{" "}
        <span className="text-foreground">{endIndex}</span> of{" "}
        <span className="text-foreground">{totalResults}</span> results
      </p>

      <div className="flex items-center gap-2">
        <Button
          className="h-9 gap-1 rounded-lg border-border/60 px-3"
          disabled={currentPage <= 1}
          type="button"
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span>Previous</span>
        </Button>

        <div className="hidden items-center gap-1 sm:flex">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              className={cn(
                "flex size-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                page === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          className="h-9 gap-1 rounded-lg border-border/60 px-3"
          disabled={currentPage >= totalPages}
          type="button"
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span>Next</span>
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Styling helpers.
 */
function getCategoryClassName(category: string) {
  switch (category.toLowerCase()) {
    case "exam":
      return "bg-primary/10 text-primary";
    case "contest":
      return "bg-chart-4/10 text-chart-4";
    case "game":
      return "bg-chart-2/10 text-chart-2";
    case "feast":
      return "bg-chart-5/10 text-chart-5";
    case "tour":
      return "bg-chart-3/10 text-chart-3";
    case "concert":
      return "bg-purple-500/10 text-purple-500";
    case "others":
    default:
      return "bg-secondary text-secondary-foreground";
  }
}

function getStatusClassName(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "approved") {
    return "text-emerald-600 dark:text-emerald-400";
  }

  if (normalized === "pending") {
    return "text-amber-500 dark:text-amber-400";
  }

  return "text-destructive";
}

/**
 * Helper to format date strings to a readable format (e.g., Oct 24, 2024).
 */
const formatDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

/**
 * Helper to format time strings (HH:mm:ss or HH:mm) to AM/PM format.
 */
const formatTime = (timeStr: string) => {
  try {
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHours = h % 12 || 12;
    return `${displayHours}:${minutes} ${ampm}`;
  } catch {
    return timeStr;
  }
};

/**
 * Helper to get clean status labels for display.
 */
const getStatusLabel = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "Approved";
    case "pending":
      return "Pending";
    case "canceled":
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}
