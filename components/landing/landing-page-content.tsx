import { Separator } from "@/components/ui/separator";

import { ContactSection } from "@/components/landing/contact-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSlider } from "@/components/landing/hero-slider";
import type { LandingData } from "@/lib/content/types";

type LandingPageContentProps = {
  data: LandingData;
};

export function LandingPageContent({ data }: LandingPageContentProps) {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-5 py-10 sm:px-8">
      <HeroSlider slides={data.heroSlider} />
      <FeaturesSection items={data.features} />
      <Separator />
      <FaqSection items={data.faq} />
      <ContactSection contact={data.contact} />
    </main>
  );
}
