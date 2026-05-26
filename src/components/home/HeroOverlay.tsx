import { cn } from "@/lib/cn";

type HeroOverlayProps = {
  className?: string;
};

export function HeroOverlay({ className }: HeroOverlayProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 z-[1]", className)}
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_20%,rgba(154,106,58,0.12)_0%,transparent_55%)]" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />
    </div>
  );
}
