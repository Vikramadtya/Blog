import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { MarkdownNoteRepository } from "../src/core/note/infrastructure/MarkdownNoteRepository.js";
import { NoteService } from "../src/core/note/application/NoteService.js";
import { tmpDir, writeFiles } from "./helpers.mjs";

async function setup() {
  const root = await tmpDir();
  const config = path.join(await tmpDir(), "notes.json");
  await fs.writeFile(config, "[]");
  await writeFiles(root, {
    "book/2. Second.md": "# Second\nbody",
    "book/1. First.md": "# First\nbody",
    "book/weird.md": "---\nid: not-a-number\n---\n# Weird\nbody",
    "book/sub/About.md": "# About\nbody",
  });
  return { root, config, svc: new NoteService(new MarkdownNoteRepository(root), config) };
}

test("tree orders files by number, then folders, with no NaN titles", async () => {
  const { svc } = await setup();
  const tree = await svc.getNoteTree("book");
  assert.deepEqual(tree.slice(0, 3).map((n) => n.title), ["1. First", "2. Second", "Weird"]);
  assert.equal(JSON.stringify(tree).includes("NaN"), false);
  assert.equal(tree[3].type, "directory");
});

test("missing notes return null; traversal is rejected", async () => {
  const { svc } = await setup();
  assert.equal(await svc.getNote("book", ["nope"]), null);
  await assert.rejects(svc.getNoteRaw("../../etc/passwd"), /Invalid path/);
  await assert.rejects(svc.saveNoteRaw("../evil.md", "x"), /Invalid path/);
});

test("createBook makes a slug-named folder and registers it in notes.json", async () => {
  const { svc, root, config } = await setup();
  const slug = await svc.createBook("My New Book");
  assert.equal(slug, "my-new-book");
  assert.ok((await fs.stat(path.join(root, "my-new-book"))).isDirectory());
  const cfg = JSON.parse(await fs.readFile(config, "utf8"));
  assert.deepEqual(cfg, [{ category: "BOOK", title: "My New Book", link: "/notes/my-new-book" }]);
  await svc.createBook("My New Book"); // idempotent
  assert.equal(JSON.parse(await fs.readFile(config, "utf8")).length, 1);
});
