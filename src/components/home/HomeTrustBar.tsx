import {
  Award,
  Eye,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Container } from "@/components/common/Container";

const trustItems = [
  { icon: Layers, label: "Modern Mimari", mobileLabel: "Mimari" },
  { icon: Award, label: "Kaliteli Malzeme", mobileLabel: "Kalite" },
  { icon: ShieldCheck, label: "Güvenilir Teslim", mobileLabel: "Teslim" },
  { icon: Eye, label: "Şeffaf Süreç", mobileLabel: "Şeffaflık" },
  { icon: TrendingUp, label: "Yatırım Değeri", mobileLabel: "Yatırım" },
] as const;

export function HomeTrustBar() {
  return (
    <section id="kesfet" className="home-trust-bar scroll-mt-20">
      <Container className="home-trust-bar-inner">
        <p className="home-trust-bar-eyebrow lg:hidden">Neden Yeni Kule?</p>
        <ul className="home-trust-bar-grid">
          {trustItems.map((item) => (
            <li key={item.label} className="home-trust-bar-tile">
              <span className="home-trust-bar-tile-icon" aria-hidden>
                <item.icon className="size-[1.125rem]" />
              </span>
              <span className="home-trust-bar-tile-label">
                <span className="lg:hidden">{item.mobileLabel}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
