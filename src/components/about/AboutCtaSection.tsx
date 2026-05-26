import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export async function AboutCtaSection() {
  const siteConfig = await getPublicSiteConfig();
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, ${siteConfig.name} hakkında bilgi almak istiyorum.`,
    siteConfig.whatsapp,
  );

  return (
    <section className="about-page-cta">
      <Container>
        <div className="about-page-cta-inner">
          <div className="relative z-[1] max-w-xl">
            <p className="about-page-eyebrow about-page-eyebrow-light">İletişim</p>
            <h2 className="about-page-section-title-light mt-4">
              Projeniz İçin Doğru Adımı Birlikte Atalım
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/65">
              Uzman ekibimiz satış, kiralama ve proje geliştirme süreçlerinizde size
              özel çözümler sunmaya hazır.
            </p>
          </div>

          <div className="relative z-[1] flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button
              asChild
              className="min-h-12 rounded-full border border-white/15 bg-white px-7 text-anthracite hover:bg-bronze-soft hover:text-anthracite"
            >
              <Link href={routes.contact}>
                <MessageCircle className="size-4" aria-hidden />
                İletişime Geçin
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="min-h-12 rounded-full border-white/25 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="min-h-12 rounded-full px-7 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <a href={`tel:${siteConfig.phone}`}>
                <Phone className="size-4" aria-hidden />
                {siteConfig.phoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
