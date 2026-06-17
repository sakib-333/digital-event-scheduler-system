import { Send } from "lucide-react";

const footerColumns = [
  {
    title: "Quick Links",
    links: ["Admin Portal", "Student Login", "Documentation", "System Status"],
  },
  {
    title: "Support",
    links: ["Help Center", "Submit a Ticket", "Privacy Policy", "Terms of Service"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#c3c6d7] bg-white transition-colors dark:border-border dark:bg-card/40">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-12">
        <div>
          <p className="text-2xl font-extrabold text-[#004ac6]">DESS</p>
          <p className="mt-4 text-sm leading-6 text-[#434655] dark:text-muted-foreground">
            Digital Event Scheduler System. Streamlining university logistics
            through advanced technology and intuitive design.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-bold text-[#191b23] dark:text-foreground">{column.title}</h2>
            <ul className="mt-5 space-y-3">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#home"
                    className="text-sm text-[#434655] transition-colors hover:text-[#004ac6] dark:text-muted-foreground dark:hover:text-primary"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="text-sm font-bold text-[#191b23] dark:text-foreground">Newsletter</h2>
          <p className="mt-5 text-sm leading-6 text-[#434655] dark:text-muted-foreground">
            Get the latest updates on campus events.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              className="min-w-0 flex-1 rounded-lg border border-transparent bg-[#f3f3fe] px-3 text-sm text-[#191b23] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 dark:bg-muted dark:text-foreground dark:placeholder:text-muted-foreground"
              placeholder="Email"
              type="email"
              aria-label="Newsletter email"
            />
            <button
              type="submit"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#004ac6] text-white hover:bg-[#003ea8]"
              aria-label="Subscribe"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[#c3c6d7]/40 px-4 py-6 text-center dark:border-border">
        <p className="text-sm text-[#737686]">
          © 2024 Digital Event Scheduler System. University Infrastructure
          Division.
        </p>
      </div>
    </footer>
  );
}
