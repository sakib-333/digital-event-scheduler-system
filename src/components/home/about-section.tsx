import { useTranslation } from "react-i18next";

import { SectionShell } from "./section-shell";

export function AboutSection() {
  const { t } = useTranslation();
  const stats = [
    { value: "98%", label: t("home.about.stats.efficiency") },
    { value: "500+", label: t("home.about.stats.institutions") },
  ];

  return (
    <SectionShell id="about" className="bg-card py-16 transition-colors dark:bg-card/40 lg:py-24">
      <div className="grid min-w-0 items-center gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
            alt={t("home.about.imageAlt")}
            className="aspect-video h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl">
            {t("home.about.title")}
          </h2>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            {t("home.about.descriptionOne")}
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {t("home.about.descriptionTwo")}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="text-5xl font-extrabold text-primary">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
