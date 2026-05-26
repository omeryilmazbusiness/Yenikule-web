import type { ContactMessage } from "@/features/contact/types/contact.types";

const now = new Date().toISOString();

export const mockContactMessages: ContactMessage[] = [
  {
    id: "msg-001",
    name: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "0532 111 22 33",
    subject: "Satış",
    message:
      "Yeni Kule Residence projesindeki 3+1 daire hakkında detaylı bilgi ve ödeme planı almak istiyorum.",
    status: "yeni",
    projectId: "prj-001",
    listingId: "lst-001",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "msg-002",
    name: "Elif Kaya",
    email: "elif.kaya@example.com",
    phone: "0533 444 55 66",
    subject: "Kiralama",
    message:
      "Esenler'deki 2+1 kiralık daire için görüşme randevusu talep ediyorum. Hafta sonu uygunum.",
    status: "okundu",
    listingId: "lst-002",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "msg-003",
    name: "Mehmet Demir",
    email: "mehmet.demir@sirket.com",
    phone: "0212 777 88 99",
    subject: "Proje Bilgisi",
    message:
      "Yeni Kule Vadi projesinin teslim tarihi ve ön satış koşulları hakkında bilgi rica ederim.",
    status: "yanitlandi",
    projectId: "prj-004",
    createdAt: now,
    updatedAt: now,
  },
];
