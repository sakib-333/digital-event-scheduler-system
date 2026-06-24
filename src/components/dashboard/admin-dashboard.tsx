import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Eye,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { getNameInitials, userTypeMap } from "@/utils";

type UserRole = "admin" | "moderator" | "general";

type DashboardUser = {
  user_role?: UserRole | string | null;
  name?: string | null;
  avatar?: string | null;
};

type NavItem = {
  icon: LucideIcon;
  label: string;
  to: string;

  /**
   * Roles that can see this route/nav item.
   *
   * Example:
   * allowedRoles: ["admin", "moderator"]
   */
  allowedRoles: UserRole[];
};

type StatCard = {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  meta: string;
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

/*━━Roles━━━━ */

const ALL_ROLES: UserRole[] = ["admin", "moderator", "general"];

function normalizeUserRole(role?: string | null): UserRole {
  if (role === "admin" || role === "moderator" || role === "general") {
    return role;
  }

  return "general";
}

/**
 * Returns nav items based on the current user's role.
 *
 * Rules:
 * - Admin can see all routes.
 * - Moderator can see all routes except Manage Users.
 * - General can see all routes except Manage Users and Manage Events.
 */
export function getNavItemsByRole(
  user?: DashboardUser | null,
  items: NavItem[] = navItems,
) {
  const role = normalizeUserRole(user?.user_role);

  return items.filter((item) => item.allowedRoles.includes(role));
}

/*━━Navitems━━━━ */

const primaryNavItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    to: "/dashboard",
    allowedRoles: ALL_ROLES,
  },
  {
    icon: Calendar,
    label: "Events",
    to: "/events",
    allowedRoles: ALL_ROLES,
  },
  {
    icon: CalendarDays,
    label: "My Events",
    to: "/my-events",
    allowedRoles: ALL_ROLES,
  },
  {
    icon: CalendarCheck,
    label: "Manage Events",
    to: "/event/manage-events",
    allowedRoles: ["admin", "moderator"],
  },
  {
    icon: Users,
    label: "Manage Users",
    to: "/manage-users",
    allowedRoles: ["admin"],
  },
  {
    icon: BarChart3,
    label: "Analytics",
    to: "/analytics",
    allowedRoles: ["admin", "moderator"],
  },
];

const secondaryNavItems: NavItem[] = [
  {
    icon: User,
    label: "Profile",
    to: "/profile",
    allowedRoles: ALL_ROLES,
  },
  {
    icon: Settings,
    label: "Settings",
    to: "/settings",
    allowedRoles: ALL_ROLES,
  },
];

const mobileNavItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: "Overview",
    to: "/dashboard",
    allowedRoles: ALL_ROLES,
  },
  {
    icon: CalendarCheck,
    label: "Events",
    to: "/manage-events",
    allowedRoles: ["admin", "moderator"],
  },
  {
    icon: BarChart3,
    label: "Analytics",
    to: "/analytics",
    allowedRoles: ["admin", "moderator"],
  },
  {
    icon: User,
    label: "Profile",
    to: "/profile",
    allowedRoles: ALL_ROLES,
  },
];

const navItems = [...primaryNavItems, ...secondaryNavItems];

/*━━Dashboard Data━━━━ */

const stats: StatCard[] = [
  {
    icon: CalendarCheck,
    iconClassName: "bg-primary/10 text-primary",
    label: "Total Events",
    meta: "+12%",
    metaClassName: "bg-chart-3/10 text-chart-3",
    value: "1,284",
  },
  {
    icon: CalendarDays,
    iconClassName: "bg-chart-4/10 text-chart-4",
    label: "Pending Approval",
    meta: "Active",
    metaClassName: "text-chart-4",
    value: "42",
  },
  {
    icon: CheckCircle2,
    iconClassName: "bg-chart-3/10 text-chart-3",
    label: "Approved",
    meta: "Monthly",
    value: "856",
  },
  {
    icon: CircleX,
    iconClassName: "bg-destructive/10 text-destructive",
    label: "Cancelled",
    meta: "-3%",
    metaClassName: "text-destructive",
    value: "18",
  },
  {
    icon: Users,
    iconClassName: "bg-secondary text-secondary-foreground",
    label: "Total Users",
    meta: "Total",
    value: "4,912",
  },
];

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

/*━━Dashboard Shell━━━━ */

export function DashboardShell() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar />

      <main className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <DashboardHeader />

        <section className="mx-auto w-full max-w-360 p-6">
          <Outlet />
        </section>
      </main>

      <MobileDashboardNav />
    </div>
  );
}

/*━━Dashboard Overview━━━━ */

export function DashboardOverview({
  currentUserName,
}: {
  currentUserName?: string;
}) {
  return (
    <>
      {currentUserName ? (
        <p className="mb-4 text-sm font-medium leading-5 text-muted-foreground">
          Welcome back,{" "}
          <span className="text-foreground">{currentUserName}</span>
        </p>
      ) : null}

      <StatsGrid />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PendingEventsTable />
        <DashboardAnalytics />
      </div>
    </>
  );
}

