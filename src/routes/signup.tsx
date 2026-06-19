import { useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="w-full max-w-110 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <CalendarDays className="size-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold leading-8 text-foreground">
            Digital Event Scheduler System
          </h1>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Create your institutional account
          </p>
        </div>

        <section className="rounded-xl border border-border bg-card/85 p-8 text-card-foreground shadow-sm backdrop-blur-xl transition-shadow duration-300 focus-within:shadow-lg hover:shadow-md">
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => event.preventDefault()}
          >
            <SignupField
              autoComplete="email"
              icon={<Mail className="size-5" aria-hidden="true" />}
              id="email"
              label="Email Address"
              name="email"
              placeholder="name@university.edu"
              type="email"
            />

            <SignupField
              autoComplete="new-password"
              icon={<Lock className="size-5" aria-hidden="true" />}
              id="password"
              label="Password"
              name="password"
              placeholder="Min. 8 characters"
              type={showPassword ? "text" : "password"}
              endControl={
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword((visible) => !visible)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" aria-hidden="true" />
                  ) : (
                    <Eye className="size-5" aria-hidden="true" />
                  )}
                </button>
              }
              inputClassName="pr-11"
            />

            <SignupField
              autoComplete="new-password"
              icon={<ShieldCheck className="size-5" aria-hidden="true" />}
              id="confirm-password"
              label="Confirm Password"
              name="confirm-password"
              placeholder="Repeat your password"
              type="password"
            />

            <Button
              className="mt-2 h-10 w-full rounded-lg font-bold shadow-sm active:scale-[0.98]"
              type="submit"
            >
              Create Account
            </Button>

            <div className="my-1 flex items-center gap-4">
              <div className="h-px flex-1 bg-border/50" />
              <span className="text-sm font-medium leading-5 text-muted-foreground">
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
              <span>Sign up with Google</span>
            </Button>
          </form>
        </section>

        <p className="mt-8 text-center text-sm leading-5 text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="font-bold text-primary underline-offset-4 transition-colors hover:underline"
            to="/signin"
          >
            Signin
          </Link>
        </p>
      </div>

      <footer className="pointer-events-none fixed inset-x-0 bottom-0 px-4 py-4 text-center text-sm leading-5 text-muted-foreground opacity-70">
        Copyright 2024 Digital Event Scheduler System. University Infrastructure
        Division.
      </footer>
    </main>
  );
}

type SignupFieldProps = {
  autoComplete: string;
  endControl?: ReactNode;
  icon: ReactNode;
  id: string;
  inputClassName?: string;
  label: string;
  name: string;
  placeholder: string;
  type: string;
};

function SignupField({
  autoComplete,
  endControl,
  icon,
  id,
  inputClassName = "",
  label,
  name,
  placeholder,
  type,
}: SignupFieldProps) {
  return (
    <div className="group flex flex-col gap-1">
      <label
        className="px-1 text-sm font-medium leading-5 text-muted-foreground transition-colors group-focus-within:text-primary"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
          {icon}
        </div>
        <input
          autoComplete={autoComplete}
          className={`h-10 w-full rounded-lg border border-input bg-background py-2 pl-11 pr-4 text-base leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50 ${inputClassName}`}
          id={id}
          name={name}
          placeholder={placeholder}
          required
          type={type}
        />
        {endControl}
      </div>
    </div>
  );
}
