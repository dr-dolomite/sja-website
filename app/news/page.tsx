import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GuardLineIndex } from "@/components/news/guard-line-index";
import { getAllPosts } from "@/lib/news";

export const metadata: Metadata = {
  title: "News | St. Joseph's Academy of Malinao",
  description:
    "The Guard Line: news and announcements from St. Joseph's Academy of Malinao. Enrollment updates, school events, and Guardian achievements.",
};

export default function NewsPage() {
  // Client component gets a plain serializable shape, never the full post.
  const posts = getAllPosts().map((post) => ({
    slug: post.slug,
    date: post.date,
    title: post.title,
    displayDate: post.displayDate,
    excerpt: post.excerpt,
    photo: post.photos[0],
  }));

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded-md focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <GuardLineIndex posts={posts} />
      </main>
      <SiteFooter />
    </>
  );
}
