const DEFAULT_SITE_URL = "https://banaglobal.io";
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL;

function normalizeSiteUrl(url: string): string {
  return url.startsWith("http") ? url : `https://${url}`;
}

export function getSiteUrl(): string | undefined {
  if (!rawSiteUrl) {
    return undefined;
  }

  return normalizeSiteUrl(rawSiteUrl);
}

export function getRequiredSiteUrl(): string {
  return getSiteUrl() ?? DEFAULT_SITE_URL;
}

export function getMetadataBase(): URL | undefined {
  const siteUrl = getSiteUrl();
  return siteUrl ? new URL(siteUrl) : undefined;
}
