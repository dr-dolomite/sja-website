import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/news";

const BASE = "https://sjamalinao.edu.ph";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/academics",
    "/news",
    "/contact",
  ].map((route) => ({ url: `${BASE}${route}` }));

  const articles: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE}/news/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00+08:00`),
  }));

  return [...staticRoutes, ...articles];
}
