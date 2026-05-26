import { Container } from "@/components/common/Container";
import { MotionInView, MotionItem } from "@/components/common/MotionInView";
import { aboutValues } from "@/lib/about-content";

export function AboutValuesSection() {
  return (
    <section className="about-page-values relative overflow-hidden">
      <div className="about-page-values-glow" aria-hidden />
      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="about-page-eyebrow about-page-eyebrow-light mx-auto">Değerlerimiz</p>
          <h2 className="about-page-section-title-light mt-4">
            Her Projede Aynı İlkelerle Hareket Ediyoruz
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60 md:text-lg">
            Güven, kalite ve şeffaflık; tüm süreçlerimizin temel taşlarıdır.
          </p>
        </div>

        <MotionInView
          as="ul"
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:gap-6"
        >
          {aboutValues.map((item) => (
            <MotionItem key={item.title} as="li">
              <article className="about-page-value-card">
                <div className="about-page-value-icon" aria-hidden>
                  <item.icon className="size-5 text-bronze-soft" />
                </div>
                <h3 className="font-heading text-lg font-medium text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
                  {item.description}
                </p>
              </article>
            </MotionItem>
          ))}
        </MotionInView>
      </Container>
    </section>
  );
}
