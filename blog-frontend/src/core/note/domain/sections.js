/**
 * Groups a book's loose top-level notes into named sections without moving any files,
 * so URLs stay stable. `sections` is `[{ title, description?, notes: ["slug", ...] }]`
 * where each entry in `notes` is the note's URL path inside the book (e.g. "dns").
 * Notes that no section lists stay at the top level, so new notes still show up.
 */
export function applySections(tree, sections) {
  if (!Array.isArray(sections) || sections.length === 0) return tree;

  const byPath = new Map(
    tree.filter((n) => n.type === "file").map((n) => [n.path.join("/"), n]),
  );
  const grouped = new Set();

  const groups = sections
    .map((section, index) => {
      const children = (section.notes || [])
        .map((p) => byPath.get(p))
        .filter(Boolean);
      children.forEach((n) => grouped.add(n));
      return {
        type: "directory",
        title: section.title,
        description: section.description,
        slug: `section-${index + 1}`,
        path: [`section-${index + 1}`],
        children,
        synthetic: true,
      };
    })
    .filter((g) => g.children.length > 0);

  const rest = tree.filter((n) => !(n.type === "file" && grouped.has(n)));
  const files = rest.filter((n) => n.type === "file");
  const dirs = rest.filter((n) => n.type !== "file");
  return [...files, ...groups, ...dirs];
}
