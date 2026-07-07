// Neutrality guard for tracked lesson briefs (ADR-0023).
//
// Briefs in lessons/*.md are tracked, forkable template content: they must never
// name the learner's real reference project, its stack, or real counts. Wherever
// the learner's project is meant, they use the literal {{reference_project}} token,
// which /teach resolves at HTML render time from reference_project_name in the
// git-ignored learning-config.md.
//
// Dual-mode:
//  - Local mode (learning-config.md present): additionally blocks any occurrence
//    of the reference_project_name value. The name is read from the git-ignored
//    config — never hardcoded here (a hardcoded blocklist would itself re-leak it).
//  - Generic mode (always, incl. CI where the config is absent): blocks hardcoded
//    model counts and proper names after "_Example —", and positively requires the
//    {{reference_project}} token in every _Example line.
//
// No stack-name blocklist: a lesson may legitimately be about those tools.

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const lessonsDir = path.join(root, "lessons");
const excluded = new Set(["_template.md", "README.md"]);

const briefs = fs
  .readdirSync(lessonsDir)
  .filter((f) => f.endsWith(".md") && !excluded.has(f))
  .sort();

const failures = [];

function fail(file, line, message) {
  failures.push(`lessons/${file}:${line} — ${message}`);
}

// Local mode: read the real name from the git-ignored config, if present.
let projectName = null;
const configPath = path.join(root, "learning-config.md");
if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, "utf8");
  const match = config.match(/^reference_project_name:\s*([^\s#]+)/m);
  if (match) projectName = match[1].trim();
}

const token = "{{reference_project}}";
const modelCount = /~?\d+\s+models\b/i;
// "_Example — <ProperName>:" with anything other than the exact token.
const examplePrefix = /^_Example\s+—\s+(.+?):_/;

for (const file of briefs) {
  const lines = fs
    .readFileSync(path.join(lessonsDir, file), "utf8")
    .split("\n");

  lines.forEach((text, i) => {
    const line = i + 1;

    if (projectName) {
      const re = new RegExp(projectName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      if (re.test(text)) {
        fail(file, line, `names the reference project (value of reference_project_name)`);
      }
    }

    if (modelCount.test(text)) {
      fail(file, line, `hardcoded model count: "${text.match(modelCount)[0]}"`);
    }

    const example = text.match(examplePrefix);
    if (example && example[1] !== token) {
      fail(file, line, `_Example line must use the ${token} token, got "${example[1]}"`);
    }
  });
}

if (failures.length > 0) {
  console.error(`verify-neutral-lessons: ${failures.length} violation(s) (ADR-0023):\n`);
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}

console.log(
  `verify-neutral-lessons: OK — ${briefs.length} briefs neutral` +
    (projectName ? " (local mode: config name checked)" : " (generic mode: no local config)"),
);
