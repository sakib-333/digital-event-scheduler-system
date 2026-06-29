import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { TFunction } from "i18next";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Camera, Mail, Phone, Save, ShieldCheck, User } from "lucide-react";

import manageUsers from "@/api/manage-users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import type { UserType } from "@/types/user";
import { getNameInitials, isValidBDPhoneNumber, uploadImage, usePageTitle } from "@/utils";
import moment from "moment";
import { useTranslation } from "react-i18next";

/*━━ Profile route ━━━━━━ */
export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

/*━━ Default profile data ━━━━━━ */
const defaultProfile: UserType = {
  avatar: null,
  email: "",
  name: "",
  phone: "",
  uid: "",
  user_role: "general",
};

/*━━ Profile page component ━━━━━━ */
function ProfilePage() {
  usePageTitle("Profile");
  const { t } = useTranslation();
  const authUser = useAuthStore((state) => state.user);
  const setAuthUser = useAuthStore((state) => state.setUser);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [savedMessage, setSavedMessage] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormValues>({
    defaultValues: authUser ?? defaultProfile,
    mode: "onChange",
  });
  const profile = watch();
  const profileAvatar = profile.avatar;
  const profileName = profile.name;
  const profileEmail = profile.email;
  const profileRole = profile.user_role;
  const profileUid = profile.uid;
  const initials = useMemo(() => getNameInitials(profileName ?? ""), [profileName]);
  const nameField = register("name", { required: true });
  const phoneField = register("phone", {
    validate: (value) =>
      !value ||
      isValidBDPhoneNumber(value) ||
      t("routes.profile.validation.invalidPhone"),
  });

  /*━━ Sync zustand user with form ━━━━━━ */
  useEffect(() => {
    if (authUser) {
      reset(authUser);
    }
  }, [authUser, reset]);

  /*━━ Save profile method ━━━━━━ */
  const handleSave: SubmitHandler<ProfileFormValues> = async (formData) => {
    if (!formData.uid) {
      setSavedMessage(t("routes.profile.messages.noUser"));
      return;
    }

    setSavedMessage("");

    try {
      const avatarUrl = avatarFile
        ? await uploadImage(avatarFile)
        : formData.avatar;

      const updatedUser = await manageUsers.updateUser(formData.uid, {
        avatar: avatarUrl,
        name: formData.name,
        phone: formData.phone,
      });

      setAuthUser(updatedUser);
      reset(updatedUser);
      setAvatarFile(null);
      setSavedMessage(t("routes.profile.messages.saved"));
    } catch (error) {
      setSavedMessage(
        error instanceof Error
          ? error.message
          : t("routes.profile.messages.saveError"),
      );
    }
  };

  /*━━ Upload avatar preview method ━━━━━━ */
  function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setSavedMessage(t("routes.profile.messages.invalidImage"));
      return;
    }

    setAvatarFile(file);
    setValue("avatar", URL.createObjectURL(file), {
      shouldDirty: true,
      shouldTouch: true,
    });
    setSavedMessage("");
  }

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold leading-10 text-foreground">
          {t("routes.profile.title")}
        </h1>
        <p className="mt-1 text-base leading-6 text-muted-foreground">
          {t("routes.profile.description")}
        </p>
      </header>

      <form onSubmit={handleSubmit(handleSave)}>
        <Card className="border-border/70 bg-card/80 shadow-sm backdrop-blur-xl">
          <CardHeader className="border-b border-border/60">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="relative size-28 shrink-0">
                <div className="size-28 rounded-full border-4 border-accent overflow-hidden shadow-sm flex items-center justify-center bg-accent text-accent-content text-3xl font-semibold">
                  {profileAvatar ? (
                    <img
                      src={profileAvatar}
                      alt={t("routes.profile.avatarAlt", {
                        name: profileName,
                      })}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <label className="absolute bottom-1 right-1 flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95">
                  <Camera className="size-4" aria-hidden="true" />
                  <span className="sr-only">
                    {t("routes.profile.uploadAvatar")}
                  </span>
                  <Input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="sr-only"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              <div className="min-w-0">
                <CardTitle className="text-2xl font-semibold leading-8 text-foreground">
                  {profileName}
                </CardTitle>
                <CardDescription className="mt-1 text-sm leading-5">
                  {profileEmail}
                </CardDescription>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  {formatRole(profileRole, t)}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <h2 className="text-xl font-semibold leading-7 text-foreground">
                {t("routes.profile.account.title")}
              </h2>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {t("routes.profile.account.description")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ProfileField label={t("routes.profile.fields.userId")}>
                <Input
                  className="h-11 rounded-xl bg-muted"
                  readOnly
                  value={profileUid}
                />
              </ProfileField>

              <ProfileField label={t("routes.profile.fields.userType")}>
                <Input
                  className="h-11 rounded-xl bg-muted"
                  readOnly
                  value={formatRole(profileRole, t)}
                />
              </ProfileField>

              <ProfileField label={t("routes.profile.fields.name")}>
                <Input
                  className="h-11 rounded-xl bg-background"
                  {...nameField}
                  onChange={(event) => {
                    nameField.onChange(event);
                    setSavedMessage("");
                  }}
                />
              </ProfileField>

              <ProfileField label={t("routes.profile.fields.email")}>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    className="h-11 rounded-xl bg-muted pl-10"
                    readOnly
                    type="email"
                    value={profileEmail}
                  />
                </div>
              </ProfileField>

              <ProfileField label={t("routes.profile.fields.phone")}>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    aria-invalid={Boolean(errors.phone)}
                    className={cn(
                      "h-11 rounded-xl bg-background pl-10",
                      errors.phone && "border-destructive focus:border-destructive",
                    )}
                    type="tel"
                    {...phoneField}
                    onChange={(event) => {
                      phoneField.onChange(event);
                      setSavedMessage("");
                    }}
                  />
                </div>
                {errors.phone ? (
                  <p className="text-sm leading-5 text-destructive">
                    {errors.phone.message}
                  </p>
                ) : null}
              </ProfileField>

              <ProfileField label={t("routes.profile.fields.memberSince")}>
                <Input
                  className="h-11 rounded-xl bg-muted"
                  readOnly
                  value={moment(authUser?.created_at).format("YYYY-MM-DD")}
                />
              </ProfileField>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-5 text-muted-foreground">
                {savedMessage || t("routes.profile.messages.default")}
              </p>
              <Button
                className="h-11 gap-2 rounded-xl px-6"
                disabled={isSubmitting}
                type="submit"
              >
                <Save className="size-4" aria-hidden="true" />
                <span>
                  {isSubmitting
                    ? t("routes.profile.actions.saving")
                    : t("routes.profile.actions.save")}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

type ProfileFormValues = UserType;

/*━━ Format user role method ━━━━━━ */
function formatRole(role: UserType["user_role"], t: TFunction) {
  if (!role) {
    return t("routes.profile.roles.general");
  }

  return t(`routes.profile.roles.${role}`);
}

/*━━ Profile field component ━━━━━━ */
function ProfileField({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={cn("space-y-2", className)}>
      <span className="flex items-center gap-2 text-sm font-semibold leading-5 text-muted-foreground">
        <User className="size-4" aria-hidden="true" />
        {label}
      </span>
      {children}
    </label>
  );
}
