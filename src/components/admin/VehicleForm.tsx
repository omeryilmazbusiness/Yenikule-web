"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm, type DefaultValues, type Resolver } from "react-hook-form";

import { ImageUploader } from "@/components/admin/ImageUploader";
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
import { vehicleSchema } from "@/features/vehicles/schemas/vehicle.schema";
import type { VehicleFormValues } from "@/features/vehicles/schemas/vehicle.schema";
import { VEHICLE_CATEGORIES, VEHICLE_STATUSES } from "@/lib/constants";
import {
  handleAdminFormSubmit,
  numberInputProps,
  toastFormValidationErrors,
} from "@/components/admin/admin-form-utils";
import type { ActionResult } from "@/lib/action-result";
import { cn } from "@/lib/cn";

export const vehicleFormSchema = vehicleSchema;

const FUEL_TYPES = [
  { value: "benzin", label: "Benzin" },
  { value: "dizel", label: "Dizel" },
  { value: "lpg", label: "LPG" },
  { value: "hibrit", label: "Hibrit" },
  { value: "elektrik", label: "Elektrik" },
] as const;

const TRANSMISSION_TYPES = [
  { value: "manuel", label: "Manuel" },
  { value: "otomatik", label: "Otomatik" },
] as const;

const defaultVehicleValues: DefaultValues<VehicleFormValues> = {
  title: "",
  description: "",
  shortDescription: "",
  category: "otomobil",
  status: "aktif",
  brand: "",
  model: "",
  trim: "",
  condition: {
    accidentFree: false,
    paintFree: false,
  },
  year: new Date().getFullYear(),
  fuelType: "benzin",
  transmission: "otomatik",
  color: "",
  currency: "TRY",
  city: "",
  features: [],
  images: [],
  isFeatured: false,
};

export type VehicleFormProps = {
  defaultValues?: Partial<VehicleFormValues>;
  onSubmit: (values: VehicleFormValues) => Promise<ActionResult>;
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

export function VehicleForm({
  defaultValues,
  onSubmit,
  submitLabel,
  mode = "create",
  className,
}: VehicleFormProps) {
  const router = useRouter();
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema) as Resolver<VehicleFormValues>,
    defaultValues: { ...defaultVehicleValues, ...defaultValues },
    mode: "onBlur",
  });

  const isSubmitting = form.formState.isSubmitting;
  const fallbackMessage =
    mode === "edit"
      ? "Araç ilanı başarıyla güncellendi."
      : "Araç ilanı başarıyla oluşturuldu.";

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
                      {VEHICLE_CATEGORIES.map((option) => (
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
                      {VEHICLE_STATUSES.map((option) => (
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

        <FormSection title="Araç Detayları">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marka</FormLabel>
                  <FormControl>
                    <Input placeholder="örn. Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="örn. Corolla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trim"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paket / Donanım</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="örn. M Sport, Long Range"
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
              name="condition.accidentFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-lg border border-border p-4 md:col-span-2 lg:col-span-1">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="size-4 rounded border-input accent-primary"
                      checked={field.value ?? false}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Kazasız</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condition.paintFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-3 space-y-0 rounded-lg border border-border p-4 md:col-span-2 lg:col-span-1">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="size-4 rounded border-input accent-primary"
                      checked={field.value ?? false}
                      onChange={(event) => field.onChange(event.target.checked)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Boyasız</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Yılı</FormLabel>
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
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kilometre</FormLabel>
                  <FormControl>
                    <Input {...numberInputProps(field.value, field.onChange)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yakıt Tipi</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Yakıt tipi seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FUEL_TYPES.map((option) => (
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
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vites</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Vites tipi seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSMISSION_TYPES.map((option) => (
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
              name="engineSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motor Hacmi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="örn. 1.6"
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
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renk</FormLabel>
                  <FormControl>
                    <Input placeholder="örn. Beyaz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Fiyat ve Konum">
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
          </div>
        </FormSection>

        <FormSection title="Özellikler">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <StringArrayField
                    label="Özellikler"
                    description="Klima, sunroof gibi özellikleri ekleyin."
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
                    <FormLabel>Öne Çıkan Araç</FormLabel>
                    <FormDescription>
                      Ana sayfa ve listelerde öne çıkarılır.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Görseller">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Görseller</FormLabel>
                <FormControl>
                  <ImageUploader
                    folder="vehicles"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
              (mode === "edit" ? "Değişiklikleri Kaydet" : "Araç Oluştur")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
