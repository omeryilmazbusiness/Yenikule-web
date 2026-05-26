import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Car,
  KeyRound,
  LineChart,
  Store,
} from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

const services = [
  {
    icon: Building2,
    title: "Konut Projeleri",
    description:
      "Modern planlama ve yaşam kalitesi odaklı konut geliştirme.",
  },
  {
    icon: Store,
    title: "Ticari Alanlar",
    description: "Dükkan, ofis ve karma kullanım alanları.",
  },
  {
    icon: KeyRound,
    title: "Satış & Kiralama",
    description: "Güncel portföy ve danışmanlık hizmetleri.",
  },
  {
    icon: LineChart,
    title: "Yatırım Danışmanlığı",
    description: "Bölgesel analiz ve getiri odaklı rehberlik.",
  },
  {
    icon: Car,
    title: "Araç & Ekipman Portföyü",
    description: "Kurumsal araç ve ekipman seçenekleri.",
  },
] as const;

export function HomeServicesPreview() {
  return (
    <Section background="muted" className="home-section">
      <Container>
        <SectionHeading
          eyebrow="Hizmetler"
          title="İhtiyacınıza Uygun Gayrimenkul ve Proje Çözümleri"
          subtitle="Konuttan ticari alana, satıştan yatırım danışmanlığına uçtan uca destek."
          align="center"
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service) => (
            <li key={service.title}>
              <article className="soft-card soft-card-lift group flex h-full flex-col p-6 md:p-7">
                <div className="soft-card-icon mb-5">
                  <service.icon className="size-5" aria-hidden />
                </div>
                <h3 className="font-heading text-lg font-medium text-foreground transition-premium group-hover:text-bronze">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {service.description}
                </p>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Link
            href={routes.aboutServices}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-bronze transition-colors hover:text-wood-medium"
          >
            Tüm Hizmetler
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
