import Link from "next/link";
import { MessageCircle, Phone, Send } from "lucide-react";

import { Container } from "@/components/common/Container";
import { Section } from "@/components/common/Section";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { routes } from "@/lib/routes";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export async function HomeContactCta() {
  const siteConfig = await getPublicSiteConfig();
  const whatsappUrl = getWhatsAppUrl(
    "Merhaba, yeni yaşam alanım için bilgi almak istiyorum.",
    siteConfig.whatsapp,
  );

  return (
    <Section
      background="default"
      className="pb-[var(--mobile-dock-clearance)] md:pb-24 lg:pb-28"
    >
      <Container>
        <div className="soft-card p-6 md:p-10 lg:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <SectionHeading
              eyebrow="İletişim"
              title="Yeni Yaşam Alanınızı Birlikte Seçelim"
              subtitle="Satılık, kiralık, proje veya yatırım seçenekleri için ekibimizle iletişime geçin."
              align="center"
              className="mb-8"
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <Button
                asChild
                size="lg"
                variant="whatsapp"
                className="min-h-11 w-full sm:w-auto"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" />
                  WhatsApp ile Yaz
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="default"
                className="min-h-11 w-full sm:w-auto"
              >
                <a href={`tel:${siteConfig.phone}`}>
                  <Phone className="size-4" />
                  Bizi Arayın
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-h-11 w-full sm:w-auto"
              >
                <Link href={routes.contact}>
                  <Send className="size-4" />
                  İletişim Formu
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
