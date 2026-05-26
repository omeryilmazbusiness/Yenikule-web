import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

import { Container } from "@/components/common/Container";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { Button } from "@/components/ui/button";
import { aboutStats } from "@/lib/about-content";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { routes } from "@/lib/routes";

export async function AboutPageHero() {
  const siteConfig = await getPublicSiteConfig();
  return (
    <section className="about-page-hero relative overflow-hidden">
      <div className="about-page-hero-glow about-page-hero-glow-left" aria-hidden />
      <div className="about-page-hero-glow about-page-hero-glow-right" aria-hidden />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <span className="about-page-eyebrow">Kurumsal</span>
            <h1 className="about-page-hero-title">
              İstanbul&apos;da Güvenilir İnşaat ve Gayrimenkul Ortağınız
            </h1>
            <p className="about-page-hero-lead">
              {siteConfig.name} olarak konut ve ticari projeler geliştiriyor; satış,
              kiralama ve yatırım danışmanlığıyla uçtan uca çözüm sunuyoruz.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="min-h-12 rounded-full border border-white/15 bg-white px-7 text-anthracite hover:bg-bronze-soft hover:text-anthracite"
              >
                <Link href={`${routes.about}#hizmetler`}>
                  Hizmetlerimiz
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="min-h-12 rounded-full border-white/25 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
              >
                <a href={`tel:${siteConfig.phone}`}>
                  <Phone className="size-4" aria-hidden />
                  Bizi Arayın
                </a>
              </Button>
            </div>

            <ul className="about-page-hero-stats mt-12 grid grid-cols-3 gap-3 sm:gap-4">
              {aboutStats.map((stat) => (
                <li key={stat.label}>
                  <div className="about-page-stat">
                    <p className="about-page-stat-value">{stat.value}</p>
                    <p className="about-page-stat-label">{stat.label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="about-page-hero-image-frame">
              <OptimizedImage
                src="/images/placeholders/project.svg"
                alt={`${siteConfig.name} proje ve yaşam alanı`}
                aspectRatio="4/3"
                rounded={false}
                className="about-page-hero-image opacity-95"
                sizes="(max-width: 1024px) 100vw, 46vw"
                priority
              />
            </div>
            <div className="about-page-hero-badge" aria-hidden>
              <span className="about-page-hero-badge-dot" />
              Bağcılar · İstanbul
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
