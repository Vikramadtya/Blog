import test from "node:test";
import assert from "node:assert/strict";
import { preprocessAdmonitions } from "../src/lib/admonitions.js";

test("rewrites an admonition with lazy-indented body into a container directive", () => {
  const out = preprocessAdmonitions(
    'Intro\n!!! info "Recursive vs Iterative"\n    A normal app.\n    - one\n    - two\n\nAfter',
  );
  assert.equal(
    out,
    'Intro\n\n:::admonition{type="info" title="Recursive vs Iterative"}\nA normal app.\n- one\n- two\n:::\n\nAfter',
  );
});

test("supports empty titles, collapsible blocks and unknown types", () => {
  const out = preprocessAdmonitions('??? tip "More"\n\n    body\n\n!!! npte ""\n    x');
  assert.match(out, /type="tip" title="More" collapsible\}/);
  assert.match(out, /type="note" title=""\}/);
});

test("leaves fenced code untouched", () => {
  const src = '```md\n!!! info "x"\n    y\n```';
  assert.equal(preprocessAdmonitions(src), src);
});
