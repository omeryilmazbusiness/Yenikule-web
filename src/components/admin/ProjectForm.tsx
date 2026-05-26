"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm, type DefaultValues, type Resolver } from "react-hook-form";

import { ImageUploader } from "@/components/admin/ImageUploader";
import { MediaGrid } from "@/components/admin/MediaGrid";
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
import { projectSchema } from "@/features/projects/schemas/project.schema";
import type { ProjectFormValues } from "@/features/projects/schemas/project.schema";
import {
  handleAdminFormSubmit,
  numberInputProps,
  toastFormValidationErrors,
} from "@/components/admin/admin-form-utils";
import { PROJECT_STATUSES } from "@/lib/constants";
import type { ActionResult } from "@/lib/action-result";
import { cn } from "@/lib/cn";

export const projectFormSchema = projectSchema;

const defaultProjectValues: DefaultValues<ProjectFormValues> = {
  name: "",
  title: "",
  description: "",
  shortDescription: "",
  status: "planlama",
  city: "",
  district: "",
  neighborhood: "",
  address: "",
  totalUnits: 1,
  availableUnits: 0,
  startYear: new Date().getFullYear(),
  features: [],
  amenities: [],
  images: [],
  isFeatured: false,
};

export type ProjectFormProps = {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<ActionResult>;
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
    <section className="space-y-4 rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {children}
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
                aria-label={`${item} öğesini kaldır`}
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

export function ProjectForm({
  defaultValues,
  onSubmit,
  submitLabel,
  mode = "create",
  className,
}: ProjectFormProps) {
  const router = useRouter();
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema) as Resolver<ProjectFormValues>,
    defaultValues: { ...defaultProjectValues, ...defaultValues },
    mode: "onBlur",
  });

  const images = form.watch("images");
  const isSubmitting = form.formState.isSubmitting;
  const fallbackMessage =
    mode === "edit" ? "Proje başarıyla güncellendi." : "Proje başarıyla oluşturuldu.";

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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proje Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Yeni Kule Residence" {...field} />
                  </FormControl>
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
                      {PROJECT_STATUSES.map((option) => (
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
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Başlık</FormLabel>
                  <FormControl>
                    <Input placeholder="Vitrin başlığı" {...field} />
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
                    <Textarea rows={2} {...field} />
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
                    <Textarea rows={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Slug (isteğe bağlı)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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

        <FormSection title="Proje Detayları">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="totalUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Toplam Birim</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availableUnits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Müsait Birim</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlangıç Yılı</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deliveryYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teslim Yılı</FormLabel>
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
          </div>
        </FormSection>

        <FormSection title="Özellikler">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <StringArrayField
                    label="Özellikler"
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="örn. Kapalı otopark"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <StringArrayField
                    label="Sosyal Olanaklar"
                    value={field.value ?? []}
                    onChange={field.onChange}
                    placeholder="örn. Havuz"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brochureUrl"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Broşür URL (isteğe bağlı)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://"
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
                <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-lg border border-border p-4 md:col-span-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="size-4 rounded border-input accent-primary"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Öne Çıkan Proje</FormLabel>
                    <FormDescription>Ana sayfada öne çıkarılır.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Görseller">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Galeri Görselleri</FormLabel>
                  <FormControl>
                    <ImageUploader
                      folder="projects"
                      value={field.value}
                      onChange={(urls) => {
                        field.onChange(urls);
                        if (!form.getValues("coverImage") && urls[0]) {
                          form.setValue("coverImage", urls[0], {
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {images.length > 0 ? (
              <FormField
                control={form.control}
                name="coverImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kapak Görseli</FormLabel>
                    <FormDescription>
                      Yıldız simgesiyle kapak görselini seçin.
                    </FormDescription>
                    <MediaGrid
                      images={images}
                      coverImage={field.value}
                      onSetCover={field.onChange}
                      onRemove={(url) => {
                        const nextImages = images.filter((item) => item !== url);
                        field.onChange(
                          field.value === url
                            ? (nextImages[0] ?? "")
                            : field.value,
                        );
                        form.setValue("images", nextImages, {
                          shouldValidate: true,
                        });
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </div>
        </FormSection>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Kaydediliyor…
              </>
            ) : (
              submitLabel ??
              (mode === "edit" ? "Değişiklikleri Kaydet" : "Proje Oluştur")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
