import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Eye,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { DashboardPanel, IconButton } from "./dashboard-panel";
import { useManageOverviewStore } from "@/stores/manage-overview-store";

type StatCard = {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  metaClassName?: string;
  value: string;
};

type PendingEvent = {
  date: string;
  location: string;
  name: string;
  organizer: string;
};

type CategoryMetric = {
  label: string;
  progressClassName: string;
  value: string;
  widthClassName: string;
};

const stats: StatCard[] = [
  {
    icon: CalendarCheck,
    iconClassName: "bg-primary/10 text-primary",
    label: "Total Events",
    metaClassName: "bg-chart-3/10 text-chart-3",
    value: "1,284",
  },
  {
    icon: CalendarDays,
    iconClassName: "bg-chart-4/10 text-chart-4",
    label: "Pending Approval",
    metaClassName: "text-chart-4",
    value: "42",
  },
  {
    icon: CheckCircle2,
    iconClassName: "bg-chart-3/10 text-chart-3",
    label: "Approved",
    value: "856",
  },
  {
    icon: CircleX,
    iconClassName: "bg-destructive/10 text-destructive",
    label: "Cancelled",
    metaClassName: "text-destructive",
    value: "18",
  },
  {
    icon: Users,
    iconClassName: "bg-secondary text-secondary-foreground",
    label: "Total Users",
    value: "4,912",
  },
];

