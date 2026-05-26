"use client";

import { Film, ImagePlus, Loader2, Star, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  createListingMediaItem,
  isVideoMediaUrl,
} from "@/features/listings/utils/listing-media";
import type { ListingMedia } from "@/features/listings/types/listing-media.types";
import { cn } from "@/lib/cn";
import { sanitizeImageUrl } from "@/lib/images";

export type MediaUploaderProps = {
  value: ListingMedia[];
  onChange: (media: ListingMedia[]) => void;
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  folder?: "listings" | "projects" | "vehicles" | "general";
};

export function MediaUploader({
  value,
  onChange,
  maxFiles = 16,
  disabled = false,
  className,
  folder = "listings",
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const blobUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const blobUrls = blobUrlsRef.current;
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
      blobUrls.clear();
    };
  }, []);

  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const payload = (await response.json()) as {
        success?: boolean;
        files?: { url: string }[];
        error?: string;
      };

      if (!response.ok || !payload.files?.[0]?.url) {
        throw new Error(payload.error ?? "Dosya yüklenemedi.");
      }

      return sanitizeImageUrl(payload.files[0].url);
    },
    [folder],
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length || disabled) return;

      const remaining = maxFiles - value.length;
      if (remaining <= 0) return;

      const selected = Array.from(files).slice(0, remaining);
      setIsUploading(true);

      try {
        const uploaded: ListingMedia[] = [];

        for (const file of selected) {
          const blobUrl = URL.createObjectURL(file);
          blobUrlsRef.current.add(blobUrl);
          const serverUrl = await uploadFile(file);
          const type =
            file.type.startsWith("video/") || isVideoMediaUrl(serverUrl)
              ? "video"
              : "image";

          uploaded.push(
            createListingMediaItem(
              type,
              serverUrl,
              value.length === 0 && uploaded.length === 0,
            ),
          );
          setPreviews((current) => ({ ...current, [serverUrl]: blobUrl }));
        }

        onChange([...value, ...uploaded]);
        toast.success(
          uploaded.length === 1 ? "Dosya yüklendi." : `${uploaded.length} dosya yüklendi.`,
        );
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Yükleme başarısız.");
      } finally {
        setIsUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [disabled, maxFiles, onChange, uploadFile, value],
  );

  const removeItem = (id: string) => {
    const item = value.find((entry) => entry.id === id);
    if (item) {
      const blob = previews[item.url];
      if (blob) {
        URL.revokeObjectURL(blob);
        blobUrlsRef.current.delete(blob);
      }
    }

    const next = value.filter((entry) => entry.id !== id);
    if (next.length > 0 && !next.some((entry) => entry.isPrimary)) {
      next[0] = { ...next[0]!, isPrimary: true };
    }
    onChange(next);
  };

  const setPrimary = (id: string) => {
    onChange(
      value.map((entry) => ({
        ...entry,
        isPrimary: entry.id === id,
      })),
    );
  };

  const canAddMore = value.length < maxFiles;

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "admin-media-dropzone",
          canAddMore && !disabled && "admin-media-dropzone-active",
          (!canAddMore || disabled) && "opacity-60",
        )}
      >
        <div className="admin-media-dropzone-icon">
          {isUploading ? (
            <Loader2 className="size-6 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="size-6" aria-hidden />
          )}
        </div>
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium">Fotoğraf veya video ekleyin</p>
          <p className="text-xs text-muted-foreground">
            En fazla {maxFiles} dosya · Birincil medya seçilebilir
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || !canAddMore || isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? "Yükleniyor…" : "Dosya Seç"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/webm,video/quicktime"
          multiple
          className="sr-only"
          disabled={disabled || !canAddMore || isUploading}
          onChange={(event) => void handleFiles(event.target.files)}
        />
      </div>

      {value.length > 0 ? (
        <ul className="admin-media-grid">
          {value.map((item) => {
            const preview = previews[item.url] ?? item.url;
            const isVideo = item.type === "video";

            return (
              <li
                key={item.id}
                className={cn(
                  "admin-media-item",
                  item.isPrimary && "admin-media-item-primary",
                )}
              >
                {isVideo ? (
                  <video
                    src={preview}
                    className="admin-media-preview"
                    muted
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="" className="admin-media-preview" />
                )}

                <span className="admin-media-type-badge">
                  {isVideo ? (
                    <>
                      <Film className="size-3" aria-hidden /> Video
                    </>
                  ) : (
                    "Foto"
                  )}
                </span>

                <div className="admin-media-item-actions">
                  <button
                    type="button"
                    className={cn(
                      "admin-media-primary-btn",
                      item.isPrimary && "admin-media-primary-btn-active",
                    )}
                    onClick={() => setPrimary(item.id)}
                    aria-label="Birincil medya yap"
                    title="Birincil"
                  >
                    <Star className="size-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    className="admin-media-remove-btn"
                    onClick={() => removeItem(item.id)}
                    aria-label="Kaldır"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
