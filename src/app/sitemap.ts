import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://pablosilvabjj.com";
  return [
    { url: `${base}/`,            lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/programs`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/instructors`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/llm.txt`,     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];
}
