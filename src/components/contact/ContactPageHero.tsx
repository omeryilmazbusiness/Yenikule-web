import { Clock, MessageCircle, Phone } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export async function ContactPageHero() {
  const siteConfig = await getPublicSiteConfig();
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, ${siteConfig.name} ile iletişime geçmek istiyorum.`,
    siteConfig.whatsapp,
  );

  return (
    <section className="contact-page-hero relative overflow-hidden">
      <div className="contact-page-hero-glow contact-page-hero-glow-left" aria-hidden />
      <div className="contact-page-hero-glow contact-page-hero-glow-right" aria-hidden />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="about-page-eyebrow">İletişim</span>
          <h1 className="about-page-hero-title mt-4">
            Size En Kısa Sürede Dönüş Yapalım
          </h1>
          <p className="about-page-hero-lead mx-auto">
            Satış, kiralama, proje veya yatırım talepleriniz için formu doldurun ya da
            doğrudan WhatsApp veya telefon ile bize ulaşın.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              variant="whatsapp"
              className="min-h-12 rounded-full px-7"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden />
                WhatsApp ile Yazın
              </a>
            </Button>
            <Button
              asChild
              className="min-h-12 rounded-full border border-white/15 bg-white px-7 text-anthracite hover:bg-bronze-soft hover:text-anthracite"
            >
              <a href={`tel:${siteConfig.phone}`}>
                <Phone className="size-4" aria-hidden />
                {siteConfig.phoneDisplay}
              </a>
            </Button>
          </div>

          <p className="contact-page-hero-hours mt-8 inline-flex items-center justify-center gap-2 text-sm text-white/55">
            <Clock className="size-4 shrink-0 text-bronze-soft" aria-hidden />
            {siteConfig.workingHours}
          </p>
        </div>
      </Container>
    </section>
  );
}
