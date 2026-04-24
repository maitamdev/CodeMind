/**
 * Rate limiter for auth and API routes.
 * Support Upstash Redis for serverless deployment, fallback to in-memory map.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitConfig {
    maxAttempts: number;
    windowMs: number;
}

export const RATE_LIMITS = {
    /** Login: 5 attempts per minute */
    login: { maxAttempts: 5, windowMs: 60 * 1000 } as RateLimitConfig,
    /** Register: 3 attempts per 10 minutes */
    register: { maxAttempts: 3, windowMs: 10 * 60 * 1000 } as RateLimitConfig,
    /** Forgot password: 3 attempts per 15 minutes */
    forgotPassword: { maxAttempts: 3, windowMs: 15 * 60 * 1000 } as RateLimitConfig,
    /** Password change: 5 attempts per minute */
    changePassword: { maxAttempts: 5, windowMs: 60 * 1000 } as RateLimitConfig,
    /** General API: 60 requests per minute */
    general: { maxAttempts: 60, windowMs: 60 * 1000 } as RateLimitConfig,
    /** File upload: 10 uploads per minute */
    upload: { maxAttempts: 10, windowMs: 60 * 1000 } as RateLimitConfig,
    /** AI endpoints: 20 requests per minute (expensive operations) */
    ai: { maxAttempts: 20, windowMs: 60 * 1000 } as RateLimitConfig,
    /** Blog/content creation: 5 creates per minute */
    contentCreate: { maxAttempts: 5, windowMs: 60 * 1000 } as RateLimitConfig,
};

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetInMs: number;
}

// ==========================
// In-Memory Fallback Store
// ==========================
interface RateLimitEntry {
    count: number;
    resetAt: number;
}
const memoryStore = new Map<string, RateLimitEntry>();

if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of memoryStore) {
            if (now > entry.resetAt) {
                memoryStore.delete(key);
            }
        }
    }, 5 * 60 * 1000);
}

// ==========================
// Redis Store Setup
// ==========================
let redisLimiters = new Map<string, Ratelimit>();
const hasRedis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

if (hasRedis) {
    const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    for (const [key, config] of Object.entries(RATE_LIMITS)) {
        const windowInSeconds = Math.max(1, Math.floor(config.windowMs / 1000));
        redisLimiters.set(key, new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(config.maxAttempts, `${windowInSeconds} s`),
            analytics: true,
            prefix: `ratelimit:${key}`,
        }));
    }
}

/**
 * Check if the request is allowed under the rate limit
 */
export async function checkRateLimit(
    key: string,
    config: RateLimitConfig,
    limitType?: keyof typeof RATE_LIMITS
): Promise<RateLimitResult> {
    
    // 1. Try Redis first if available
    if (hasRedis && limitType && redisLimiters.has(limitType)) {
        try {
            const { success, limit, remaining, reset } = await redisLimiters.get(limitType)!.limit(key);
            return {
                allowed: success,
                remaining,
                resetInMs: Math.max(0, reset - Date.now())
            };
        } catch (error) {
            console.error("Redis Rate Limiter Error (falling back to memory):", error);
        }
    }

    // 2. Fallback to Memory
    const now = Date.now();
    const entry = memoryStore.get(key);

    if (!entry || now > entry.resetAt) {
        memoryStore.set(key, { count: 1, resetAt: now + config.windowMs });
        return {
            allowed: true,
            remaining: config.maxAttempts - 1,
            resetInMs: config.windowMs,
        };
    }

    if (entry.count >= config.maxAttempts) {
        return {
            allowed: false,
            remaining: 0,
            resetInMs: entry.resetAt - now,
        };
    }

    entry.count++;
    return {
        allowed: true,
        remaining: config.maxAttempts - entry.count,
        resetInMs: entry.resetAt - now,
    };
}

export function getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp;
    return "unknown";
}
