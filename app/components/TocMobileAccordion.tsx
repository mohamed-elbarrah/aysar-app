"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { PolicyData } from "@/lib/policy-data";
import { cn } from "@/lib/utils";

interface TOCItem {
  id: string;
  number: string;
  label: string;
}

export function TocMobileAccordion({ data }: { data: PolicyData }) {
  const tocItems: TOCItem[] = useMemo(() =>
    data.parts.map((p, i) => ({
      id: p.id,
      number: String(i + 1).padStart(2, "0"),
      label: p.headline,
    })), [data.parts]
  );

  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(tocItems[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const BAR_HEIGHT = 48;

  useEffect(() => {
    const hero = document.querySelector(".policy-hero");
    if (!hero) return;
    const handleScroll = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      setIsSticky(heroBottom <= 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateActive = useCallback(() => {
    const sections = document.querySelectorAll<HTMLElement>(".policy-section");
    const scrollTop = window.scrollY + 140;
    let active: string | null = null;
    sections.forEach((s) => {
      if (scrollTop >= s.offsetTop) active = s.getAttribute("id");
    });
    setActiveId(active ?? tocItems[0]?.id ?? "");
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0);
  }, [tocItems]);

  useEffect(() => {
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  const activeItem = tocItems.find((t) => t.id === activeId);
  const activeNum = activeItem?.number ?? "";

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }

  return (
    <>
      {isSticky && <div className="lg:hidden" style={{ height: BAR_HEIGHT }} />}
      <div ref={barRef} className={cn("lg:hidden", isSticky && "toc-mobile-fixed")}>
        <div className="toc-mobile-bar" onClick={() => setOpen((p) => !p)}>
          <div className="toc-mobile-bar-inner">
            <div className="toc-mobile-current">
              <div className="toc-mobile-current-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                <span>{activeItem?.label ?? "المحتويات"}</span>
              </div>
              <span className="toc-mobile-current-num">{activeNum}</span>
            </div>
            <div className="toc-mobile-chevron-wrap">
              <div className={cn("toc-mobile-chevron", open && "open")}>
                <svg width="10" height="10" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1l5 5 5-5" stroke="#7C8794" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <div className="toc-mobile-progress-bar">
            <div className="toc-mobile-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        {open && (
          <div className={cn("toc-mobile-dropdown", isSticky && "toc-dropdown-fixed")}>
            <div className="toc-mobile-dropdown-inner">
              <div className="toc-list">
                {tocItems.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className={cn(activeId === item.id && "active")} onClick={(e) => handleClick(e, item.id)}>
                    <span className="toc-num">{item.number}</span>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
