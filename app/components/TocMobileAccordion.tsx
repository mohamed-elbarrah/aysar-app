"use client";

import { useState, useEffect, useCallback } from "react";
import { PolicyData } from "@/lib/policy-data";
import { cn } from "@/lib/utils";

export function TocMobileAccordion({ data }: { data: PolicyData }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>(data.tocItems[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  const updateActive = useCallback(() => {
    const sections = document.querySelectorAll<HTMLElement>(".policy-section");
    const scrollTop = window.scrollY + 140;
    let active: string | null = null;
    sections.forEach((s) => {
      if (scrollTop >= s.offsetTop) {
        active = s.getAttribute("id");
      }
    });
    setActiveId(active ?? data.tocItems[0]?.id ?? "");

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0);
  }, [data.tocItems]);

  useEffect(() => {
    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  const activeItem = data.tocItems.find((t) => t.id === activeId);
  const activeNum = activeItem?.number ?? "";

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <div className="toc-mobile-bar" onClick={() => setOpen((p) => !p)}>
        <div className="toc-mobile-bar-inner">
          <div className="toc-mobile-current">
            <div className="toc-mobile-current-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span>{activeItem?.label ?? "المحتويات"}</span>
            </div>
            <span className="toc-mobile-current-num">{activeNum}</span>
          </div>
          <div className="toc-mobile-chevron-wrap">
            <div className={cn("toc-mobile-chevron", open && "open")}>
              <svg width="10" height="10" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="#6b7a94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div className="toc-mobile-progress-bar">
          <div className="toc-mobile-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <div className={cn("toc-mobile-dropdown", open && "open")}>
        <div className="toc-mobile-dropdown-inner">
          {data.tocGroups.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <div className="toc-mobile-group-divider" />}
              <div className="toc-mobile-group-title">{group.title}</div>
              {group.items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn("toc-mobile-link", isActive && "active")}
                    onClick={(e) => handleClick(e, item.id)}
                  >
                    <span className={cn("toc-mobile-link-num", isActive && "active")}>{item.number}</span>
                    <div className="toc-mobile-link-text">
                      <span className={cn("toc-mobile-link-label", isActive && "active")}>{item.label}</span>
                      {item.subtitle && (
                        <span className={cn("toc-mobile-link-subtitle", isActive && "active")}>{item.subtitle}</span>
                      )}
                    </div>
                    {isActive && (
                      <span className="toc-mobile-link-dot" />
                    )}
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
