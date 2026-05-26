import {
  Award,
  Eye,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Container } from "@/components/common/Container";
import { cn } from "@/lib/cn";

const trustItems = [
  { icon: Layers, label: "Modern Mimari" },
  { icon: Award, label: "Kaliteli Malzeme" },
  { icon: ShieldCheck, label: "Güvenilir Teslim" },
  { icon: Eye, label: "Şeffaf Süreç" },
  { icon: TrendingUp, label: "Yatırım Değeri" },
] as const;

export function HomeTrustBar() {
  return (
    <div id="kesfet" className="scroll-mt-20 bg-black">
      <Container>
        <ul
          className={cn(
            "flex gap-6 overflow-x-auto py-10 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-5 md:gap-8 md:overflow-visible md:py-12",
            "[&::-webkit-scrollbar]:hidden",
          )}
        >
          {trustItems.map((item) => (
            <li
              key={item.label}
              className="flex min-w-[8.5rem] shrink-0 flex-col items-center gap-2.5 text-center md:min-w-0 md:flex-row md:text-left"
            >
              <item.icon
                className="size-5 shrink-0 text-bronze-soft/90"
                aria-hidden
              />
              <p className="font-heading text-sm font-medium text-white/90 md:text-base">
                {item.label}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
