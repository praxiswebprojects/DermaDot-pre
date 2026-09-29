import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";
const routes = [
  "",
  "/info",
  "/applications",
  "/doctor",
  "/what-is-smp",
  "/treatment-guide",
  "/procedure",
  "/aftercare",
  "/contact",
  "/faq",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => {
    const el = route ? `${SITE_URL}${route}` : `${SITE_URL}/`;
    const en = `${SITE_URL}/en${route}`;
    return [
      { url: el, changeFrequency: "monthly" as const, priority: route ? 0.7 : 1 },
      { url: en, changeFrequency: "monthly" as const, priority: route ? 0.6 : 0.9 },
    ];
  });
}
