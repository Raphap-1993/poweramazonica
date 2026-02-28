import { headers } from "next/headers";

import { LandingFallback } from "@/components/landing/landing-fallback";
import { LandingPageContent } from "@/components/landing/landing-page-content";
import { getPublishedLandingForDomain } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const { landing } = await getPublishedLandingForDomain(host);

  if (!landing) {
    return <LandingFallback />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fef2_0%,#f6faf7_40%,#ffffff_100%)]">
      <LandingPageContent data={landing.data} />
    </div>
  );
}
