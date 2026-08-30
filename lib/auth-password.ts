import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto"
import { promisify } from "util"

const scrypt = promisify(scryptCallback)
const MIN_PASSWORD_LENGTH = 12
const COMMON_PASSWORDS = new Set([
  "123456", "12345678", "123456789", "1234567890", "12345678910", "123456789012", "0123456789", "abcdefghijkl", "password", "password1", "password123", "password1234", "admin", "admin123", "admin1234", "adminpassword", "administrator", "qwerty", "qwerty123", "qwertyuiop", "abc123", "letmein", "welcome", "welcome123", "iloveyou", "monkey", "dragon", "football", "baseball", "master", "login", "passw0rd", "p@ssw0rd", "secret", "secret123", "test", "test123", "guest", "user", "user123", "root", "root123", "superadmin", "superadmin123", "desa", "kedungrejo", "indonesia", "bismillah", "sayang", "anjing", "123123", "111111", "000000", "11111111", "00000000", "1q2w3e4r", "1q2w3e4r5t", "asdfgh", "asdfghjkl", "zxcvbnm", "zaq12wsx", "qazwsx", "michael", "jennifer", "ninja", "sunshine", "princess", "freedom", "whatever", "trustno1", "computer", "internet", "changeme",
])

export function passwordPolicyError(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) return `Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`
  const normalized = password.trim().toLowerCase()
  if (COMMON_PASSWORDS.has(normalized)) return "Kata sandi terlalu umum dan tidak boleh digunakan."
  if (/^(.)\1+$/.test(password)) return "Kata sandi terlalu mudah ditebak."
  return null
}

export function assertPasswordPolicy(password: string) {
  const error = passwordPolicyError(password)
  if (error) throw new Error(error)
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${derivedKey.toString("hex")}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":")
  if (!salt || !key) return false

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  const storedKey = Buffer.from(key, "hex")
  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey)
}
