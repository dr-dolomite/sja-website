// Strict pre-publish validator for content/news. The build itself is tolerant
// (lib/news.ts skips invalid posts with a warning so a typo can never brick
// deploys); THIS script is the loud gate: run `pnpm validate:content` before
// pushing a new article. Exits 1 on any error. Oversized photos are warnings.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { imageSize } from "image-size";

const CONTENT_DIR = path.join(process.cwd(), "content", "news");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 400 * 1024;
const MAX_PHOTO_WIDTH = 1600;

let errorCount = 0;
let warnCount = 0;
const fail = (file, msg) => {
  errorCount += 1;
  console.error(`ERROR  ${file}: ${msg}`);
};
const warn = (file, msg) => {
  warnCount += 1;
  console.warn(`warn   ${file}: ${msg}`);
};

const files = fs.existsSync(CONTENT_DIR)
  ? fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md") && f !== "README.md")
  : [];

for (const file of files) {
  const slug = path.basename(file, ".md");
  let parsed;
  try {
    parsed = matter(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
  } catch (e) {
    fail(file, `frontmatter failed to parse: ${e.message}`);
    continue;
  }
  const { data, content } = parsed;
  if (data.draft === true) {
    console.log(`draft  ${file} (excluded from the site)`);
    continue;
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail(file, "filename must be kebab-case (a-z, 0-9, hyphens)");
  }
  if (typeof data.title !== "string" || data.title.trim() === "") {
    fail(file, "missing required frontmatter field: title");
  }
  if (typeof data.excerpt !== "string" || data.excerpt.trim() === "") {
    fail(file, "missing required frontmatter field: excerpt");
  }
  if (
    typeof data.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    Number.isNaN(new Date(`${data.date}T12:00:00+08:00`).getTime())
  ) {
    fail(file, `date must be a valid "YYYY-MM-DD" string, got: ${JSON.stringify(data.date)}`);
  }
  if (data.category !== undefined && typeof data.category !== "string") {
    fail(file, "category must be a string when present");
  }
  const KNOWN_KEYS = ["title", "date", "excerpt", "category", "photos", "draft"];
  for (const key of Object.keys(data)) {
    if (!KNOWN_KEYS.includes(key)) {
      fail(file, `unknown frontmatter field "${key}" (allowed: ${KNOWN_KEYS.join(", ")})`);
    }
  }
  if (content.trim() === "") {
    fail(file, "article body is empty");
  }
  for (const banned of [["—", "em dash"], ["·", "mid dot"]]) {
    if (content.includes(banned[0]) || String(data.title).includes(banned[0])) {
      fail(file, `contains a ${banned[1]} (${banned[0]}), banned by house copy rules`);
    }
  }
  const photos = data.photos ?? [];
  if (!Array.isArray(photos)) {
    fail(file, "photos must be a list");
    continue;
  }
  if (photos.length > MAX_PHOTOS) {
    fail(file, `at most ${MAX_PHOTOS} photos per article, got ${photos.length}`);
  }
  for (const photo of photos) {
    const src = typeof photo?.src === "string" ? photo.src : "";
    if (!src.startsWith(`/news/${slug}/`)) {
      fail(file, `photo src must start with "/news/${slug}/", got: ${JSON.stringify(photo?.src)}`);
      continue;
    }
    if (typeof photo?.alt !== "string" || photo.alt.trim() === "") {
      fail(file, `photo ${src} is missing its required alt text`);
    }
    const abs = path.join(PUBLIC_DIR, src);
    if (!fs.existsSync(abs)) {
      fail(file, `photo file not found in public/: ${src}`);
      continue;
    }
    let buf;
    try {
      buf = fs.readFileSync(abs);
    } catch {
      fail(file, `could not read photo file ${src}`);
      continue;
    }
    try {
      const { width } = imageSize(buf);
      if (width > MAX_PHOTO_WIDTH) {
        warn(file, `${src} is ${width}px wide; resize to <=${MAX_PHOTO_WIDTH}px before committing`);
      }
    } catch {
      fail(file, `could not read image dimensions of ${src}`);
    }
    if (buf.byteLength > MAX_PHOTO_BYTES) {
      warn(file, `${src} is ${Math.round(buf.byteLength / 1024)}KB; aim for <=${MAX_PHOTO_BYTES / 1024}KB`);
    }
  }
}

console.log(
  `\nChecked ${files.length} article(s): ${errorCount} error(s), ${warnCount} warning(s).`
);
if (errorCount > 0) process.exit(1);
