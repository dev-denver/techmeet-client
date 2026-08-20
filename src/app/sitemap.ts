import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/config/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicEnv.appUrl;

  return [
    {
      url: `${base}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
