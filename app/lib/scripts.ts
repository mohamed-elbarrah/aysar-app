import DOMPurify from "isomorphic-dompurify";

export type ScriptType = "inline" | "external" | "link" | "meta" | "iframe";
export type ScriptLocation = "head" | "body";
export type ScriptStrategy = "afterInteractive" | "lazyOnload" | "beforeInteractive";

export interface ScriptRecord {
  id: string;
  type: ScriptType;
  location: ScriptLocation;
  strategy: ScriptStrategy;
  content: string;
  attributes?: Record<string, string>;
}

export interface ExtractedMeta {
  description?: string;
  keywords?: string;
  openGraph?: Record<string, string>;
  other?: Record<string, string>;
}

export interface ValidationResult {
  valid: ScriptRecord[];
  warnings: string[];
}

const DANGEROUS_PATTERNS = [
  /\bdocument\s*\.\s*write\b/,
  /\bdocument\s*\.\s*open\b/,
  /\bdocument\s*\.\s*close\b/,
  /\bwindow\s*\.\s*location\s*=/,
  /<base[\s>]/i,
  /\bnavigator\s*\.\s*serviceWorker\b/,
  /\bContent-Security-Policy\b/i,
];

const DANGEROUS_SANDBOX_VALUES = [
  "allow-top-navigation",
  "allow-popups",
  "allow-pointer-lock",
  "allow-modals",
  "allow-top-navigation-by-user-activation",
];

const ALLOWED_TYPES: ScriptType[] = ["inline", "external", "link", "meta", "iframe"];

interface SanitizeConfig {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  ALLOW_DATA_ATTR?: boolean;
}

const SANITIZE_CONFIG: SanitizeConfig = {
  ALLOWED_TAGS: ["script", "link", "meta", "iframe"],
  ALLOWED_ATTR: [
    "src",
    "href",
    "rel",
    "type",
    "async",
    "defer",
    "crossorigin",
    "integrity",
    "nonce",
    "name",
    "content",
    "property",
    "charset",
    "sandbox",
    "loading",
    "referrerpolicy",
    "id",
  ],
  ALLOW_DATA_ATTR: false,
};

