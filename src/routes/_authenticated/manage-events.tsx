import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Edit,
  Filter,
  PlusCircle,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { requireRouteRoles } from "@/utils/route-permissions";

export const Route = createFileRoute("/_authenticated/manage-events")({
  beforeLoad: async ({ context }) => {
    await requireRouteRoles(context.auth, ["admin", "moderator"]);
  },
  component: ManageEventsPage,
});

type EventStatus = "Approved" | "Pending" | "Cancelled";
type EventCategory =
  | "exam"
  | "contest"
  | "game"
  | "feast"
  | "tour"
  | "concert"
  | "others";

type ManagedEvent = {
  category: EventCategory;
  date: string;
  department: string;
  imageAlt: string;
  imageUrl: string;
  organizer: string;
  status: EventStatus;
  time: string;
  title: string;
};

const managedEvents: ManagedEvent[] = [
  {
    category: "exam",
    date: "Oct 24, 2024",
    department: "Physics Dept.",
    imageAlt: "Students sitting an exam in a large hall.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAmmfqY8QFVY0ibV-L4ghAoljl5lqg5aSpolBycnBN3uAXB_WC2IuWv3HkIaE2HtGv-jIH0Ud5z7-8Cz9EH-LFiPsMf947vTznJtLJSokZjpWf4XZulLVH5TRjUi6J9e-9UvvMl2rqSedEY_oud96lvfsFQmVFH3ky8ldoexfKHe8lzdtiScBR9aoSVoPgosOkmfww1XFOzf0pAiORGzUvrL7czt-X5yo8axPjMpsO2kE_fuS-OoD0bWocEteqHF7u8_JI9HaOt3PE",
    organizer: "Dr. Sarah Jenkins",
    status: "Approved",
    time: "10:00 AM - 4:00 PM",
    title: "Mid-Term Examination 2024",
  },
  {
    category: "contest",
    date: "Nov 02, 2024",
    department: "Design Collective",
    imageAlt: "Design contest banner with creative artwork.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXyxJ9BuDFs2mFssbATcrv-I30WHL_LrUXZ8MnWAxsSgyzRjmJHVhXPiKrzkzOs6zOsx5nNHHZ4MS5z5nIJs9tB-FnYQa6ZNa7JgNrFDTpK0rIIw3kUn0OskjZxZq0vhJ80QFiWYGaQMW3EIsSUDoiOg-JYG9Fh3w-7gOVFP2awVUOLFXCImIra1J6KE7-zY191Kzq0O_tmhsWsgoplFbCVvhx2nBfkmo1oYsshGpRVYBT_pgLT5PZgS2p5Osth-FasC9pwJLSBxs",
    organizer: "Alex Rivera",
    status: "Pending",
    time: "02:00 PM - 5:00 PM",
    title: "UI/UX Design Contest",
  },
  {
    category: "feast",
    date: "Oct 28, 2024",
    department: "General Affairs",
    imageAlt: "Festive banquet table with food and decorations.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCaViOj-UNor6aUfVVbWFd-hbcqDTjt3nlldgphnANGOCEPrfl-6RZQ2siE32SRHFg88x1tFoB0qY-eCrPE3GVsUB_774oaGvqJ9YMq_U4MXycs2-LhSw3b02_qVwEYp3t1C_xtJjeSLEBeDgWsUju4Rjt73oV6oeZyi3qB2Y2OTANX5Z3rtBY8X1SbPtfOu7Lv6-RaHDG-skz5lMsygubRhT5ZZ91mtU5g87YzHuGME5QnSlazD37TR_NsEfkOOHxQZjriq5wELf0",
    organizer: "Student Union",
    status: "Cancelled",
    time: "6:30 PM - 9:00 PM",
    title: "Annual Graduation Feast",
  },
];

function ManageEventsPage() {
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

      <ManageEventsFilters />
      <ManageEventsTable />
    </div>
  );
}

