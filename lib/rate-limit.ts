/**
 * lib/rate-limit.ts
 * IP-based in-memory rate limiter for all /api routes.
 * - Uses a sliding window counter per IP address.
 * - No external deps required (pure in-memory).
 * - For production, replace with Upstash Redis for distributed rate limiting.
 */

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

// In-memory store — resets on server restart (acceptable for dev/beta)
const ipStore = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60_000; // 1 minute window

interface RateLimitConfig {
  /** Max requests allowed within the window */
  limit: number;
}

/**
 * Returns true if the request should be BLOCKED.
 */
export function isRateLimited(ip: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const record = ipStore.get(ip);

  if (!record || now - record.windowStart > WINDOW_MS) {
    // New window
    ipStore.set(ip, { count: 1, windowStart: now });
    return false;
  }

  record.count += 1;
  if (record.count > config.limit) {
    return true;
  }
  return false;
}

/**
 * Extract client IP from Next.js request headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * Pre-built rate limit configs for each route class.
 */
export const RATE_LIMITS = {
  /** AI rewrite — most expensive, most restricted */
  REWRITE: { limit: 10 },       // 10 rewrites / min per IP
  /** Production generation (budget, casting, etc.) */
  PRODUCTION: { limit: 5 },     // 5 AI production calls / min per IP
  /** Main scenario streaming — very costly */
  GENERATE: { limit: 3 },       // 3 full generations / min per IP
  /** General API fallback */
  DEFAULT: { limit: 30 },       // 30 general calls / min per IP
};
