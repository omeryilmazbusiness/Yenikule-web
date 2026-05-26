"use client";

import { Star, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type MediaGridProps = {
  images: string[];
  coverImage?: string;
  onRemove?: (url: string) => void;
  onSetCover?: (url: string) => void;
  disabled?: boolean;
  className?: string;
  emptyLabel?: string;
};

export function MediaGrid({
  images,
  coverImage,
  onRemove,
  onSetCover,
  disabled = false,
  className,
  emptyLabel = "Henüz görsel eklenmedi.",
}: MediaGridProps) {
  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-[8rem] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 px-4 text-sm text-muted-foreground",
          className,
        )}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        className,
      )}
    >
      {images.map((url) => {
        const isCover = coverImage === url;

        return (
          <li
            key={url}
            className={cn(
              "group relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted",
              isCover ? "border-primary ring-2 ring-primary/20" : "border-border",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={isCover ? "Kapak görseli" : "Galeri görseli"}
              className="size-full object-cover"
            />

            {isCover ? (
              <Badge className="absolute left-2 top-2" variant="accent">
                Kapak
              </Badge>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-1 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              {onSetCover && !isCover ? (
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="size-8"
                  disabled={disabled}
                  onClick={() => onSetCover(url)}
                  aria-label="Kapak yap"
                >
                  <Star className="size-4" />
                </Button>
              ) : null}
              {onRemove ? (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="size-8"
                  disabled={disabled}
                  onClick={() => onRemove(url)}
                  aria-label="Görseli kaldır"
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
