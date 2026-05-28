import Script from "next/script";
import { type ScriptRecord, type ScriptStrategy } from "@/app/lib/scripts";

interface ScriptRendererProps {
  scripts: ScriptRecord[];
  location: "head" | "body";
}

const STRATEGY_ORDER: Record<ScriptStrategy, number> = {
  beforeInteractive: 0,
  afterInteractive: 1,
  lazyOnload: 2,
};

export function ScriptRenderer({ scripts, location }: ScriptRendererProps) {
  const filtered = scripts
    .filter((s) => s.location === location)
    .sort((a, b) => STRATEGY_ORDER[a.strategy] - STRATEGY_ORDER[b.strategy]);

  return (
    <>
      {filtered.map((record) => {
        switch (record.type) {
          case "external":
            return (
              <Script
                key={record.id}
                src={record.content}
                strategy={record.strategy}
                {...(record.attributes || {})}
              />
            );
          case "inline":
            return (
              <Script
                key={record.id}
                strategy={record.strategy}
                {...(record.attributes || {})}
              >
                {record.content}
              </Script>
            );
          case "link":
            return (
              <link
                key={record.id}
                rel="stylesheet"
                href={record.content}
                {...(record.attributes || {})}
              />
            );
          case "iframe":
            return (
              <iframe
                key={record.id}
                src={record.content}
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="border-0"
                {...(record.attributes || {})}
              />
            );
          case "meta":
            return null;
          default:
            return null;
        }
      })}
    </>
  );
}