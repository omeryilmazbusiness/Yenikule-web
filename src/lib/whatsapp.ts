import { siteConfig } from "@/lib/site-config";

export function getWhatsAppUrl(message?: string, whatsapp?: string): string {
  const phone = (whatsapp ?? siteConfig.whatsapp).replace(/\D/g, "");
  if (!message) {
    return `https://wa.me/${phone}`;
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
