import { mockStorageProvider } from "@/features/uploads/mock-storage.provider";
import { supabaseStorageProvider } from "@/features/uploads/supabase-storage.provider";
import type {
  StorageProvider,
  UploadInput,
  UploadResult,
  UploadedFile,
} from "@/features/uploads/upload.types";
import { vercelBlobStorageProvider } from "@/features/uploads/vercel-blob.provider";
import { env, isMockMode } from "@/lib/env";

export type StorageBackend = "mock" | "vercel-blob" | "supabase";

function resolveProvider(backend?: StorageBackend): StorageProvider {
  if (backend === "vercel-blob" && env.BLOB_READ_WRITE_TOKEN) {
    return vercelBlobStorageProvider;
  }

  if (backend === "supabase" && env.NEXT_PUBLIC_SUPABASE_URL) {
    return supabaseStorageProvider;
  }

  if (isMockMode()) {
    return mockStorageProvider;
  }

  if (env.BLOB_READ_WRITE_TOKEN) {
    return vercelBlobStorageProvider;
  }

  if (env.NEXT_PUBLIC_SUPABASE_URL) {
    return supabaseStorageProvider;
  }

  return mockStorageProvider;
}

export const uploadService = {
  async upload(
    input: UploadInput,
    backend?: StorageBackend,
  ): Promise<UploadResult> {
    const provider = resolveProvider(backend);
    return provider.upload(input);
  },

  async delete(pathname: string, backend?: StorageBackend): Promise<boolean> {
    const provider = resolveProvider(backend);
    return provider.delete(pathname);
  },

  getUrl(pathname: string, backend?: StorageBackend): string {
    const provider = resolveProvider(backend);
    return provider.getUrl(pathname);
  },

  async uploadMultiple(
    inputs: UploadInput[],
    backend?: StorageBackend,
  ): Promise<{ succeeded: UploadedFile[]; failed: string[] }> {
    const succeeded: UploadedFile[] = [];
    const failed: string[] = [];

    for (const input of inputs) {
      const result = await this.upload(input, backend);
      if (result.success) {
        succeeded.push(result.file);
      } else {
        failed.push(`${input.filename}: ${result.error}`);
      }
    }

    return { succeeded, failed };
  },
};
