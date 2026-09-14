import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import metricsRouter from './routes/metrics';
import subscribeRouter from './routes/subscribe';
import contactRouter from './routes/contact';
import commentsRouter from './routes/comments';
import analyticsRouter from './routes/analytics';

import { instrument } from '@microlabs/otel-cf-workers';

export type Bindings = {
  DATABASE_URL: string;
  DISCORD_WEBHOOK_URL: string;
  DISCORD_SUBSCRIBE_WEBHOOK_URL: string;
  ALLOWED_ORIGIN: string;
  OTEL_EXPORTER_OTLP_ENDPOINT?: string;
  OTEL_EXPORTER_OTLP_HEADERS?: string;
  ADMIN_SECRET?: string;
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
    allowHeaders: ['Content-Type', 'traceparent', 'tracestate', 'Authorization'],
  });
  return corsMiddleware(c, next);
});

// Route Handlers
app.get('/health', (c) => c.json({ status: 'ok' }));
app.route('/metrics', metricsRouter);
app.route('/subscribe', subscribeRouter);
app.route('/contact', contactRouter);
app.route('/comments', commentsRouter);
app.route('/analytics', analyticsRouter);

export default {
  fetch: (request: Request, env: Bindings, ctx: ExecutionContext) => {
    // Only instrument if OTLP endpoint is provided
    if (env.OTEL_EXPORTER_OTLP_ENDPOINT) {
      const instrumentedApp = instrument(
        app,
        (env: Bindings) => {
          return {
            exporter: {
              url: env.OTEL_EXPORTER_OTLP_ENDPOINT as string,
              headers: env.OTEL_EXPORTER_OTLP_HEADERS 
                ? { Authorization: env.OTEL_EXPORTER_OTLP_HEADERS } 
                : undefined,
            },
            service: { name: 'blog-microservice' },
          };
        }
      );
      return instrumentedApp.fetch!(request as any, env, ctx as any);
    }
    // Fallback to uninstrumented execution if missing configuration
    return app.fetch(request, env, ctx);
  }
};
