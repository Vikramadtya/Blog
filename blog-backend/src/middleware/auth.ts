import { Context, Next } from 'hono';

export const adminAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  const secret = c.env.ADMIN_SECRET;
  
  if (!secret) {
    console.warn("ADMIN_SECRET is not configured on the server!");
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (authHeader !== `Bearer ${secret}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
};
