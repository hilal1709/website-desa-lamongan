type LimitEntry = { count: number; resetAt: number }

// This is a conservative, process-local safeguard. Production deployments with
// multiple instances should replace it with a shared store (for example Redis).
const limits = new Map<string, LimitEntry>()

export function clientAddress(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || headers.get("x-real-ip")
    || "unknown"
}

export function isRateLimited(key: string, maxAttempts: number, windowMs: number) {
  const now = Date.now()
  const current = limits.get(key)
  if (!current || current.resetAt <= now) {
    limits.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }
  current.count += 1
  return current.count > maxAttempts
}

/** Uses Upstash in deployed environments and keeps the in-memory fallback for local development. */
export async function isRateLimitedDistributed(key: string, maxAttempts: number, windowMs: number) {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return isRateLimited(key, maxAttempts, windowMs)
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["PTTL", key], ["PEXPIRE", key, windowMs, "NX"]]),
      cache: "no-store",
    })
    if (!response.ok) return isRateLimited(key, maxAttempts, windowMs)
    const results = await response.json() as { result?: number }[]
    return Number(results[0]?.result) > maxAttempts
  } catch { return isRateLimited(key, maxAttempts, windowMs) }
}
