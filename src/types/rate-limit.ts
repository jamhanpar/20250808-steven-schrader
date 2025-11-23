export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitResult {
  isAllowed: boolean;
  remainingRequests: number;
  resetTime: number;
  totalRequests: number;
}

export interface RateLimitEntry {
  requests: number[];
  firstRequest: number;
}

export interface RateLimitStore {
  byIP: Map<string, RateLimitEntry>;
  byEmail: Map<string, RateLimitEntry>;
  global: RateLimitEntry;
  lastCleanup: number;
}
