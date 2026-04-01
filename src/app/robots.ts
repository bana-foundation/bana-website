import type { MetadataRoute } from "next";
import { getRequiredSiteUrl } from "@/lib/site-url";

const siteUrl = getRequiredSiteUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
