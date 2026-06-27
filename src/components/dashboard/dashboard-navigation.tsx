import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Clock,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  User,
  Users,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { useAuthStore } from "@/stores/auth-store";
import { getNameInitials, userTypeMap } from "@/utils";
import NotificationDialog from "../notifiction-daloag";

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
  allowedRoles: UserRole[];
};

const ALL_ROLES: UserRole[] = ["admin", "moderator", "general"];

function normalizeUserRole(role?: string | null): UserRole {
  if (role === "admin" || role === "moderator" || role === "general") {
    return role;
  }

  return "general";
}

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
    icon: Clock,
    label: "Calendar",
    to: "/calendar",
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

export function getNavItemsByRole(
  user?: DashboardUser | null,
  items: NavItem[] = navItems,
) {
  const role = normalizeUserRole(user?.user_role);

  return items.filter((item) => item.allowedRoles.includes(role));
}

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

function DashboardHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const user = useAuthStore((state) => state.user);
  const allowedNavItems = getNavItemsByRole(user, navItems);

  let activeTitle =
    allowedNavItems.find((item) => item.to === pathname)?.label ?? "Overview";

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
        <NotificationDialog />

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
