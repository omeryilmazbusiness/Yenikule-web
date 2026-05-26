"use client";

import { MoreHorizontal } from "lucide-react";

import { AdminDataTable, type AdminDataTableColumn } from "@/components/admin/AdminDataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  ContactMessage,
  ContactMessageStatus,
} from "@/features/contact/types/contact.types";
import { formatDateTime, formatPhone } from "@/lib/format";

const STATUS_LABELS: Record<ContactMessageStatus, string> = {
  yeni: "Yeni",
  okundu: "Okundu",
  yanitlandi: "Yanıtlandı",
  arsiv: "Arşiv",
};

const STATUS_VARIANTS: Record<
  ContactMessageStatus,
  "default" | "secondary" | "outline" | "accent"
> = {
  yeni: "accent",
  okundu: "secondary",
  yanitlandi: "default",
  arsiv: "outline",
};

export type MessageTableProps = {
  messages: ContactMessage[];
  isLoading?: boolean;
  emptyMessage?: string;
  onStatusChange?: (
    id: string,
    status: ContactMessageStatus,
  ) => void | Promise<void>;
  onDelete?: (id: string) => void | Promise<void>;
};

export function MessageTable({
  messages,
  isLoading = false,
  emptyMessage = "Henüz mesaj bulunmuyor.",
  onStatusChange,
  onDelete,
}: MessageTableProps) {
  const columns: AdminDataTableColumn<ContactMessage>[] = [
    {
      key: "name",
      header: "Gönderen",
      cell: (message) => (
        <div className="space-y-0.5">
          <p className="font-medium text-foreground">{message.name}</p>
          <p className="text-xs text-muted-foreground">{message.email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Telefon",
      cell: (message) => (
        <span className="whitespace-nowrap text-sm">
          {formatPhone(message.phone)}
        </span>
      ),
    },
    {
      key: "subject",
      header: "Konu",
      cell: (message) => (
        <span className="font-medium text-foreground">{message.subject}</span>
      ),
    },
    {
      key: "message",
      header: "Mesaj",
      className: "max-w-xs",
      cell: (message) => (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {message.message}
        </p>
      ),
    },
    {
      key: "status",
      header: "Durum",
      cell: (message) => (
        <Badge variant={STATUS_VARIANTS[message.status]}>
          {STATUS_LABELS[message.status]}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      header: "Tarih",
      cell: (message) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDateTime(message.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-[4rem] text-right",
      cell: (message) =>
        onStatusChange || onDelete ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Mesaj işlemleri">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onStatusChange ? (
                <>
                  <DropdownMenuLabel>Durumu güncelle</DropdownMenuLabel>
                  {(Object.keys(STATUS_LABELS) as ContactMessageStatus[]).map(
                    (status) => (
                      <DropdownMenuItem
                        key={status}
                        disabled={message.status === status}
                        onClick={() => void onStatusChange(message.id, status)}
                      >
                        {STATUS_LABELS[status]}
                      </DropdownMenuItem>
                    ),
                  )}
                </>
              ) : null}
              {onDelete ? (
                <>
                  {onStatusChange ? <DropdownMenuSeparator /> : null}
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => void onDelete(message.id)}
                  >
                    Sil
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null,
    },
  ];

  return (
    <AdminDataTable
      columns={columns}
      data={messages}
      keyExtractor={(message) => message.id}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
      caption="İletişim mesajları tablosu"
    />
  );
}
