import { Container } from "@/components/common/Container";
import { MotionInView, MotionItem } from "@/components/common/MotionInView";
import { aboutServices } from "@/lib/about-content";

export function AboutServicesSection() {
  return (
    <section
      id="hizmetler"
      className="about-page-services scroll-mt-24 md:scroll-mt-28"
      aria-labelledby="about-services-heading"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow mb-3">Hizmetlerimiz</p>
          <h2 id="about-services-heading" className="about-page-section-title">
            Proje Geliştirmeden Satış Sonrasına Uçtan Uca Destek
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            İnşaat, gayrimenkul ve araç portföyünde ihtiyacınıza uygun profesyonel
            çözümler sunuyoruz.
          </p>
        </div>

        <MotionInView
          as="ul"
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6"
        >
          {aboutServices.map((service, index) => (
            <MotionItem key={service.title} as="li">
              <article className="about-page-service-card group h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="soft-card-icon about-page-service-icon">
                    <service.icon className="size-5" aria-hidden />
                  </div>
                  {service.tag ? (
                    <span className="about-page-service-tag">{service.tag}</span>
                  ) : null}
                </div>
                <span className="about-page-service-index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-heading text-lg font-medium text-foreground transition-premium group-hover:text-bronze">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {service.description}
                </p>
              </article>
            </MotionItem>
          ))}
        </MotionInView>
      </Container>
    </section>
  );
}
