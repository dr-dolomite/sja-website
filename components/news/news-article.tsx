import Image from "next/image";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import { ArrowLeft } from "lucide-react";

import type { NewsPost } from "@/lib/news";

// Calm, fully server-rendered long-form article (DESIGN.md §7: interior pages
// drop the kicker density and motion of the homepage). react-markdown emits
// React elements directly, and raw HTML in the pasted body is ignored by
// allowedElements, so nothing here touches dangerouslySetInnerHTML.
// react-markdown passes an extra `node` prop to custom components; it must be
// destructured out so it never spreads onto the DOM element.
const markdownComponents: Components = {
  p: ({ node, ...props }) => (
    <p
      className="text-[16px] leading-[1.7] text-foreground/90 sm:text-[17px]"
      {...props}
    />
  ),
  a: ({ node, ...props }) => (
    <a
      className="font-semibold text-primary underline decoration-secondary/70 underline-offset-4 transition-colors hover:text-grove-deep"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-[16px] leading-[1.7] text-foreground/90 sm:text-[17px]" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="flex list-decimal flex-col gap-2 pl-5 text-[16px] leading-[1.7] text-foreground/90 sm:text-[17px]" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="border-l-2 border-secondary pl-5 font-serif text-2xl leading-snug text-grove-deep"
      {...props}
    />
  ),
};

export function NewsArticle({ post }: { post: NewsPost }) {
  const [lead, ...morePhotos] = post.photos;

  return (
    <article className="relative overflow-hidden bg-background text-foreground">
      {/* Decorative thin gold ring, per the Gold-as-Detail Rule. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-40 size-[28rem] rounded-full border border-secondary/25"
      />

      <div className="relative mx-auto w-full max-w-3xl px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-14">
        <Link
          href="/news"
          className="inline-flex min-h-11 items-center gap-2 rounded-md text-[15px] font-semibold text-primary transition-colors hover:text-grove-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          The Guard Line
        </Link>

        <header className="mt-8 flex flex-col gap-5">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold uppercase tracking-[0.18em] text-primary">
            <time dateTime={post.date}>{post.displayDate}</time>
            {post.category ? (
              <>
                {/* Thin gold rule as separator, never a mid dot. */}
                <span aria-hidden="true" className="h-px w-6 bg-secondary" />
                <span>{post.category}</span>
              </>
            ) : null}
          </p>
          <h1 className="text-balance font-serif text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.06] tracking-[-0.005em] text-grove-deep">
            {post.title}
          </h1>
          <p className="text-pretty text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
            {post.excerpt}
          </p>
        </header>

        {lead ? (
          <figure className="mt-10 overflow-hidden rounded-[28px]">
            <Image
              src={lead.src}
              alt={lead.alt}
              width={lead.width}
              height={lead.height}
              priority
              sizes="(min-width: 768px) 48rem, 100vw"
              className="h-auto w-full object-cover"
            />
          </figure>
        ) : null}

        <div className="mt-10 flex max-w-[68ch] flex-col gap-6">
          <ReactMarkdown
            allowedElements={["p", "strong", "em", "a", "ul", "ol", "li", "blockquote"]}
            unwrapDisallowed
            components={markdownComponents}
          >
            {post.body}
          </ReactMarkdown>
        </div>

        {morePhotos.length > 0 ? (
          <div
            className={`mt-10 grid gap-4 ${
              morePhotos.length === 2 ? "sm:grid-cols-2" : ""
            }`}
          >
            {morePhotos.map((photo) => (
              <figure key={photo.src} className="overflow-hidden rounded-3xl">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 640px) 24rem, 100vw"
                  className="h-auto w-full object-cover"
                />
              </figure>
            ))}
          </div>
        ) : null}

        {/* Contact stays one scroll away, on a Leaf-Tint break panel. */}
        <div className="mt-14 flex flex-col gap-4 rounded-3xl bg-muted px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="max-w-[42ch] text-pretty text-[15px] leading-relaxed text-foreground/90">
            Questions about this story? The office is glad to help, Monday to
            Friday.
          </p>
          <Link
            href="/contact"
            className="inline-flex h-11 w-fit shrink-0 items-center justify-center rounded-full bg-primary px-6 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            Contact the school
          </Link>
        </div>
      </div>
    </article>
  );
}
