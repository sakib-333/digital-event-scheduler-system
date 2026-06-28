import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();
  const footerColumns = [
    {
      title: t("home.footer.quickLinks.title"),
      links: [
        t("home.footer.quickLinks.adminPortal"),
        t("home.footer.quickLinks.studentLogin"),
        t("home.footer.quickLinks.documentation"),
        t("home.footer.quickLinks.systemStatus"),
      ],
    },
    {
      title: t("home.footer.support.title"),
      links: [
        t("home.footer.support.helpCenter"),
        t("home.footer.support.submitTicket"),
        t("home.footer.support.privacyPolicy"),
        t("home.footer.support.terms"),
      ],
    },
  ];

  return (
    <footer className="border-t border-[#c3c6d7] bg-white transition-colors dark:border-border dark:bg-card/40">
      <div className="mx-auto grid max-w-360 gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-12">
        <div>
          <p className="text-2xl font-extrabold text-[#004ac6]">DESS</p>
          <p className="mt-4 text-sm leading-6 text-[#434655] dark:text-muted-foreground">
            {t("home.footer.description")}
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-bold text-[#191b23] dark:text-foreground">
              {column.title}
            </h2>
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
          <h2 className="text-sm font-bold text-[#191b23] dark:text-foreground">
            {t("home.footer.newsletter.title")}
          </h2>
          <p className="mt-5 text-sm leading-6 text-[#434655] dark:text-muted-foreground">
            {t("home.footer.newsletter.description")}
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              className="min-w-0 flex-1 rounded-lg border border-transparent bg-[#f3f3fe] px-3 text-sm text-[#191b23] outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 dark:bg-muted dark:text-foreground dark:placeholder:text-muted-foreground"
              placeholder={t("home.footer.newsletter.placeholder")}
              type="email"
              aria-label={t("home.footer.newsletter.emailAria")}
            />
            <button
              type="submit"
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#004ac6] text-white hover:bg-[#003ea8]"
              aria-label={t("home.footer.newsletter.subscribeAria")}
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-[#c3c6d7]/40 px-4 py-6 text-center dark:border-border">
        <p className="text-sm text-[#737686]">
          {t("home.footer.copyright")}
        </p>
      </div>
    </footer>
  );
}
