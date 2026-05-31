"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useLayoutEffect } from "react";

interface NavLinkItem {
  label: string;
  href: string;
}

interface PlatformLinks {
  loginUrl: string;
  registerUrl: string;
  supportCenterUrl: string;
}

export default function Navbar({ navLinks, platformLinks, logoUrl }: { navLinks: NavLinkItem[]; platformLinks: PlatformLinks; logoUrl?: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 });
  const navRef = useRef<HTMLUListElement>(null);
  const activeIndex = navLinks.findIndex((link) => link.href === pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  useLayoutEffect(() => {
    if (navRef.current && activeIndex !== -1) {
      const activeLink = navRef.current.children[activeIndex] as HTMLElement;
      if (activeLink) {
        const linkElement = activeLink.querySelector("a") as HTMLElement;
        if (linkElement) {
          setUnderlineStyle({
            width: linkElement.offsetWidth - 28,
            left: linkElement.offsetLeft + 14,
          });
        }
      }
    }
  }, [activeIndex, pathname]);

  const navBg = scrolled
    ? "bg-[rgba(8,16,36,0.85)] border-b border-[rgba(255,255,255,0.08)] backdrop-blur-xl"
    : "bg-transparent border-b border-transparent";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[200] h-[62px] flex items-center transition-all duration-300 ${navBg}`}
    >
      <div className="container-aysar flex items-center gap-6 w-full">
        <Link href="/" className="flex-shrink-0">
          <Image
            src={logoUrl || "/logo.png"}
            alt="أيسَر"
            width={130}
            height={44}
            className="h-12 w-auto object-contain"
            style={{ width: 'auto' }}
            priority
          />
        </Link>

        <ul ref={navRef} className="max-md:hidden md:flex items-center gap-2 me-auto relative">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative text-lg px-3.5 py-1.5 rounded-lg  transition-colors duration-200 ${
                    active ? "text-white font-bold" : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          {/* Animated underline */}
          <span
            className="absolute -bottom-1 h-0.5 bg-white rounded-full transition-all duration-300 ease-out"
            style={{
              width: underlineStyle.width,
              left: underlineStyle.left,
              opacity: activeIndex !== -1 ? 1 : 0,
            }}
          />
        </ul>

        <div className="max-md:hidden md:flex  items-center gap-2">
          <a
            href={platformLinks.loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-nav text-lg text-white/70 border border-white/18 hover:bg-white/10 hover:text-white"
          >
            تسجيل دخول
          </a>
          <a
            href={platformLinks.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid-nav text-lg bg-[#28C928] text-white hover:opacity-90"
          >
            ابدأ مجاناً
          </a>
        </div>

        <button
          className="md:hidden mr-auto text-white/80"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <>
                <path d="M18 6L6 18M6 6l12 12" />
              </>
            ) : (
              <>
                <path d="M3 12h18M3 6h18M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden absolute top-[62px] left-0 right-0 bg-white border border-[#e8ebf3] shadow-lg flex flex-col p-4 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[rgba(45,46,131,0.06)] text-indigo font-semibold"
                  : "text-[#7C8794] hover:text-[#08335D] hover:bg-[#F4F7FA]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={platformLinks.loginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-nav text-[#08335D] border border-[#e8ebf3] hover:bg-[#F4F7FA] justify-center mt-2"
          >
            تسجيل دخول
          </a>
          <a
            href={platformLinks.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid-nav bg-[#28C928] text-white hover:opacity-88 justify-center"
          >
            ابدأ مجاناً
          </a>
        </div>
      )}
    </nav>
  );
}