function ManageEventsFilters() {
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
          />
        </label>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto">
          <FilterSelect
            label="Category"
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
            options={["All Status", "Pending", "Approved", "Cancelled"]}
          />
          <Button
            className="h-10 rounded-xl border-border/60 bg-muted px-3 text-muted-foreground hover:bg-secondary hover:text-foreground"
            type="button"
            variant="outline"
          >
            <Filter className="size-5" aria-hidden="true" />
            <span className="sr-only">More filters</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="text-xs font-semibold leading-4 text-muted-foreground"
        id={`${label}-filter-label`}
      >
        {label}
      </span>
      <Select defaultValue={options[0]}>
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
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ManageEventsTable() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border/60 bg-muted/60">
              {[
                "Event Name",
                "Organizer",
                "Date & Time",
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
            {managedEvents.map((event) => (
              <ManagedEventRow event={event} key={event.title} />
            ))}
          </tbody>
        </table>
      </div>

      <ManageEventsPagination />
    </section>
  );
}

function ManagedEventRow({ event }: { event: ManagedEvent }) {
  return (
    <tr className="transition-colors hover:bg-muted/40">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted">
            <img
              alt={event.imageAlt}
              className="h-full w-full object-cover"
              src={event.imageUrl}
            />
          </div>
          <span className="text-base font-semibold leading-6 text-foreground">
            {event.title}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm leading-5 text-foreground">
            {event.organizer}
          </span>
          <span className="text-xs leading-4 text-muted-foreground">
            {event.department}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm leading-5 text-foreground">{event.date}</span>
          <span className="text-xs leading-4 text-muted-foreground">
            {event.time}
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
        <EventStatusBadge status={event.status} />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {event.status === "Approved" ? (
            <>
              <ActionButton label="Edit" tone="primary">
                <Edit className="size-5" aria-hidden="true" />
              </ActionButton>
              <ActionButton label="Delete" tone="destructive">
                <Trash2 className="size-5" aria-hidden="true" />
              </ActionButton>
            </>
          ) : null}

          {event.status === "Pending" ? (
            <>
              <ActionButton label="Approve" tone="primary">
                <Check className="size-5" aria-hidden="true" />
              </ActionButton>
              <ActionButton label="Reject" tone="destructive">
                <CircleX className="size-5" aria-hidden="true" />
              </ActionButton>
              <ActionButton label="Edit" tone="muted">
                <Edit className="size-5" aria-hidden="true" />
              </ActionButton>
            </>
          ) : null}

          {event.status === "Cancelled" ? (
            <>
              <ActionButton label="Restore" tone="muted">
                <RotateCcw className="size-5" aria-hidden="true" />
              </ActionButton>
              <ActionButton label="Delete" tone="destructive">
                <Trash2 className="size-5" aria-hidden="true" />
              </ActionButton>
            </>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

function EventStatusBadge({ status }: { status: EventStatus }) {
  const Icon =
    status === "Approved"
      ? CheckCircle2
      : status === "Pending"
        ? ClockStatusIcon
        : CircleX;

  return (
    <div className={cn("flex items-center gap-1", getStatusClassName(status))}>
      <Icon className="size-4" aria-hidden="true" />
      <span className="text-xs font-semibold leading-4">{status}</span>
    </div>
  );
}

function ClockStatusIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-4 rounded-full border-2 border-current",
        className,
      )}
      aria-hidden="true"
    />
  );
}

function ActionButton({
  children,
  label,
  tone,
}: {
  children: React.ReactNode;
  label: string;
  tone: "primary" | "destructive" | "muted";
}) {
  return (
    <button
      className={cn(
        "rounded-lg p-2 transition-colors",
        tone === "primary" && "text-primary hover:bg-primary/10",
        tone === "destructive" && "text-destructive hover:bg-destructive/10",
        tone === "muted" && "text-muted-foreground hover:bg-muted",
      )}
      title={label}
      type="button"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

function ManageEventsPagination() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 bg-muted/30 px-6 py-4 sm:flex-row">
      <p className="text-xs font-semibold leading-4 text-muted-foreground">
        Showing <span className="text-foreground">1</span> to{" "}
        <span className="text-foreground">3</span> of{" "}
        <span className="text-foreground">42</span> results
      </p>

      <div className="flex items-center gap-2">
        <Button
          className="h-9 gap-1 rounded-lg border-border/60 px-3"
          disabled
          type="button"
          variant="outline"
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
          <span>Previous</span>
        </Button>

        <div className="hidden items-center gap-1 sm:flex">
          {[1, 2, 3].map((page) => (
            <button
              className={cn(
                "flex size-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
                page === 1
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
              key={page}
              type="button"
            >
              {page}
            </button>
          ))}
          <span className="px-2 text-muted-foreground">...</span>
          <button
            className="flex size-9 items-center justify-center rounded-lg text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
            type="button"
          >
            14
          </button>
        </div>

        <Button
          className="h-9 gap-1 rounded-lg border-border/60 px-3"
          type="button"
          variant="outline"
        >
          <span>Next</span>
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

function getCategoryClassName(category: EventCategory) {
  switch (category) {
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

function getStatusClassName(status: EventStatus) {
  if (status === "Approved") {
    return "text-primary";
  }

  if (status === "Pending") {
    return "text-chart-4";
  }

  return "text-destructive";
}
