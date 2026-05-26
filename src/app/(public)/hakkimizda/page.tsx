import { AboutCtaSection } from "@/components/about/AboutCtaSection";
import { AboutPageHero } from "@/components/about/AboutPageHero";
import { AboutServicesSection } from "@/components/about/AboutServicesSection";
import { AboutStorySection } from "@/components/about/AboutStorySection";
import { AboutValuesSection } from "@/components/about/AboutValuesSection";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata({
  title: "Hakkımızda",
  description: `${siteConfig.name} kurumsal kimliği, değerleri, hizmetleri ve İstanbul'daki inşaat ve gayrimenkul deneyimi.`,
  path: routes.about,
});

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutPageHero />
      <AboutStorySection />
      <AboutValuesSection />
      <AboutServicesSection />
      <AboutCtaSection />
    </div>
  );
}
