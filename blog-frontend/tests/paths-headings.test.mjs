import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { resolveBlogFile, resolveInside } from "../src/lib/paths.js";
import { extractHeadings } from "../src/lib/headings.js";

test("resolveBlogFile accepts plain markdown filenames only", () => {
  assert.ok(resolveBlogFile("my-post.md").endsWith(`${path.sep}my-post.md`));
  for (const bad of ["../x.md", "a/b.md", "x.txt", "..", ".md", "a\0.md", undefined]) {
    assert.throws(() => resolveBlogFile(bad), /Invalid filename/, String(bad));
  }
});

test("resolveInside blocks traversal and sibling-prefix escapes", () => {
  const root = path.join(path.sep, "tmp", "notes");
  assert.equal(resolveInside(root, "a/b.md"), path.join(root, "a", "b.md"));
  for (const bad of ["../x.md", "../notes-evil/x.md", "a/../../x.md", "a\0b"]) {
    assert.throws(() => resolveInside(root, bad), /Invalid path/, bad);
  }
});

test("extractHeadings matches rehype-slug, dedupes and skips code fences", () => {
  const md = "# A\n```sh\n# comment\n```\n## B\n## B\n#### too deep\n";
  assert.deepEqual(
    extractHeadings(md).map((h) => [h.level, h.slug]),
    [[1, "a"], [2, "b"], [2, "b-1"]],
  );
  assert.deepEqual(extractHeadings(md, { minLevel: 2 }).map((h) => h.slug), ["b", "b-1"]);
});
