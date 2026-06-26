import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function DashboardPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
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

export function IconButton({
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
