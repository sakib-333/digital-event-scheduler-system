import { CalendarDays, Code2, ShieldCheck, Users } from "lucide-react";
import type { ReactNode } from "react";

import { GlassPanel, SectionShell } from "./section-shell";

export function FeaturesSection() {
  return (
    <SectionShell id="features">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold text-[#191b23] dark:text-foreground sm:text-5xl">
          Engineered for Academic Excellence
        </h2>
        <p className="mt-4 text-base leading-7 text-[#434655] dark:text-muted-foreground">
          A suite of professional tools designed to manage every facet of
          campus event planning with pixel-perfect precision.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <GlassPanel className="p-6 transition-transform hover:-translate-y-1 md:col-span-2">
          <FeatureIcon tone="primary">
            <CalendarDays className="size-6" />
          </FeatureIcon>
          <h3 className="mt-5 text-2xl font-bold text-[#191b23] dark:text-foreground">
            Exam Scheduling Matrix
          </h3>
          <p className="mt-3 max-w-xl text-base leading-7 text-[#434655] dark:text-muted-foreground">
            Advanced conflict resolution engine that automatically assigns rooms
            and invigilators, ensuring no student has overlapping sessions.
          </p>
          <div className="mt-8 h-48 overflow-hidden rounded-xl bg-[#f3f3fe] p-4 dark:bg-muted/40">
            <div className="flex gap-3 overflow-x-auto pb-3">
              <div className="min-w-32 rounded-lg bg-[#004ac6] p-3 text-sm font-bold text-white">
                MATH-101
              </div>
              <div className="min-w-32 rounded-lg bg-[#dae2fd] p-3 text-sm font-bold text-[#5c647a]">
                CS-50 Final
              </div>
              <div className="min-w-32 rounded-lg border border-[#737686] bg-[#c3c6d7]/30 p-3 text-sm font-bold text-[#434655] dark:border-border dark:text-muted-foreground">
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

        <GlassPanel className="grid gap-8 p-6 transition-transform hover:-translate-y-1 md:col-span-2 md:grid-cols-[1fr_0.85fr] md:items-center">
          <div>
            <FeatureIcon tone="primary">
              <Users className="size-6" />
            </FeatureIcon>
            <h3 className="mt-5 text-2xl font-bold text-[#191b23] dark:text-foreground">
              Seminars & Workshops
            </h3>
            <p className="mt-3 text-base leading-7 text-[#434655] dark:text-muted-foreground">
              Interactive scheduling for guest lectures and technical workshops
              with QR-based attendance tracking.
            </p>
          </div>
          <div className="rounded-xl bg-[#ededf9] p-5 dark:bg-muted/40">
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
    <GlassPanel className="p-6 transition-transform hover:-translate-y-1">
      <FeatureIcon tone={tone}>{icon}</FeatureIcon>
      <h3 className="mt-5 text-2xl font-bold text-[#191b23] dark:text-foreground">{title}</h3>
      <p className="mt-3 text-base leading-7 text-[#434655] dark:text-muted-foreground">{description}</p>
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
    primary: "bg-[#dbe1ff] text-[#004ac6]",
    secondary: "bg-[#dae2fd] text-[#5c647a]",
    tertiary: "bg-[#ffdbcd] text-[#943700]",
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
    <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm dark:bg-card">
      <span className="text-sm font-semibold text-[#191b23] dark:text-foreground">{title}</span>
      <span
        className={`text-sm font-bold ${active ? "text-[#004ac6]" : "text-[#737686]"}`}
      >
        {status}
      </span>
    </div>
  );
}
