# The Guard Line: how to publish an article

Articles on https://sjamalinao.edu.ph/news are plain files in this folder.
Publishing = adding a file and pushing to `main` (Vercel deploys automatically).

## The two ways to publish

1. **Ask Claude Code** (primary): paste the Facebook post text and attach the
   photos; it creates the files, applies house style, validates, commits, and
   pushes.
2. **GitHub web UI** (works from any browser): in this folder press
   "Add file > Create new file", paste the template below; upload photos to
   `public/news/<slug>/` with "Add file > Upload files". Commit both to main.

## Article template

Create `content/news/<slug>.md` where `<slug>` is kebab-case and becomes the
URL (`/news/<slug>`):

    ---
    title: "Title of the announcement"
    date: "2026-07-18"
    excerpt: "One or two sentences shown in lists and link previews."
    category: "Announcement"
    photos:
      - src: "/news/<slug>/photo-1.jpg"
        alt: "Describe the photo for screen readers, required"
    ---
    Body of the article. Plain paragraphs, blank line between them.

Rules the validator enforces (`pnpm validate:content`):

- `title`, `date` (YYYY-MM-DD), `excerpt`, and a body are required.
- 0 to 3 photos; each needs `alt` text; files live in `public/news/<slug>/`.
- Resize photos to at most 1600px wide and roughly 400KB before committing
  (any photo editor or https://squoosh.app works).
- No em dashes and no mid dots anywhere in the text.
- `category` is optional: Announcement, Event, or Achievement read best.
- Add `draft: true` to keep a post out of the site while working on it.

House style the validator cannot check for you: refer to students as
"Guardians", and keep the warm, encouraging voice used across the site.

A broken article never takes the site down: the build skips invalid posts with
a warning. Run `pnpm validate:content` to find out exactly what is wrong.
