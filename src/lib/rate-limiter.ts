interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
let lastCleanup = Date.now();
function cleanup() {
    const now = Date.now();
    if (now - lastCleanup > 300000) {
        lastCleanup = now;
        for (const [key, record] of rateLimitMap.entries()) {
            if (now > record.resetTime) {
                rateLimitMap.delete(key);
            }
        }
    }
}

/**
 * In-memory sliding window rate limiter for Edge/Serverless Middleware.
 * Automatically tracks and restricts requests per client identifier.
 */
export function checkRateLimit(
    identifier: string,
    limit: number,
    windowMs: number = 60000
): { success: boolean; remaining: number; reset: number } {
    cleanup();
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(identifier, {
            count: 1,
            resetTime: now + windowMs,
        });
        return { success: true, remaining: limit - 1, reset: now + windowMs };
    }

    if (record.count >= limit) {
        return { success: false, remaining: 0, reset: record.resetTime };
    }

    record.count += 1;
    return { success: true, remaining: limit - record.count, reset: record.resetTime };
}
