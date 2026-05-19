"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { PolicyData, SectionBlock, ListBlock, TableBlock, AlertBlock } from "@/lib/policy-data";
import { Badge } from "@/app/components/ui/Badge";
import { TocMobileAccordion } from "@/app/components/TocMobileAccordion";

function SectionBlockView({ block }: { block: SectionBlock }) {
  return (
    <>
      {block.paragraphs.map((p, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
      ))}
    </>
  );
}

function ListBlockView({ block }: { block: ListBlock }) {
  return (
    <ul className="policy-list">
      {block.items.map((item, i) => (
        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
      ))}
    </ul>
  );
}

function TableBlockView({ block }: { block: TableBlock }) {
  return (
    <table className="policy-table">
      <thead>
        <tr>
          {block.headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows.map((row, i) => (
          <tr key={i}>
            <td><strong>{row[0]}</strong></td>
            <td>{row[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AlertBlockView({ block }: { block: AlertBlock }) {
  const emojiMap = { blue: "ℹ️", green: "✅", amber: "⚠️" };
  return (
    <div className={`alert-card ${block.variant}`}>
      <div className="alert-icon">{emojiMap[block.variant]}</div>
      <div className="alert-body">
        <strong>{block.label}</strong>
        <p>{block.text}</p>
      </div>
    </div>
  );
}

function TocSidebar({ data, isSticky }: { data: PolicyData; isSticky: boolean }) {
  const [activeId, setActiveId] = useState(data.tocItems[0]?.id ?? "");
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".policy-section");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id) setActiveId(id);
          }
        });
      },
      { rootMargin: "-82px 0px -60% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [data.tocItems]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const docHeight = typeof document !== "undefined" ? document.documentElement.scrollHeight - window.innerHeight : 1;
  const scrollTop = typeof window !== "undefined" ? window.scrollY : 0;
  const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

  return (
    <aside className={cn("toc", isSticky && "toc-sticky")}>
      {isSticky && (
        <div className="toc-progress-bar">
          <div className="toc-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      )}
      <div className="toc-title">المحتويات</div>
      <ul className="toc-list" ref={listRef}>
        {data.tocItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(activeId === item.id && "active")}
              onClick={(e) => handleClick(e, item.id)}
            >
              <span className="toc-num">{item.number}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {data.sidebarCard && (
        <div className="toc-card">
          <div className="toc-card-title">{data.sidebarCard.title}</div>
          <div className="toc-card-desc">{data.sidebarCard.desc}</div>
          <a href={data.sidebarCard.href} className="toc-card-btn">
            {data.sidebarCard.linkLabel}
          </a>
        </div>
      )}
    </aside>
  );
}

function ContentBody({ data }: { data: PolicyData }) {
  return (
    <main className="policy-body">
      {data.sections.map((section, si) => (
        <div key={section.id}>
          <section className="policy-section" id={section.id}>
            <div className="sec-eyebrow">{section.eyebrow}</div>
            <h2>{section.title}</h2>
            {section.content.map((block, bi) => {
              if (block.type === "section") {
                return <SectionBlockView key={bi} block={block} />;
              }
              if (block.type === "list") {
                return <ListBlockView key={bi} block={block} />;
              }
              if (block.type === "table") {
                return <TableBlockView key={bi} block={block} />;
              }
              if (block.type === "alert") {
                return <AlertBlockView key={bi} block={block} />;
              }
              return null;
            })}
          </section>
          {si < data.sections.length - 1 && <div className="section-divider" />}
        </div>
      ))}
    </main>
  );
}

function PolicyFooterBar({ data }: { data: PolicyData }) {
  return (
    <div className="policy-footer-bar">
      <div className="policy-footer-inner">
        <div className="policy-footer-text">
          {data.footerText.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </div>
        <div className="policy-footer-actions">
          {data.footerActions.map((action, i) => (
            <a
              key={i}
              href={action.href}
              className={`tfooter-btn ${action.variant}`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PolicyTemplate({ data }: { data: PolicyData }) {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="policy-hero noise-overlay">
        <div className="glow-orb glow-orb-indigo w-[600px] h-[400px] -top-[80px] -right-[80px]" />
        <div className="glow-orb glow-orb-mint w-[400px] h-[300px] bottom-0 left-[20%]" />
        <div className="policy-hero-inner">
          <div className="page-breadcrumb anim-fade-in-up">
            <a href="/">الرئيسية</a>
            <span className="page-breadcrumb-sep">›</span>
            <span>{data.breadcrumb}</span>
          </div>
          <div className="page-badge anim-fade-in-up anim-delay-1">
            <Badge dot>{data.badge}</Badge>
          </div>
          <h1 className="text-[clamp(28px,4vw,48px)] font-bold text-white leading-[1.2] mb-4 anim-fade-in-up anim-delay-1" style={{ letterSpacing: "-0.3px" }}>
            {data.title}
          </h1>
          <p className="text-[17px] text-white/55 leading-[1.75] max-w-[600px] mb-7 anim-fade-in-up anim-delay-2">
            {data.description}
          </p>
          {data.version && data.effectiveDate && data.entity && (
            <div className="page-meta anim-fade-in-up anim-delay-3">
              <div className="meta-item">
                📄 <strong>الإصدار:</strong> {data.version}
              </div>
              <div className="meta-item">
                📅 <strong>تاريخ السريان:</strong> {data.effectiveDate}
              </div>
              <div className="meta-item">
                🏢 <strong>الجهة:</strong> {data.entity}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="policy-content-root">
        <TocMobileAccordion data={data} />
        <div ref={sentinelRef} className="toc-sentinel" />

        <div className="policy-content-wrap">
          <div className="hidden lg:block">
            <TocSidebar data={data} isSticky={isSticky} />
          </div>
          <ContentBody data={data} />
        </div>
      </div>

      <PolicyFooterBar data={data} />
    </>
  );
}
