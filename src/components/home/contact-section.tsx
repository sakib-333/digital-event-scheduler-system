import emailjs from "@emailjs/browser";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm, type UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GlassPanel, SectionShell } from "./section-shell";

type ContactFormValues = {
  firstName: string;
  lastName: string;
  universityEmail: string;
  message: string;
};

const emailServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const emailTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const emailPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export function ContactSection() {
  const { t } = useTranslation();
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ContactFormValues>();
  const contactMethods = [
    {
      icon: <Mail className="size-5" />,
      title: t("home.contact.methods.email.title"),
      detail: "support@dess-university.edu",
    },
    {
      icon: <Phone className="size-5" />,
      title: t("home.contact.methods.phone.title"),
      detail: "+1 (555) 123-4567",
    },
    {
      icon: <MapPin className="size-5" />,
      title: t("home.contact.methods.address.title"),
      detail: t("home.contact.methods.address.detail"),
    },
  ];

  async function onSubmit(data: ContactFormValues) {
    if (!emailServiceId || !emailTemplateId || !emailPublicKey) {
      toast.error(t("home.contact.toast.notConfigured"));
      return;
    }

    try {
      const firstName = data.firstName.trim();
      const lastName = data.lastName.trim();
      const universityEmail = data.universityEmail.trim();
      const message = data.message.trim();
      const fullName = [firstName, lastName].filter(Boolean).join(" ");

      await emailjs.send(
        emailServiceId,
        emailTemplateId,
        {
          first_name: firstName,
          last_name: lastName,
          from_name: fullName,
          from_email: universityEmail,
          university_email: universityEmail,
          reply_to: universityEmail,
          message,
        },
        {
          publicKey: emailPublicKey,
        },
      );

      toast.success(t("home.contact.toast.success"));
      reset();
    } catch (err) {
      console.log(err)
      toast.error(t("home.contact.toast.error"));
    }
  }

  return (
    <SectionShell id="contact">
      <div className="grid min-w-0 gap-12 md:grid-cols-2">
        <div className="min-w-0">
          <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl">
            {t("home.contact.title")}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            {t("home.contact.description")}
          </p>
          <div className="mt-10 space-y-8">
            {contactMethods.map((method) => (
              <div key={method.title} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  {method.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-foreground">
                    {method.title}
                  </h3>
                  <p className="mt-1 wrap-break-word text-sm leading-6 text-muted-foreground">
                    {method.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <GlassPanel className="min-w-0 p-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field
                id="first-name"
                label={t("home.contact.form.firstName.label")}
                name="firstName"
                placeholder={t("home.contact.form.firstName.placeholder")}
                register={register}
                required
              />
              <Field
                id="last-name"
                label={t("home.contact.form.lastName.label")}
                name="lastName"
                placeholder={t("home.contact.form.lastName.placeholder")}
                register={register}
                required
              />
            </div>
            <Field
              id="university-email"
              label={t("home.contact.form.universityEmail.label")}
              name="universityEmail"
              placeholder={t("home.contact.form.universityEmail.placeholder")}
              register={register}
              required
              type="email"
            />
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-muted-foreground"
                htmlFor="message"
              >
                {t("home.contact.form.message.label")}
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder={t("home.contact.form.message.placeholder")}
                className="w-full resize-none rounded-lg border border-transparent bg-muted p-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:placeholder:text-muted-foreground"
                {...register("message", { required: true })}
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t("home.contact.form.sending")
                : t("home.contact.form.send")}
            </Button>
          </form>
        </GlassPanel>
      </div>
    </SectionShell>
  );
}

function Field({
  id,
  label,
  name,
  placeholder,
  required = false,
  register,
  type = "text",
}: {
  id: string;
  label: string;
  name: keyof ContactFormValues;
  placeholder: string;
  required?: boolean;
  register: UseFormRegister<ContactFormValues>;
  type?: string;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <label className="text-sm font-semibold text-muted-foreground" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-12 w-full rounded-lg border border-transparent bg-muted px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:placeholder:text-muted-foreground"
        {...register(name, { required })}
      />
    </div>
  );
}
