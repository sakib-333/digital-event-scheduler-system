import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { GlassPanel, SectionShell } from "./section-shell";

const faqs = [
  {
    question: "How do I create a new event?",
    answer:
      "Navigate to your Command Center dashboard and click the Create New Event button in the sidebar. Follow the guided wizard to set your date, venue, and attendance requirements.",
  },
  {
    question: "Who can approve events?",
    answer:
      "Approvals follow a hierarchical chain. Department Heads approve initial requests, while Facility Managers confirm venue availability. High-profile events may require approval from the Dean's office.",
  },
  {
    question: "Is there a limit on student attendance?",
    answer:
      "Attendance limits are automatically synchronized with the maximum capacity of the selected venue. Once capacity is reached, the system opens a waitlist.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionShell
      id="faq"
      className="border-y border-border/30 bg-card py-16 transition-colors dark:bg-card/40 lg:py-24"
    >
      <div className="mx-auto max-w-3xl min-w-0">
        <h2 className="mb-12 text-center text-4xl font-extrabold text-foreground sm:text-5xl">
          Common Queries
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
