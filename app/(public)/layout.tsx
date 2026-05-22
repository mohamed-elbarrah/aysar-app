import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getSiteSettings } from "@/app/lib/settings-data";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar navLinks={settings.navLinks} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer
        tagline={settings.footerTagline}
        copyright={settings.footerCopyright}
        quickLinks={settings.footerQuickLinks}
        helpLinks={settings.footerHelpLinks}
        socialLinks={settings.socialLinks}
        appLinks={settings.appLinks}
      />
    </>
  );
}
