import type {
  StorageProvider,
  UploadFolder,
  UploadInput,
  UploadResult,
  UploadedFile,
} from "@/features/uploads/upload.types";
import { createId } from "@/lib/validations";

type StoredUpload = UploadedFile & { buffer: Buffer };

const globalStore = globalThis as typeof globalThis & {
  __uploadStore?: Map<string, StoredUpload>;
};

function getStore(): Map<string, StoredUpload> {
  if (!globalStore.__uploadStore) {
    globalStore.__uploadStore = new Map();
  }
  return globalStore.__uploadStore;
}

function buildPathname(folder: UploadFolder, filename: string): string {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `/${folder}/${Date.now()}-${safeName}`;
}

function toBuffer(file: File | Buffer): Buffer {
  if (Buffer.isBuffer(file)) return file;
  throw new Error("Mock storage expects Buffer on the server.");
}

export function getMockUpload(pathname: string): StoredUpload | undefined {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return getStore().get(normalized);
}

export class MockStorageProvider implements StorageProvider {
  async upload(input: UploadInput): Promise<UploadResult> {
    try {
      const folder = input.folder ?? "general";
      const pathname = buildPathname(folder, input.filename);
      const id = createId();
      const buffer = toBuffer(input.file);
      const size = buffer.byteLength;

      const uploaded: StoredUpload = {
        id,
        url: `/api/uploads/mock${pathname}`,
        pathname,
        filename: input.filename,
        contentType: input.contentType || "application/octet-stream",
        size,
        folder,
        uploadedAt: new Date().toISOString(),
        buffer,
      };

      getStore().set(pathname, uploaded);
      return { success: true, file: uploaded };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Dosya yüklenemedi.";
      return { success: false, error: message };
    }
  }

  async delete(pathname: string): Promise<boolean> {
    const key = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return getStore().delete(key);
  }

  getUrl(pathname: string): string {
    const key = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const file = getStore().get(key);
    return file?.url ?? `/api/uploads/mock${key}`;
  }
}

export const mockStorageProvider = new MockStorageProvider();
