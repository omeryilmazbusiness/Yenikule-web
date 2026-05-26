import { env } from "@/lib/env";
import type {
  StorageProvider,
  UploadInput,
  UploadResult,
} from "@/features/uploads/upload.types";

/**
 * Vercel Blob depolama sağlayıcısı.
 * BLOB_READ_WRITE_TOKEN tanımlı olduğunda @vercel/blob ile entegre edilebilir.
 */
export class VercelBlobStorageProvider implements StorageProvider {
  private get isConfigured(): boolean {
    return Boolean(env.BLOB_READ_WRITE_TOKEN);
  }

  async upload(_input: UploadInput): Promise<UploadResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        error:
          "Vercel Blob yapılandırılmamış. BLOB_READ_WRITE_TOKEN ortam değişkenini tanımlayın.",
      };
    }

    return {
      success: false,
      error:
        "Vercel Blob entegrasyonu henüz tamamlanmadı. @vercel/blob paketini ekleyip put() metodunu kullanın.",
    };
  }

  async delete(_pathname: string): Promise<boolean> {
    if (!this.isConfigured) return false;
    return false;
  }

  getUrl(pathname: string): string {
    return `https://blob.vercel-storage.com${pathname}`;
  }
}

export const vercelBlobStorageProvider = new VercelBlobStorageProvider();
