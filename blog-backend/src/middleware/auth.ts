import type { Context, Next } from 'hono';

const encoder = new TextEncoder();

/** Constant-time string comparison (hashes first so length differences don't leak). */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

export const adminAuth = async (c: Context, next: Next) => {
  const secret = c.env.ADMIN_SECRET as string | undefined;
  if (!secret) {
    console.warn('ADMIN_SECRET is not configured on the server!');
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const header = c.req.header('Authorization') ?? '';
  if (!(await safeEqual(header, `Bearer ${secret}`))) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
};
