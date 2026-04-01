import type { MetadataRoute } from "next";
import { getRequiredSiteUrl } from "@/lib/site-url";

const siteUrl = getRequiredSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
