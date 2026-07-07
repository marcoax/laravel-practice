import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const lessonsDir = path.join(root, "lessons");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function versionLineFromMarkdown(markdown) {
  const match = markdown.match(/^>\s*Version:\s*(.+)$/m);
  return match ? match[1] : "";
}

function lessonMajorFromVersion(versionText) {
  const versionSegment = versionText.split("·")[0];
  const majors = [];
  const re = /(?:^|[^\d.])(\d+)(?=\.(?:\d+|x)\b)/g;
  let match;

  while ((match = re.exec(versionSegment)) !== null) {
    majors.push(Number(match[1]));
  }

  return majors.length ? Math.min(...majors) : null;
}

function lessonFiles() {
  const main = fs
    .readdirSync(lessonsDir)
    .filter((file) => /^[0-9][0-9]-.*\.md$/.test(file))
    .sort((a, b) => Number(a.slice(0, 2)) - Number(b.slice(0, 2)));

  const releases = fs
    .readdirSync(lessonsDir)
    .filter((file) => /^[0-9]+\.[0-9]+\.[0-9]+\.md$/.test(file))
    .sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    );

  return [...main, ...releases];
}

function activeLessonsForBaseline(baseline) {
  return lessonFiles()
    .map((file) => {
      const markdown = fs.readFileSync(path.join(lessonsDir, file), "utf8");
      const versionText = versionLineFromMarkdown(markdown);
      return {
        file,
        versionText,
        major: lessonMajorFromVersion(versionText),
      };
    })
    .filter((lesson) => lesson.major === null || lesson.major >= baseline);
}

const example = read("learning-config.example.md");
assert(
  /^\s*course_baseline_major:\s*12\s*$/m.test(example),
  "learning-config.example.md must document course_baseline_major with default 12",
);

const initSkill = read(".claude/skills/lesson-init/SKILL.md");
assert(
  initSkill.includes("course_baseline_major") &&
    initSkill.includes("Static choices only: `12` \\| `13`"),
  "lesson-init skill must ask for static course_baseline_major choices 12 and 13",
);

const teachSkill = read(".claude/skills/lesson/SKILL.md");
assert(
  teachSkill.includes("course_baseline_major") &&
    teachSkill.includes("outside the active course path"),
  "lesson skill must filter direct requests against the active baseline",
);

const index = read("index.html");
const coursePageJs = read("assets/course-page.js");
const coursePage = index + "\n" + coursePageJs;
assert(
  index.includes('src="assets/course-page.js"') &&
    coursePage.includes("parseCourseBaseline") &&
    coursePage.includes("lessonMajorFromVersion") &&
    coursePage.includes('x.slug === "recap-12x"'),
  "course page must parse config, parse lesson Version metadata, and hide recap-12x",
);

const baseline12 = activeLessonsForBaseline(12);
const baseline13 = activeLessonsForBaseline(13);

assert(
  baseline12.length === lessonFiles().length,
  "baseline 12 should keep every lesson visible",
);
assert(
  baseline13.every((lesson) => lesson.major === null || lesson.major >= 13),
  "baseline 13 should not include 12.x lessons",
);
assert(
  baseline13[0]?.file === "06-php-83-upgrade.md",
  `baseline 13 should start at first 13.x lesson, got ${baseline13[0]?.file}`,
);
assert(
  !baseline13.some((lesson) => /^0[1-5]-/.test(lesson.file)),
  "baseline 13 should hide the 12.x core lessons 01-05",
);

console.log(
  `course baseline verification passed: ${baseline12.length} lessons for baseline 12, ${baseline13.length} lessons for baseline 13`,
);
