"use client";

import { useEffect, useRef, useState, useCallback } from "react";

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-10 bg-[#e8ebf3] rounded-lg w-full" />
      <div className="h-10 bg-[#e8ebf3] rounded-lg w-full" />
      <div className="h-10 bg-[#e8ebf3] rounded-lg w-3/4" />
      <div className="h-24 bg-[#e8ebf3] rounded-lg w-full" />
      <div className="h-12 bg-gradient-to-r from-[#08335D] to-[#28C928] rounded-lg w-full opacity-30" />
    </div>
  );
}

export function ThirdPartyForm({ scriptHtml }: { scriptHtml: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const mountedRef = useRef(true);

  const hasVisibleContent = useCallback((container: HTMLElement): boolean => {
    for (const child of container.children) {
      const tag = child.tagName.toLowerCase();
      if (tag === "script") continue;
      if ((child as HTMLElement).offsetHeight > 0) return true;
    }
    return false;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (!scriptHtml?.trim()) return;

    const container = containerRef.current;
    if (!container) return;

    setLoaded(false);
    container.innerHTML = scriptHtml;

    if (hasVisibleContent(container)) {
      setLoaded(true);
      return;
    }

    const observer = new MutationObserver(() => {
      if (!mountedRef.current) return;
      if (hasVisibleContent(container)) {
        setLoaded(true);
        observer.disconnect();
        clearTimeout(fallback);
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    const fallback = setTimeout(() => {
      if (!mountedRef.current) return;
      setLoaded(true);
      observer.disconnect();
    }, 3000);

    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    return () => {
      mountedRef.current = false;
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [scriptHtml, hasVisibleContent]);

  if (!scriptHtml?.trim()) {
    return null;
  }

  return (
    <div className="relative">
      {!loaded && <LoadingSkeleton />}
      <div
        ref={containerRef}
        className="transition-opacity duration-300"
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}