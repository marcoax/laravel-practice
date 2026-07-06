import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const EXTERNAL_HREF = /^(https?:)?\/\//i;
// Anything not external and not a non-navigational scheme (mailto:, tel:, javascript:)
// is treated as internal course navigation: relative lesson/README links and local anchors.
const NON_NAV_SCHEME = /^(mailto:|tel:|javascript:)/i;

function findAnchors(html) {
  const anchors = [];
  const re = /<a\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[1];
    const href = attrs.match(/\bhref\s*=\s*"([^"]*)"/i)?.[1]
      ?? attrs.match(/\bhref\s*=\s*'([^']*)'/i)?.[1];
    if (href === undefined) continue;
    const target = attrs.match(/\btarget\s*=\s*"([^"]*)"/i)?.[1]
      ?? attrs.match(/\btarget\s*=\s*'([^']*)'/i)?.[1];
    const rel = attrs.match(/\brel\s*=\s*"([^"]*)"/i)?.[1]
      ?? attrs.match(/\brel\s*=\s*'([^']*)'/i)?.[1];
    anchors.push({ href, target, rel });
  }
  return anchors;
}

// Returns a list of human-readable problems; empty means the HTML is compliant.
function checkExternalLinks(html) {
  const problems = [];
  for (const { href, target, rel } of findAnchors(html)) {
    if (NON_NAV_SCHEME.test(href)) continue;

    const isExternal = EXTERNAL_HREF.test(href);
    const relTokens = (rel || "").toLowerCase().split(/\s+/).filter(Boolean);

    if (isExternal) {
      if (target !== "_blank") {
        problems.push(`external link "${href}" is missing target="_blank"`);
      }
      if (!relTokens.includes("noopener") || !relTokens.includes("noreferrer")) {
        problems.push(`external link "${href}" is missing rel="noopener noreferrer"`);
      }
    } else {
      // Internal course navigation (relative lesson links, README, local anchors)
      // must keep loading in the current course pane, not a new tab.
      if (target === "_blank") {
        problems.push(`internal link "${href}" should not use target="_blank"`);
      }
    }
  }
  return problems;
}

// Self-test: prove the checker actually distinguishes good from bad before
// trusting it against real, per-user, git-ignored lesson HTML.
const good = read("scripts/fixtures/lesson-external-links-good.html");
const bad = read("scripts/fixtures/lesson-external-links-bad.html");

assert(
  checkExternalLinks(good).length === 0,
  `fixture "good" should have no problems, got: ${checkExternalLinks(good).join("; ")}`,
);
assert(
  checkExternalLinks(bad).length > 0,
  `fixture "bad" should have been flagged but the checker found nothing — detector is broken`,
);

// Real lessons are generated per-user and git-ignored (see .gitignore), so a
// fresh clone has none — skip gracefully rather than failing.
const lessonFiles = fs.existsSync(path.join(root, "lessons"))
  ? fs.readdirSync(path.join(root, "lessons")).filter((f) => f.endsWith(".html"))
  : [];

let realProblems = 0;
for (const file of lessonFiles) {
  const problems = checkExternalLinks(read(path.join("lessons", file)));
  for (const problem of problems) {
    console.error(`lessons/${file}: ${problem}`);
    realProblems++;
  }
}
assert(
  realProblems === 0,
  `${realProblems} external-link problem(s) found in generated lessons — see above`,
);

console.log(
  lessonFiles.length
    ? `external link verification passed (checked ${lessonFiles.length} generated lesson file(s))`
    : "external link verification passed (fixture self-test only — no generated lessons on disk)",
);
