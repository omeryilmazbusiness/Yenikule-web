"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/features/contact/schemas/contact.schema";
import { CONTACT_SUBJECTS } from "@/lib/constants";
import { KvkkConsentField } from "@/components/legal/KvkkConsentField";
import { cn } from "@/lib/cn";

const MESSAGE_MAX = 5000;

type ContactApiResponse = {
  success?: boolean;
  error?: string;
  issues?: Record<string, string[] | undefined>;
};

function isContactSubject(value: string): value is (typeof CONTACT_SUBJECTS)[number] {
  return (CONTACT_SUBJECTS as readonly string[]).includes(value);
}

export function ContactForm() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: CONTACT_SUBJECTS[0],
      message: "",
      consent: false,
      hp: "",
      listingId: undefined,
      projectId: undefined,
      vehicleId: undefined,
    },
  });

  const messageLength = form.watch("message")?.length ?? 0;

  useEffect(() => {
    const subjectParam = searchParams.get("konu") ?? searchParams.get("subject");
    if (subjectParam && isContactSubject(subjectParam)) {
      form.setValue("subject", subjectParam);
    }

    const listingId = searchParams.get("listingId");
    if (listingId) {
      form.setValue("listingId", listingId);
    }

    const projectId = searchParams.get("projectId");
    if (projectId) {
      form.setValue("projectId", projectId);
    }

    const vehicleId = searchParams.get("vehicleId");
    if (vehicleId) {
      form.setValue("vehicleId", vehicleId);
    }
  }, [searchParams, form]);

  function applyServerErrors(issues: ContactApiResponse["issues"]) {
    if (!issues) return;

    for (const [field, messages] of Object.entries(issues)) {
      const message = messages?.[0];
      if (!message) continue;
      if (field in form.getValues()) {
        form.setError(field as keyof ContactFormValues, { message });
      }
    }
  }

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as ContactApiResponse;

      if (!response.ok || !data.success) {
        applyServerErrors(data.issues);
        throw new Error(data.error ?? "Mesaj gönderilemedi.");
      }

      setIsSuccess(true);
      toast.success("Mesajınız alındı. En kısa sürede size dönüş yapacağız.");
      form.reset({
        name: "",
        email: "",
        phone: "",
        subject: CONTACT_SUBJECTS[0],
        message: "",
        consent: false,
        hp: "",
        listingId: values.listingId,
        projectId: values.projectId,
        vehicleId: values.vehicleId,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Bir hata oluştu. Lütfen tekrar deneyin.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <div
        className="contact-page-form-success"
        role="status"
        aria-live="polite"
      >
        <span className="contact-page-form-success-icon" aria-hidden>
          <CheckCircle2 className="size-8 text-bronze" />
        </span>
        <h2 className="font-heading text-2xl font-medium text-foreground">
          Mesajınız Başarıyla İletildi
        </h2>
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
          Talebiniz ekibimize ulaştı. En kısa sürede belirttiğiniz iletişim bilgilerinden
          size dönüş yapacağız.
        </p>
        <Button
          type="button"
          className="mt-8 min-h-12 rounded-full px-8"
          onClick={() => setIsSuccess(false)}
        >
          Yeni Mesaj Gönder
        </Button>
      </div>
    );
  }

  return (
    <div className="contact-page-form">
      <div className="contact-page-form-head">
        <h2 className="font-heading text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          İletişim Formu
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
          Formu doldurun; satış, kiralama ve proje talepleriniz için ekibimiz sizinle
          iletişime geçsin.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
          noValidate
        >
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="contact-page-hp"
            {...form.register("hp")}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Soyad</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Adınız Soyadınız"
                      autoComplete="name"
                      className="contact-page-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="05xx xxx xx xx"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className="contact-page-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="ornek@email.com"
                    autoComplete="email"
                    className="contact-page-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konu</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="contact-page-input h-11 w-full">
                      <SelectValue placeholder="Konu seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CONTACT_SUBJECTS.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
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
            name="message"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-2">
                  <FormLabel>Mesajınız</FormLabel>
                  <span
                    className={cn(
                      "text-xs tabular-nums text-muted-foreground",
                      messageLength > MESSAGE_MAX - 100 && "text-destructive",
                    )}
                    aria-live="polite"
                  >
                    {messageLength} / {MESSAGE_MAX}
                  </span>
                </div>
                <FormControl>
                  <Textarea
                    rows={6}
                    placeholder="Talebinizi kısaca açıklayın..."
                    className="contact-page-textarea min-h-[9rem] resize-y"
                    maxLength={MESSAGE_MAX}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <KvkkConsentField
                    checked={field.value === true}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-h-12 w-full rounded-full px-8 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="size-4" aria-hidden />
                Mesajı Gönder
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
