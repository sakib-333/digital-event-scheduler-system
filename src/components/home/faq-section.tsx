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
      className="border-y border-[#c3c6d7]/30 bg-white py-16 transition-colors dark:border-border dark:bg-card/40 lg:py-24"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-4xl font-extrabold text-[#191b23] dark:text-foreground sm:text-5xl">
          Common Queries
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <GlassPanel key={faq.question} className="overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-[#f3f3fe] dark:hover:bg-muted/50"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-bold text-[#191b23] dark:text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-[#434655] transition-transform dark:text-muted-foreground ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen ? (
                  <div className="border-t border-[#c3c6d7]/30 px-6 pb-6 pt-4 text-base leading-7 text-[#434655] dark:border-border dark:text-muted-foreground">
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
