import type { Metadata } from "next";
import { SiteLayout } from "@/shared/components/layout/SiteLayout";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { JsonLdScript } from "@/shared/seo/JsonLdScript";
import { createRootMetadata } from "@/shared/seo/metadata";
import { createOrganizationJsonLd, createWebsiteJsonLd } from "@/shared/seo/structuredData";
import "@/styles/global.css";

export const metadata: Metadata = createRootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <SiteLayout>{children}</SiteLayout>
        </AuthProvider>
        <JsonLdScript data={[createOrganizationJsonLd(), createWebsiteJsonLd()]} />
      </body>
    </html>
  );
}
