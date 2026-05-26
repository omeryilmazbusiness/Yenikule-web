"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { drawerItem, easePremium, motionDuration } from "@/lib/motion";
import { publicNavLinks } from "@/lib/public-nav";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

const drawerPanel = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: motionDuration.normal, ease: easePremium },
  },
};

type PublicMobileMenuProps = {
  overlay?: boolean;
};

export function PublicMobileMenu({ overlay = false }: PublicMobileMenuProps) {
  const siteConfig = useSiteConfig();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "size-11 shrink-0 transition-premium",
            overlay && "text-white hover:bg-white/10 hover:text-white",
          )}
          aria-label="Menüyü aç"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-[min(100vw-1.5rem,22rem)] flex-col border-border/80 bg-surface p-0 shadow-[0_0_80px_-20px_rgb(0_0_0/0.35)]"
      >
        <motion.div
          className="flex min-h-0 flex-1 flex-col"
          initial={reduceMotion ? false : "hidden"}
          animate={open || reduceMotion ? "visible" : "hidden"}
          variants={reduceMotion ? undefined : drawerPanel}
        >
          <SheetHeader className="border-b border-border/80 px-5 py-5 text-left">
            <SheetTitle className="font-heading text-left text-lg tracking-tight">
              {siteConfig.name}
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Mobil menü">
            {publicNavLinks.map((link, index) => {
              const active =
                pathname === link.href ||
                (link.href !== routes.home && pathname.startsWith(link.href));
              const Icon = link.icon;

              const linkEl = (
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-medium transition-premium",
                    active
                      ? "bg-anthracite text-white shadow-md"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 shrink-0",
                      active ? "opacity-90" : "opacity-60",
                    )}
                    aria-hidden
                  />
                  {link.label}
                </Link>
              );

              if (reduceMotion) {
                return <div key={link.href}>{linkEl}</div>;
              }

              return (
                <motion.div
                  key={link.href}
                  custom={index}
                  initial="hidden"
                  animate={open ? "visible" : "hidden"}
                  variants={drawerItem}
                >
                  {linkEl}
                </motion.div>
              );
            })}
          </nav>

          <motion.div
            className="border-t border-border/80 p-4"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={
              open || reduceMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 12 }
            }
            transition={{
              duration: motionDuration.normal,
              ease: easePremium,
              delay: reduceMotion ? 0 : 0.28,
            }}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-whatsapp px-5 text-sm font-medium text-white shadow-sm transition-premium hover:bg-whatsapp/90"
              onClick={() => setOpen(false)}
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp ile İletişim
            </a>
          </motion.div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}
