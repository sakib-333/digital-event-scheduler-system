import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionShellProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export function SectionShell({ id, className, children }: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn("px-4 py-16 sm:px-6 lg:px-12 lg:py-24", className)}
    >
      <div className="mx-auto max-w-360">{children}</div>
    </section>
  );
}

export function GlassPanel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-xl transition-colors dark:bg-card/80",
        className,
      )}
    >
      {children}
    </div>
  );
}
