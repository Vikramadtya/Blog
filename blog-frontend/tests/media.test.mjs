import test from "node:test";
import assert from "node:assert/strict";
import { resolveMediaUrl, relativeMediaPath } from "../src/lib/media.js";

test("resolveMediaUrl maps relative image paths onto /media", () => {
  assert.equal(
    resolveMediaUrl("notes/system-design", "../../images/a%20b.png"),
    "/media/images/a%20b.png",
  );
  assert.equal(
    resolveMediaUrl("blogs", "../images/x.svg?v=1"),
    "/media/images/x.svg?v=1",
  );
  assert.equal(
    resolveMediaUrl("notes/a/b", "./pics/c.png"),
    "/media/notes/a/b/pics/c.png",
  );
});

test("resolveMediaUrl leaves everything else alone", () => {
  for (const src of [
    "https://x.com/a.png",
    "//cdn/a.png",
    "/notes-assets/a.png",
    "#top",
    "../../../../escape.png",
    "doc.md",
    "",
  ]) {
    assert.equal(resolveMediaUrl("notes/a", src), src, src);
  }
});

test("relativeMediaPath is the inverse of resolveMediaUrl", () => {
  for (const [from, asset] of [
    ["notes/system-design/DNS.md", "images/my pic (1).png"],
    ["blogs/post.md", "images/x.png"],
    ["notes/low-level-design/Class Design/index.md", "images/x.png"],
  ]) {
    const rel = relativeMediaPath(from, asset);
    const dir = from.split("/").slice(0, -1).join("/");
    assert.equal(
      decodeURIComponent(resolveMediaUrl(dir, rel)),
      `/media/${asset}`,
    );
  }
  assert.equal(
    relativeMediaPath("notes/a/b.md", "images/x.png"),
    "../../images/x.png",
  );
});
