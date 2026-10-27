import type { Context, Next } from 'hono';

/**
 * Best-effort fixed-window limiter, per Worker isolate. It stops casual hammering
 * (curl loops) but is not a global guarantee; use Cloudflare's rate-limiting rules
 * for hard limits.
 */
export const rateLimit = (name: string, limit: number, windowMs: number) => {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return async (c: Context, next: Next) => {
    const now = Date.now();
    const ip = c.req.header('CF-Connecting-IP') ?? 'unknown';
    const key = `${name}:${ip}`;

    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    }

    const entry = hits.get(key);
    if (!entry || entry.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
    } else if (++entry.count > limit) {
      c.header('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return c.json({ error: 'Too many requests' }, 429);
    }
    await next();
  };
};