export function generateId(): string {
  return `scr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function parseRawScripts(
  headHtml: string,
  bodyHtml: string
): ScriptRecord[] {
  const records: ScriptRecord[] = [];

  function parseBlob(html: string, location: ScriptLocation): void {
    if (!html || !html.trim()) return;

    const cleaned = DOMPurify.sanitize(html, SANITIZE_CONFIG);

    const domParser =
      typeof DOMParser !== "undefined"
        ? new DOMParser()
        : null;

    if (!domParser) {
      console.warn("[parseRawScripts] No DOMParser available — skipping raw HTML parsing. Pre-convert scripts to structured format instead.");
      return;
    }

    const doc = domParser.parseFromString(
      `<div>${cleaned}</div>`,
      "text/html"
    );
    const container = doc.body.firstElementChild;
    if (!container) return;

    for (let i = 0; i < container.children.length; i++) {
      const el = container.children[i] as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const strategy: ScriptStrategy =
        location === "head" ? "afterInteractive" : "lazyOnload";

      if (tag === "script") {
        const src = el.getAttribute("src");
        if (src) {
          records.push({
            id: generateId(),
            type: "external",
            location,
            strategy,
            content: src,
            attributes: pickAttrs(el, ["src"]),
          });
        } else {
          records.push({
            id: generateId(),
            type: "inline",
            location,
            strategy,
            content: el.textContent || "",
          });
        }
      } else if (tag === "link" && el.getAttribute("rel") === "stylesheet") {
        const href = el.getAttribute("href");
        if (href) {
          records.push({
            id: generateId(),
            type: "link",
            location,
            strategy: "afterInteractive",
            content: href,
            attributes: pickAttrs(el, ["href", "rel"]),
          });
        }
      } else if (tag === "meta") {
        const name = el.getAttribute("name") || el.getAttribute("property") || "";
        const content = el.getAttribute("content") || "";
        if (name && content) {
          records.push({
            id: generateId(),
            type: "meta",
            location: "head",
            strategy: "afterInteractive",
            content: `${name}=${content}`,
          });
        }
      } else if (tag === "iframe") {
        const src = el.getAttribute("src");
        if (src) {
          records.push({
            id: generateId(),
            type: "iframe",
            location: "body",
            strategy: "lazyOnload",
            content: src,
            attributes: pickAttrs(el, ["src"]),
          });
        }
      }
    }
  }

  parseBlob(headHtml, "head");
  parseBlob(bodyHtml, "body");

  return records;
}

function pickAttrs(
  el: HTMLElement,
  exclude: string[]
): Record<string, string> | undefined {
  const attrs: Record<string, string> = {};
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    if (!exclude.includes(attr.name)) {
      attrs[attr.name] = attr.value;
    }
  }
  return Object.keys(attrs).length > 0 ? attrs : undefined;
}

export function sanitizeScripts(records: ScriptRecord[]): ScriptRecord[] {
  return records.filter((r) => ALLOWED_TYPES.includes(r.type)).map((r) => {
    if (r.type === "iframe" && r.attributes?.sandbox) {
      const values = r.attributes.sandbox.split(/\s+/);
      const safe = values.filter(
        (v) => !DANGEROUS_SANDBOX_VALUES.includes(v)
      );
      return {
        ...r,
        attributes: {
          ...r.attributes,
          sandbox: safe.join(" ") || "allow-scripts",
        },
      };
    }
    return r;
  });
}

export function validateScripts(records: ScriptRecord[]): ValidationResult {
  const valid: ScriptRecord[] = [];
  const warnings: string[] = [];

  for (const record of records) {
    const recordWarnings: string[] = [];

    if (record.type === "inline" || record.type === "external") {
      for (const pattern of DANGEROUS_PATTERNS) {
        if (pattern.test(record.content)) {
          recordWarnings.push(
            `Script "${record.id}" contains dangerous pattern: ${pattern.source}`
          );
        }
      }
    }

    if (record.type === "iframe" && record.attributes?.sandbox) {
      const values = record.attributes.sandbox.split(/\s+/);
      for (const dangerous of DANGEROUS_SANDBOX_VALUES) {
        if (values.includes(dangerous)) {
          recordWarnings.push(
            `Iframe "${record.id}" uses dangerous sandbox value: ${dangerous}`
          );
        }
      }
    }

    if (record.type === "link" && !record.content) {
      recordWarnings.push(`Link script "${record.id}" has no href`);
    }

    if (record.type === "external" && !record.content) {
      recordWarnings.push(`External script "${record.id}" has no src`);
    }

    if (record.type === "inline" && !record.content.trim()) {
      recordWarnings.push(`Inline script "${record.id}" is empty`);
    }

    if (recordWarnings.length > 0) {
      warnings.push(...recordWarnings);
    } else {
      valid.push(record);
    }
  }

  return { valid, warnings };
}

export function extractMetaFromScripts(scripts: ScriptRecord[]): ExtractedMeta {
  const meta: ExtractedMeta = {};
  const openGraph: Record<string, string> = {};
  const other: Record<string, string> = {};

  for (const record of scripts) {
    if (record.type !== "meta") continue;

    const eqIndex = record.content.indexOf("=");
    if (eqIndex === -1) continue;

    const name = record.content.slice(0, eqIndex).trim();
    const value = record.content.slice(eqIndex + 1).trim();

    if (!name || !value) continue;

    if (name === "description") {
      meta.description = value;
    } else if (name === "keywords") {
      meta.keywords = value;
    } else if (name.startsWith("og:")) {
      openGraph[name.slice(3)] = value;
    } else {
      other[name] = value;
    }
  }

  if (Object.keys(openGraph).length > 0) {
    meta.openGraph = openGraph;
  }
  if (Object.keys(other).length > 0) {
    meta.other = other;
  }

  return meta;
}

export function createDefaultScriptRecord(
  type: ScriptType,
  location: ScriptLocation
): ScriptRecord {
  return {
    id: generateId(),
    type,
    location,
    strategy: location === "head" ? "afterInteractive" : "lazyOnload",
    content: "",
  };
}

export function parseJsonScripts(raw: unknown): ScriptRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is ScriptRecord =>
    item &&
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.type === "string" &&
    typeof item.location === "string" &&
    typeof item.strategy === "string" &&
    typeof item.content === "string" &&
    ALLOWED_TYPES.includes(item.type as ScriptType)
  ).map((item) => ({
    id: item.id,
    type: item.type as ScriptType,
    location: item.location as ScriptLocation,
    strategy: item.strategy as ScriptStrategy,
    content: item.content,
    ...(item.attributes && typeof item.attributes === "object"
      ? { attributes: item.attributes as Record<string, string> }
      : {}),
  }));
}