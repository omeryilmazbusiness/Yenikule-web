export type UploadFolder =
  | "listings"
  | "projects"
  | "vehicles"
  | "general";

export type UploadedFile = {
  id: string;
  url: string;
  pathname: string;
  filename: string;
  contentType: string;
  size: number;
  folder: UploadFolder;
  uploadedAt: string;
};

export type UploadInput = {
  file: File | Buffer;
  filename: string;
  contentType: string;
  folder?: UploadFolder;
};

export type UploadResult =
  | { success: true; file: UploadedFile }
  | { success: false; error: string };

export interface StorageProvider {
  upload(input: UploadInput): Promise<UploadResult>;
  delete(pathname: string): Promise<boolean>;
  getUrl(pathname: string): string;
}
