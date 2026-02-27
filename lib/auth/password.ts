import bcrypt from "bcryptjs";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_PREFIX = "scrypt";
const DEFAULT_SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
  keyLen: 64,
};

function toSafeBuffer(value: string): Buffer {
  return Buffer.from(value, "hex");
}

export function isBcryptHash(value: string): boolean {
  return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
}

export function hashPasswordScrypt(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, DEFAULT_SCRYPT_PARAMS.keyLen, {
    N: DEFAULT_SCRYPT_PARAMS.N,
    r: DEFAULT_SCRYPT_PARAMS.r,
    p: DEFAULT_SCRYPT_PARAMS.p,
  }).toString("hex");

  return [
    SCRYPT_PREFIX,
    DEFAULT_SCRYPT_PARAMS.N,
    DEFAULT_SCRYPT_PARAMS.r,
    DEFAULT_SCRYPT_PARAMS.p,
    salt,
    derived,
  ].join("$");
}

function verifyScryptHash(password: string, hash: string): boolean {
  const [prefix, n, r, p, salt, storedHex] = hash.split("$");
  if (prefix !== SCRYPT_PREFIX || !n || !r || !p || !salt || !storedHex) {
    return false;
  }

  const N = Number(n);
  const R = Number(r);
  const P = Number(p);
  if (!Number.isFinite(N) || !Number.isFinite(R) || !Number.isFinite(P)) {
    return false;
  }

  const stored = toSafeBuffer(storedHex);
  const derived = scryptSync(password, salt, stored.length, { N, r: R, p: P });

  if (derived.length !== stored.length) {
    return false;
  }

  return timingSafeEqual(derived, stored);
}

export function verifyPasswordHash(password: string, hash: string): boolean {
  if (!hash) {
    return false;
  }

  if (isBcryptHash(hash)) {
    return bcrypt.compareSync(password, hash);
  }

  if (hash.startsWith(`${SCRYPT_PREFIX}$`)) {
    return verifyScryptHash(password, hash);
  }

  return false;
}
