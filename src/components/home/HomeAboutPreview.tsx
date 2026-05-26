import Link from "next/link";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/common/Container";
import { OptimizedImage } from "@/components/common/OptimizedImage";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

const highlights = [
  {
    icon: ShieldCheck,
    text: "Şeffaf ve güvenilir satış süreci",
  },
  {
    icon: Award,
    text: "Kaliteli malzeme ve işçilik standartları",
  },
  {
    icon: Building2,
    text: "Uzun vadeli değer odaklı proje yaklaşımı",
  },
] as const;

const stats = [
  { value: "Güvenilir", label: "Süreç", icon: ShieldCheck },
  { value: "Modern", label: "Proje Yaklaşımı", icon: Sparkles },
  { value: "Şeffaf", label: "Portföy Yönetimi", icon: Building2 },
] as const;

export function HomeAboutPreview() {
  return (
    <Section background="dark" className="home-about-section relative overflow-hidden">
      <div className="home-about-glow pointer-events-none absolute -left-32 top-0 size-[28rem] rounded-full bg-bronze/10 blur-3xl" aria-hidden />
      <div className="home-about-glow pointer-events-none absolute -right-24 bottom-0 size-[22rem] rounded-full bg-white/5 blur-3xl" aria-hidden />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="home-about-image-frame">
              <OptimizedImage
                src="/images/placeholders/project.svg"
                alt="Yeni Kule İnşaat proje ve yaşam alanı"
                aspectRatio="4/3"
                rounded={false}
                className="home-about-image"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <ul className="mt-5 grid grid-cols-3 gap-3 md:absolute md:-bottom-6 md:left-6 md:right-6 md:mt-0">
              {stats.map((stat) => (
                <li key={stat.label}>
                  <div className="home-about-stat">
                    <stat.icon className="size-4 text-bronze-soft" aria-hidden />
                    <p className="font-heading text-sm font-semibold text-white md:text-base">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-white/55 md:text-xs">{stat.label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 lg:order-2">
            <span className="home-about-eyebrow">Hakkımızda</span>
            <h2 className="home-about-title">
              Kaliteyi, Güveni ve Modern Yaşamı Bir Araya Getiriyoruz
            </h2>
            <p className="home-about-subtitle">
              Yeni Kule İnşaat; her projede doğru planlama, sağlam yapı anlayışı ve
              uzun vadeli değer üretme hedefiyle hareket eder.
            </p>

            <ul className="mt-8 space-y-4">
              {highlights.map((item) => (
                <li key={item.text} className="home-about-highlight">
                  <span className="home-about-highlight-icon" aria-hidden>
                    <item.icon className="size-4 text-bronze-soft" />
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-white/88 md:text-base">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className={cn(
                "mt-10 min-h-12 rounded-full border border-white/15 bg-white px-7",
                "text-anthracite hover:bg-bronze-soft hover:text-anthracite",
              )}
            >
              <Link href={routes.about}>
                Hakkımızda
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
