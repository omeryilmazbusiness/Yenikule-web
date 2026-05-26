import {
  Briefcase,
  Camera,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Users,
} from "lucide-react";
import Link from "next/link";

import { getPublicSiteConfig } from "@/lib/get-public-site-config";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export async function ContactChannels() {
  const siteConfig = await getPublicSiteConfig();
  const whatsappUrl = getWhatsAppUrl(
    `Merhaba, ${siteConfig.name} hakkında bilgi almak istiyorum.`,
    siteConfig.whatsapp,
  );

  const socialLinks = [
    { href: siteConfig.socialLinks.instagram, label: "Instagram", icon: Camera },
    { href: siteConfig.socialLinks.facebook, label: "Facebook", icon: Users },
    { href: siteConfig.socialLinks.linkedin, label: "LinkedIn", icon: Briefcase },
    { href: siteConfig.socialLinks.youtube, label: "YouTube", icon: Play },
  ] as const;

  const channels = [
    {
      icon: Phone,
      label: "Telefon",
      value: siteConfig.phoneDisplay,
      href: `tel:${siteConfig.phone}`,
      external: false,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: siteConfig.whatsappDisplay,
      href: whatsappUrl,
      external: true,
    },
    {
      icon: Mail,
      label: "E-posta",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      external: false,
    },
    {
      icon: MapPin,
      label: "Adres",
      value: siteConfig.address.full,
      href: undefined,
      external: false,
    },
  ] as const;

  return (
    <div className="contact-channels space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium">İletişim Kanalları</h2>
        <p className="mt-2 text-sm text-muted-foreground">{siteConfig.workingHours}</p>
      </div>

      <ul className="space-y-3">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const content = (
            <>
              <span className="contact-channel-icon">
                <Icon className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">{channel.label}</span>
                <span className="block font-medium text-foreground">{channel.value}</span>
              </span>
            </>
          );

          return (
            <li key={channel.label}>
              {channel.href ? (
                <a
                  href={channel.href}
                  className="contact-channel-card"
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {content}
                </a>
              ) : (
                <div className="contact-channel-card">{content}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sosyal Medya
        </p>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social-link"
              aria-label={item.label}
            >
              <item.icon className="size-4" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
