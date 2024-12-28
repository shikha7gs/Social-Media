import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiters = {
    login: new RateLimiterMemory({
        points: 5,
        duration: 300,
    }),
    signup: new RateLimiterMemory({
        points: 1,
        duration: 300,
    }),
    checkSession: new RateLimiterMemory({
        points: 20,
        duration: 300,
    }),
    checkAuthenticate: new RateLimiterMemory({
        points: 50,
        duration: 300,
    })
};

export async function rateLimit(req, apiName) {
    const rateLimiter = rateLimiters[apiName];
    if (!rateLimiter) {
        throw new Error(`Rate limiter not defined for API: ${apiName}`);
    }
    try {
        await rateLimiter.consume(req.ip);
    } catch (rejRes) {
        return false;
    }
    return true;
}
