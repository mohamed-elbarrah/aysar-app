import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/app/lib/settings-data";

export const dynamic = "force-dynamic";

const notoKufi = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.siteTitle,
    description: settings.extractedMeta.description || settings.siteDescription,
    keywords: settings.extractedMeta.keywords || settings.seoKeywords,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
    ...(settings.extractedMeta.openGraph && {
      openGraph: settings.extractedMeta.openGraph as Metadata["openGraph"],
    }),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${notoKufi.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
