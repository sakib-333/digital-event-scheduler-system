import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarCheck,
  CircleCheck,
  CircleX,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { requireRouteRoles } from "@/utils/route-permissions";
import { useManageOverviewStore } from "@/stores/manage-overview-store";
import { usePageTitle } from "@/utils";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_authenticated/analytics")({
  beforeLoad: async ({ context }) => {
    await requireRouteRoles(context.auth, ["admin", "moderator"]);
  },
  component: AnalyticsPage,
});


const chartColors = [
  "var(--primary)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function AnalyticsPage() {
  const { t } = useTranslation();
  usePageTitle(t("routes.analytics.pageTitle"))
  const statsData = useManageOverviewStore()
  const approvalHealthData = [
    { name: t("routes.analytics.chartLabels.approved"), value: statsData.eventStatusCounts.approved || 0 },
    { name: t("routes.analytics.chartLabels.pending"), value: statsData.eventStatusCounts.pending || 0 },
    { name: t("routes.analytics.chartLabels.cancelled"), value: statsData.eventStatusCounts.canceled || 0 },
  ];

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold leading-10 text-foreground">
          {t("routes.analytics.title")}
        </h1>
        <p className="mt-1 text-base leading-6 text-muted-foreground">
          {t("routes.analytics.description")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Grid-1 */}
        <section
          className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className={cn("rounded-lg p-2", 'bg-primary/10 text-primary')}>
              <CalendarCheck className="size-5" aria-hidden="true" />
            </span>
          </div>
          <p className="text-sm leading-5 text-muted-foreground">
            {t("routes.analytics.metrics.eventsTracked")}
          </p>
          <h2 className="mt-1 text-3xl font-semibold leading-10 text-foreground">
            {statsData.totalEvents || 0}
          </h2>
        </section>

        {/* Grid-2 */}
        <section
          className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className={cn("rounded-lg p-2", 'bg-chart-3/10 text-chart-3')}>
              <CircleCheck className="size-5" aria-hidden="true" />
            </span>
          </div>
          <p className="text-sm leading-5 text-muted-foreground">
            {t("routes.analytics.metrics.approvalRate")}
          </p>
          <h2 className="mt-1 text-3xl font-semibold leading-10 text-foreground">
            {statsData.approvalRate || 0}%
          </h2>
        </section>

        {/* Grid-3 */}
        <section
          className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className={cn("rounded-lg p-2", 'bg-chart-3/10 text-chart-3')}>
              <CalendarCheck className="size-5 bg-primary/10 text-primary" aria-hidden="true" />
            </span>
          </div>
          <p className="text-sm leading-5 text-muted-foreground">
            {t("routes.analytics.metrics.pendingRate")}
          </p>
          <h2 className="mt-1 text-3xl font-semibold leading-10 text-foreground">
            {statsData.pendingRate || 0}%
          </h2>
        </section>

        {/* Grid-4 */}
        <section
          className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className={cn("rounded-lg p-2", 'bg-chart-3/10 text-chart-3')}>
              <CircleX className="size-5 bg-destructive/10 text-destructive" aria-hidden="true" />
            </span>
          </div>
          <p className="text-sm leading-5 text-muted-foreground">
            {t("routes.analytics.metrics.cancelRate")}
          </p>
          <h2 className="mt-1 text-3xl font-semibold leading-10 text-foreground">
            {statsData.cancelRate || 0}%
          </h2>
        </section>

      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartPanel
          className="xl:col-span-2"
          description={t("routes.analytics.panels.eventActivity.description")}
          title={t("routes.analytics.panels.eventActivity.title")}
        >
          <ResponsiveContainer height={320} width="100%">
            <AreaChart data={statsData.monthlyEventData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Legend />
              <Area
                dataKey="canceled"
                fill="var(--primary)"
                fillOpacity={0.14}
                name={t("routes.analytics.chartLabels.cancelled")}
                stroke="var(--primary)"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                dataKey="approved"
                name={t("routes.analytics.chartLabels.approved")}
                stroke="var(--chart-3)"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                dataKey="pending"
                name={t("routes.analytics.chartLabels.pending")}
                stroke="var(--chart-4)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          description={t("routes.analytics.panels.approvalHealth.description")}
          title={t("routes.analytics.panels.approvalHealth.title")}
        >
          <ResponsiveContainer height={320} width="100%">
            <PieChart>
              <Pie
                data={approvalHealthData}
                dataKey="value"
                innerRadius={68}
                nameKey="name"
                outerRadius={108}
                paddingAngle={4}
              >
                {approvalHealthData.map((entry, index) => (
                  <Cell
                    fill={chartColors[index % chartColors.length]}
                    key={entry.name}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartPanel
          description={t("routes.analytics.panels.eventsByCategory.description")}
          title={t("routes.analytics.panels.eventsByCategory.title")}
        >
          <ResponsiveContainer height={320} width="100%">
            <BarChart data={statsData.categoryData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Bar dataKey="value" name={t("routes.analytics.chartLabels.events")} radius={[8, 8, 0, 0]}>
                {statsData.categoryData.map((entry, index) => (
                  <Cell
                    fill={chartColors[index % chartColors.length]}
                    key={entry.name + String(index)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          description={t("routes.analytics.panels.attendance.description")}
          title={t("routes.analytics.panels.attendance.title")}
        >
          <ResponsiveContainer height={320} width="100%">
            <BarChart data={statsData.attendanceData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="category" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="capacity"
                fill="var(--secondary-foreground)"
                name={t("routes.analytics.chartLabels.capacity")}
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="attendees"
                fill="var(--primary)"
                name={t("routes.analytics.chartLabels.attendees")}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </div>
  );
}

function ChartPanel({
  children,
  className,
  description,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  description: string;
  title: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold leading-7 text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
