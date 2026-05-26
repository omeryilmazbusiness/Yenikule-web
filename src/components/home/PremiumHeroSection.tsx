import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Handshake,
  Home,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Container } from "@/components/common/Container";
import { HeroGlobalSearch } from "@/components/home/HeroGlobalSearch";
import { HomeMobileQuickNav } from "@/components/home/HomeMobileQuickNav";
import { HeroOverlay } from "@/components/home/HeroOverlay";
import { HeroYouTubeBackground } from "@/components/home/HeroYouTubeBackground";
import { searchAnalyticsService } from "@/features/search/services/search-analytics.service";
import { searchService } from "@/features/search/services/search.service";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

const trustIndicators = [
  { icon: Home, label: "Modern Konut Projeleri" },
  { icon: Layers, label: "Satılık & Kiralık Portföy" },
  { icon: ShieldCheck, label: "Güvenilir Teslim Süreci" },
  { icon: TrendingUp, label: "Yatırım Odaklı Yaklaşım" },
] as const;

export async function PremiumHeroSection() {
  const [searchIndex, trendingSearches] = await Promise.all([
    searchService.getPublicIndex(),
    searchAnalyticsService.getTrendingForHero(),
  ]);

  const whatsappUrl = getWhatsAppUrl(
    "Merhaba, Yeni Kule İnşaat hakkında bilgi almak istiyorum.",
  );

  return (
    <section className="home-hero relative flex min-h-[100dvh] items-end overflow-hidden lg:items-center">
      <HeroYouTubeBackground />
      <HeroOverlay />

      <Container className="home-hero-container relative z-10">
        <div className="home-hero-grid">
          <HeroGlobalSearch
            index={searchIndex}
            trendingSearches={trendingSearches}
          />

          <div className="home-hero-content max-w-3xl">
            <p className="hero-eyebrow home-hero-eyebrow">
              <Handshake className="size-4 shrink-0 opacity-90" aria-hidden />
              <span>Yeni Kule İnşaat</span>
            </p>

            <div className="hero-panel home-hero-panel rounded-3xl p-6 md:p-9">
              <h1 className="hero-title home-hero-title">
                Güvenle Yükselen
                <span className="mt-1 block font-light text-white/90">
                  Yaşam Alanları
                </span>
              </h1>

              <p className="hero-subtitle home-hero-subtitle mt-4 max-w-xl md:mt-6">
                Modern mimari, kaliteli malzeme ve güvenilir teslim anlayışıyla
                yaşam ve yatırım alanları geliştiriyoruz.
              </p>

              <div className="home-hero-cta-desktop mt-8 hidden flex-wrap gap-2.5 sm:flex">
                <Link href={routes.listings.index} className="hero-cta-primary home-hero-cta">
                  <Building2 className="size-4 opacity-80" aria-hidden />
                  İlanları İncele
                  <ArrowRight className="size-4 opacity-70" aria-hidden />
                </Link>
                <Link href={routes.projects.index} className="hero-cta-secondary home-hero-cta">
                  <Layers className="size-4 opacity-80" aria-hidden />
                  Projelerimizi Gör
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-cta-whatsapp home-hero-cta"
                >
                  <WhatsAppIcon className="size-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            <HomeMobileQuickNav />

            <ul className="hero-trust-rail mt-6 lg:mt-10">
              {trustIndicators.map((item) => (
                <li key={item.label} className="hero-trust-chip home-hero-trust-chip">
                  <span className="hero-trust-chip-icon">
                    <item.icon
                      className="size-5 text-bronze-soft sm:size-[1.35rem]"
                      aria-hidden
                    />
                  </span>
                  <span className="hero-trust-chip-label">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <a
        href="#kesfet"
        className={cn(
          "absolute bottom-[var(--mobile-dock-clearance)] left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1.5",
          "text-white/45 transition-colors hover:text-white/80 md:bottom-24 md:flex",
        )}
        aria-label="Sayfayı keşfet"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.28em]">
          Keşfet
        </span>
        <ChevronDown className="size-5 animate-bounce motion-reduce:animate-none" />
      </a>
    </section>
  );
}
