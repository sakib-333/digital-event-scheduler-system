import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  ShieldCheck,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";

import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Trans, useTranslation } from "react-i18next";

import { DashboardPanel } from "./dashboard-panel";
import { useManageOverviewStore } from "@/stores/manage-overview-store";
import { Link } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth-store";
import { useManageEventsStore } from "@/stores/manage-events-store";
import { useEffect, useState, type ReactNode } from "react";
import type { EventType } from "@/types/event";
import { formatDate } from "@/utils";

type StatCard = {
  icon: LucideIcon;
  iconClassName: string;
  id: "totalEvents" | "pendingApproval" | "approved" | "cancelled" | "totalUsers";
  labelKey: string;
  metaClassName?: string;
  value: string;
};

type CategoryMetric = {
  count: number;
  label: string;
  progressClassName: string;
  percentage: number;
  value: string;
};

const tableColumns = ["eventName", "organizer", "date", "status"] as const;

const stats: StatCard[] = [
  {
    icon: CalendarCheck,
    iconClassName: "bg-primary/10 text-primary",
    id: "totalEvents",
    labelKey: "dashboard.overview.stats.totalEvents",
    metaClassName: "bg-chart-3/10 text-chart-3",
    value: "1,284",
  },
  {
    icon: CalendarDays,
    iconClassName: "bg-chart-4/10 text-chart-4",
    id: "pendingApproval",
    labelKey: "dashboard.overview.stats.pendingApproval",
    metaClassName: "text-chart-4",
    value: "42",
  },
  {
    icon: CheckCircle2,
    iconClassName: "bg-chart-3/10 text-chart-3",
    id: "approved",
    labelKey: "dashboard.overview.stats.approved",
    value: "856",
  },
  {
    icon: CircleX,
    iconClassName: "bg-destructive/10 text-destructive",
    id: "cancelled",
    labelKey: "dashboard.overview.stats.cancelled",
    metaClassName: "text-destructive",
    value: "18",
  },
  {
    icon: Users,
    iconClassName: "bg-secondary text-secondary-foreground",
    id: "totalUsers",
    labelKey: "dashboard.overview.stats.totalUsers",
    value: "4,912",
  },
];

