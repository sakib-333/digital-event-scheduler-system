import { useState } from "react";
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
  Settings,
  User,
  Users,
  X,
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

function getUserRoleLabel(role?: string | null) {
  return userTypeMap[normalizeUserRole(role)];
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

      <main className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />

        <section className="mx-auto w-full max-w-360 p-6">
          <Outlet />
        </section>
      </main>
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { signout } = useAuth();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const user = useAuthStore((state) => state.user);
  const allowedNavItems = getNavItemsByRole(user, navItems);
  const allowedPrimaryNavItems = getNavItemsByRole(user, primaryNavItems);
  const allowedSecondaryNavItems = getNavItemsByRole(user, secondaryNavItems);

  let activeTitle =
    allowedNavItems.find((item) => item.to === pathname)?.label ?? "Overview";

  const eventDetailRegex = /^\/(?:_authenticated\/)?event\/[^/]+$/;
  if (eventDetailRegex.test(pathname)) {
    activeTitle = "Event Details";
  }

  async function handleLogout() {
    await signout();
    setIsMobileSidebarOpen(false);
    navigate({ to: "/signin" });
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/70 px-6 backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-4">
          <h2 className="truncate text-2xl font-bold leading-8 text-primary">
            {activeTitle}
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <NotificationDialog />

          <div className="hidden items-center gap-2 md:flex">
            <div className="text-right">
              <p className="text-sm font-semibold leading-5 text-foreground">
                {user?.name}
              </p>
              <p className="text-xs leading-4 text-muted-foreground">
                {getUserRoleLabel(user?.user_role)}
              </p>
            </div>
            <UserAvatar user={user} />
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMobileSidebarOpen(true)}
            type="button"
            aria-label="Open dashboard navigation"
          >
            <UserAvatar user={user} />
          </button>
        </div>
      </header>

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
        primaryItems={allowedPrimaryNavItems}
        secondaryItems={allowedSecondaryNavItems}
        user={user}
      />
    </>
  );
}

function UserAvatar({ user }: { user?: DashboardUser | null }) {
  return (
    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border-2 border-accent bg-accent font-semibold text-accent-foreground">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="User Avatar"
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{getNameInitials(user?.name ?? "")}</span>
      )}
    </div>
  );
}

function MobileSidebar({
  isOpen,
  onClose,
  onLogout,
  primaryItems,
  secondaryItems,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  primaryItems: NavItem[];
  secondaryItems: NavItem[];
  user?: DashboardUser | null;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        className={`absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        type="button"
        aria-label="Close dashboard navigation"
      />

      <aside
        className={`absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col border-r border-border bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-border/60 p-5">
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-5 text-foreground">
                {user?.name}
              </p>
              <p className="text-xs leading-4 text-muted-foreground">
                {getUserRoleLabel(user?.user_role)}
              </p>
            </div>
          </div>

          <button
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={onClose}
            type="button"
            aria-label="Close dashboard navigation"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {primaryItems.map((item) => (
            <MobileSidebarLink key={item.label} item={item} onClick={onClose} />
          ))}

          <div className="my-3 border-t border-border/50" />

          {secondaryItems.map((item) => (
            <MobileSidebarLink key={item.label} item={item} onClick={onClose} />
          ))}
        </nav>

        <div className="border-t border-border/60 p-4">
          <button
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium leading-5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            onClick={onLogout}
            type="button"
          >
            <LogOut className="size-5" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

function MobileSidebarLink({
  item,
  onClick,
}: {
  item: NavItem;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <Link
      className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium leading-5 transition-colors"
      activeProps={{
        className: "bg-primary text-primary-foreground",
      }}
      inactiveProps={{
        className: "text-muted-foreground hover:bg-muted hover:text-foreground",
      }}
      onClick={onClick}
      to={item.to}
    >
      <Icon className="size-5" aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}