export function DashboardPlaceholderPage({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <DashboardPanel className="flex min-h-105 items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-semibold leading-8 text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </DashboardPanel>
  );
}

/*━━Sidebar━━━━ */

function DashboardSidebar() {
  const navigate = useNavigate();
  const { signout } = useAuth();
  const user = useAuthStore((state) => state.user);

  const allowedPrimaryNavItems = getNavItemsByRole(user, primaryNavItems);
  const allowedSecondaryNavItems = getNavItemsByRole(user, secondaryNavItems);

  async function handleLogout() {
    await signout();
    navigate({ to: "/signin" });
  }

  return (
    <aside className="sticky left-0 top-0 z-40 hidden h-screen w-64 flex-col gap-2 border-r border-border/50 bg-secondary/30 px-4 py-6 md:flex">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold leading-7 text-secondary-foreground">
          Command Center
        </h1>
        <p className="text-sm leading-5 text-muted-foreground">
          University Portal
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {allowedPrimaryNavItems.map((item) => (
          <SidebarLink key={item.label} item={item} />
        ))}

        <div className="my-4 border-t border-border/50" />

        {allowedSecondaryNavItems.map((item) => (
          <SidebarLink key={item.label} item={item} />
        ))}
      </nav>

      <div className="border-t border-border/50 pt-6">
        <button
          className="flex w-full items-center gap-4 rounded-lg px-4 py-2 text-sm font-medium leading-5 text-muted-foreground transition-all duration-200 hover:translate-x-1 hover:bg-muted hover:text-foreground"
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="size-5" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon;

  return (
    <Link
      className="flex items-center gap-4 rounded-lg px-4 py-2 text-sm font-medium leading-5 transition-all duration-200"
      activeProps={{
        className:
          "rounded-r-full border-l-4 border-primary bg-primary text-primary-foreground",
      }}
      inactiveProps={{
        className:
          "text-muted-foreground hover:translate-x-1 hover:bg-muted hover:text-foreground",
      }}
      to={item.to}
    >
      <Icon className="size-5" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

/*━━Header━━━━ */

function DashboardHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const user = useAuthStore((state) => state.user);
  const allowedNavItems = getNavItemsByRole(user, navItems);

  let activeTitle =
    allowedNavItems.find((item) => item.to === pathname)?.label ?? "Overview";

  // Map dynamic event detail routes to a fixed header title.
  // Matches both `/event/:id` and `/_authenticated/event/:id`.
  const eventDetailRegex = /^\/(?:_authenticated\/)?event\/[^/]+$/;
  if (eventDetailRegex.test(pathname)) {
    activeTitle = "Event Details";
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/70 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold leading-8 text-primary">
          {activeTitle}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <button
          className="relative rounded-md p-1 text-muted-foreground transition-colors hover:text-primary"
          type="button"
        >
          <Bell className="size-5" aria-hidden="true" />
          <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-5 text-foreground">
              {user?.name}
            </p>
            <p className="text-xs leading-4 text-muted-foreground">
              {user?.user_role ? userTypeMap[user?.user_role] : ""}
            </p>
          </div>
          <div className="size-10 rounded-full border-2 border-accent overflow-hidden flex items-center justify-center bg-accent text-accent-content font-semibold">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getNameInitials(user?.name ?? "")}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/*━━Stats━━━━ */

function StatsGrid() {
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
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold leading-4 text-muted-foreground",
            stat.metaClassName,
          )}
        >
          {stat.meta}
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

/*━━Pending Events━━━━ */

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

/*━━Analytics━━━━ */

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

/*━━Mobile Nav━━━━ */

function MobileDashboardNav() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const allowedMobileNavItems = getNavItemsByRole(user, mobileNavItems);
  const canManageEvents = normalizeUserRole(user?.user_role) !== "general";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-border/60 bg-background/90 px-2 backdrop-blur-lg md:hidden">
      {allowedMobileNavItems.slice(0, 2).map((item) => (
        <MobileNavLink key={item.label} item={item} />
      ))}

      {canManageEvents ? (
        <div className="-mt-8">
          <button
            className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-90"
            onClick={() => navigate({ to: "/event/manage-events" })}
            type="button"
          >
            <Plus className="size-8" aria-hidden="true" />
            <span className="sr-only">Create event</span>
          </button>
        </div>
      ) : null}

      {allowedMobileNavItems.slice(2).map((item) => (
        <MobileNavLink key={item.label} item={item} />
      ))}
    </nav>
  );
}

function MobileNavLink({ item }: { item: NavItem }) {
  const Icon = item.icon;

  return (
    <Link
      className="flex flex-col items-center gap-1"
      activeProps={{
        className: "text-primary",
      }}
      inactiveProps={{
        className: "text-muted-foreground",
      }}
      to={item.to}
    >
      <Icon className="size-5" aria-hidden="true" />
      <span className="text-[10px] font-semibold leading-4">
        {item.label}
      </span>
    </Link>
  );
}

/*━━Reusable Components━━━━ */

function DashboardPanel({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card/70 shadow-sm backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

function IconButton({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <button
      className={cn("rounded-lg p-1 transition-colors hover:bg-muted", className)}
      title={label}
      type="button"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}