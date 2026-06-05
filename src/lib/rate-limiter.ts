import type {
  RateLimitConfig,
  RateLimitResult,
  RateLimitEntry,
  RateLimitStore,
} from "../types/rate-limit";

// Must match RATE_LIMITS.*.windowMs — entries are only useful within the rate
// limit window, so we clean them up as soon as they age out of it.
const ENTRY_MAX_AGE_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "3600000"); // 1 hour

class RateLimiter {
  private store: RateLimitStore;
  private readonly cleanupInterval = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.store = {
      byIP: new Map(),
      byEmail: new Map(),
      global: { requests: [], firstRequest: 0 },
      lastCleanup: Date.now(),
    };
  }

  /**
   * Check if a request is allowed based on rate limiting rules
   * @param identifier The IP address or email to check
   * @param config Rate limiting configuration
   * @param type Type of rate limiting (IP, email, or global)
   */
  checkRateLimit(
    identifier: string,
    config: RateLimitConfig,
    type: "ip" | "email" | "global"
  ): RateLimitResult {
    const now = Date.now();

    // Cleanup old entries periodically
    if (now - this.store.lastCleanup > this.cleanupInterval) {
      this.cleanup();
    }

    let entry: RateLimitEntry;

    if (type === "global") {
      entry = this.store.global;
    } else {
      const map = type === "ip" ? this.store.byIP : this.store.byEmail;
      entry = map.get(identifier) || { requests: [], firstRequest: 0 };
      map.set(identifier, entry);
    }

    // Remove expired requests
    const windowStart = now - config.windowMs;
    entry.requests = entry.requests.filter(
      (timestamp) => timestamp > windowStart
    );

    const totalRequests = entry.requests.length;
    const remainingRequests = Math.max(0, config.maxRequests - totalRequests);
    const isAllowed = totalRequests < config.maxRequests;

    // Calculate reset time (when the oldest request expires)
    const oldestRequest = entry.requests[0] || now;
    const resetTime = oldestRequest + config.windowMs;

    if (isAllowed) {
      entry.requests.push(now);
      if (entry.firstRequest === 0) {
        entry.firstRequest = now;
      }
    }

    return {
      isAllowed,
      remainingRequests: isAllowed ? remainingRequests - 1 : remainingRequests,
      resetTime,
      totalRequests: isAllowed ? totalRequests + 1 : totalRequests,
    };
  }

  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - ENTRY_MAX_AGE_MS;

    // Clean IP entries
    for (const [key, entry] of this.store.byIP) {
      entry.requests = entry.requests.filter((ts) => ts > windowStart);
      if (entry.requests.length === 0) {
        this.store.byIP.delete(key);
      }
    }

    // Clean email entries
    for (const [key, entry] of this.store.byEmail) {
      entry.requests = entry.requests.filter((ts) => ts > windowStart);
      if (entry.requests.length === 0) {
        this.store.byEmail.delete(key);
      }
    }

    // Clean global entries
    this.store.global.requests = this.store.global.requests.filter(
      (ts) => ts > windowStart
    );

    this.store.lastCleanup = now;
  }

  /**
   * Get current statistics (for monitoring/debugging)
   */
  getStats(): {
    totalIPs: number;
    totalEmails: number;
    globalRequests: number;
  } {
    return {
      totalIPs: this.store.byIP.size,
      totalEmails: this.store.byEmail.size,
      globalRequests: this.store.global.requests.length,
    };
  }

  /**
   * Reset rate limits for a specific identifier (for testing or admin override)
   */
  reset(identifier?: string, type?: "ip" | "email" | "global"): void {
    if (!identifier || !type) {
      // Reset all
      this.store.byIP.clear();
      this.store.byEmail.clear();
      this.store.global = { requests: [], firstRequest: 0 };
      return;
    }

    if (type === "global") {
      this.store.global = { requests: [], firstRequest: 0 };
    } else if (type === "ip") {
      this.store.byIP.delete(identifier);
    } else if (type === "email") {
      this.store.byEmail.delete(identifier);
    }
  }
}

// Singleton instance to maintain state across requests
export const rateLimiter = new RateLimiter();

// Rate limiting configurations
export const RATE_LIMITS = {
  byIP: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "3600000"), // 1 hour
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_PER_IP || "5"), // 5 per hour
  },
  byEmail: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "3600000"), // 1 hour
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_PER_EMAIL || "3"), // 3 per hour
  },
  global: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "3600000"), // 1 hour
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_GLOBAL_REQUESTS || "100"), // 100 per hour
  },
} as const;

/**
 * Helper function to extract client IP from request headers
 */
export function getClientIP(request: Request): string {
  // Try multiple headers in order of preference
  const headers = [
    "x-forwarded-for",
    "x-real-ip",
    "x-client-ip",
    "cf-connecting-ip", // Cloudflare
    "fastly-client-ip", // Fastly
    "x-render-client-ip", // Render.com specific
    "x-forwarded",
    "forwarded-for",
    "forwarded",
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ip = value.split(",")[0].trim();
      if (ip && ip !== "unknown" && ip !== "127.0.0.1") {
        return ip;
      }
    }
  }

  // Fallback for development/testing
  return process.env.NODE_ENV === "production" ? "unknown" : "127.0.0.1";
}

/**
 * Comprehensive rate limiting check for contact form
 */
export function checkContactFormRateLimit(
  ip: string,
  email: string
): {
  isAllowed: boolean;
  reason?: string;
  resetTime?: number;
  remainingRequests?: number;
} {
  // Check global rate limit first
  const globalResult = rateLimiter.checkRateLimit(
    "global",
    RATE_LIMITS.global,
    "global"
  );
  if (!globalResult.isAllowed) {
    return {
      isAllowed: false,
      reason: "Service temporarily busy. Please try again later.",
      resetTime: globalResult.resetTime,
      remainingRequests: globalResult.remainingRequests,
    };
  }

  // Check IP rate limit
  const ipResult = rateLimiter.checkRateLimit(ip, RATE_LIMITS.byIP, "ip");
  if (!ipResult.isAllowed) {
    const minutes = Math.ceil((ipResult.resetTime - Date.now()) / (1000 * 60));
    return {
      isAllowed: false,
      reason: `Too many requests from your location. Please try again in ${minutes} minute${
        minutes !== 1 ? "s" : ""
      }.`,
      resetTime: ipResult.resetTime,
      remainingRequests: ipResult.remainingRequests,
    };
  }

  // Check email rate limit
  const emailResult = rateLimiter.checkRateLimit(
    email,
    RATE_LIMITS.byEmail,
    "email"
  );
  if (!emailResult.isAllowed) {
    const minutes = Math.ceil(
      (emailResult.resetTime - Date.now()) / (1000 * 60)
    );
    return {
      isAllowed: false,
      reason: `Too many messages from this email address. Please try again in ${minutes} minute${
        minutes !== 1 ? "s" : ""
      }.`,
      resetTime: emailResult.resetTime,
      remainingRequests: emailResult.remainingRequests,
    };
  }

  return {
    isAllowed: true,
    remainingRequests: Math.min(
      ipResult.remainingRequests,
      emailResult.remainingRequests
    ),
  };
}
