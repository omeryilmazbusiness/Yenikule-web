import { Container } from "@/components/common/Container";
import { MotionInView, MotionItem } from "@/components/common/MotionInView";
import { aboutPillars } from "@/lib/about-content";
import { getPublicSiteConfig } from "@/lib/get-public-site-config";

export async function AboutStorySection() {
  const siteConfig = await getPublicSiteConfig();
  return (
    <section className="about-page-story">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-start">
          <MotionInView className="space-y-6">
            <div>
              <p className="section-eyebrow mb-3">Hikayemiz</p>
              <h2 className="about-page-section-title">
                Kaliteyi, Güveni ve Modern Yaşamı Bir Araya Getiriyoruz
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              {siteConfig.company.legalName}, Bağcılar ve çevresinde yılların deneyimiyle
              inşaat taahhüt, proje geliştirme ve gayrimenkul portföy yönetimi alanlarında
              faaliyet göstermektedir. Modern mimari anlayışı, enerji verimli yapı
              standartları ve zamanında teslim prensibiyle bölgenin güvenilir markalarından
              biri olmayı sürdürüyoruz.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">
              {siteConfig.about}
            </p>
          </MotionInView>

          <MotionInView as="ul" className="space-y-4">
            {aboutPillars.map((pillar, index) => (
              <MotionItem key={pillar.title} as="li">
                <article className="about-page-pillar">
                  <span className="about-page-pillar-index" aria-hidden>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="about-page-pillar-icon" aria-hidden>
                        <pillar.icon className="size-4 text-bronze" />
                      </span>
                      <h3 className="font-heading text-lg font-medium text-foreground">
                        {pillar.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                      {pillar.text}
                    </p>
                  </div>
                </article>
              </MotionItem>
            ))}
          </MotionInView>
        </div>
      </Container>
    </section>
  );
}
