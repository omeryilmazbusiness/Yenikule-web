"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getKvkkAydinlatmaMetni } from "@/lib/kvkk-content";
import { siteConfig } from "@/lib/site-config";

type KvkkAydinlatmaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept?: () => void;
  legalName?: string;
  email?: string;
  address?: string;
};

export function KvkkAydinlatmaDialog({
  open,
  onOpenChange,
  onAccept,
  legalName = siteConfig.company.legalName,
  email = siteConfig.email,
  address = siteConfig.address.full,
}: KvkkAydinlatmaDialogProps) {
  const sections = useMemo(
    () => getKvkkAydinlatmaMetni({ legalName, email, address }),
    [legalName, email, address],
  );

  function handleAccept() {
    onAccept?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="kvkk-dialog flex max-h-[min(90dvh,42rem)] w-[min(100vw-1.5rem,32rem)] flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="kvkk-dialog-header shrink-0 border-b border-border/60 px-5 py-4 text-left">
          <DialogTitle className="font-heading text-lg">
            KVKK Aydınlatma Metni
          </DialogTitle>
          <DialogDescription className="text-xs">
            Kişisel verilerinizin işlenmesine ilişkin bilgilendirme
          </DialogDescription>
        </DialogHeader>

        <div className="kvkk-dialog-body min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
          <div className="space-y-5 text-sm leading-relaxed text-muted-foreground">
            {sections.map((section) => (
              <section key={section.title}>
                <h3 className="mb-2 font-heading text-sm font-semibold text-foreground">
                  {section.title}
                </h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mb-2 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>

        <DialogFooter className="kvkk-dialog-footer shrink-0 flex-col gap-2 border-t border-border/60 px-5 py-4 sm:flex-col">
          <Button
            type="button"
            className="min-h-11 w-full rounded-xl"
            onClick={handleAccept}
          >
            Okudum, kabul ediyorum
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="min-h-10 w-full rounded-xl text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
