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
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-extrabold text-[#191b23] dark:text-foreground sm:text-5xl">
            Get in Touch
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#434655] dark:text-muted-foreground">
            Interested in implementing DESS at your institution? Our technical
            deployment team is ready to assist.
          </p>
          <div className="mt-10 space-y-8">
            {contactMethods.map((method) => (
              <div key={method.title} className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#dbe1ff] text-[#004ac6]">
                  {method.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#191b23] dark:text-foreground">
                    {method.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#434655] dark:text-muted-foreground">
                    {method.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <GlassPanel className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
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
                className="text-sm font-semibold text-[#434655] dark:text-muted-foreground"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="How can we help?"
                className="w-full resize-none rounded-lg border border-transparent bg-[#f3f3fe] p-4 text-sm text-[#191b23] outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 dark:bg-muted dark:text-foreground dark:placeholder:text-muted-foreground"
              />
            </div>
            {submitted ? (
              <p className="rounded-lg bg-[#dbe1ff] px-4 py-3 text-sm font-semibold text-[#004ac6]">
                Message sent successfully.
              </p>
            ) : null}
            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#004ac6] text-base font-bold text-white hover:bg-[#003ea8]"
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
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[#434655] dark:text-muted-foreground" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-12 w-full rounded-lg border border-transparent bg-[#f3f3fe] px-4 text-sm text-[#191b23] outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 dark:bg-muted dark:text-foreground dark:placeholder:text-muted-foreground"
      />
    </div>
  );
}
