import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export const Route = createFileRoute("/signin")({
  component: SigninPage,
});

function SigninPage() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm<SigninFormValues>();

  const handleEmailSignIn: SubmitHandler<SigninFormValues> = async ({
    email,
    password,
  }) => {
    setErrorMessage("");

    try {
      await signInWithEmail(email, password);
      navigate({ to: "/dashboard" });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    }
  };

  async function handleGoogleSignIn() {
    setErrorMessage("");

    try {
      await signInWithGoogle();
      navigate({ to: "/dashboard" });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    }
  }

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
            onSubmit={handleSubmit(handleEmailSignIn)}
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
                placeholder="name@university.edu"
                type="email"
                {...register("email", { required: true })}
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
                placeholder="********"
                type="password"
                {...register("password", { required: true })}
              />
            </div>

            <div className="space-y-4 pt-2">
              {errorMessage ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-5 text-destructive">
                  {errorMessage}
                </p>
              ) : null}

              <Button
                className="h-10 w-full gap-2 rounded-lg shadow-md hover:shadow-lg active:scale-[0.98]"
                disabled={isSubmitting}
                type="submit"
              >
                <span>{isSubmitting ? "Signing in..." : "Sign In"}</span>
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
                disabled={isSubmitting}
                onClick={handleGoogleSignIn}
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
              <Link
                className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
                to="/signup"
              >
                Signup
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

type SigninFormValues = {
  email: string;
  password: string;
};

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to sign in. Please try again.";
}
