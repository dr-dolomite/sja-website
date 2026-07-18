import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NewsArticle } from "@/components/news/news-article";
import { getAllPosts, getPost } from "@/lib/news";

// Every article is rendered at build time; anything not in
// generateStaticParams is a hard 404 (no runtime fs access on Vercel).
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | St. Joseph's Academy of Malinao`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      siteName: "St. Joseph's Academy of Malinao",
      locale: "en_PH",
      // Resolved against metadataBase to an absolute URL for FB's scraper.
      // Conditionally include images: per-article photo if available,
      // otherwise fall back to the branded OG card at /opengraph-image.
      ...(post.photos[0]
        ? {
            images: [
              {
                url: post.photos[0].src,
                width: post.photos[0].width,
                height: post.photos[0].height,
                alt: post.photos[0].alt,
              },
            ],
          }
        : {
            images: [
              {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: "St. Joseph's Academy of Malinao, Inc.",
              },
            ],
          }),
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

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
        <NewsArticle post={post} />
      </main>
      <SiteFooter />
    </>
  );
}
