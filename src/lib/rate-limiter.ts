/**
 * Simple in-memory rate limiter for server-side validation.
 * Note: In a production environment, use Redis or a similar persistent store
 * to ensure rate limiting works across multiple server instances/serverless functions.
 */

interface RateLimitInfo {
  count: number;
  lastRequest: number;
}

const cache = new Map<string, RateLimitInfo>();

// Default: 5 requests per 15 minutes per IP
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

/**
 * Checks if a request from a specific key (e.g., IP) should be rate limited.
 * @param key Unique identifier for the client (IP address)
 * @returns true if limited, false if allowed
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const info = cache.get(key);

  if (!info) {
    cache.set(key, { count: 1, lastRequest: now });
    return false;
  }

  // Reset if window has passed
  if (now - info.lastRequest > WINDOW_MS) {
    info.count = 1;
    info.lastRequest = now;
    return false;
  }

  if (info.count >= MAX_REQUESTS) {
    return true;
  }

  info.count += 1;
  return false;
}
