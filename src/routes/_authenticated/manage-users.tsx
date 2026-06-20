import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, ShieldCheck, UserCog, UserPlus, Users } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useManageUsersStore } from "@/stores/manage-users-store";
import type { UserType } from "@/types/user";
import { formatJoinedDate, getNameInitials, isNewThisWeek } from "@/utils";

export const Route = createFileRoute("/_authenticated/manage-users")({
  component: ManageUsersPage,
});

type UserRole = NonNullable<UserType["user_role"]>;
type RoleFilter = "all" | UserRole;

const roleOptions: UserRole[] = ["moderator", "general"];
const roleFilterOptions: RoleFilter[] = ["all", "admin", ...roleOptions];

function ManageUsersPage() {
  const error = useManageUsersStore((state) => state.error);
  const getAllUsers = useManageUsersStore((state) => state.getAllUsers);
  const isLoading = useManageUsersStore((state) => state.isLoading);
  const isUpdatingRole = useManageUsersStore((state) => state.isUpdatingRole);
  const storeUsers = useManageUsersStore((state) => state.users);
  const updatingUserId = useManageUsersStore((state) => state.updatingUserId);
  const userUserRole = useManageUsersStore((state) => state.userUserRole);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return storeUsers.filter((user) => {
      const matchesSearch =
        !normalizedQuery ||
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery);
      const matchesRole =
        roleFilter === "all" || getUserRole(user) === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [query, roleFilter, storeUsers]);

  function updateUserRole(userId: string, role: UserRole) {
    userUserRole(userId, role);
  }

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold leading-10 text-foreground">
          Manage Users
        </h1>
        <p className="mt-1 text-base leading-6 text-muted-foreground">
          Review institutional accounts, search by user details, filter by role,
          and update access between admin, moderator, and general user roles.
        </p>
      </header>

      <UserStats users={storeUsers} />

      <section className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col items-center gap-4 lg:flex-row">
          <label className="relative w-full lg:flex-1">
            <Search
              className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="sr-only">Search users</span>
            <input
              className="h-10 w-full rounded-xl border border-border/60 bg-muted pl-10 pr-4 text-sm leading-5 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search users by name or email..."
              type="search"
              value={query}
            />
          </label>

          <RoleFilterSelect value={roleFilter} onValueChange={setRoleFilter} />
        </div>
      </section>

      <UsersTable
        error={error}
        isLoading={isLoading}
        isUpdatingRole={isUpdatingRole}
        users={filteredUsers}
        onRoleChange={updateUserRole}
        totalUsers={storeUsers.length}
        updatingUserId={updatingUserId}
      />
    </div>
  );
}

function UserStats({ users }: { users: UserType[] }) {
  console.log(users)
  const cards = [
    {
      icon: Users,
      iconClassName: "bg-primary/10 text-primary",
      label: "Total Users",
      value: users.length.toString(),
    },
    {
      icon: ShieldCheck,
      iconClassName: "bg-chart-4/10 text-chart-4",
      label: "Moderators",
      value: users
        .filter((user) => getUserRole(user) === "moderator")
        .length.toString(),
    },
    {
      icon: UserCog,
      iconClassName: "bg-secondary text-secondary-foreground",
      label: "General Users",
      value: users
        .filter((user) => getUserRole(user) === "general")
        .length.toString(),
    },
    {
      icon: UserPlus,
      iconClassName: "bg-chart-3/10 text-chart-3",
      label: "New This Week",
      value: users.filter((user) => isNewThisWeek(user.created_at)).length.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <section
            className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-xl"
            key={card.label}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className={cn("rounded-lg p-2", card.iconClassName)}>
                <Icon className="size-5" aria-hidden="true" />
              </span>
            </div>
            <p className="text-sm leading-5 text-muted-foreground">
              {card.label}
            </p>
            <h2 className="mt-1 text-3xl font-semibold leading-10 text-foreground">
              {card.value}
            </h2>
          </section>
        );
      })}
    </div>
  );
}

