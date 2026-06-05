export type BlockLocation = "head" | "body";

export interface HtmlBlockRecord {
  id: string;
  location: BlockLocation;
  content: string;
}

function generateId(): string {
  return `blk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createDefaultHtmlBlock(location: BlockLocation): HtmlBlockRecord {
  return {
    id: generateId(),
    location,
    content: "",
  };
}

const LEGACY_TYPES = new Set(["inline", "external", "link", "meta", "iframe"]);

export function parseJsonBlocks(raw: unknown): HtmlBlockRecord[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item): HtmlBlockRecord | null => {
      if (!item || typeof item !== "object") return null;

      if (typeof item.type === "string" && LEGACY_TYPES.has(item.type)) {
        return convertLegacyRecord(item as Record<string, unknown>);
      }

      if (
        typeof item.id === "string" &&
        (item.location === "head" || item.location === "body") &&
        typeof item.content === "string"
      ) {
        return { id: item.id, location: item.location, content: item.content };
      }

      return convertLegacyRecord(item as Record<string, unknown>);
    })
    .filter((r): r is HtmlBlockRecord => r !== null);
}

function convertLegacyRecord(item: Record<string, unknown>): HtmlBlockRecord | null {
  const type = item.type as string;
  const loc = (item.location as string) === "head" ? "head" : "body";
  const content = typeof item.content === "string" ? item.content : "";
  const id = typeof item.id === "string" ? item.id : `migrated_${Date.now().toString(36)}`;
  const attrs = (item.attributes && typeof item.attributes === "object")
    ? item.attributes as Record<string, string>
    : {};

  switch (type) {
    case "external": {
      if (!content) return null;
      let tag = `<script src="${content}"`;
      for (const [k, v] of Object.entries(attrs)) {
        if (k !== "src") tag += ` ${k}="${v}"`;
      }
      tag += `></script>`;
      return { id, location: loc, content: tag };
    }
    case "inline": {
      if (!content.trim()) return null;
      let open = "<script";
      for (const [k, v] of Object.entries(attrs)) {
        open += ` ${k}="${v}"`;
      }
      open += ">";
      return { id, location: loc, content: `${open}\n${content}\n</script>` };
    }
    case "link": {
      if (!content) return null;
      let tag = `<link rel="stylesheet" href="${content}"`;
      for (const [k, v] of Object.entries(attrs)) {
        if (k !== "href" && k !== "rel") tag += ` ${k}="${v}"`;
      }
      tag += " />";
      return { id, location: loc, content: tag };
    }
    case "meta": {
      if (!content) return null;
      const eqIndex = content.indexOf("=");
      if (eqIndex === -1) return null;
      const name = content.slice(0, eqIndex).trim();
      const value = content.slice(eqIndex + 1).trim();
      if (!name || !value) return null;
      return { id, location: loc, content: `<meta name="${name}" content="${value}" />` };
    }
    case "iframe": {
      if (!content) return null;
      let tag = `<iframe src="${content}"`;
      for (const [k, v] of Object.entries(attrs)) {
        if (k !== "src") tag += ` ${k}="${v}"`;
      }
      tag += `></iframe>`;
      return { id, location: loc, content: tag };
    }
    default:
      return null;
  }
}