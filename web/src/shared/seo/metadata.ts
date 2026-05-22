import type { Metadata } from "next";

import {
  defaultSeoDescription,
  defaultSeoKeywords,
  getCanonicalUrl,
  getSiteOrigin,
  siteName
} from "@/shared/seo/site";

export function createSeoMetadata({
  description = defaultSeoDescription,
  noIndex = false,
  path = "/",
  title,
  type = "website"
}: {
  description?: string;
  noIndex?: boolean;
  path?: string;
  title: string;
  type?: "website" | "article";
}): Metadata {
  const canonical = getCanonicalUrl(path);

  return {
    title,
    description,
    keywords: defaultSeoKeywords,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      siteName,
      type,
      url: canonical,
      locale: "ko_KR"
    },
    twitter: {
      card: "summary",
      title,
      description
    },
    robots: noIndex
      ? {
          follow: false,
          index: false
        }
      : {
          follow: true,
          googleBot: {
            follow: true,
            index: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          },
          index: true
        }
  };
}

export function createRootMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteOrigin()),
    title: {
      default: "GymIn | 피트니스 구인구직 플랫폼",
      template: "%s | GymIn"
    },
    description: defaultSeoDescription,
    applicationName: siteName,
    creator: siteName,
    publisher: siteName,
    keywords: defaultSeoKeywords,
    category: "피트니스 구인구직",
    formatDetection: {
      telephone: false
    },
    openGraph: {
      title: "GymIn | 피트니스 구인구직 플랫폼",
      description: defaultSeoDescription,
      siteName,
      type: "website",
      url: getCanonicalUrl("/"),
      locale: "ko_KR"
    },
    twitter: {
      card: "summary",
      title: "GymIn | 피트니스 구인구직 플랫폼",
      description: defaultSeoDescription
    }
  };
}

export function createNoIndexMetadata(title: string, path = "/"): Metadata {
  return createSeoMetadata({
    title,
    noIndex: true,
    path
  });
}
