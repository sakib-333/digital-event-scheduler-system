import { CalendarDays, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassPanel, SectionShell } from "./section-shell";

type HeroSectionProps = {
  onGetStarted: () => void;
};

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <SectionShell id="home" className="overflow-x-clip pb-20 pt-28 lg:pb-24 lg:pt-32">
      <div className="grid min-w-0 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <div className="relative z-10 min-w-0">
          <span className="mb-4 inline-flex rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            Digital Event Scheduler System
          </span>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight text-foreground sm:text-6xl lg:text-7xl">
            Streamlining{" "}
            <span className="text-primary">University Events</span> with
            Precision.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            The all-in-one command center for campus administration. Orchestrate
            exams, hackathons, and workshops through an intuitive,
            institutional-grade platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              onClick={onGetStarted}
              className="h-12 rounded-xl bg-primary px-7 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              Get Started Free
            </Button>
          </div>
        </div>

        <div className="relative min-w-0">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <GlassPanel className="relative overflow-hidden p-2 shadow-2xl transition-transform duration-500 lg:rotate-2 lg:hover:rotate-0">
            <div className="rounded-xl bg-background p-4 shadow-inner dark:bg-muted/30">
              <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <p className="text-sm font-bold text-foreground">
                    Campus Operations
                  </p>
                  <p className="text-xs text-muted-foreground">April event matrix</p>
                </div>
                <div className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  Live
                </div>
              </div>
              <div className="grid min-w-0 gap-3 lg:grid-cols-[150px_minmax(0,1fr)]">
                <aside className="hidden rounded-lg bg-card p-3 shadow-sm lg:block">
                  {["Exams", "Hackathons", "Seminars", "Venues"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className={`mb-2 rounded-md px-3 py-2 text-sm font-semibold ${index === 0
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                          }`}
                      >
                        {item}
                      </div>
                    ),
                  )}
                </aside>
                <div className="min-w-0 rounded-lg bg-card p-4 shadow-sm">
                  <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold text-muted-foreground">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {Array.from({ length: 20 }, (_, index) => (
                      <div
                        key={index}
                        className="min-h-16 min-w-0 rounded-lg border border-border bg-background p-2"
                      >
                        {index === 2 ? (
                          <div className="truncate rounded-md bg-primary p-2 text-xs font-bold text-primary-foreground">
                            CS-50
                          </div>
                        ) : null}
                        {index === 8 ? (
                          <div className="truncate rounded-md bg-secondary p-2 text-xs font-bold text-secondary-foreground">
                            Workshop
                          </div>
                        ) : null}
                        {index === 16 ? (
                          <div className="truncate rounded-md bg-chart-4/20 p-2 text-xs font-bold text-foreground">
                            Hackathon
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  ["128", "Events queued"],
                  ["24", "Room conflicts solved"],
                  ["99%", "Attendance sync"],
                ].map(([value, label]) => (
                  <div key={label} className="min-w-0 rounded-lg bg-card p-3 shadow-sm">
                    <div className="flex items-center gap-2 text-primary">
                      {label === "Events queued" ? (
                        <CalendarDays className="size-4" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                      <span className="text-lg font-extrabold">{value}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </SectionShell>
  );
}
