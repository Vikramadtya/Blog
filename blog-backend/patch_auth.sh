sed -i '' -e 's/import type { Bindings } from '\''..\/index'\'';/import type { Bindings } from '\''..\/index'\'';\nimport { adminAuth } from '\''..\/middleware\/auth'\'';/' src/routes/subscribe.ts
sed -i '' -e 's/subscribe.get('\''\/'\'', async (c) => {/subscribe.get('\''\/'\'', adminAuth, async (c) => {/' src/routes/subscribe.ts

sed -i '' -e 's/import type { Bindings } from '\''..\/index'\'';/import type { Bindings } from '\''..\/index'\'';\nimport { adminAuth } from '\''..\/middleware\/auth'\'';/' src/routes/contact.ts
sed -i '' -e 's/contact.get('\''\/'\'', async (c) => {/contact.get('\''\/'\'', adminAuth, async (c) => {/' src/routes/contact.ts

sed -i '' -e 's/import { Hono } from "hono";/import { Hono } from "hono";\nimport type { Bindings } from '\''..\/index'\'';\nimport { adminAuth } from '\''..\/middleware\/auth'\'';/' src/routes/analytics.ts
sed -i '' -e 's/const app = new Hono<{ Bindings: Env }>();/const app = new Hono<{ Bindings: Bindings }>();/' src/routes/analytics.ts
sed -i '' -e 's/app.get("\/", async (c) => {/app.get("\/", adminAuth, async (c) => {/' src/routes/analytics.ts

sed -i '' -e 's/import { zValidator } from "@hono\/zod-validator";/import { zValidator } from "@hono\/zod-validator";\nimport type { Bindings } from '\''..\/index'\'';\nimport { adminAuth } from '\''..\/middleware\/auth'\'';/' src/routes/comments.ts
sed -i '' -e 's/const app = new Hono<{ Bindings: Env }>();/const app = new Hono<{ Bindings: Bindings }>();/' src/routes/comments.ts
sed -i '' -e 's/app.delete("\/:id", async (c) => {/app.delete("\/:id", adminAuth, async (c) => {/' src/routes/comments.ts

cat wrangler.toml | grep -v 'OTEL_EXPORTER_OTLP_ENDPOINT = ""' > wrangler_temp.toml
mv wrangler_temp.toml wrangler.toml
