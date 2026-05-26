"use client";

import { useState } from "react";

import { ImageUploader } from "@/components/admin/ImageUploader";
import { MediaGrid } from "@/components/admin/MediaGrid";

export function AdminMediaClient() {
  const [images, setImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | undefined>();

  return (
    <div className="space-y-6">
      <ImageUploader
        value={images}
        onChange={(urls) => {
          setImages(urls);
          if (!coverImage && urls[0]) {
            setCoverImage(urls[0]);
          }
        }}
      />
      <MediaGrid
        images={images}
        coverImage={coverImage}
        onRemove={(url) => setImages((prev) => prev.filter((item) => item !== url))}
        onSetCover={setCoverImage}
      />
    </div>
  );
}
