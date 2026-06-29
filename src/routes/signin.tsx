import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { usePageTitle } from "@/utils";

export const Route = createFileRoute("/signin")({
  component: SigninPage,
});

function SigninPage() {
  usePageTitle("Signin");
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
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
      setErrorMessage(getAuthErrorMessage(error, t("auth.signin.error")));
    }
  };

  async function handleGoogleSignIn() {
    setErrorMessage("");

    try {
      await signInWithGoogle();
      navigate({ to: "/dashboard" });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error, t("auth.signin.error")));
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
              {t("auth.brand")}
            </h1>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {t("auth.signin.subtitle")}
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
                {t("auth.form.email.label")}
              </label>
              <input
                className="h-10 w-full rounded-lg border border-input bg-background px-4 text-base leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/50"
                id="email"
                placeholder={t("auth.form.email.placeholder")}
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
                  {t("auth.form.password.label")}
                </label>
                <a
                  className="text-xs font-semibold leading-4 text-primary underline-offset-4 transition-colors hover:underline"
                  href="#"
                >
                  {t("auth.signin.forgotPassword")}
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
                <span>
                  {isSubmitting
                    ? t("auth.signin.submitting")
                    : t("auth.signin.submit")}
                </span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>

              <div className="flex items-center py-2">
                <div className="h-px flex-1 bg-border/50" />
                <span className="mx-4 text-xs font-semibold leading-4 text-muted-foreground">
                  {t("auth.divider")}
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
                <span>{t("auth.signin.google")}</span>
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm leading-5 text-muted-foreground">
              {t("auth.signin.signupPrompt")}{" "}
              <Link
                className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
                to="/signup"
              >
                {t("auth.signin.signupLink")}
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

function getAuthErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
