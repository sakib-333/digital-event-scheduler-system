import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { GlassPanel, SectionShell } from "./section-shell";

export function FaqSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    {
      question: t("home.faq.items.createEvent.question"),
      answer: t("home.faq.items.createEvent.answer"),
    },
    {
      question: t("home.faq.items.approvals.question"),
      answer: t("home.faq.items.approvals.answer"),
    },
    {
      question: t("home.faq.items.attendance.question"),
      answer: t("home.faq.items.attendance.answer"),
    },
  ];

  return (
    <SectionShell
      id="faq"
      className="border-y border-border/30 bg-card py-16 transition-colors dark:bg-card/40 lg:py-24"
    >
      <div className="mx-auto max-w-3xl min-w-0">
        <h2 className="mb-12 text-center text-4xl font-extrabold text-foreground sm:text-5xl">
          {t("home.faq.title")}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <GlassPanel key={faq.question} className="overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-muted dark:hover:bg-muted/50"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="min-w-0 text-lg font-bold text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-border/30 px-6 pb-6 pt-4 text-base leading-7 text-muted-foreground">
                    {faq.answer}
                  </div>
                ) : null}
              </GlassPanel>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
