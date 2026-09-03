import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import metricsRouter from './routes/metrics';
import subscribeRouter from './routes/subscribe';
import contactRouter from './routes/contact';
import commentsRouter from './routes/comments';
import analyticsRouter from './routes/analytics';

export type Bindings = {
  DATABASE_URL: string;
  DISCORD_WEBHOOK_URL: string;
  DISCORD_SUBSCRIBE_WEBHOOK_URL: string;
  ALLOWED_ORIGIN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Global Middleware
app.use('*', logger());

// Dynamic CORS based on environment variable
app.use('*', async (c, next) => {
  const allowedOrigin = c.env.ALLOWED_ORIGIN || 'http://localhost:3000';
  const corsMiddleware = cors({
    origin: allowedOrigin,
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  });
  return corsMiddleware(c, next);
});

// Route Handlers
app.route('/metrics', metricsRouter);
app.route('/subscribe', subscribeRouter);
app.route('/contact', contactRouter);
app.route('/comments', commentsRouter);
app.route('/analytics', analyticsRouter);

export default app;