function formatStatValue(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function getStats(statsData: ReturnType<typeof useManageOverviewStore.getState>) {
  return stats.map((stat) => {
    if (stat.id === "totalEvents") {
      return {
        ...stat,
        value: formatStatValue(statsData.totalEvents),
      };
    }

    if (stat.id === "pendingApproval") {
      return {
        ...stat,
        value: formatStatValue(statsData.eventStatusCounts.pending),
      };
    }

    if (stat.id === "approved") {
      return {
        ...stat,
        value: formatStatValue(statsData.eventStatusCounts.approved),
      };
    }

    if (stat.id === "cancelled") {
      return {
        ...stat,
        value: formatStatValue(statsData.eventStatusCounts.canceled),
      };
    }

    if (stat.id === "totalUsers") {
      return {
        ...stat,
        value: formatStatValue(statsData.totalUsers),
      };
    }

    return stat;
  });
}

const categoryProgressClassNames = [
  "bg-primary",
  "bg-chart-4",
  "bg-chart-3",
  "bg-chart-2",
  "bg-chart-5",
  "bg-secondary",
];

export function DashboardOverview({
  currentUserName,
}: {
  currentUserName?: string;
}) {
  const { t } = useTranslation();
  const statsData = useManageOverviewStore((state) => state);
  const dashboardStats = getStats(statsData);
  const categoryMetrics = getCategoryMetrics(
    statsData.eventsByCategory,
    t("dashboard.overview.analytics.uncategorized"),
  );

  return (
    <>
      {currentUserName ? (
        <p className="mb-4 text-sm font-medium leading-5 text-muted-foreground">
          {t("dashboard.overview.welcome")}{" "}
          <span className="text-foreground">{currentUserName}</span>
        </p>
      ) : null}

      <StatsGrid stats={dashboardStats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PendingEventsTable />
        <DashboardAnalytics categoryMetrics={categoryMetrics} />
      </div>
    </>
  );
}

function getCategoryMetrics(
  eventsByCategory: ReturnType<
    typeof useManageOverviewStore.getState
  >["eventsByCategory"],
  uncategorizedLabel: string,
): CategoryMetric[] {
  const groupedCategories = eventsByCategory.reduce<
    Record<string, { count: number; label: string }>
  >((acc, item) => {
    const label = item.category.trim() || uncategorizedLabel;
    const key = label.toLowerCase();

    acc[key] = {
      count: (acc[key]?.count ?? 0) + item.count,
      label: acc[key]?.label ?? label,
    };

    return acc;
  }, {});

  const totalCount = Object.values(groupedCategories).reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return Object.values(groupedCategories)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .map((item, index) => {
      const percentage = totalCount
        ? Math.round((item.count / totalCount) * 100)
        : 0;

      return {
        count: item.count,
        label: item.label,
        percentage,
        progressClassName:
          categoryProgressClassNames[index % categoryProgressClassNames.length],
        value: `${percentage}%`,
      };
    });
}

function StatsGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <StatSummaryCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

function StatSummaryCard({ stat }: { stat: StatCard }) {
  const Icon = stat.icon;
  const { t } = useTranslation();

  return (
    <DashboardPanel className="p-6 transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className={cn("rounded-lg p-2", stat.iconClassName)}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="text-sm leading-5 text-muted-foreground">
        {t(stat.labelKey)}
      </p>
      <h3 className="mt-1 text-3xl font-semibold leading-10 text-foreground">
        {stat.value}
      </h3>
    </DashboardPanel>
  );
}

function PendingEventsTable() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const {
    events,
    getAllPendingEvents,
    isLoading,
    updateEvent,
    deleteEvent,
  } = useManageEventsStore();
  const [currentPage, setCurrentPage] = useState(1);
  const canManageEvents = user?.user_role !== "general";
  const columns = canManageEvents ? [...tableColumns, "actions"] : [...tableColumns];
  const pendingEvents = events.filter((event) => event.status === "pending");
  const itemsPerPage = 4;
  const totalPages = Math.ceil(pendingEvents.length / itemsPerPage) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedEvents = pendingEvents.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage,
  );

  useEffect(() => {
    getAllPendingEvents();
  }, [getAllPendingEvents]);

  useEffect(() => {
    setCurrentPage(1);
  }, [pendingEvents.length]);

  async function handleApprove(id: string) {
    await updateEvent(id, { status: "approved" });
    await getAllPendingEvents();
  }

  async function handleCancel(id: string) {
    await updateEvent(id, { status: "canceled" });
    await getAllPendingEvents();
  }

  async function handleDelete(id: string) {
    await deleteEvent(id);
    await getAllPendingEvents();
  }
  
  return (
    <DashboardPanel className="flex flex-col overflow-hidden lg:col-span-2">
      <div className="flex items-center justify-between border-b border-border/50 p-6">
        <div>
          <h4 className="text-xl font-semibold leading-7 text-foreground">
            {t("dashboard.overview.pendingEvents.title")}
          </h4>
          <p className="text-sm leading-5 text-muted-foreground">
            {t("dashboard.overview.pendingEvents.description")}
          </p>
        </div>
        <Link to="/events">
          <Button type="button" variant="link">
            {t("dashboard.overview.pendingEvents.viewAll")}
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-muted">
              {columns.map((heading) => (
                <th
                  className={cn(
                    "px-6 py-4 text-sm font-medium leading-5 text-muted-foreground",
                    heading === "actions" && "text-right",
                  )}
                  key={heading}
                >
                  {t(`dashboard.overview.pendingEvents.columns.${heading}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? (
              <tr>
                <td
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                  colSpan={columns.length}
                >
                  {t("dashboard.overview.pendingEvents.loading")}
                </td>
              </tr>
            ) : paginatedEvents.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-10 text-center text-sm text-muted-foreground"
                  colSpan={columns.length}
                >
                  {t("dashboard.overview.pendingEvents.empty")}
                </td>
              </tr>
            ) : (
              paginatedEvents.map((event) => (
                <PendingEventRow
                  canManageEvents={canManageEvents}
                  event={event}
                  key={event.id}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto flex justify-center border-t border-border/40 bg-card px-4 py-3">
        <nav
          className="flex items-center gap-1"
          aria-label={t("dashboard.overview.pendingEvents.paginationAria")}
        >
          <button
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            disabled={activePage <= 1}
            title={t("dashboard.overview.pendingEvents.previousPage")}
            type="button"
            onClick={() => setCurrentPage(activePage - 1)}
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
            <span className="sr-only">
              {t("dashboard.overview.pendingEvents.previousPage")}
            </span>
          </button>
          <span className="px-2 text-sm font-medium leading-5">
            {t("dashboard.overview.pendingEvents.pageStatus", {
              page: activePage,
              total: totalPages,
            })}
          </span>
          <button
            className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            disabled={activePage >= totalPages}
            title={t("dashboard.overview.pendingEvents.nextPage")}
            type="button"
            onClick={() => setCurrentPage(activePage + 1)}
          >
            <ChevronRight className="size-5" aria-hidden="true" />
            <span className="sr-only">
              {t("dashboard.overview.pendingEvents.nextPage")}
            </span>
          </button>
        </nav>
      </div>
    </DashboardPanel>
  );
}

function PendingEventRow({
  canManageEvents,
  event,
  onApprove,
  onCancel,
  onDelete,
}: {
  canManageEvents: boolean;
  event: EventType;
  onApprove: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleAction(action: () => Promise<void>) {
    setIsUpdating(true);
    try {
      await action();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <tr className={cn("transition-colors hover:bg-muted/40", isUpdating && "opacity-60")}>
      <td className="px-6 py-4">
        <p className="text-sm font-semibold leading-5 text-foreground">
          {event.title}
        </p>
        <p className="text-xs leading-4 text-muted-foreground">
          {event.location}
        </p>
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-foreground">
        {event.organizer_name}
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-foreground">
        {formatDate(event.start_date)}
      </td>
      <td className="px-6 py-4">
        <span className="rounded-full bg-chart-4/10 px-2 py-1 text-xs font-semibold leading-4 text-chart-4">
          {t("dashboard.overview.pendingEvents.status.pendingReview")}
        </span>
      </td>
      {canManageEvents ? (
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-2">
            <ConfirmationDialog
              actionClassName="bg-emerald-600 text-white hover:bg-emerald-700"
              actionLabel={
                isUpdating
                  ? t("dashboard.overview.pendingEvents.actions.approving")
                  : t("dashboard.overview.pendingEvents.actions.confirmApprove")
              }
              cancelLabel={t("dashboard.overview.pendingEvents.actions.cancel")}
              description={
                <Trans
                  i18nKey="dashboard.overview.pendingEvents.actions.approveDescription"
                  values={{ title: event.title }}
                  components={{ strong: <strong className="text-foreground" /> }}
                />
              }
              disabled={isUpdating}
              icon={<ShieldCheck />}
              mediaClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
              title={t("dashboard.overview.pendingEvents.actions.approveTitle")}
              onConfirm={() => handleAction(() => onApprove(event.id))}
            >
              <PendingActionButton
                className="text-primary hover:bg-primary/10"
                disabled={isUpdating}
                label={t("dashboard.overview.pendingEvents.actions.approve")}
              >
                <CheckCircle2 className="size-5" aria-hidden="true" />
              </PendingActionButton>
            </ConfirmationDialog>
            <ConfirmationDialog
              actionClassName="bg-amber-500 text-white hover:bg-amber-600"
              actionLabel={
                isUpdating
                  ? t("dashboard.overview.pendingEvents.actions.cancelling")
                  : t("dashboard.overview.pendingEvents.actions.confirmCancel")
              }
              cancelLabel={t("dashboard.overview.pendingEvents.actions.goBack")}
              description={
                <Trans
                  i18nKey="dashboard.overview.pendingEvents.actions.cancelDescription"
                  values={{ title: event.title }}
                  components={{ strong: <strong className="text-foreground" /> }}
                />
              }
              disabled={isUpdating}
              icon={<XCircle />}
              mediaClassName="bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
              title={t("dashboard.overview.pendingEvents.actions.cancelTitle")}
              onConfirm={() => handleAction(() => onCancel(event.id))}
            >
              <PendingActionButton
                className="text-destructive hover:bg-destructive/10"
                disabled={isUpdating}
                label={t("dashboard.overview.pendingEvents.actions.cancel")}
              >
                <CircleX className="size-5" aria-hidden="true" />
              </PendingActionButton>
            </ConfirmationDialog>
            <ConfirmationDialog
              actionLabel={
                isUpdating
                  ? t("dashboard.overview.pendingEvents.actions.deleting")
                  : t("dashboard.overview.pendingEvents.actions.confirmDelete")
              }
              cancelLabel={t("dashboard.overview.pendingEvents.actions.keepEvent")}
              description={
                <Trans
                  i18nKey="dashboard.overview.pendingEvents.actions.deleteDescription"
                  values={{ title: event.title }}
                  components={{
                    event: <strong className="text-foreground" />,
                    warning: <strong />,
                  }}
                />
              }
              disabled={isUpdating}
              icon={<Trash2 />}
              mediaClassName="bg-destructive/10 text-destructive"
              title={t("dashboard.overview.pendingEvents.actions.deleteTitle")}
              variant="destructive"
              onConfirm={() => handleAction(() => onDelete(event.id))}
            >
              <PendingActionButton
                className="text-destructive hover:bg-destructive/10"
                disabled={isUpdating}
                label={t("dashboard.overview.pendingEvents.actions.delete")}
              >
                <Trash2 className="size-5" aria-hidden="true" />
              </PendingActionButton>
            </ConfirmationDialog>
          </div>
        </td>
      ) : null}
    </tr>
  );
}

function PendingActionButton({
  children,
  className,
  disabled,
  label,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-1 transition-colors",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      title={label}
    >
      {children}
      <span className="sr-only">{label}</span>
    </span>
  );
}

function DashboardAnalytics({
  categoryMetrics,
}: {
  categoryMetrics: CategoryMetric[];
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <DashboardPanel className="flex min-h-80 flex-col p-6">
        <h4 className="mb-4 text-xl font-semibold leading-7 text-foreground">
          {t("dashboard.overview.analytics.title")}
        </h4>

        <div className="flex flex-1 flex-col justify-center gap-4">
          {categoryMetrics.length > 0 ? (
            categoryMetrics.map((metric) => (
              <CategoryProgress key={metric.label} metric={metric} />
            ))
          ) : (
            <p className="text-sm leading-5 text-muted-foreground">
              {t("dashboard.overview.analytics.empty")}
            </p>
          )}
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
          )}
          style={{ width: `${Math.min(Math.max(metric.percentage, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
