import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  CalendarCheck,
  CircleCheck,
  Clock3,
  TrendingUp,
  Users,
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

export const Route = createFileRoute("/_authenticated/analytics")({
  beforeLoad: async ({ context }) => {
      await requireRouteRoles(context.auth, ["admin", "moderator"]);
    },
  component: AnalyticsPage,
});

const monthlyEventData = [
  { month: "Jan", approved: 52, pending: 18, submitted: 74 },
  { month: "Feb", approved: 61, pending: 22, submitted: 88 },
  { month: "Mar", approved: 74, pending: 26, submitted: 105 },
  { month: "Apr", approved: 68, pending: 20, submitted: 96 },
  { month: "May", approved: 83, pending: 24, submitted: 118 },
  { month: "Jun", approved: 91, pending: 28, submitted: 132 },
];

const approvalData = [
  { name: "Approved", value: 856 },
  { name: "Pending", value: 42 },
  { name: "Cancelled", value: 18 },
];

const categoryData = [
  { name: "Workshops", value: 34 },
  { name: "Lectures", value: 29 },
  { name: "Social", value: 18 },
  { name: "Academic", value: 14 },
  { name: "Symposium", value: 5 },
];

const attendanceData = [
  { category: "Workshop", actual: 620, capacity: 760 },
  { category: "Lecture", actual: 840, capacity: 980 },
  { category: "Social", actual: 360, capacity: 440 },
  { category: "Academic", actual: 510, capacity: 600 },
  { category: "Symposium", actual: 280, capacity: 320 },
];

const venueUtilization = [
  {
    name: "Main Auditorium",
    utilization: "92%",
    events: 28,
    trend: "+8%",
    widthClassName: "w-[92%]",
  },
  {
    name: "Engineering Hall",
    utilization: "84%",
    events: 22,
    trend: "+5%",
    widthClassName: "w-[84%]",
  },
  {
    name: "Faculty Lounge",
    utilization: "76%",
    events: 18,
    trend: "+3%",
    widthClassName: "w-[76%]",
  },
  {
    name: "Physics Lab 302",
    utilization: "68%",
    events: 14,
    trend: "-2%",
    widthClassName: "w-[68%]",
  },
];

const chartColors = [
  "var(--primary)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function AnalyticsPage() {
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

      <AnalyticsStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartPanel
          className="xl:col-span-2"
          description="Submitted events compared with approved and pending decisions."
          title="Event Activity Trend"
        >
          <ResponsiveContainer height={320} width="100%">
            <AreaChart data={monthlyEventData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Legend />
              <Area
                dataKey="submitted"
                fill="var(--primary)"
                fillOpacity={0.14}
                name="Submitted"
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
                data={approvalData}
                dataKey="value"
                innerRadius={68}
                nameKey="name"
                outerRadius={108}
                paddingAngle={4}
              >
                {approvalData.map((entry, index) => (
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
            <BarChart data={categoryData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Bar dataKey="value" name="Events" radius={[8, 8, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell
                    fill={chartColors[index % chartColors.length]}
                    key={entry.name}
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
            <BarChart data={attendanceData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="category" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="capacity"
                fill="var(--muted)"
                name="Capacity"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="actual"
                fill="var(--primary)"
                name="Actual"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <VenueUtilizationTable />
        <OperationalInsights />
      </section>
    </div>
  );
}

function AnalyticsStats() {
  const stats = [
    {
      icon: CalendarCheck,
      iconClassName: "bg-primary/10 text-primary",
      label: "Events Tracked",
      value: "1,284",
    },
    {
      icon: CircleCheck,
      iconClassName: "bg-chart-3/10 text-chart-3",
      label: "Approval Rate",
      value: "94.1%",
    },
    {
      icon: Users,
      iconClassName: "bg-chart-2/10 text-chart-2",
      label: "Attendance",
      value: "18.6K",
    },
    {
      icon: Clock3,
      iconClassName: "bg-chart-4/10 text-chart-4",
      label: "Avg. Review Time",
      value: "6.4h",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <section
            className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-xl"
            key={stat.label}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className={cn("rounded-lg p-2", stat.iconClassName)}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
            <p className="text-sm leading-5 text-muted-foreground">
              {stat.label}
            </p>
            <h2 className="mt-1 text-3xl font-semibold leading-10 text-foreground">
              {stat.value}
            </h2>
          </section>
        );
      })}
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

function VenueUtilizationTable() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl">
      <div className="border-b border-border/60 p-6">
        <h2 className="text-xl font-semibold leading-7 text-foreground">
          Venue Utilization
        </h2>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          High-demand spaces and monthly usage movement.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-muted/60">
              {["Venue", "Events", "Utilization", "Trend"].map((heading) => (
                <th
                  className="px-6 py-4 text-sm font-medium leading-5 text-muted-foreground"
                  key={heading}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {venueUtilization.map((venue) => (
              <tr className="transition-colors hover:bg-muted/40" key={venue.name}>
                <td className="px-6 py-4 text-sm font-semibold leading-5 text-foreground">
                  {venue.name}
                </td>
                <td className="px-6 py-4 text-sm leading-5 text-foreground">
                  {venue.events}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full bg-primary",
                          venue.widthClassName,
                        )}
                      />
                    </div>
                    <span className="text-sm leading-5 text-muted-foreground">
                      {venue.utilization}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold leading-5 text-primary">
                  {venue.trend}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OperationalInsights() {
  return (
    <section className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-xl">
      <div className="mb-5 flex items-start gap-3">
        <span className="rounded-lg bg-primary/10 p-2 text-primary">
          <Activity className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-semibold leading-7 text-foreground">
            Operational Notes
          </h2>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Practical signals for the scheduling office.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          "Workshop demand is leading category growth and may need more lab availability.",
          "Approval throughput remains strong, with pending volume below the monthly target.",
          "Main Auditorium is near peak utilization; avoid overlapping large academic events.",
        ].map((item) => (
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4" key={item}>
            <div className="flex gap-3">
              <TrendingUp className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">{item}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
