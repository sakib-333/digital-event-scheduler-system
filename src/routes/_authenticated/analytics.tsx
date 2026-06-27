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
  usePageTitle("Analytics")
  const statsData = useManageOverviewStore()

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold leading-10 text-foreground">
          Analytics
        </h1>
        <p className="mt-1 text-base leading-6 text-muted-foreground">
          Monitor event volume, approval health, attendance performance, and
          venue utilization across the university scheduling system.
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
            Events Tracked
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
            Approval Rate
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
            Pending Rate
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
            Cancel Rate
          </p>
          <h2 className="mt-1 text-3xl font-semibold leading-10 text-foreground">
            {statsData.cancelRate || 0}%
          </h2>
        </section>

      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartPanel
          className="xl:col-span-2"
          description="Submitted events compared with approved and pending decisions."
          title="Event Activity Trend"
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
                name="Canceled"
                stroke="var(--primary)"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                dataKey="approved"
                name="Approved"
                stroke="var(--chart-3)"
                strokeWidth={2}
                type="monotone"
              />
              <Line
                dataKey="pending"
                name="Pending"
                stroke="var(--chart-4)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          description="Current operational status across all submitted events."
          title="Approval Health"
        >
          <ResponsiveContainer height={320} width="100%">
            <PieChart>
              <Pie
                data={[
                  { name: "Approved", value: statsData.eventStatusCounts.approved || 0 },
                  { name: "Pending", value: statsData.eventStatusCounts.pending || 0 },
                  { name: "Cancelled", value: statsData.eventStatusCounts.canceled || 0 },
                ]}
                dataKey="value"
                innerRadius={68}
                nameKey="name"
                outerRadius={108}
                paddingAngle={4}
              >
                {[
                  { name: "Approved", value: statsData.eventStatusCounts.approved || 0 },
                  { name: "Pending", value: statsData.eventStatusCounts.pending || 0 },
                  { name: "Cancelled", value: statsData.eventStatusCounts.canceled || 0 },
                ].map((entry, index) => (
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
          description="Share of scheduled programming by event category."
          title="Events by Category"
        >
          <ResponsiveContainer height={320} width="100%">
            <BarChart data={statsData.categoryData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Bar dataKey="value" name="Events" radius={[8, 8, 0, 0]}>
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
          description="Actual attendance measured against expected room capacity."
          title="Attendance vs Capacity"
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
                name="Capacity"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="attendees"
                fill="var(--primary)"
                name="Attendees"
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