function RoleFilterSelect({
  onValueChange,
  value,
}: {
  onValueChange: (value: RoleFilter) => void;
  value: RoleFilter;
}) {
  return (
    <div className="flex w-full items-center gap-2 sm:w-auto">
      <span
        className="text-xs font-semibold leading-4 text-muted-foreground"
        id="role-filter-label"
      >
        Role
      </span>
      <Select
        value={value}
        onValueChange={(nextValue) => onValueChange(nextValue as RoleFilter)}
      >
        <SelectTrigger
          aria-labelledby="role-filter-label"
          className="h-10 min-w-40 flex-1 rounded-xl border-border/60 bg-muted px-4 text-sm leading-5 text-foreground shadow-none sm:flex-none"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          align="start"
          className="border border-border bg-popover text-popover-foreground"
        >
          {roleFilterOptions.map((role) => (
            <SelectItem key={role} value={role}>
              {role === "all" ? "All Roles" : getRoleLabel(role)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function UsersTable({
  error,
  isLoading,
  isUpdatingRole,
  onRoleChange,
  totalUsers,
  updatingUserId,
  users,
}: {
  error: string | null;
  isLoading: boolean;
  isUpdatingRole: boolean;
  onRoleChange: (userId: string, role: UserRole) => void;
  totalUsers: number;
  updatingUserId: string | null;
  users: UserType[];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border/60 bg-muted/60">
              {["User", "Role", "Joined Date", "Action"].map((heading) => (
                <th
                  className={cn(
                    "px-6 py-4 text-sm font-medium leading-5 text-muted-foreground",
                    heading === "Action" && "text-right",
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
              <TableMessage message="Loading users..." />
            ) : error ? (
              <TableMessage message={error} />
            ) : users.length > 0 ? (
              users.map((user) => (
                <UserRow
                  isUpdating={isUpdatingRole && updatingUserId === user.uid}
                  key={user.uid}
                  onRoleChange={onRoleChange}
                  user={user}
                />
              ))
            ) : (
              <TableMessage message="No users match the current search and filter." />
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-border/60 bg-muted/30 px-6 py-4 sm:flex-row">
        <p className="text-xs font-semibold leading-4 text-muted-foreground">
          Showing <span className="text-foreground">{users.length}</span> of{" "}
          <span className="text-foreground">{totalUsers}</span> users
        </p>
      </div>
    </section>
  );
}

function UserRow({
  isUpdating,
  onRoleChange,
  user,
}: {
  isUpdating: boolean;
  onRoleChange: (userId: string, role: UserRole) => void;
  user: UserType;
}) {
  const role = getUserRole(user);

  return (
    <tr className="transition-colors hover:bg-muted/40">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.name} avatar`}
                className="size-full object-cover"
              />
            ) : (
              getNameInitials(user?.name ?? "")
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold leading-6 text-foreground">
              {user.name}
            </span>
            <span className="text-xs leading-4 text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <RoleBadge role={role} />
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-foreground">
        {formatJoinedDate(user.created_at)}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end">
          <Select
            disabled={isUpdating}
            value={role}
            onValueChange={(nextRole) => onRoleChange(user.uid, nextRole as UserRole)}
          >
            <SelectTrigger
              aria-label={`Change role for ${user.name}`}
              className="h-10 min-w-40 rounded-xl border-border/60 bg-muted px-4 text-sm leading-5 text-foreground shadow-none"
              disabled={role === "admin"}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="border border-border bg-popover text-popover-foreground"
            >
              {roleOptions.map((role) => (
                <SelectItem key={role} value={role} disabled={role === "admin"}>
                  {getRoleLabel(role)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </td>
    </tr>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-1 text-xs font-bold uppercase leading-4",
        role === "admin" && "bg-primary/10 text-primary",
        role === "moderator" && "bg-chart-4/10 text-chart-4",
        role === "general" && "bg-secondary text-secondary-foreground",
      )}
    >
      {getRoleLabel(role)}
    </span>
  );
}

function TableMessage({ message }: { message: string }) {
  return (
    <tr>
      <td className="px-6 py-10 text-center text-sm text-muted-foreground" colSpan={4}>
        {message}
      </td>
    </tr>
  );
}

function getUserRole(user: UserType): UserRole {
  return user.user_role ?? "general";
}

function getRoleLabel(role: UserRole) {
  const labels: Record<UserRole, string> = {
    admin: "Admin",
    general: "General User",
    moderator: "Moderator",
  };

  return labels[role];
}
