import { CalendarDays, Code2, ShieldCheck, Users } from "lucide-react";
import type { ReactNode } from "react";

import { GlassPanel, SectionShell } from "./section-shell";

export function FeaturesSection() {
  return (
    <SectionShell id="features">
      <div className="mx-auto mb-12 max-w-3xl min-w-0 text-center">
        <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl">
          Engineered for Academic Excellence
        </h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          A suite of professional tools designed to manage every facet of
          campus event planning with pixel-perfect precision.
        </p>
      </div>

      <div className="grid min-w-0 gap-6 md:grid-cols-3">
        <GlassPanel className="min-w-0 p-6 transition-transform hover:-translate-y-1 md:col-span-2">
          <FeatureIcon tone="primary">
            <CalendarDays className="size-6" />
          </FeatureIcon>
          <h3 className="mt-5 text-2xl font-bold text-foreground">
            Exam Scheduling Matrix
          </h3>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Advanced conflict resolution engine that automatically assigns rooms
            and invigilators, ensuring no student has overlapping sessions.
          </p>
          <div className="mt-8 h-48 min-w-0 overflow-hidden rounded-xl bg-muted p-4 dark:bg-muted/40">
            <div className="flex gap-3 overflow-x-auto pb-3">
              <div className="min-w-32 rounded-lg bg-primary p-3 text-sm font-bold text-primary-foreground">
                MATH-101
              </div>
              <div className="min-w-32 rounded-lg bg-secondary p-3 text-sm font-bold text-muted-foreground">
                CS-50 Final
              </div>
              <div className="min-w-32 rounded-lg border border-muted-foreground bg-border/30 p-3 text-sm font-bold text-muted-foreground dark:border-border">
                Room A-12
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {Array.from({ length: 8 }, (_, index) => (
                <div
                  key={index}
                  className="h-16 rounded-lg bg-white/80 shadow-sm dark:bg-card/80"
                />
              ))}
            </div>
          </div>
        </GlassPanel>

        <FeatureCard
          icon={<Code2 className="size-6" />}
          title="Hackathon Hub"
          description="Dedicated pipeline for technical events, including registration management and mentor matching."
          tone="tertiary"
        />

        <FeatureCard
          icon={<ShieldCheck className="size-6" />}
          title="Admin Approvals"
          description="Multi-tier workflow for facility management, security, and departmental approval chains."
          tone="secondary"
        />

        <GlassPanel className="grid min-w-0 gap-8 p-6 transition-transform hover:-translate-y-1 md:col-span-2 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:items-center">
          <div className="min-w-0">
            <FeatureIcon tone="primary">
              <Users className="size-6" />
            </FeatureIcon>
            <h3 className="mt-5 text-2xl font-bold text-foreground">
              Seminars & Workshops
            </h3>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Interactive scheduling for guest lectures and technical workshops
              with QR-based attendance tracking.
            </p>
          </div>
          <div className="min-w-0 rounded-xl bg-muted p-5 dark:bg-muted/40">
            <div className="space-y-3">
              <EventRow title="AI Ethics Workshop" status="Live" active />
              <EventRow title="Bio-Tech Seminar" status="Pending" />
              <EventRow title="Cloud Systems Lab" status="Review" />
            </div>
          </div>
        </GlassPanel>
      </div>
    </SectionShell>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone: "primary" | "secondary" | "tertiary";
}) {
  return (
    <GlassPanel className="min-w-0 p-6 transition-transform hover:-translate-y-1">
      <FeatureIcon tone={tone}>{icon}</FeatureIcon>
      <h3 className="mt-5 text-2xl font-bold text-foreground">{title}</h3>
      <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
    </GlassPanel>
  );
}

function FeatureIcon({
  tone,
  children,
}: {
  tone: "primary" | "secondary" | "tertiary";
  children: ReactNode;
}) {
  const toneClass = {
    primary: "bg-accent text-accent-foreground",
    secondary: "bg-secondary text-muted-foreground",
    tertiary: "bg-chart-4/20 text-foreground",
  }[tone];

  return (
    <div
      className={`flex size-12 items-center justify-center rounded-xl ${toneClass}`}
    >
      {children}
    </div>
  );
}

function EventRow({
  title,
  status,
  active = false,
}: {
  title: string;
  status: string;
  active?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg bg-card px-4 py-3 shadow-sm">
      <span className="min-w-0 truncate text-sm font-semibold text-foreground">{title}</span>
      <span
        className={`shrink-0 text-sm font-bold ${active ? "text-primary" : "text-muted-foreground"}`}
      >
        {status}
      </span>
    </div>
  );
}
