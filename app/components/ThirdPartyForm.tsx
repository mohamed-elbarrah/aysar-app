"use client";

import { useEffect, useRef, useState } from "react";

function createScriptElement(oldScript: HTMLScriptElement): HTMLScriptElement {
  const el = document.createElement("script");
  for (const attr of oldScript.attributes) {
    el.setAttribute(attr.name, attr.value);
  }
  el.textContent = oldScript.textContent;
  return el;
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-10 bg-[#e8edf5] rounded-lg w-full" />
      <div className="h-10 bg-[#e8edf5] rounded-lg w-full" />
      <div className="h-10 bg-[#e8edf5] rounded-lg w-3/4" />
      <div className="h-24 bg-[#e8edf5] rounded-lg w-full" />
      <div className="h-12 bg-gradient-to-r from-[#0c2954] to-[#2d2e83] rounded-lg w-full opacity-30" />
    </div>
  );
}

export function ThirdPartyForm({ scriptHtml }: { scriptHtml: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const prevScriptRef = useRef(scriptHtml);

  useEffect(() => {
    if (!containerRef.current) return;

    prevScriptRef.current = scriptHtml;

    if (!scriptHtml) return;

    const container = containerRef.current;
    container.innerHTML = "";
    requestAnimationFrame(() => {
      if (prevScriptRef.current !== scriptHtml) return;
      setLoaded(false);
    });

    const temp = document.createElement("div");
    temp.innerHTML = scriptHtml;
    while (temp.firstChild) {
      container.appendChild(temp.firstChild);
    }

    const scripts = Array.from(container.querySelectorAll("script"));
    for (const oldScript of scripts) {
      try {
        const newScript = createScriptElement(oldScript);
        oldScript.parentNode?.replaceChild(newScript, oldScript);
      } catch {
        // skip failing scripts
      }
    }

    const observer = new MutationObserver(() => {
      if (container.children.length > 0 || (container.textContent?.trim() ?? "").length > 0) {
        observer.disconnect();
        requestAnimationFrame(() => {
          if (prevScriptRef.current !== scriptHtml) return;
          setLoaded(true);
        });
      }
    });

    observer.observe(container, { childList: true, subtree: true, characterData: true });

    const fallbackTimeout = setTimeout(() => {
      observer.disconnect();
      requestAnimationFrame(() => {
        if (prevScriptRef.current !== scriptHtml) return;
        setLoaded(true);
      });
    }, 10000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimeout);
      container.innerHTML = "";
    };
  }, [scriptHtml]);

  return (
    <div className="relative">
      {!loaded && <LoadingSkeleton />}
      <div
        ref={containerRef}
        className="transition-opacity duration-300"
        style={{
          opacity: loaded ? 1 : 0,
          height: loaded ? "auto" : 0,
          overflow: loaded ? "visible" : "hidden",
        }}
      />
    </div>
  );
}
