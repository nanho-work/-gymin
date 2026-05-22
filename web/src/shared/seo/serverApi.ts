import { getSiteOrigin } from "@/shared/seo/site";

type QueryValue = string | number | boolean | null | undefined;

type PublicApiOptions = {
  query?: Record<string, QueryValue>;
  revalidate?: number;
};

export async function fetchPublicApi<T>(path: string, options: PublicApiOptions = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${getPublicApiBaseUrl()}${normalizedPath}`);

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json"
    },
    next: {
      revalidate: options.revalidate ?? 300
    }
  });

  if (!response.ok) {
    throw new Error(`SEO API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

function getPublicApiBaseUrl() {
  const explicitBaseUrl = process.env.SERVER_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

  if (explicitBaseUrl && /^https?:\/\//i.test(explicitBaseUrl)) {
    return explicitBaseUrl.replace(/\/$/, "");
  }

  const apiPath = explicitBaseUrl && explicitBaseUrl.startsWith("/") ? explicitBaseUrl : "/api";
  return new URL(apiPath, `${getSiteOrigin()}/`).toString().replace(/\/$/, "");
}
