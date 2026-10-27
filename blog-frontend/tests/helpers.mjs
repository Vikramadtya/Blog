import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export async function tmpDir(prefix = "blog-test-") {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

export async function writeFiles(root, files) {
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(root, rel);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, content);
  }
}

export const post = (fields, body = "Hello world") =>
  `---\n${Object.entries(fields)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join("\n")}\n---\n${body}\n`;
