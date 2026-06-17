import { CalendarDays, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassPanel, SectionShell } from "./section-shell";

type HeroSectionProps = {
  onGetStarted: () => void;
};

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <SectionShell id="home" className="pb-20 pt-28 lg:pb-24 lg:pt-32">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
        <div className="relative z-10">
          <span className="mb-4 inline-flex rounded-full bg-[#dbe1ff] px-4 py-1.5 text-sm font-semibold text-[#004ac6]">
            Digital Event Scheduler System
          </span>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight text-[#191b23] dark:text-foreground sm:text-6xl lg:text-7xl">
            Streamlining{" "}
            <span className="text-[#004ac6]">University Events</span> with
            Precision.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#434655] dark:text-muted-foreground">
            The all-in-one command center for campus administration. Orchestrate
            exams, hackathons, and workshops through an intuitive,
            institutional-grade platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              onClick={onGetStarted}
              className="h-12 rounded-xl bg-[#004ac6] px-7 text-base font-bold text-white shadow-lg hover:bg-[#003ea8]"
            >
              Get Started Free
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#004ac6]/10 blur-3xl" />
          <GlassPanel className="relative overflow-hidden p-2 shadow-2xl transition-transform duration-500 lg:rotate-2 lg:hover:rotate-0">
            <div className="rounded-xl bg-[#f8faff] p-4 shadow-inner dark:bg-muted/30">
              <div className="mb-4 flex items-center justify-between border-b border-[#c3c6d7]/50 pb-4 dark:border-border">
                <div>
                  <p className="text-sm font-bold text-[#191b23] dark:text-foreground">
                    Campus Operations
                  </p>
                  <p className="text-xs text-[#737686]">April event matrix</p>
                </div>
                <div className="rounded-full bg-[#dbe1ff] px-3 py-1 text-xs font-bold text-[#004ac6]">
                  Live
                </div>
              </div>
              <div className="grid gap-3 lg:grid-cols-[150px_1fr]">
                <aside className="hidden rounded-lg bg-white p-3 shadow-sm dark:bg-card lg:block">
                  {["Exams", "Hackathons", "Seminars", "Venues"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className={`mb-2 rounded-md px-3 py-2 text-sm font-semibold ${index === 0
                            ? "bg-[#dbe1ff] text-[#004ac6]"
                            : "text-[#5c647a] dark:text-muted-foreground"
                          }`}
                      >
                        {item}
                      </div>
                    ),
                  )}
                </aside>
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-card">
                  <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold text-[#737686]">
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                      <span key={day}>{day}</span>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-5 gap-2">
                    {Array.from({ length: 20 }, (_, index) => (
                      <div
                        key={index}
                        className="min-h-16 rounded-lg border border-[#e1e2ed] bg-[#faf8ff] p-2 dark:border-border dark:bg-background"
                      >
                        {index === 2 ? (
                          <div className="rounded-md bg-[#004ac6] p-2 text-xs font-bold text-white">
                            CS-50
                          </div>
                        ) : null}
                        {index === 8 ? (
                          <div className="rounded-md bg-[#dae2fd] p-2 text-xs font-bold text-[#5c647a]">
                            Workshop
                          </div>
                        ) : null}
                        {index === 16 ? (
                          <div className="rounded-md bg-[#ffdbcd] p-2 text-xs font-bold text-[#7d2d00]">
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
                  <div key={label} className="rounded-lg bg-white p-3 shadow-sm dark:bg-card">
                    <div className="flex items-center gap-2 text-[#004ac6]">
                      {label === "Events queued" ? (
                        <CalendarDays className="size-4" />
                      ) : (
                        <CheckCircle2 className="size-4" />
                      )}
                      <span className="text-lg font-extrabold">{value}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#737686]">{label}</p>
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
