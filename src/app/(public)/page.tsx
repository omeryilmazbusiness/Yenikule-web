import { HomeAboutPreview } from "@/components/home/HomeAboutPreview";
import { HomeCategoryShowcase } from "@/components/home/HomeCategoryShowcase";
import { HomeContactCta } from "@/components/home/HomeContactCta";
import { HomeFeaturedListings } from "@/components/home/HomeFeaturedListings";
import { HomeInvestmentSection } from "@/components/home/HomeInvestmentSection";
import { HomeProjectsShowcase } from "@/components/home/HomeProjectsShowcase";
import { HomeServicesPreview } from "@/components/home/HomeServicesPreview";
import { HomeTrustBar } from "@/components/home/HomeTrustBar";
import { PremiumHeroSection } from "@/components/home/PremiumHeroSection";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Modern Konut, Villa, Daire ve Yatırım Projeleri",
  description:
    "Yeni Kule İnşaat ile modern konut projeleri, satılık ve kiralık daireler, villalar, ticari alanlar ve yatırım fırsatlarını keşfedin.",
  path: "/",
  keywords: [
    "yeni kule inşaat",
    "istanbul konut",
    "satılık daire",
    "kiralık daire",
    "villa",
    "gayrimenkul",
    "inşaat projesi",
  ],
});

export default function HomePage() {
  return (
    <div className="home-page">
      <PremiumHeroSection />
      <HomeTrustBar />
      <HomeCategoryShowcase />
      <HomeFeaturedListings />
      <HomeProjectsShowcase />
      <HomeAboutPreview />
      <HomeServicesPreview />
      <HomeInvestmentSection />
      <HomeContactCta />
    </div>
  );
}
