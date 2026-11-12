// lib/hash.ts
import bcrypt from "bcrypt";
import crypto from "crypto";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// We store sha256(token) in DB for safety
export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// generate secure random hex token
export function genToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}