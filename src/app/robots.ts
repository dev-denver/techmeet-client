import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/terms", "/privacy"],
      disallow: [
        "/api/",
        "/signup",
        "/settings",
        "/profile",
        "/projects",
        "/notifications",
        "/notices",
      ],
    },
    sitemap: `${publicEnv.appUrl}/sitemap.xml`,
  };
}
