"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/plans", label: "الأسعار" },
  { href: "/contact", label: "اتصل بنا" },
];

type Variant = "hero" | "light";

interface NavbarProps {
  variant?: Variant;
}

export default function Navbar({ variant = "light" }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHero = variant === "hero";
  const hasScrolled = scrolled;

  /* On hero: transparent → dark glass when scrolled.
     On light pages: always glass-light. */
  const navBg = isHero
    ? hasScrolled
      ? "bg-[rgba(8,16,36,0.85)] border-b border-[rgba(255,255,255,0.08)] backdrop-blur-xl"
      : "bg-transparent border-b border-transparent"
    : "bg-[rgba(255,255,255,0.92)] border-b border-[#e8edf5] backdrop-blur-[16px]";

  const textColor = isHero
    ? hasScrolled
      ? "text-white/70 hover:text-white"
      : "text-white/70 hover:text-white"
    : "text-[#6b7a94] hover:text-[#0c2954]";

  const ghostStyle = isHero
    ? "text-white/70 border border-white/18 hover:bg-white/10 hover:text-white"
    : "text-[#0c2954] border border-[#e8edf5] hover:bg-[#f7f8fa]";

  const solidStyle = isHero
    ? "bg-white text-[#0c2954] hover:opacity-90"
    : "bg-[#0c2954] text-white hover:opacity-88";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[200] h-[62px] flex items-center transition-all duration-300 ${navBg}`}
    >
      <div className="container-aysar flex items-center gap-6 w-full">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="أيسَر"
            width={110}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 mr-auto">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-lg text-sm font-normal transition-all duration-150 ${textColor} ${
                    active ? "font-semibold" : ""
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 right-4 left-4 h-0.5 bg-indigo rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop buttons */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="https://platform.aysar.sa/"
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-ghost-nav ${ghostStyle}`}
          >
            تسجيل دخول
          </a>
          <a
            href="https://platform.aysar.sa/ar/company/dashboard/register"
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-solid-nav ${solidStyle}`}
          >
            ابدأ مجاناً
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden mr-auto text-white/80"
          onClick={()=>setMobileOpen(!mobileOpen)}
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[62px] left-0 right-0 bg-white border border-[#e8edf5] shadow-lg flex flex-col p-4 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={()=>setMobileOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-[rgba(45,46,131,0.06)] text-indigo font-semibold"
                  : "text-[#6b7a94] hover:text-[#0c2954] hover:bg-[#f7f8fa]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://platform.aysar.sa/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-nav text-[#0c2954] border border-[#e8edf5] hover:bg-[#f7f8fa] justify-center mt-2"
          >
            تسجيل دخول
          </a>
          <a
            href="https://platform.aysar.sa/ar/company/dashboard/register"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid-nav bg-[#0c2954] text-white hover:opacity-88 justify-center"
          >
            ابدأ مجاناً
          </a>
        </div>
      )}
    </nav>
  );
}
