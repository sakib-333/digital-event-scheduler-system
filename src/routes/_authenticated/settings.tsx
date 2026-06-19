import { createFileRoute } from "@tanstack/react-router";
import { Languages } from "lucide-react";

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

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold leading-10 text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-base leading-6 text-muted-foreground">
          Configure account preferences for the dashboard experience.
        </p>
      </header>

      <Card className="max-w-2xl border-border/70 bg-card/80 shadow-sm backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="rounded-lg bg-primary/10 p-2 text-primary">
              <Languages className="size-5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle className="text-xl font-semibold leading-7 text-foreground">
                Language
              </CardTitle>
              <CardDescription>
                Choose your preferred interface language.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm space-y-2">
            <label
              className="text-sm font-semibold leading-5 text-muted-foreground"
              id="language-select-label"
            >
              Display Language
            </label>
            <Select defaultValue="english">
              <SelectTrigger
                aria-labelledby="language-select-label"
                className="h-11 w-full rounded-xl border-border/60 bg-muted px-4 text-sm leading-5 text-foreground shadow-none"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                align="start"
                className="border border-border bg-popover text-popover-foreground"
              >
                <SelectItem value="bangla">Bangla</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
