"use client";

import { useState } from "react";

import { KvkkAydinlatmaDialog } from "@/components/legal/KvkkAydinlatmaDialog";
import { useSiteConfig } from "@/components/providers/SiteConfigProvider";
import { cn } from "@/lib/cn";

type KvkkConsentFieldProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  inputId?: string;
  className?: string;
  legalName?: string;
  email?: string;
  address?: string;
};

export function KvkkConsentField({
  checked,
  onCheckedChange,
  inputId = "contact-consent",
  className,
  legalName: legalNameProp,
  email: emailProp,
  address: addressProp,
}: KvkkConsentFieldProps) {
  const siteConfig = useSiteConfig();
  const legalName = legalNameProp ?? siteConfig.company.legalName;
  const email = emailProp ?? siteConfig.email;
  const address = addressProp ?? siteConfig.address.full;
  const [dialogOpen, setDialogOpen] = useState(false);

  function accept() {
    onCheckedChange(true);
  }

  return (
    <>
      <div className={cn("contact-page-consent", className)}>
        <input
          type="checkbox"
          id={inputId}
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="contact-page-consent-input"
        />
        <p className="contact-page-consent-label">
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="font-medium text-bronze underline-offset-4 hover:underline"
          >
            KVKK Aydınlatma Metni
          </button>
          &apos;ni okuyabilir veya{" "}
          <button
            type="button"
            onClick={accept}
            className="font-medium text-bronze underline-offset-4 hover:underline"
          >
            okudum, kabul ediyorum
          </button>
          &nbsp;diyerek iletişim talebimin işlenmesini onaylayabilirsiniz.
        </p>
      </div>

      <KvkkAydinlatmaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAccept={accept}
        legalName={legalName}
        email={email}
        address={address}
      />
    </>
  );
}
