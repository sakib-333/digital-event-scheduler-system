import { createFileRoute } from "@tanstack/react-router";
import { Check, Globe2, Languages, MonitorCog } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePageTitle } from "@/utils";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

const languageOptions = [
  {
    value: "en",
    nativeLabel: "English",
    region: "United States",
  },
  {
    value: "bn",
    nativeLabel: "বাংলা",
    region: "Bangladesh",
  },
] as const;

function SettingsPage() {
  usePageTitle("Settings");
  const { i18n, t } = useTranslation();
  const currentLanguageCode = i18n.resolvedLanguage?.split("-")[0] ?? "en";
  const currentLanguage = languageOptions.some(
    (language) => language.value === currentLanguageCode,
  )
    ? currentLanguageCode
    : "en";
  const selectedLanguage =
    languageOptions.find((language) => language.value === currentLanguage) ??
    languageOptions[0];

  function handleLanguageChange(language: string | null) {
    if (!language) {
      return;
    }

    void i18n.changeLanguage(language);
  }

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-lg border border-border/70 bg-card/80 shadow-sm backdrop-blur-xl">
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Badge
              variant="secondary"
              className="mb-4 gap-2 rounded-md px-3 py-1 text-sm font-semibold"
            >
              <MonitorCog className="size-4" aria-hidden="true" />
              {t("settings.badge")}
            </Badge>
            <h1 className="text-3xl font-semibold leading-10 text-foreground">
              {t("settings.title")}
            </h1>
            <p className="mt-2 text-base leading-7 text-muted-foreground">
              {t("settings.description")}
            </p>
          </div>

          <div className="grid min-w-52 gap-2 rounded-lg border border-border/70 bg-background/70 p-4">
            <span className="text-sm font-semibold text-muted-foreground">
              {t("settings.activeLanguage")}
            </span>
            <span className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Globe2 className="size-5 text-primary" aria-hidden="true" />
              {selectedLanguage.nativeLabel}
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card className="border-border/70 bg-card/80 shadow-sm backdrop-blur-xl">
          <CardHeader className="border-b border-border/60">
            <div className="flex items-start gap-3">
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <Languages className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <CardTitle className="text-xl font-semibold leading-7 text-foreground">
                  {t("settings.language.title")}
                </CardTitle>
                <CardDescription className="mt-1 leading-6">
                  {t("settings.language.description")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-2">
              <label
                className="text-sm font-semibold leading-5 text-muted-foreground"
                id="language-select-label"
              >
                {t("settings.language.displayLabel")}
              </label>
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger
                  aria-labelledby="language-select-label"
                  className="h-11 w-full max-w-md rounded-md border-border/70 bg-background px-4 text-sm leading-5 text-foreground shadow-none"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  align="start"
                  className="border border-border bg-popover text-popover-foreground"
                >
                  {languageOptions.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.nativeLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {languageOptions.map((language) => {
                const isSelected = language.value === currentLanguage;

                return (
                  <div
                    className="rounded-lg border border-border/70 bg-background/70 p-4"
                    key={language.value}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-semibold leading-6 text-foreground">
                          {language.nativeLabel}
                        </h2>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          {t(`settings.language.region.${language.value}`)}
                        </p>
                      </div>
                      {isSelected ? (
                        <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                          <Check className="size-4" aria-hidden="true" />
                          <span className="sr-only">
                            {t("settings.language.selected")}
                          </span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/80 shadow-sm backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold leading-7 text-foreground">
              {t("settings.summary.title")}
            </CardTitle>
            <CardDescription className="leading-6">
              {t("settings.summary.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
                <dt className="text-sm font-semibold text-muted-foreground">
                  {t("settings.summary.language")}
                </dt>
                <dd className="text-sm font-semibold text-foreground">
                  {selectedLanguage.nativeLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm font-semibold text-muted-foreground">
                  {t("settings.summary.storage")}
                </dt>
                <dd className="text-sm font-semibold text-foreground">
                  {t("settings.summary.localBrowser")}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
