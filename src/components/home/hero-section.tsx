import { CalendarDays, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { GlassPanel, SectionShell } from "./section-shell";

type HeroSectionProps = {
  onGetStarted: () => void;
};

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const { t } = useTranslation();
  const sidebarItems = [
    t("home.hero.preview.sidebar.exams"),
    t("home.hero.preview.sidebar.hackathons"),
    t("home.hero.preview.sidebar.seminars"),
    t("home.hero.preview.sidebar.venues"),
  ];
  const weekdays = [
    t("home.hero.preview.weekdays.mon"),
    t("home.hero.preview.weekdays.tue"),
    t("home.hero.preview.weekdays.wed"),
    t("home.hero.preview.weekdays.thu"),
    t("home.hero.preview.weekdays.fri"),
  ];
  const stats = [
    ["128", t("home.hero.preview.stats.eventsQueued")],
    ["24", t("home.hero.preview.stats.roomConflictsSolved")],
    ["99%", t("home.hero.preview.stats.attendanceSync")],
  ];

  return (
    <SectionShell id="home" className="overflow-x-clip pb-20 pt-28 lg:pb-24 lg:pt-32">
      <div className="grid min-w-0 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <div className="relative z-10 min-w-0">
          <span className="mb-4 inline-flex rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-accent-foreground">
            {t("home.hero.eyebrow")}
          </span>
          <h1 className="max-w-3xl text-5xl font-extrabold leading-tight text-foreground sm:text-6xl lg:text-7xl">
            {t("home.hero.titlePrefix")}{" "}
            <span className="text-primary">{t("home.hero.titleHighlight")}</span>{" "}
            {t("home.hero.titleSuffix")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            {t("home.hero.description")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              onClick={onGetStarted}
              className="h-12 rounded-xl bg-primary px-7 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              {t("home.hero.cta")}
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
                    {t("home.hero.preview.title")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("home.hero.preview.subtitle")}
                  </p>
                </div>
                <div className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                  {t("home.hero.preview.live")}
                </div>
              </div>
              <div className="grid min-w-0 gap-3 lg:grid-cols-[150px_minmax(0,1fr)]">
                <aside className="hidden rounded-lg bg-card p-3 shadow-sm lg:block">
                  {sidebarItems.map((item, index) => (
                    <div
                      key={item}
                      className={`mb-2 rounded-md px-3 py-2 text-sm font-semibold ${index === 0
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground"
                        }`}
                    >
                      {item}
                    </div>
                  ))}
                </aside>
                <div className="min-w-0 rounded-lg bg-card p-4 shadow-sm">
                  <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold text-muted-foreground">
                    {weekdays.map((day) => (
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
                            {t("home.hero.preview.events.cs50")}
                          </div>
                        ) : null}
                        {index === 8 ? (
                          <div className="truncate rounded-md bg-secondary p-2 text-xs font-bold text-secondary-foreground">
                            {t("home.hero.preview.events.workshop")}
                          </div>
                        ) : null}
                        {index === 16 ? (
                          <div className="truncate rounded-md bg-chart-4/20 p-2 text-xs font-bold text-foreground">
                            {t("home.hero.preview.events.hackathon")}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {stats.map(([value, label]) => (
                  <div key={label} className="min-w-0 rounded-lg bg-card p-3 shadow-sm">
                    <div className="flex items-center gap-2 text-primary">
                      {label === t("home.hero.preview.stats.eventsQueued") ? (
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
