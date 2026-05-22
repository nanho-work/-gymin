import type { MetadataRoute } from "next";

import { getCanonicalUrl, getSiteOrigin } from "@/shared/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    host: getSiteOrigin(),
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/jobs/hiring",
          "/jobs/hiring/",
          "/gyms/"
        ],
        disallow: [
          "/api/",
          "/gyms/new",
          "/jobs/hiring/new",
          "/login",
          "/owner",
          "/owner/",
          "/signup",
          "/trainer",
          "/trainer/",
          "/trainers/"
        ]
      }
    ],
    sitemap: getCanonicalUrl("/sitemap.xml")
  };
}
