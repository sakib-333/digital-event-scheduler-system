import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, HelpCircle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signin")({
  component: SigninPage,
});

function SigninPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-110 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <section className="rounded-xl border border-border bg-card/80 p-8 text-card-foreground shadow-sm backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <CalendarCheck className="size-7" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-semibold leading-8 text-foreground">
              Digital Event Scheduler System
            </h1>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Access your university scheduling portal
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="group space-y-1">
              <label
                className="block text-sm font-medium leading-5 text-muted-foreground transition-colors group-focus-within:text-primary"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="h-10 w-full rounded-lg border border-input bg-background px-4 text-base leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
                id="email"
                name="email"
                placeholder="name@university.edu"
                required
                type="email"
              />
            </div>

            <div className="group space-y-1">
              <div className="flex items-center justify-between gap-4">
                <label
                  className="block text-sm font-medium leading-5 text-muted-foreground transition-colors group-focus-within:text-primary"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="text-xs font-semibold leading-4 text-primary underline-offset-4 transition-colors hover:underline"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              <input
                className="h-10 w-full rounded-lg border border-input bg-background px-4 text-base leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
                id="password"
                name="password"
                placeholder="********"
                required
                type="password"
              />
            </div>

            <div className="space-y-4 pt-2">
              <Button
                className="h-10 w-full gap-2 rounded-lg shadow-md hover:shadow-lg active:scale-[0.98]"
                type="submit"
              >
                <span>Sign In</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>

              <div className="flex items-center py-2">
                <div className="h-px flex-1 bg-border/50" />
                <span className="mx-4 text-xs font-semibold leading-4 text-muted-foreground">
                  OR
                </span>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              <Button
                className="h-10 w-full gap-2 rounded-lg active:scale-[0.98]"
                type="button"
                variant="outline"
              >
                <span
                  className="flex size-5 items-center justify-center rounded-full border border-current text-xs font-bold"
                  aria-hidden="true"
                >
                  G
                </span>
                <span>Sign in with Google</span>
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm leading-5 text-muted-foreground">
              New to the platform?{" "}
              <a
                className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
                href="#"
              >
                Register
              </a>
            </p>
          </div>
        </section>

        <div className="mt-6 flex justify-center gap-6">
          <a
            className="inline-flex items-center gap-1 text-xs font-semibold leading-4 text-muted-foreground transition-colors hover:text-primary"
            href="#"
          >
            <HelpCircle className="size-4" aria-hidden="true" />
            <span>Need Help?</span>
          </a>
          <a
            className="inline-flex items-center gap-1 text-xs font-semibold leading-4 text-muted-foreground transition-colors hover:text-primary"
            href="#"
          >
            <ShieldCheck className="size-4" aria-hidden="true" />
            <span>Privacy Policy</span>
          </a>
        </div>
      </div>
    </main>
  );
}
