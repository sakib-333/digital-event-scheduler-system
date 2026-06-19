import { useMemo, useState } from "react";
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

export const Route = createFileRoute("/_authenticated/manage-users")({
  component: ManageUsersPage,
});

type UserRole = "Moderator" | "General User";
type RoleFilter = "All Roles" | UserRole;

type ManagedUser = {
  department: string;
  email: string;
  id: number;
  joinedDate: string;
  name: string;
  newThisWeek: boolean;
  role: UserRole;
};

const initialUsers: ManagedUser[] = [
  {
    department: "Computer Science",
    email: "amina.rahman@university.edu",
    id: 1,
    joinedDate: "Jan 12, 2024",
    name: "Amina Rahman",
    newThisWeek: false,
    role: "Moderator",
  },
  {
    department: "Student Affairs",
    email: "omar.farid@university.edu",
    id: 2,
    joinedDate: "Feb 03, 2024",
    name: "Omar Farid",
    newThisWeek: false,
    role: "Moderator",
  },
  {
    department: "Engineering",
    email: "nadia.khan@university.edu",
    id: 3,
    joinedDate: "Mar 18, 2024",
    name: "Nadia Khan",
    newThisWeek: false,
    role: "General User",
  },
  {
    department: "Business School",
    email: "rayhan.alam@university.edu",
    id: 4,
    joinedDate: "Jun 16, 2026",
    name: "Rayhan Alam",
    newThisWeek: true,
    role: "General User",
  },
  {
    department: "Registrar Office",
    email: "sadia.islam@university.edu",
    id: 5,
    joinedDate: "Jun 17, 2026",
    name: "Sadia Islam",
    newThisWeek: true,
    role: "Moderator",
  },
];

const roleOptions: UserRole[] = ["Moderator", "General User"];
const roleFilterOptions: RoleFilter[] = ["All Roles", ...roleOptions];

function ManageUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All Roles");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !normalizedQuery ||
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery) ||
        user.department.toLowerCase().includes(normalizedQuery);
      const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [query, roleFilter, users]);

  function updateUserRole(userId: number, role: UserRole) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, role } : user,
      ),
    );
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

      <UserStats users={users} />

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
              placeholder="Search users by name, email, or department..."
              type="search"
              value={query}
            />
          </label>

          <RoleFilterSelect value={roleFilter} onValueChange={setRoleFilter} />
        </div>
      </section>

      <UsersTable
        users={filteredUsers}
        onRoleChange={updateUserRole}
        totalUsers={users.length}
      />
    </div>
  );
}

function UserStats({ users }: { users: ManagedUser[] }) {
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
      value: users.filter((user) => user.role === "Moderator").length.toString(),
    },
    {
      icon: UserCog,
      iconClassName: "bg-secondary text-secondary-foreground",
      label: "General Users",
      value: users
        .filter((user) => user.role === "General User")
        .length.toString(),
    },
    {
      icon: UserPlus,
      iconClassName: "bg-chart-3/10 text-chart-3",
      label: "New This Week",
      value: users.filter((user) => user.newThisWeek).length.toString(),
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
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function UsersTable({
  onRoleChange,
  totalUsers,
  users,
}: {
  onRoleChange: (userId: number, role: UserRole) => void;
  totalUsers: number;
  users: ManagedUser[];
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
            {users.length > 0 ? (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  onRoleChange={onRoleChange}
                  user={user}
                />
              ))
            ) : (
              <tr>
                <td className="px-6 py-10 text-center text-sm text-muted-foreground" colSpan={4}>
                  No users match the current search and filter.
                </td>
              </tr>
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
  onRoleChange,
  user,
}: {
  onRoleChange: (userId: number, role: UserRole) => void;
  user: ManagedUser;
}) {
  return (
    <tr className="transition-colors hover:bg-muted/40">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {getInitials(user.name)}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold leading-6 text-foreground">
              {user.name}
            </span>
            <span className="text-xs leading-4 text-muted-foreground">
              {user.email}
            </span>
            <span className="text-xs leading-4 text-muted-foreground">
              {user.department}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-foreground">
        {user.joinedDate}
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end">
          <Select
            value={user.role}
            onValueChange={(nextRole) =>
              onRoleChange(user.id, nextRole as UserRole)
            }
          >
            <SelectTrigger
              aria-label={`Change role for ${user.name}`}
              className="h-10 min-w-40 rounded-xl border-border/60 bg-muted px-4 text-sm leading-5 text-foreground shadow-none"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              align="end"
              className="border border-border bg-popover text-popover-foreground"
            >
              {roleOptions.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
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
        role === "Moderator" && "bg-chart-4/10 text-chart-4",
        role === "General User" && "bg-secondary text-secondary-foreground",
      )}
    >
      {role}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
