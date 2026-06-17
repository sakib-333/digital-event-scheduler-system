import { AboutSection } from "./about-section";
import { ContactSection } from "./contact-section";
import { FaqSection } from "./faq-section";
import { FeaturesSection } from "./features-section";
import { HeroSection } from "./hero-section";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type HomePageProps = {
  onGetStarted: () => void;
};

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="min-h-screen scroll-smooth bg-[#faf8ff] text-[#191b23] transition-colors dark:bg-background dark:text-foreground">
      <SiteHeader onGetStarted={onGetStarted} />
      <main>
        <HeroSection onGetStarted={onGetStarted} />
        <AboutSection />
        <FeaturesSection />
        <FaqSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
