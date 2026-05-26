import { getSupabaseConfig } from "@/lib/supabase";
import type {
  StorageProvider,
  UploadInput,
  UploadResult,
} from "@/features/uploads/upload.types";

const DEFAULT_BUCKET = "uploads";

/**
 * Supabase Storage sağlayıcısı.
 * Supabase ortam değişkenleri tanımlı olduğunda entegre edilebilir.
 */
export class SupabaseStorageProvider implements StorageProvider {
  private get isConfigured(): boolean {
    return getSupabaseConfig() !== null;
  }

  async upload(_input: UploadInput): Promise<UploadResult> {
    if (!this.isConfigured) {
      return {
        success: false,
        error:
          "Supabase Storage yapılandırılmamış. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlayın.",
      };
    }

    return {
      success: false,
      error: `Supabase Storage entegrasyonu henüz tamamlanmadı. "${DEFAULT_BUCKET}" bucket'ına upload implementasyonu ekleyin.`,
    };
  }

  async delete(_pathname: string): Promise<boolean> {
    if (!this.isConfigured) return false;
    return false;
  }

  getUrl(pathname: string): string {
    const config = getSupabaseConfig();
    if (!config) return pathname;
    return `${config.url}/storage/v1/object/public/${DEFAULT_BUCKET}${pathname}`;
  }
}

export const supabaseStorageProvider = new SupabaseStorageProvider();
