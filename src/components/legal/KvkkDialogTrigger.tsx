"use client";

import { useState } from "react";

import { KvkkAydinlatmaDialog } from "@/components/legal/KvkkAydinlatmaDialog";
import { cn } from "@/lib/cn";

type KvkkDialogTriggerProps = {
  className?: string;
  label?: string;
  legalName?: string;
  email?: string;
  address?: string;
};

export function KvkkDialogTrigger({
  className,
  label = "KVKK",
  legalName,
  email,
  address,
}: KvkkDialogTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "text-left transition-colors hover:text-bronze-soft",
          className,
        )}
      >
        {label}
      </button>
      <KvkkAydinlatmaDialog
        open={open}
        onOpenChange={setOpen}
        legalName={legalName}
        email={email}
        address={address}
      />
    </>
  );
}
