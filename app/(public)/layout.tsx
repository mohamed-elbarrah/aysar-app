import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getSiteSettings } from "@/app/lib/settings-data";
import { ScriptRenderer } from "@/app/components/ScriptRenderer";
import { ScriptErrorBoundary } from "@/app/components/ScriptErrorBoundary";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <>
      <ScriptErrorBoundary>
        <ScriptRenderer scripts={settings.scripts} location="head" />
      </ScriptErrorBoundary>
      <Navbar navLinks={settings.navLinks} platformLinks={settings.platformLinks} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer
        columns={settings.footerColumns}
        socialLinks={settings.socialLinks}
        contactInfo={settings.contactInfo}
        appLinks={settings.appLinks}
      />
      <ScriptErrorBoundary>
        <ScriptRenderer scripts={settings.scripts} location="body" />
      </ScriptErrorBoundary>
    </>
  );
}