import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata({
  title: "Gizlilik Politikası",
  description: "Yeni Kule İnşaat gizlilik politikası ve kişisel verilerin korunması.",
  path: routes.legal.privacy,
});

export default function PrivacyPage() {
  return (
    <PageShell title="Gizlilik Politikası">
      <div className="prose prose-stone max-w-none space-y-6 text-muted-foreground">
        <p>
          {siteConfig.company.legalName} (&quot;Şirket&quot;) olarak web sitemizi
          ziyaret eden kullanıcıların gizliliğine önem veriyoruz. Bu politika,
          kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu
          açıklar.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Toplanan Veriler</h2>
        <p>
          İletişim formu aracılığıyla ad, soyad, telefon, e-posta ve mesaj içeriği;
          teknik loglar aracılığıyla IP adresi, tarayıcı bilgisi ve çerez verileri
          toplanabilir.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Verilerin Kullanımı</h2>
        <p>
          Toplanan veriler yalnızca talebinize yanıt vermek, hizmet sunmak ve yasal
          yükümlülükleri yerine getirmek amacıyla işlenir. Üçüncü taraflarla
          pazarlama amacıyla paylaşılmaz.
        </p>
        <h2 className="text-lg font-semibold text-foreground">Haklarınız</h2>
        <p>
          KVKK kapsamında verilerinize erişim, düzeltme, silme ve itiraz haklarına
          sahipsiniz. Talepleriniz için {siteConfig.email} adresine yazabilirsiniz.
        </p>
      </div>
    </PageShell>
  );
}
