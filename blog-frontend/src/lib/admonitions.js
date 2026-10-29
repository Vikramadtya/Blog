import { visit } from "unist-util-visit";

/**
 * MkDocs-style admonitions:
 *
 *   !!! info "Title"
 *       Indented body.
 *
 *   ??? tip "Collapsible"
 *       Indented body.
 *
 * Markdown would parse the indented body as a lazy paragraph continuation or a code block, so
 * `preprocessAdmonitions` first rewrites them into `:::admonition{...}` container directives
 * (parsed by remark-directive) and `remarkAdmonitions` then turns those into <div>/<details>.
 */

const MARKER =
  /^(\s*)(!!!|\?\?\?\+?)\s+([A-Za-z][\w-]*)(?:\s+"(.*)"|\s+(\S.*))?\s*$/;
const FENCE = /^\s*(```|~~~)/;
const BODY_INDENT = 4;
const TYPES = {
  note: "note",
  info: "info",
  tip: "tip",
  warning: "warning",
  warn: "warning",
  attention: "warning",
  danger: "danger",
};

const indentWidth = (line) => line.match(/^ */)[0].length;
const quote = (value) =>
  `"${value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/[{}]/g, (c) => `&#${c.charCodeAt(0)};`)}"`;

export function preprocessAdmonitions(source) {
  if (typeof source !== "string" || !/^\s*(!!!|\?\?\?)/m.test(source))
    return source;

  const lines = source.split("\n");
  const out = [];
  let fence = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = line.match(FENCE);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fence === fenceMatch[1]) fence = null;
    }
    const match = fence ? null : line.match(MARKER);
    if (!match) {
      out.push(line);
      continue;
    }

    const [, lead, marker, rawType, quotedTitle, bareTitle] = match;
    const type = rawType.toLowerCase();
    const title =
      quotedTitle ?? bareTitle ?? type[0].toUpperCase() + type.slice(1);
    const bodyIndent = lead.length + BODY_INDENT;

    const body = [];
    let j = i + 1;
    for (; j < lines.length; j++) {
      if (lines[j].trim() === "") body.push("");
      else if (indentWidth(lines[j]) >= bodyIndent)
        body.push(lines[j].slice(bodyIndent));
      else break;
    }
    while (body.length && body[body.length - 1] === "") body.pop();

    // A directive must be separated from the surrounding text by blank lines
    if (out.length && out[out.length - 1].trim() !== "") out.push("");
    const attrs = `type=${quote(TYPES[type] ?? "note")} title=${quote(title)}${marker.startsWith("?") ? " collapsible" : ""}${marker === "???+" ? " open" : ""}`;
    out.push(
      `${lead}:::admonition{${attrs}}`,
      ...body.map((l) => (l ? lead + l : l)),
      `${lead}:::`,
    );
    if (j < lines.length && lines[j].trim() !== "") out.push("");
    i = j - 1;
  }

  return out.join("\n");
}

/** Turns `:::admonition` containers into callouts; any other directive-looking text is restored verbatim. */
export function remarkAdmonitions() {
  return (tree, file) => {
    visit(tree, (node, index, parent) => {
      if (!/^(container|leaf|text)Directive$/.test(node.type)) return;

      if (node.type !== "containerDirective" || node.name !== "admonition") {
        // e.g. "12:30" or ":smile:" in prose must stay literal text
        const { start, end } = node.position ?? {};
        if (!parent || start?.offset == null) return;
        parent.children[index] = {
          type: "text",
          value: String(file.value).slice(start.offset, end.offset),
        };
        return;
      }

      const {
        type = "note",
        title = "",
        collapsible,
        open,
      } = node.attributes ?? {};
      const collapsibleBox = collapsible != null;
      const heading = title
        ? [
            {
              type: "paragraph",
              data: {
                hName: collapsibleBox ? "summary" : "p",
                hProperties: { className: ["admonition-title"] },
              },
              children: [{ type: "text", value: title }],
            },
          ]
        : [];

      node.data = {
        hName: collapsibleBox ? "details" : "div",
        hProperties: {
          className: ["admonition", `admonition-${type}`],
          ...(open != null ? { open: true } : {}),
        },
      };
      node.children = [...heading, ...node.children];
    });
  };
}
