import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";

const notoKufi = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "أيسَر — منصة إدارة التطوير العقاري",
  description:
    "أيسَر تمنحك لوحة تحكم احترافية لإدارة مشاريعك وعملاءك — من تتبع مراحل الإنشاء وإشعارات فورية، حتى صفحات هبوط واستقبال حجوزات ونظام CRM متكامل.",
};

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
