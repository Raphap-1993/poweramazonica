import { hashPasswordScrypt, verifyPasswordHash } from "@/lib/auth/password";

type ValidationResult =
  | {
      ok: true;
      email: string;
      passwordHashForStorage: string;
    }
  | {
      ok: false;
      error: string;
    };

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getAdminEmailFromEnv(): string {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) {
    throw new Error("ADMIN_EMAIL no esta definido");
  }

  return email;
}

export function validateAdminCredentials(input: {
  email: string;
  password: string;
}): ValidationResult {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!expectedEmail) {
    return { ok: false, error: "ADMIN_EMAIL no esta configurado" };
  }

  const email = normalizeEmail(input.email);
  if (email !== expectedEmail) {
    return { ok: false, error: "Credenciales invalidas" };
  }

  const configuredHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  if (configuredHash) {
    const valid = verifyPasswordHash(input.password, configuredHash);
    return valid
      ? {
          ok: true,
          email,
          passwordHashForStorage: configuredHash,
        }
      : { ok: false, error: "Credenciales invalidas" };
  }

  const devPlain = process.env.ADMIN_PASSWORD_PLAIN;
  if (process.env.NODE_ENV !== "production" && devPlain) {
    if (input.password !== devPlain) {
      return { ok: false, error: "Credenciales invalidas" };
    }

    return {
      ok: true,
      email,
      passwordHashForStorage: hashPasswordScrypt(devPlain),
    };
  }

  return {
    ok: false,
    error:
      "Configura ADMIN_PASSWORD_HASH (produccion) o ADMIN_PASSWORD_PLAIN (solo desarrollo)",
  };
}
