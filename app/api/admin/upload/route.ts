import { NextResponse } from "next/server";

import { getAuthenticatedAdminFromRequest } from "@/lib/auth/server";
import { resolveTenantFromRequest } from "@/lib/tenant";
import { storeOptimizedImage, UploadValidationError, type UploadKind } from "@/lib/uploads";

export const runtime = "nodejs";

async function authorize(request: Request) {
  const [tenant, admin] = await Promise.all([
    resolveTenantFromRequest(request),
    getAuthenticatedAdminFromRequest(request),
  ]);

  if (!admin) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (admin.user.tenantId !== tenant.id) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return {
    tenant,
    admin,
  };
}

function parseUploadKind(value: FormDataEntryValue | null): UploadKind {
  if (value === "generic") {
    return "generic";
  }

  return "hero";
}

export async function POST(request: Request) {
  const auth = await authorize(request);
  if ("error" in auth) {
    return auth.error;
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Formulario inválido" }, { status: 400 });
  }

  const fileEntry = formData.get("file");
  if (!(fileEntry instanceof File)) {
    return NextResponse.json({ error: "Adjunta un archivo válido" }, { status: 400 });
  }

  try {
    const stored = await storeOptimizedImage({
      tenantDomain: auth.tenant.domain,
      mimeType: fileEntry.type,
      sizeBytes: fileEntry.size,
      inputBuffer: Buffer.from(await fileEntry.arrayBuffer()),
      kind: parseUploadKind(formData.get("kind")),
    });

    return NextResponse.json({
      ok: true,
      file: stored,
    });
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("Error subiendo archivo", error);
    return NextResponse.json({ error: "No se pudo procesar el archivo" }, { status: 500 });
  }
}
