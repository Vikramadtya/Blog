import { registerOTel } from '@vercel/otel';

export function register() {
  // @vercel/otel automatically configures OTLP Exporters
  // when OTEL_EXPORTER_OTLP_ENDPOINT and OTEL_EXPORTER_OTLP_HEADERS are present
  registerOTel({
    serviceName: 'blog-frontend',
  });
}
