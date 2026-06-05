"use client";

import { useEffect, useRef } from "react";
import { type HtmlBlockRecord } from "@/app/lib/scripts";

interface HtmlBlockRendererProps {
  blocks: HtmlBlockRecord[];
  location: "head" | "body";
}

function HtmlBlockItem({ block }: { block: HtmlBlockRecord }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!block.content?.trim()) return;

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = block.content;

    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [block.content]);

  if (!block.content?.trim()) {
    return null;
  }

  return <div ref={containerRef} />;
}

export function HtmlBlockRenderer({ blocks, location }: HtmlBlockRendererProps) {
  const filtered = blocks.filter((b) => b.location === location);

  return (
    <>
      {filtered.map((block) => (
        <HtmlBlockItem key={block.id} block={block} />
      ))}
    </>
  );
}