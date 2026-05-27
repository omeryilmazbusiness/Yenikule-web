export type KvkkSection = {
  title: string;
  paragraphs: string[];
};

export type KvkkMetniParams = {
  legalName: string;
  email: string;
  address: string;
};

export function getKvkkAydinlatmaMetni({
  legalName,
  email,
  address,
}: KvkkMetniParams): KvkkSection[] {
  return [
    {
      title: "Veri Sorumlusu",
      paragraphs: [
        `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu ${legalName}'dir.`,
        `İletişim: ${email} · Adres: ${address}`,
      ],
    },
    {
      title: "İşlenen Kişisel Veriler",
      paragraphs: [
        "Web sitemiz ve iletişim kanallarımız üzerinden; kimlik (ad, soyad), iletişim (telefon, e-posta), talep/şikâyet içeriği, işlem güvenliği (IP, log) ve çerez verileriniz işlenebilir.",
        "İlan, proje veya araç detay sayfalarından gelen taleplerde ilgili portföy bilgisi de mesajınızla birlikte kaydedilebilir.",
      ],
    },
    {
      title: "İşleme Amaçları",
      paragraphs: [
        "İletişim taleplerinize dönüş sağlamak, satış/kiralama ve danışmanlık süreçlerini yürütmek, sözleşme öncesi bilgilendirme yapmak, hukuki yükümlülükleri yerine getirmek ve bilgi güvenliğini sağlamak.",
      ],
    },
    {
      title: "Hukuki Sebepler",
      paragraphs: [
        "KVKK m.5/2 (c) sözleşmenin kurulması veya ifası, (f) meşru menfaat, (ç) hukuki yükümlülük; açık rızanızın gerektiği hallerde m.5/1 kapsamında açık rızanız.",
      ],
    },
    {
      title: "Aktarım",
      paragraphs: [
        "Verileriniz; barındırma, e-posta ve teknik altyapı hizmet sağlayıcılarına, yasal zorunluluk halinde yetkili kamu kurumlarına aktarılabilir. Yurt dışına aktarım, gerekli güvenlik tedbirleri alınarak ve mevzuata uygun şekilde yapılır.",
      ],
    },
    {
      title: "Saklama Süresi",
      paragraphs: [
        "Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuattaki zamanaşımı süreleri kadar saklanır; süre sonunda silinir, yok edilir veya anonim hale getirilir.",
      ],
    },
    {
      title: "Haklarınız",
      paragraphs: [
        "KVKK m.11 kapsamında; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme, silme, itiraz ve zararın giderilmesini talep etme haklarına sahipsiniz.",
        `Başvurularınızı ${email} adresine iletebilirsiniz. Başvurularınız en geç 30 gün içinde sonuçlandırılır.`,
      ],
    },
  ];
}
