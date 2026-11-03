// One-off: moves images referenced as /notes-assets/... or /uploads/... into blog-datastore/images
// and rewrites the markdown to relative paths, so notes render in any markdown editor AND on the site.
//   node scripts/migrate-images.mjs          # dry run
//   node scripts/migrate-images.mjs --write  # apply
// Files with uncommitted git changes are skipped (their legacy paths keep working).
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { relativeMediaPath } from "../src/lib/media.js";

const write = process.argv.includes("--write");
const repoRoot = path.resolve(process.cwd(), "..");
const datastore = path.join(repoRoot, "blog-datastore");
const publicDir = path.join(process.cwd(), "public");
const imagesDir = path.join(datastore, "images");

const dirty = new Set(
  execSync("git status --porcelain -- blog-datastore", {
    cwd: repoRoot,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .map((l) => l.slice(3).trim()),
);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith(".md") ? [p] : [];
  });

const sameContent = (a, b) => fs.readFileSync(a).equals(fs.readFileSync(b));
const placed = new Map(); // public file -> datastore-relative asset path
function place(publicFile) {
  if (placed.has(publicFile)) return placed.get(publicFile);
  let name = path.basename(publicFile).replace(/[^a-zA-Z0-9._-]+/g, "-");
  let target = path.join(imagesDir, name);
  for (
    let n = 2;
    fs.existsSync(target) && !sameContent(target, publicFile);
    n++
  ) {
    const ext = path.extname(name);
    target = path.join(imagesDir, `${path.basename(name, ext)}-${n}${ext}`);
  }
  if (write) {
    fs.mkdirSync(imagesDir, { recursive: true });
    if (!fs.existsSync(target)) fs.copyFileSync(publicFile, target);
  }
  const asset = `images/${path.basename(target)}`;
  placed.set(publicFile, asset);
  return asset;
}

// GitBook exports wrap images in raw HTML, which the site's markdown renderer drops and editors
// show inconsistently; plain markdown images work everywhere.
const FIGURE =
  /<figure><img src="([^"]+)" alt="([^"]*)"(?: width="\d+")? \/><figcaption>(?:<p>([\s\S]*?)<\/p>)?<\/figcaption><\/figure>/g;
// URL may contain balanced parentheses, e.g. image%20(7).png
const LEGACY =
  /(!\[[^\]]*\]\()(\/(?:notes-assets|uploads)\/(?:[^()\s]|\([^()]*\))+)(\))/g;
let rewritten = 0,
  skippedFiles = [],
  missing = [];

for (const file of walk(datastore)) {
  const rel = path.relative(datastore, file).split(path.sep).join("/");
  const original = fs.readFileSync(file, "utf8");
  // Only convert images whose file exists; missing ones stay untouched rather than becoming broken <img>s
  const exists = (url) =>
    fs.existsSync(
      path.join(publicDir, decodeURIComponent(url.split(/[?#]/)[0])),
    );
  const text = original.replace(FIGURE, (m, src, alt, caption) =>
    exists(src)
      ? `![${(caption ?? alt).replace(/[\[\]\n]/g, " ").trim()}](${src})`
      : m,
  );
  if (!LEGACY.test(text)) continue;
  LEGACY.lastIndex = 0;
  if (dirty.has(`blog-datastore/${rel}`)) {
    skippedFiles.push(rel);
    continue;
  }

  const next = text.replace(LEGACY, (m, open, url, close) => {
    const source = path.join(
      publicDir,
      decodeURIComponent(url.split(/[?#]/)[0]),
    );
    if (!fs.existsSync(source)) {
      missing.push(`${rel}: ${url}`);
      return m;
    }
    rewritten++;
    return `${open}${relativeMediaPath(rel, place(source))}${close}`;
  });
  if (write && next !== original) fs.writeFileSync(file, next);
}

console.log(
  `${write ? "Rewrote" : "Would rewrite"} ${rewritten} image links, ${placed.size} files into blog-datastore/images`,
);
if (skippedFiles.length)
  console.log(`Skipped (uncommitted changes):\n  ${skippedFiles.join("\n  ")}`);
if (missing.length)
  console.log(
    `Left as-is (file missing in public/, already broken):\n  ${missing.join("\n  ")}`,
  );
