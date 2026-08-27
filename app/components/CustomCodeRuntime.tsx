"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { HtmlBlockRecord } from "@/app/lib/scripts";

const executed = new Map<string, string>();
const loadedExternalScripts = new Set<string>();

function hash(value: string): string {
  let result = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16);
}

function removeOwnedNodes(owner: string) {
  document.querySelectorAll(`[data-aysar-custom-owner="${CSS.escape(owner)}"]`).forEach((node) => node.remove());
}

function hasExecuted(block: HtmlBlockRecord, contentHash: string): boolean {
  if (block.runMode === "on-each-mount") return false;
  if (block.runMode === "once-per-session") {
    try { return sessionStorage.getItem(`aysar-custom-code:${block.id}`) === contentHash; } catch { return false; }
  }
  return executed.get(block.id) === contentHash;
}

function markExecuted(block: HtmlBlockRecord, contentHash: string) {
  executed.set(block.id, contentHash);
  if (block.runMode === "once-per-session") {
    try { sessionStorage.setItem(`aysar-custom-code:${block.id}`, contentHash); } catch { /* storage may be unavailable */ }
  }
}

function runScripts(scripts: HTMLScriptElement[], owner: string, host: HTMLElement) {
  scripts.forEach((source) => {
    const src = source.getAttribute("src");
    if (src && loadedExternalScripts.has(src)) return;

    const script = document.createElement("script");
    Array.from(source.attributes).forEach((attribute) => script.setAttribute(attribute.name, attribute.value));
    script.dataset.aysarCustomOwner = owner;
    script.textContent = source.textContent;
    host.appendChild(script);

    if (src) loadedExternalScripts.add(src);
  });
}

function renderBlock(block: HtmlBlockRecord, host: HTMLElement) {
  const content = block.content.trim();
  const contentHash = hash(content);
  const owner = `block-${block.id}`;

  if (host.dataset.aysarCustomHash === contentHash) return;

  removeOwnedNodes(owner);
  host.replaceChildren();
  host.dataset.aysarCustomHash = contentHash;

  const template = document.createElement("template");
  template.innerHTML = content;
  const scripts = Array.from(template.content.querySelectorAll("script"));
  scripts.forEach((script) => script.remove());

  Array.from(template.content.querySelectorAll("style")).forEach((style) => {
    style.dataset.aysarCustomOwner = owner;
  });

  host.appendChild(template.content);

  if (!hasExecuted(block, contentHash)) {
    runScripts(scripts, owner, host);
    markExecuted(block, contentHash);
  }
}

export function CustomCodeRuntime({ blocks }: { blocks: HtmlBlockRecord[] }) {
  const pathname = usePathname();
  const bodyRootRef = useRef<HTMLDivElement>(null);
  const mountedIds = useRef(new Set<string>());

  useEffect(() => {
    const bodyRoot = bodyRootRef.current;
    if (!bodyRoot) return;

    const active = blocks
      .filter((block) => block.enabled !== false && block.content.trim())
      .filter((block) => block.scope !== "page" || !block.pagePath || block.pagePath === pathname)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const activeIds = new Set(active.map((block) => block.id));

    // Remove DOM owned by blocks that were deleted or disabled. Arbitrary
    // listeners/timers cannot be inferred, so custom code may optionally
    // expose window.aysarCustomCode[blockId].cleanup().
    mountedIds.current.forEach((id) => {
      if (!activeIds.has(id)) {
        const owner = `block-${id}`;
        const registry = (window as Window & { aysarCustomCode?: Record<string, { cleanup?: () => void }> }).aysarCustomCode;
        try { registry?.[id]?.cleanup?.(); } catch (error) { console.warn("Custom code cleanup failed", id, error); }
        removeOwnedNodes(owner);
        document.querySelectorAll(`[data-aysar-custom-host="${CSS.escape(id)}"]`).forEach((node) => node.remove());
        mountedIds.current.delete(id);
      }
    });

    active.forEach((block) => {
      const hosts = Array.from(document.querySelectorAll<HTMLElement>(`[data-aysar-custom-host="${CSS.escape(block.id)}"]`));
      hosts.slice(1).forEach((node) => node.remove());
      const currentHost = hosts[0];
      if (currentHost && ((block.location === "head" && currentHost.parentElement !== document.head) ||
        (block.location === "body" && currentHost.parentElement !== bodyRoot))) {
        currentHost.remove();
      }

      const host = block.location === "head"
        ? (() => {
            let existing = document.head.querySelector<HTMLElement>(`[data-aysar-custom-host="${CSS.escape(block.id)}"]`);
            if (!existing) {
              existing = document.createElement("aysar-custom-host");
              existing.dataset.aysarCustomHost = block.id;
              document.head.appendChild(existing);
            }
            return existing;
          })()
        : (() => {
            let existing = bodyRoot.querySelector<HTMLElement>(`[data-aysar-custom-host="${CSS.escape(block.id)}"]`);
            if (!existing) {
              existing = document.createElement("div");
              existing.dataset.aysarCustomHost = block.id;
              bodyRoot.appendChild(existing);
            }
            return existing;
          })();

      try {
        renderBlock(block, host);
      } catch (error) {
        console.error(`[Aysar custom code] block ${block.id} failed`, error);
        try {
          const errors = JSON.parse(sessionStorage.getItem("aysar-custom-code-errors") || "[]") as unknown[];
          errors.push({ blockId: block.id, message: error instanceof Error ? error.message : String(error), at: new Date().toISOString() });
          sessionStorage.setItem("aysar-custom-code-errors", JSON.stringify(errors.slice(-20)));
        } catch { /* diagnostics must never break the site */ }
      }
      mountedIds.current.add(block.id);
    });
  }, [blocks, pathname]);

  return <div ref={bodyRootRef} data-aysar-custom-runtime="body" />;
}
