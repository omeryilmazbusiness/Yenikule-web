import { MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatListingPrice } from "@/features/listings/utils/listing-formatters";
import type { Listing } from "@/features/listings/types/listing.types";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

type ListingContactBoxProps = {
  listing: Listing;
  className?: string;
};

export async function ListingContactBox({ listing, className }: ListingContactBoxProps) {
  const siteConfig = await getPublicSiteConfig();
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, "${listing.title}" ilanı hakkında bilgi almak istiyorum.`,
    siteConfig.whatsapp,
  );

  return (
    <Card
      className={cn(
        "border-bronze/15 shadow-[var(--shadow-premium-lg)] lg:sticky lg:top-24",
        "hidden lg:block",
        className,
      )}
    >
      <CardHeader className="border-b border-border/60 bg-surface-soft/50">
        <p className="section-eyebrow mb-1 text-[10px]">İletişim</p>
        <CardTitle className="text-xl">Bu İlan İçin</CardTitle>
        <p className="font-heading pt-2 text-3xl font-semibold text-foreground">
          {formatListingPrice(listing)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Uzman danışmanlarımız size en kısa sürede dönüş yapsın. WhatsApp veya
          telefon ile hemen ulaşabilirsiniz.
        </p>

        <Button asChild variant="whatsapp" className="w-full" size="lg">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            WhatsApp ile Sor
          </a>
        </Button>

        <Button asChild variant="outline" className="w-full" size="lg">
          <a href={`tel:${siteConfig.phone}`}>
            <Phone className="size-4" />
            {siteConfig.phoneDisplay}
          </a>
        </Button>

        <div className="rounded-xl border border-border bg-surface-soft p-4 text-sm">
          <p className="font-medium text-foreground">Çalışma Saatleri</p>
          <p className="mt-1 text-muted-foreground">{siteConfig.workingHours}</p>
        </div>
      </CardContent>
    </Card>
  );
}
