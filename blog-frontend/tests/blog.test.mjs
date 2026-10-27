import test from "node:test";
import assert from "node:assert/strict";
import { MarkdownBlogRepository } from "../src/core/blog/infrastructure/MarkdownBlogRepository.js";
import { BlogService } from "../src/core/blog/application/BlogService.js";
import { tmpDir, writeFiles, post } from "./helpers.mjs";

async function setup() {
  const dir = await tmpDir();
  await writeFiles(dir, {
    "parent.md": post({ title: "Parent", slug: "parent", createdAt: "2026-01-02T00:00:00Z", publish: true, tags: ["Logs"] }),
    "child.md": post({ title: "Child", slug: "child", series: "parent", seriesOrder: 1, createdAt: "2026-01-03T00:00:00Z", publish: true }),
    "draft.md": post({ title: "Draft", slug: "draft", createdAt: "2026-01-04T00:00:00Z", publish: false }),
    "tags.json": JSON.stringify([{ id: "t1", name: "logs", color: "#123456" }]),
  });
  return new BlogService(new MarkdownBlogRepository(dir));
}

test("series children resolve by exact permalink only", async () => {
  const svc = await setup();
  assert.equal((await svc.getPostBySlug("parent/child")).id, "child");
  assert.equal(await svc.getPostBySlug("bogus/child"), null);
  assert.equal(await svc.getPostBySlug("child"), null);
});

test("unknown slugs return null instead of throwing", async () => {
  const svc = await setup();
  assert.equal(await svc.getPostBySlug("nope"), null);
});

test("drafts are hidden from public listings outside development", async () => {
  const svc = await setup();
  const env = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  try {
    const ids = (await svc.getAllPosts()).map((p) => p.id);
    assert.deepEqual(ids.sort(), ["child", "parent"]);
    assert.equal(await svc.getPostBySlug("draft"), null);
  } finally {
    process.env.NODE_ENV = env;
  }
});

test("tags hydrate by case-insensitive name and fall back to gray", async () => {
  const svc = await setup();
  const parent = await svc.getPostBySlug("parent", { includeUnpublished: true });
  assert.equal(parent.tags[0].color, "#123456");
  const hydrated = await svc._hydratePost(
    new (await import("../src/core/blog/domain/Post.js")).Post({ id: "x", tags: ["unknown"] }),
  );
  assert.equal(hydrated.tags[0].color, "gray");
});

test("posts expose readingTime and summaries omit content", async () => {
  const svc = await setup();
  const p = await svc.getPostBySlug("parent", { includeUnpublished: true });
  assert.match(p.readingTime, /min read/);
  const summary = p.toSummary();
  assert.equal("content" in summary, false);
  assert.equal(summary.permalink, "parent");
});
