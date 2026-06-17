import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

type SiteHeaderProps = {
  onGetStarted: () => void;
};

export function SiteHeader({ onGetStarted }: SiteHeaderProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = navItems
        .map((item) => item.href.replace("#", ""))
        .findLast((id) => {
          const section = document.getElementById(id);
          return section ? window.scrollY >= section.offsetTop - 120 : false;
        });

      if (current) {
        setActiveSection(current);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[#c3c6d7]/40 bg-[#faf8ff]/80 shadow-sm backdrop-blur-md transition-colors dark:border-border dark:bg-background/80">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-12">
        <a
          href="#home"
          className="text-xl font-extrabold text-[#004ac6]"
          aria-label="DESS home"
        >
          DESS
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.replace("#", "");

            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "border-b-2 border-transparent py-5 text-sm font-semibold text-[#434655] transition-colors hover:text-[#004ac6] dark:text-muted-foreground dark:hover:text-primary",
                  isActive && "border-[#004ac6] font-bold text-[#004ac6] dark:border-primary dark:text-primary",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/signin"
            className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-[#004ac6] transition-colors hover:bg-[#dbe1ff]/50 hover:text-[#004ac6] dark:text-primary dark:hover:bg-accent/40 dark:hover:text-primary"
          >
            Login
          </Link>
          <Button
            onClick={onGetStarted}
            className="h-10 rounded-lg bg-[#004ac6] px-5 text-white shadow-md hover:bg-[#003ea8] dark:bg-primary dark:text-primary-foreground"
          >
            Get Started
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-[#191b23] hover:bg-[#ededf9] dark:text-foreground dark:hover:bg-muted md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-[#c3c6d7]/40 bg-[#faf8ff] px-4 py-4 shadow-md transition-colors dark:border-border dark:bg-background md:hidden">
          <nav className="flex flex-col gap-2" aria-label="Mobile primary">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#434655] hover:bg-[#ededf9] hover:text-[#004ac6] dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-primary"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              to="/signin"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[#c3c6d7] bg-white px-4 text-sm font-semibold text-[#004ac6] dark:border-border dark:bg-card dark:text-primary"
            >
              Login
            </Link>
            <Button
              onClick={() => {
                setMenuOpen(false);
                onGetStarted();
              }}
              className="rounded-lg bg-[#004ac6] text-white hover:bg-[#003ea8] dark:bg-primary dark:text-primary-foreground"
            >
              Get Started
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
