import { headers } from "next/headers";

import { LandingEditor } from "@/components/admin/landing-editor";
import { getLandingDraft } from "@/lib/content";
import { resolveTenantFromHeaders } from "@/lib/tenant";

export default async function AdminLandingPage() {
  const headerStore = await headers();
  const tenant = await resolveTenantFromHeaders(headerStore);
  const draft = await getLandingDraft(tenant.id);
  const serializedDraft = {
    ...draft,
    updatedAt: draft.updatedAt.toISOString(),
  };

  return <LandingEditor initialLanding={serializedDraft} />;
}
