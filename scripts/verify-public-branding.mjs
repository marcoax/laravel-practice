import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const brand = "Laravel Practice";
const oldBrandPhrases = [
  "Laravel 12 → 13: Learn by Doing",
  "Laravel 12 → 13 · learn by doing",
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function textFromHtml(fragment) {
  return fragment
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const index = read("index.html");
const readme = read("README.md");

const title = index.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim();
const asideHeading = textFromHtml(
  index.match(/<aside>[\s\S]*?<h1>([\s\S]*?)<\/h1>/i)?.[1] || "",
);
const readmeHeading = readme.match(/^#\s+(.+)$/m)?.[1]?.trim();

assert(title === brand, `index.html title must be "${brand}", got "${title}"`);
assert(
  asideHeading === brand,
  `index.html visible course heading must be "${brand}", got "${asideHeading}"`,
);
assert(
  readmeHeading === brand,
  `README.md top-level heading must be "${brand}", got "${readmeHeading}"`,
);

for (const oldPhrase of oldBrandPhrases) {
  assert(
    ![title, asideHeading, readmeHeading].includes(oldPhrase),
    `public identity surfaces must not use old branding phrase "${oldPhrase}"`,
  );
}

assert(
  /12\.x\s+to\s+13\.x|12\.x-to-13\.x|12\s+to\s+13/i.test(readme),
  "README.md should still describe the current Laravel 12.x to 13.x lesson scope",
);
assert(
  /12\.x\s+to\s+13\.x|12\.x-to-13\.x|12\s+to\s+13/i.test(index),
  "index.html should still describe the current Laravel 12.x to 13.x lesson scope",
);

console.log("public branding verification passed");
