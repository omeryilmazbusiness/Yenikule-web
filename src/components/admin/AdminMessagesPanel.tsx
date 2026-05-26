"use client";

import { useRouter } from "next/navigation";

import { MessageTable } from "@/components/admin/MessageTable";
import { handleAdminFormSubmit } from "@/components/admin/admin-form-utils";
import {
  deleteMessageAction,
  updateMessageStatusAction,
} from "@/app/admin/(panel)/mesajlar/actions";
import type {
  ContactMessage,
  ContactMessageStatus,
} from "@/features/contact/types/contact.types";

type AdminMessagesPanelProps = {
  messages: ContactMessage[];
};

export function AdminMessagesPanel({ messages }: AdminMessagesPanelProps) {
  const router = useRouter();

  return (
    <MessageTable
      messages={messages}
      onStatusChange={async (id, status) => {
        const result = await updateMessageStatusAction(id, status);
        await handleAdminFormSubmit(result, router, "Mesaj durumu güncellendi.");
      }}
      onDelete={async (id) => {
        const result = await deleteMessageAction(id);
        await handleAdminFormSubmit(result, router, "Mesaj silindi.");
      }}
    />
  );
}
