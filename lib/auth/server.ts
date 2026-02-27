import type { AdminUser } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { prisma } from "@/lib/db";
import { verifySessionToken } from "@/lib/auth/session";

export type AuthenticatedAdmin = {
  session: {
    userId: string;
    tenantId: string;
    email: string;
    role: "SUPER_ADMIN" | "EDITOR";
  };
  user: Pick<AdminUser, "id" | "tenantId" | "email" | "role">;
};

function extractCookie(cookieHeader: string | null, key: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookiesList = cookieHeader.split(";");
  for (const chunk of cookiesList) {
    const [name, ...valueParts] = chunk.trim().split("=");
    if (name === key) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

async function hydrateAdminFromToken(token: string | null): Promise<AuthenticatedAdmin | null> {
  if (!token) {
    return null;
  }

  const session = verifySessionToken(token);
  if (!session) {
    return null;
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      tenantId: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    return null;
  }

  if (user.tenantId !== session.tenantId || user.email !== session.email) {
    return null;
  }

  return {
    session: {
      userId: session.userId,
      tenantId: session.tenantId,
      email: session.email,
      role: session.role,
    },
    user,
  };
}

export async function getAuthenticatedAdminFromRequest(
  request: Request,
): Promise<AuthenticatedAdmin | null> {
  const token = extractCookie(request.headers.get("cookie"), ADMIN_SESSION_COOKIE);
  return hydrateAdminFromToken(token);
}

export async function getAuthenticatedAdminFromServerCookies(): Promise<AuthenticatedAdmin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null;
  return hydrateAdminFromToken(token);
}

export async function requireAuthenticatedAdminForPage(): Promise<AuthenticatedAdmin> {
  const admin = await getAuthenticatedAdminFromServerCookies();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
