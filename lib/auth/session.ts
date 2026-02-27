import { createHmac, timingSafeEqual } from "node:crypto";

import { ADMIN_SESSION_TTL_SECONDS } from "@/lib/auth/constants";

export type AdminSessionPayload = {
  userId: string;
  tenantId: string;
  email: string;
  role: "SUPER_ADMIN" | "EDITOR";
  exp: number;
};

function getSessionSecret(): string {
  if (process.env.AUTH_SECRET?.trim()) {
    return process.env.AUTH_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET es obligatorio en produccion");
  }

  return "poweramazonica-dev-secret";
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value, "utf-8").toString("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf-8");
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createSessionToken(payload: Omit<AdminSessionPayload, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_TTL_SECONDS;
  const body = encodeBase64Url(
    JSON.stringify({
      ...payload,
      exp,
    }),
  );

  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifySessionToken(token: string): AdminSessionPayload | null {
  if (!token.includes(".")) {
    return null;
  }

  const [body, signature] = token.split(".");
  if (!body || !signature) {
    return null;
  }

  const expectedSignature = sign(body);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(body)) as AdminSessionPayload;

    if (!payload.userId || !payload.tenantId || !payload.email || !payload.role || !payload.exp) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  };
}
