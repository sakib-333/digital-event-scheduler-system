import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Mail, Phone, Save, ShieldCheck, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

type ProfileForm = {
  avatar: string;
  createdAt: string;
  email: string;
  id: string;
  name: string;
  phone: string;
  userType: string;
};

const defaultProfile: ProfileForm = {
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAfuUlvg_Rp6fFXCpgX2NqRr-3OjD0vGTUH8zyoyIGmqVzopS_JxCYscC2FFo_9CCoUBMmLGwlep2jGM44dQ66RbixJsQRDeqxhAvMPN0k6kSSue8yEvMIX18NaPJ_wAEULxSFI9QtW1y8grRad7gXJBpVy06oTQ5SdtTkByIZgWGTgzhgdclgFKD7Bk3jcZSd9mmp_1917YX35O59zdDM-o9RQn159W0w6Kdue1Ouh0l8004A93iEx3aMrusoNX1HdVl0xJTPen-o",
  createdAt: "Jan 12, 2024",
  email: "sakib@university.edu",
  id: "USR-1001",
  name: "Sakib Ahmed",
  phone: "+880 1712 345 678",
  userType: "Admin",
};

function ProfilePage() {
  const { setUser, user } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>({
    ...defaultProfile,
    name: user?.name ?? defaultProfile.name,
    email: user?.email ?? defaultProfile.email,
  });
  const [savedMessage, setSavedMessage] = useState("");

  function updateField(field: keyof ProfileForm, value: string) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }));
    setSavedMessage("");
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUser((currentUser: any) => ({
      ...currentUser,
      avatar: profile.avatar,
      name: profile.name,
      phone: profile.phone,
    }));
    setSavedMessage("Profile changes saved.");
  }

  function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setSavedMessage("Please upload a JPG or PNG image.");
      return;
    }

    updateField("avatar", URL.createObjectURL(file));
  }

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold leading-10 text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-base leading-6 text-muted-foreground">
          Review your account details and update the editable profile fields
          used across the scheduling system.
        </p>
      </header>

      <form onSubmit={handleSave}>
        <Card className="border-border/70 bg-card/80 shadow-sm backdrop-blur-xl">
          <CardHeader className="border-b border-border/60">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="relative size-28 shrink-0">
                <img
                  alt={`${profile.name} avatar`}
                  className="size-28 rounded-full border-4 border-accent object-cover shadow-sm"
                  src={profile.avatar}
                />
                <label className="absolute bottom-1 right-1 flex size-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95">
                  <Camera className="size-4" aria-hidden="true" />
                  <span className="sr-only">Upload profile avatar</span>
                  <Input
                    accept="image/jpeg,image/png"
                    className="sr-only"
                    onChange={handleAvatarUpload}
                    type="file"
                  />
                </label>
              </div>

              <div className="min-w-0">
                <CardTitle className="text-2xl font-semibold leading-8 text-foreground">
                  {profile.name}
                </CardTitle>
                <CardDescription className="mt-1 text-sm leading-5">
                  {profile.email}
                </CardDescription>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  {profile.userType}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <h2 className="text-xl font-semibold leading-7 text-foreground">
                Account Information
              </h2>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                Name, phone, and avatar image are editable. Identity fields are
                shown for reference.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ProfileField label="User ID">
                <Input
                  className="h-11 rounded-xl bg-muted"
                  readOnly
                  value={profile.id}
                />
              </ProfileField>

              <ProfileField label="User Type">
                <Input
                  className="h-11 rounded-xl bg-muted"
                  readOnly
                  value={profile.userType}
                />
              </ProfileField>

              <ProfileField label="Name">
                <Input
                  className="h-11 rounded-xl bg-background"
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                  value={profile.name}
                />
              </ProfileField>

              <ProfileField label="Email">
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    className="h-11 rounded-xl bg-muted pl-10"
                    readOnly
                    type="email"
                    value={profile.email}
                  />
                </div>
              </ProfileField>

              <ProfileField label="Phone">
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    className="h-11 rounded-xl bg-background pl-10"
                    onChange={(event) => updateField("phone", event.target.value)}
                    type="tel"
                    value={profile.phone}
                  />
                </div>
              </ProfileField>

              <ProfileField label="Created At">
                <Input
                  className="h-11 rounded-xl bg-muted"
                  readOnly
                  value={profile.createdAt}
                />
              </ProfileField>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-5 text-muted-foreground">
                {savedMessage || "Save changes after updating editable fields."}
              </p>
              <Button className="h-11 gap-2 rounded-xl px-6" type="submit">
                <Save className="size-4" aria-hidden="true" />
                <span>Save Updated Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

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
