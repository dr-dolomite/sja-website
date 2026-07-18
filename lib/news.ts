// Server-only content library for The Guard Line (/news).
//
// Articles are flat markdown files in content/news/<slug>.md with photos in
// public/news/<slug>/. Everything resolves at build time (all news routes are
// statically generated), so this file may use fs freely.
//
// Validation here is deliberately TOLERANT: an invalid post is skipped with a
// loud console warning instead of throwing, so one authoring typo committed to
// main can never freeze deploys of the whole site. The strict counterpart is
// scripts/validate-content.mjs (`pnpm validate:content`), which throws.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { imageSize } from "image-size";

const CONTENT_DIR = path.join(process.cwd(), "content", "news");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_PHOTOS = 3;

export type NewsPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type NewsPost = {
  slug: string;
  title: string;
  /** ISO YYYY-MM-DD, never re-parse client-side (UTC off-by-one risk). */
  date: string;
  /** Preformatted in Asia/Manila, e.g. "Jul 8, 2026". */
  displayDate: string;
  excerpt: string;
  category?: string;
  photos: NewsPhoto[];
  /** Raw markdown body. */
  body: string;
};

// Noon +08:00 keeps the formatted day stable regardless of build timezone.
const manilaDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Manila",
  month: "short",
  day: "numeric",
  year: "numeric",
});

type ParseResult =
  | { post: NewsPost }
  | { draft: true }
  | { errors: string[] };

function parsePostFile(filePath: string): ParseResult {
  const slug = path.basename(filePath, ".md");
  const errors: string[] = [];

  let data: Record<string, unknown>;
  let content: string;
  try {
    ({ data, content } = matter(fs.readFileSync(filePath, "utf8")));
  } catch (e) {
    return { errors: [`frontmatter failed to parse: ${String(e)}`] };
  }

  if (data.draft === true) return { draft: true };

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`filename "${slug}" must be kebab-case (a-z, 0-9, hyphens)`);
  }
  if (typeof data.title !== "string" || data.title.trim() === "") {
    errors.push("missing required frontmatter field: title");
  }
  if (typeof data.excerpt !== "string" || data.excerpt.trim() === "") {
    errors.push("missing required frontmatter field: excerpt");
  }
  const date = typeof data.date === "string" ? data.date : "";
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(new Date(`${date}T12:00:00+08:00`).getTime())
  ) {
    errors.push(`date must be a valid "YYYY-MM-DD" string, got: ${JSON.stringify(data.date)}`);
  }
  if (data.category !== undefined && typeof data.category !== "string") {
    errors.push("category must be a string when present");
  }

  const photos: NewsPhoto[] = [];
  const rawPhotos = data.photos ?? [];
  if (!Array.isArray(rawPhotos)) {
    errors.push("photos must be a list");
  } else {
    if (rawPhotos.length > MAX_PHOTOS) {
      errors.push(`at most ${MAX_PHOTOS} photos per article, got ${rawPhotos.length}`);
    }
    for (const raw of rawPhotos.slice(0, MAX_PHOTOS)) {
      const src = typeof raw?.src === "string" ? raw.src : "";
      const alt = typeof raw?.alt === "string" ? raw.alt.trim() : "";
      if (!src.startsWith(`/news/${slug}/`)) {
        errors.push(`photo src must start with "/news/${slug}/", got: ${JSON.stringify(raw?.src)}`);
        continue;
      }
      if (alt === "") {
        errors.push(`photo ${src} is missing its required alt text`);
        continue;
      }
      const abs = path.join(PUBLIC_DIR, src);
      if (!fs.existsSync(abs)) {
        errors.push(`photo file not found in public/: ${src}`);
        continue;
      }
      try {
        const { width, height } = imageSize(fs.readFileSync(abs));
        if (!width || !height) throw new Error("no dimensions");
        photos.push({ src, alt, width, height });
      } catch {
        errors.push(`could not read image dimensions of ${src}`);
      }
    }
  }

  if (errors.length > 0) return { errors };

  return {
    post: {
      slug,
      title: (data.title as string).trim(),
      date,
      displayDate: manilaDate.format(new Date(`${date}T12:00:00+08:00`)),
      excerpt: (data.excerpt as string).trim(),
      category: typeof data.category === "string" ? data.category.trim() : undefined,
      photos,
      body: content.trim(),
    },
  };
}

/** All published posts, newest first. Invalid posts are skipped with a warning. */
export function getAllPosts(): NewsPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const posts: NewsPost[] = [];
  for (const file of fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md") && f !== "README.md")) {
    const result = parsePostFile(path.join(CONTENT_DIR, file));
    if ("errors" in result) {
      console.warn(
        `[news] SKIPPING invalid post "${file}" (run \`pnpm validate:content\` for details):\n  - ${result.errors.join("\n  - ")}`
      );
      continue;
    }
    if ("draft" in result) continue;
    posts.push(result.post);
  }
  return posts.sort(
    (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)
  );
}

export function getPost(slug: string): NewsPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getLatestPosts(n: number): NewsPost[] {
  return getAllPosts().slice(0, n);
}
