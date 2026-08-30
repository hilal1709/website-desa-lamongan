import "server-only"

import { createCipheriv, createDecipheriv, createHmac, randomBytes, timingSafeEqual } from "crypto"

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
const ISSUER = "CMS Desa Kedungrejo"

function encryptionKey() {
  const value = process.env.MFA_ENCRYPTION_KEY
  if (!value) throw new Error("MFA_ENCRYPTION_KEY belum dikonfigurasi.")
  const key = Buffer.from(value, "base64")
  if (key.length !== 32) throw new Error("MFA_ENCRYPTION_KEY harus berupa nilai base64 untuk 32 byte.")
  return key
}

function base32Decode(value: string) {
  const normalized = value.toUpperCase().replace(/[^A-Z2-7]/g, "")
  let bits = 0
  let current = 0
  const output: number[] = []
  for (const char of normalized) {
    current = (current << 5) | BASE32.indexOf(char)
    bits += 5
    if (bits >= 8) { output.push((current >>> (bits - 8)) & 0xff); bits -= 8 }
  }
  return Buffer.from(output)
}

export function createTotpSecret() {
  const bytes = randomBytes(20)
  let output = ""
  let bits = 0
  let current = 0
  for (const byte of bytes) {
    current = (current << 8) | byte; bits += 8
    while (bits >= 5) { output += BASE32[(current >>> (bits - 5)) & 31]; bits -= 5 }
  }
  if (bits > 0) output += BASE32[(current << (5 - bits)) & 31]
  return output
}

export function encryptTotpSecret(secret: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64url")
}

export function decryptTotpSecret(value: string) {
  const payload = Buffer.from(value, "base64url")
  if (payload.length < 29) throw new Error("Secret MFA tidak valid.")
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), payload.subarray(0, 12))
  decipher.setAuthTag(payload.subarray(12, 28))
  return Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]).toString("utf8")
}

export function verifyTotp(secret: string, candidate: string, now = Date.now()) {
  const code = candidate.replace(/\s/g, "")
  if (!/^\d{6}$/.test(code)) return false
  for (const offset of [-1, 0, 1]) {
    const counter = Math.floor(now / 30_000) + offset
    const buffer = Buffer.alloc(8)
    buffer.writeBigUInt64BE(BigInt(counter))
    const digest = createHmac("sha1", base32Decode(secret)).update(buffer).digest()
    const position = digest[digest.length - 1] & 15
    const expected = String((((digest[position] & 127) << 24) | (digest[position + 1] << 16) | (digest[position + 2] << 8) | digest[position + 3]) % 1_000_000).padStart(6, "0")
    if (timingSafeEqual(Buffer.from(code), Buffer.from(expected))) return true
  }
  return false
}

export function totpUri(secret: string, accountName: string) {
  return `otpauth://totp/${encodeURIComponent(`${ISSUER}:${accountName}`)}?secret=${secret}&issuer=${encodeURIComponent(ISSUER)}&algorithm=SHA1&digits=6&period=30`
}
