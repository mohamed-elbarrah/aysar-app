import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { getSiteSettings, resolveAbsoluteUrl } from "@/app/lib/settings-data";

export const dynamic = "force-dynamic";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

function getFaviconMeta(url: string): { type?: string; sizes?: string } {
  const cleanUrl = url.split("?")[0].toLowerCase();
  if (cleanUrl.endsWith(".svg")) return { type: "image/svg+xml", sizes: "any" };
  if (cleanUrl.endsWith(".png")) return { type: "image/png", sizes: "32x32" };
  if (cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg")) return { type: "image/jpeg", sizes: "32x32" };
  if (cleanUrl.endsWith(".webp")) return { type: "image/webp", sizes: "32x32" };
  if (cleanUrl.endsWith(".ico")) return { type: "image/x-icon" };
  return {};
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const faviconUrl = settings.faviconUrl || undefined;
  const ogImageUrl = resolveAbsoluteUrl(settings.logoUrl);

  const icons: Metadata["icons"] = faviconUrl
    ? {
        icon: [
          { url: faviconUrl, ...getFaviconMeta(faviconUrl) },
        ],
      }
    : {
        icon: [
          { url: "/logo.png", type: "image/png", sizes: "32x32" },
        ],
      };

  return {
    title: settings.siteTitle,
    description: settings.siteDescription,
    keywords: settings.seoKeywords,
    icons,
    openGraph: {
      siteName: settings.siteTitle,
      title: settings.siteTitle,
      description: settings.siteDescription,
      url: settings.siteUrl,
      locale: "ar_SA",
      type: "website",
      ...(ogImageUrl && { images: [{ url: ogImageUrl }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.siteDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlexSansArabic.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}