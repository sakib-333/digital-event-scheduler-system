import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassPanel, SectionShell } from "./section-shell";

const contactMethods = [
  {
    icon: <Mail className="size-5" />,
    title: "Email Us",
    detail: "support@dess-university.edu",
  },
  {
    icon: <Phone className="size-5" />,
    title: "Call Infrastructure",
    detail: "+1 (555) 123-4567",
  },
  {
    icon: <MapPin className="size-5" />,
    title: "Office Address",
    detail: "Building 4, University Plaza, Innovation District, CA 94103",
  },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <SectionShell id="contact">
      <div className="grid min-w-0 gap-12 md:grid-cols-2">
        <div className="min-w-0">
          <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl">
            Get in Touch
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Interested in implementing DESS at your institution? Our technical
            deployment team is ready to assist.
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Field label="First Name" placeholder="John" />
              <Field label="Last Name" placeholder="Doe" />
            </div>
            <Field
              label="University Email"
              placeholder="john@university.edu"
              type="email"
            />
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-muted-foreground"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="How can we help?"
                className="w-full resize-none rounded-lg border border-transparent bg-muted p-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:placeholder:text-muted-foreground"
              />
            </div>
            {submitted ? (
              <p className="rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground">
                Message sent successfully.
              </p>
            ) : null}
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90"
            >
              Send Message
            </Button>
          </form>
        </GlassPanel>
      </div>
    </SectionShell>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

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
      />
    </div>
  );
}
