import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function HomeInvestmentSection() {
  const whatsappUrl = getWhatsAppUrl(
    "Merhaba, yatırım ve portföy hakkında bilgi almak istiyorum.",
  );

  return (
    <Section background="default" className="py-12 md:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-anthracite px-6 py-12 md:px-12 md:py-16">
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-bronze/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-wood-dark/30 blur-3xl"
            aria-hidden
          />

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <p className="section-eyebrow mb-4 text-bronze-soft">Yatırım</p>
            <h2 className="font-heading text-balance text-3xl font-semibold text-white md:text-4xl">
              Doğru Lokasyon, Sağlam Yapı, Uzun Vadeli Değer
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/75 md:text-lg">
              Yeni Kule İnşaat, yalnızca yaşam alanı değil; güvenli ve
              sürdürülebilir yatırım değeri sunan projeler geliştirir.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button
                asChild
                size="lg"
                variant="accent"
                className="min-h-11 w-full sm:w-auto"
              >
                <Link href={routes.listings.index}>
                  Portföyü İncele
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-h-11 w-full border-white/25 bg-transparent text-white hover:bg-white/10 sm:w-auto"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" />
                  Bizimle Görüşün
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
