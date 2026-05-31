"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import DOMPurify from "isomorphic-dompurify";

interface ParsedNode {
  id: string;
  type: "external" | "inline" | "html";
  src?: string;
  code?: string;
  html?: string;
}

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ["script", "link", "div", "span", "form", "input", "button", "textarea", "select", "option", "label", "style", "iframe"],
  ALLOWED_ATTR: [
    "src", "href", "rel", "type", "async", "defer", "id", "class",
    "name", "value", "placeholder", "action", "method", "target",
    "style", "width", "height", "frameborder", "loading",
    "sandbox", "referrerpolicy", "data-", "aria-",
    "onsubmit", "onclick", "onload",
  ],
  ALLOW_DATA_ATTR: true,
};

let nodeIdCounter = 0;
function nextNodeId(): string {
  return `tpf_${++nodeIdCounter}_${Date.now().toString(36)}`;
}

function parseFormScript(scriptHtml: string): ParsedNode[] {
  if (!scriptHtml || !scriptHtml.trim()) return [];

  const nodes: ParsedNode[] = [];
  const doc = DOMPurify.sanitize(scriptHtml, SANITIZE_CONFIG);

  const parser = typeof DOMParser !== "undefined" ? new DOMParser() : null;
  if (!parser) return [];

  const parsed = parser.parseFromString(`<div>${doc}</div>`, "text/html");
  const container = parsed.body.firstElementChild;
  if (!container) return [];

  for (let i = 0; i < container.children.length; i++) {
    const el = container.children[i] as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === "script") {
      const src = el.getAttribute("src");
      if (src) {
        nodes.push({
          id: nextNodeId(),
          type: "external",
          src,
        });
      } else {
        nodes.push({
          id: nextNodeId(),
          type: "inline",
          code: el.textContent || "",
        });
      }
    } else {
      nodes.push({
        id: nextNodeId(),
        type: "html",
        html: el.outerHTML,
      });
    }
  }

  return nodes;
}

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
  const [nodes, setNodes] = useState<ParsedNode[]>([]);
  const [loaded, setLoaded] = useState(false);
  const prevScriptRef = useRef(scriptHtml);

  useEffect(() => {
    if (prevScriptRef.current === scriptHtml && nodes.length > 0) return;
    prevScriptRef.current = scriptHtml;

    if (!scriptHtml) {
      setNodes([]);
      setLoaded(true);
      return;
    }

    const parsed = parseFormScript(scriptHtml);
    setNodes(parsed);
    setLoaded(parsed.filter((n) => n.type === "html").length > 0 || parsed.length === 0);
  }, [scriptHtml, nodes.length]);

  function handleScriptLoad() {
    setLoaded(true);
  }

  const htmlNodes = nodes.filter((n) => n.type === "html");

  return (
    <div className="relative">
      {!loaded && <LoadingSkeleton />}
      <div
        className="transition-opacity duration-300"
        style={{
          opacity: loaded ? 1 : 0,
          height: loaded ? "auto" : 0,
          overflow: loaded ? "visible" : "hidden",
        }}
      >
        {htmlNodes.map((node) => (
          <div key={node.id} dangerouslySetInnerHTML={{ __html: node.html || "" }} />
        ))}
      </div>
      {nodes.map((node) => {
        if (node.type === "external" && node.src) {
          return (
            <Script
              key={node.id}
              src={node.src}
              strategy="lazyOnload"
              onLoad={handleScriptLoad}
              onError={handleScriptLoad}
            />
          );
        }
        if (node.type === "inline" && node.code) {
          return (
            <Script
              key={node.id}
              strategy="lazyOnload"
              onLoad={handleScriptLoad}
              onError={handleScriptLoad}
            >
              {node.code}
            </Script>
          );
        }
        return null;
      })}
    </div>
  );
}