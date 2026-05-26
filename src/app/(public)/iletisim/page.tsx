import { Suspense } from "react";

import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFormFallback } from "@/components/contact/ContactFormFallback";
import { ContactOfficeMap } from "@/components/contact/ContactOfficeMap";
import { ContactPageHero } from "@/components/contact/ContactPageHero";
import { Container } from "@/components/common/Container";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata({
  title: "İletişim",
  description: `${siteConfig.name} iletişim — telefon, WhatsApp, e-posta ve iletişim formu. Satış, kiralama ve proje talepleriniz için bize ulaşın.`,
  path: routes.contact,
});

export default function ContactPage() {
  return (
    <div className="contact-page">
      <ContactPageHero />

      <section className="contact-page-main">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-16">
            <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
              <ContactChannels />
              <ContactOfficeMap />
            </aside>

            <div className="contact-page-form-panel">
              <Suspense fallback={<ContactFormFallback />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