function formatStatValue(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStats(statsData: ReturnType<typeof useManageOverviewStore.getState>) {
  return stats.map((stat) => {
    if (stat.label === "Total Events") {
      return {
        ...stat,
        value: formatStatValue(statsData.totalEvents),
      };
    }

    if (stat.label === "Pending Approval") {
      return {
        ...stat,
        value: formatStatValue(statsData.eventStatusCounts.pending),
      };
    }

    if (stat.label === "Approved") {
      return {
        ...stat,
        value: formatStatValue(statsData.eventStatusCounts.approved),
      };
    }

    if (stat.label === "Cancelled") {
      return {
        ...stat,
        value: formatStatValue(statsData.eventStatusCounts.canceled),
      };
    }

    if (stat.label === "Total Users") {
      return {
        ...stat,
        value: formatStatValue(statsData.totalUsers),
      };
    }

    return stat;
  });
}

const pendingEvents: PendingEvent[] = [
  {
    date: "Oct 24, 2024",
    location: "Main Auditorium",
    name: "Global AI Summit 2024",
    organizer: "Dept. of Computer Science",
  },
  {
    date: "Nov 02, 2024",
    location: "Room 302, West Wing",
    name: "Graduate Thesis Workshop",
    organizer: "Academic Affairs",
  },
  {
    date: "Nov 15, 2024",
    location: "Sky Lounge",
    name: "Alumni Career Night",
    organizer: "Career Services",
  },
  {
    date: "Dec 20, 2024",
    location: "Grand Ballroom",
    name: "Faculty Gala Dinner",
    organizer: "Dean's Office",
  },
];

const categoryMetrics: CategoryMetric[] = [
  {
    label: "Lecture",
    progressClassName: "bg-primary",
    value: "45%",
    widthClassName: "w-[45%]",
  },
  {
    label: "Workshop",
    progressClassName: "bg-secondary",
    value: "30%",
    widthClassName: "w-[30%]",
  },
  {
    label: "Social",
    progressClassName: "bg-chart-4",
    value: "15%",
    widthClassName: "w-[15%]",
  },
];

export function DashboardOverview({
  currentUserName,
}: {
  currentUserName?: string;
}) {
  const statsData = useManageOverviewStore((state) => state);
  const dashboardStats = getStats(statsData);
  
  return (
    <>
      {currentUserName ? (
        <p className="mb-4 text-sm font-medium leading-5 text-muted-foreground">
          Welcome back,{" "}
          <span className="text-foreground">{currentUserName}</span>
        </p>
      ) : null}

      <StatsGrid stats={dashboardStats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PendingEventsTable />
        <DashboardAnalytics />
      </div>
    </>
  );
}

function StatsGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatSummaryCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}

function StatSummaryCard({ stat }: { stat: StatCard }) {
  const Icon = stat.icon;

  return (
    <DashboardPanel className="p-6 transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className={cn("rounded-lg p-2", stat.iconClassName)}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="text-sm leading-5 text-muted-foreground">
        {stat.label}
      </p>
      <h3 className="mt-1 text-3xl font-semibold leading-10 text-foreground">
        {stat.value}
      </h3>
    </DashboardPanel>
  );
}

function PendingEventsTable() {
  return (
    <DashboardPanel className="flex flex-col overflow-hidden lg:col-span-2">
      <div className="flex items-center justify-between border-b border-border/50 p-6">
        <div>
          <h4 className="text-xl font-semibold leading-7 text-foreground">
            Pending Events
          </h4>
          <p className="text-sm leading-5 text-muted-foreground">
            Review and manage recent submissions
          </p>
        </div>
        <Button type="button" variant="link">
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-muted">
              {["Event Name", "Organizer", "Date", "Status", "Actions"].map(
                (heading) => (
                  <th
                    className={cn(
                      "px-6 py-4 text-sm font-medium leading-5 text-muted-foreground",
                      heading === "Actions" && "text-right",
                    )}
                    key={heading}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {pendingEvents.map((event) => (
              <PendingEventRow event={event} key={event.name} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-auto flex justify-center border-t border-border/40 bg-card px-4 py-3">
        <nav
          className="flex items-center gap-1"
          aria-label="Pending events pages"
        >
          <IconButton label="Previous page">
            <ChevronLeft className="size-5" aria-hidden="true" />
          </IconButton>
          <span className="px-2 text-sm font-medium leading-5">
            Page 1 of 5
          </span>
          <IconButton label="Next page">
            <ChevronRight className="size-5" aria-hidden="true" />
          </IconButton>
        </nav>
      </div>
    </DashboardPanel>
  );
}

function PendingEventRow({ event }: { event: PendingEvent }) {
  return (
    <tr className="transition-colors hover:bg-muted/40">
      <td className="px-6 py-4">
        <p className="text-sm font-semibold leading-5 text-foreground">
          {event.name}
        </p>
        <p className="text-xs leading-4 text-muted-foreground">
          {event.location}
        </p>
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-foreground">
        {event.organizer}
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-foreground">
        {event.date}
      </td>
      <td className="px-6 py-4">
        <span className="rounded-full bg-chart-4/10 px-2 py-1 text-xs font-semibold leading-4 text-chart-4">
          PENDING REVIEW
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <IconButton
            className="text-primary hover:bg-primary/10"
            label="Approve"
          >
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </IconButton>
          <IconButton
            className="text-destructive hover:bg-destructive/10"
            label="Cancel"
          >
            <CircleX className="size-5" aria-hidden="true" />
          </IconButton>
          <IconButton
            className="text-muted-foreground hover:bg-muted hover:text-foreground"
            label="View details"
          >
            <Eye className="size-5" aria-hidden="true" />
          </IconButton>
        </div>
      </td>
    </tr>
  );
}

function DashboardAnalytics() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardPanel className="flex min-h-80 flex-col p-6">
        <h4 className="mb-4 text-xl font-semibold leading-7 text-foreground">
          Events by Category
        </h4>

        <div className="flex flex-1 flex-col justify-center gap-4">
          {categoryMetrics.map((metric) => (
            <CategoryProgress key={metric.label} metric={metric} />
          ))}
        </div>
      </DashboardPanel>
    </div>
  );
}

function CategoryProgress({ metric }: { metric: CategoryMetric }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm leading-5 text-muted-foreground">
          {metric.label}
        </span>
        <span className="text-xs font-semibold leading-4 text-foreground">
          {metric.value}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full",
            metric.progressClassName,
            metric.widthClassName,
          )}
        />
      </div>
    </div>
  );
}
