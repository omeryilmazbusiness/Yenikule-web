"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm, type DefaultValues, type Resolver } from "react-hook-form";

import { MediaUploader } from "@/components/admin/MediaUploader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listingSchema } from "@/features/listings/schemas/listing.schema";
import type { ListingFormValues } from "@/features/listings/schemas/listing.schema";
import {
  handleAdminFormSubmit,
  numberInputProps,
  toastFormValidationErrors,
} from "@/components/admin/admin-form-utils";
import {
  LISTING_CATEGORIES,
  LISTING_STATUSES,
  LISTING_TYPES,
} from "@/lib/constants";
import type { ActionResult } from "@/lib/action-result";
import { cn } from "@/lib/cn";

export const listingFormSchema = listingSchema;

const defaultListingValues: DefaultValues<ListingFormValues> = {
  title: "",
  description: "",
  shortDescription: "",
  category: "konut",
  type: "satilik",
  status: "aktif",
  currency: "TRY",
  rooms: "",
  city: "",
  district: "",
  neighborhood: "",
  address: "",
  features: [],
  media: [],
  isFeatured: false,
};

export type ListingFormProps = {
  defaultValues?: Partial<ListingFormValues>;
  onSubmit: (values: ListingFormValues) => Promise<ActionResult>;
  submitLabel?: string;
  mode?: "create" | "edit";
  className?: string;
};

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="admin-form-section">
      <h2 className="admin-form-section-title">{title}</h2>
      <div className="admin-form-section-body">{children}</div>
    </section>
  );
}

function StringArrayField({
  label,
  description,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  description?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const addItem = () => {
    const trimmed = input.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium leading-none">{label}</p>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          placeholder={placeholder}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
        />
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="size-4" />
          Ekle
        </Button>
      </div>
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {value.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1 text-sm text-secondary-foreground"
            >
              {item}
              <button
                type="button"
                className="rounded-md p-0.5 hover:bg-background/60"
                onClick={() => onChange(value.filter((v) => v !== item))}
                aria-label={`${item} özelliğini kaldır`}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ListingForm({
  defaultValues,
  onSubmit,
  submitLabel,
  mode = "create",
  className,
}: ListingFormProps) {
  const router = useRouter();
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema) as Resolver<ListingFormValues>,
    defaultValues: { ...defaultListingValues, ...defaultValues },
    mode: "onBlur",
  });

  const isSubmitting = form.formState.isSubmitting;
  const fallbackMessage =
    mode === "edit" ? "İlan başarıyla güncellendi." : "İlan başarıyla oluşturuldu.";

  return (
    <Form {...form}>
      <form
        className={cn("space-y-6", className)}
        onSubmit={form.handleSubmit(
          async (values) => {
            const result = await onSubmit(values);
            await handleAdminFormSubmit(result, router, fallbackMessage);
          },
          (errors) => toastFormValidationErrors(errors),
        )}
      >
        <FormSection title="Temel Bilgiler">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Başlık</FormLabel>
                  <FormControl>
                    <Input placeholder="İlan başlığı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Kısa Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Liste ve kartlarda görünecek kısa metin"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Detaylı ilan açıklaması"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LISTING_CATEGORIES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İlan Tipi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Tip seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LISTING_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durum</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LISTING_STATUSES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (isteğe bağlı)</FormLabel>
                  <FormControl>
                    <Input placeholder="otomatik-uretilir" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormDescription>Boş bırakılırsa başlıktan üretilir.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Fiyat ve Ölçüler">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fiyat</FormLabel>
                  <FormControl>
                    <Input {...numberInputProps(field.value, field.onChange)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Para Birimi</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metrekare (m²)</FormLabel>
                  <FormControl>
                    <Input {...numberInputProps(field.value, field.onChange)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oda Sayısı</FormLabel>
                  <FormControl>
                    <Input placeholder="örn. 3+1" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bulunduğu Kat</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalFloors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toplam Kat</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buildingAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bina Yaşı</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Konum">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şehir</FormLabel>
                  <FormControl>
                    <Input placeholder="İstanbul" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İlçe</FormLabel>
                  <FormControl>
                    <Input placeholder="Bağcılar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="neighborhood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mahalle</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Adres</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enlem</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boylam</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      value={field.value ?? ""}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? undefined
                            : Number(event.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Özellikler ve İlişkiler">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <StringArrayField
                    label="Özellikler"
                    description="Asansör, otopark gibi özellikleri ekleyin."
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="Özellik adı"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proje ID (isteğe bağlı)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="UUID"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-lg border border-border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="size-4 rounded border-input accent-primary"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Öne Çıkan İlan</FormLabel>
                    <FormDescription>
                      Ana sayfa ve listelerde öne çıkarılır.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Fotoğraf & Video">
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medya</FormLabel>
                <FormDescription className="text-xs text-muted-foreground">
                  Birden fazla fotoğraf veya video ekleyin. Yıldız ile birincil medyayı seçin.
                </FormDescription>
                <FormControl>
                  <MediaUploader
                    folder="listings"
                    value={field.value ?? []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <div className="admin-form-actions">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Kaydediliyor…
              </>
            ) : (
              submitLabel ?? (mode === "edit" ? "Değişiklikleri Kaydet" : "İlan Oluştur")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
