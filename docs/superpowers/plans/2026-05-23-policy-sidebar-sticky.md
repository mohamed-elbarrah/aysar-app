# Policy Sidebar Sticky Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix desktop TOC sidebar so it stays sticky while scrolling through policy content

**Architecture:** Replace fragile sentinel-toggled `position: sticky` with a pure CSS approach: `display: flex` layout for sidebar+content row, always-active `position: sticky` on the sidebar wrapper. Remove IntersectionObserver + `isSticky` state.

**Tech Stack:** Next.js, React 19, Tailwind CSS v4, TypeScript

---

### Task 1: Update CSS — Flex layout + always-sticky sidebar

**Files:**
- Modify: `app/globals.css:1137-1145` (`.policy-content-wrap`)
- Modify: `app/globals.css:1147-1158` (`.toc` / `.toc.toc-sticky`)
- Modify: `app/globals.css:1289-1291` (`.policy-body`)
- Modify: `app/globals.css:1653-1656` (mobile override)

- [ ] **Step 1: Change `.policy-content-wrap` from grid to flex**

Replace lines 1137-1145:
```css
  .policy-content-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 40px 80px;
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 48px;
    align-items: start;
  }
```
With:
```css
  .policy-content-wrap {
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 40px 80px;
    display: flex;
    gap: 48px;
    align-items: flex-start;
  }
```

- [ ] **Step 2: Replace `.toc` / `.toc.toc-sticky` with always-sticky `.toc`**

Replace lines 1147-1158:
```css
  /* TOC sidebar */
  .toc {
    transition: box-shadow 0.25s ease;
  }

  .toc.toc-sticky {
    position: sticky;
    top: 82px;
    box-shadow: 0 4px 20px rgba(12, 41, 84, 0.06);
    border-radius: 14px;
    padding: 0 0 4px;
  }
```
With:
```css
  /* TOC sidebar */
  .toc {
    box-shadow: 0 4px 20px rgba(12, 41, 84, 0.06);
    border-radius: 14px;
    padding: 0 0 4px;
  }
```

- [ ] **Step 3: Add `.policy-sidebar` class for sticky wrapper**

After line 1145 (end of `.policy-content-wrap`), add:
```css
  .policy-sidebar {
    position: sticky;
    top: 82px;
    width: 260px;
    flex-shrink: 0;
    align-self: flex-start;
  }
```

- [ ] **Step 4: Update `.policy-body` to take remaining space**

Replace line 1289-1291:
```css
  .policy-body {
    min-width: 0;
  }
```
With:
```css
  .policy-body {
    flex: 1;
    min-width: 0;
  }
```

- [ ] **Step 5: Update mobile override to use `flex-direction: column`**

Replace lines 1653-1656:
```css
    .policy-content-wrap {
      grid-template-columns: 1fr;
      padding: 40px 24px 60px;
    }
```
With:
```css
    .policy-content-wrap {
      flex-direction: column;
      padding: 40px 24px 60px;
    }
```

- [ ] **Step 6: Remove `.toc-sentinel` styles**

Remove lines 1160-1164:
```css
  .toc-sentinel {
    height: 1px;
    pointer-events: none;
    opacity: 0;
  }
```

---

### Task 2: Update PolicyTemplate.tsx — Remove sentinel + simplify TocSidebar

**Files:**
- Modify: `app/components/PolicyTemplate.tsx:3` (imports)
- Modify: `app/components/PolicyTemplate.tsx:15-19` (TocSidebar props)
- Modify: `app/components/PolicyTemplate.tsx:47-56` (progress bar + sticky conditional)
- Modify: `app/components/PolicyTemplate.tsx:124-134` (isSticky/sentinel state + effect)
- Modify: `app/components/PolicyTemplate.tsx:174-184` (JSX layout)

- [ ] **Step 1: Remove unused imports**

Replace line 3:
```tsx
import { useState, useEffect, useRef, useMemo } from "react";
```
With:
```tsx
import { useEffect, useRef, useMemo } from "react";
```

- [ ] **Step 2: Simplify TocSidebar props — remove `isSticky`**

Replace lines 15-19:
```tsx
function TocSidebar({ tocItems, isSticky, sidebarCard }: {
  tocItems: TOCItem[];
  isSticky: boolean;
  sidebarCard?: PolicyData["sidebarCard"];
}) {
```
With:
```tsx
function TocSidebar({ tocItems, sidebarCard }: {
  tocItems: TOCItem[];
  sidebarCard?: PolicyData["sidebarCard"];
}) {
```

- [ ] **Step 3: Remove progress conditional, always render it**

Replace lines 51-57 (the JSX return start):
```tsx
  return (
    <aside className={cn("toc", isSticky && "toc-sticky")}>
      {isSticky && (
        <div className="toc-progress-bar">
          <div className="toc-progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      )}
```
With:
```tsx
  return (
    <aside className="toc">
      <div className="toc-progress-bar">
        <div className="toc-progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>
```

- [ ] **Step 4: Remove `isSticky` state, `sentinelRef`, and IntersectionObserver effect**

Replace lines 124-134:
```tsx
export default function PolicyTemplate({ data }: { data: PolicyData }) {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => { setIsSticky(!entry.isIntersecting); }, { threshold: 0 });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const tocItems: TOCItem[] = useMemo(() =>
```
With:
```tsx
export default function PolicyTemplate({ data }: { data: PolicyData }) {
  const tocItems: TOCItem[] = useMemo(() =>
```

- [ ] **Step 5: Remove sentinel div, add `.policy-sidebar` wrapper, remove `isSticky` prop**

Replace lines 174-183:
```tsx
      <div className="policy-content-root">
        <TocMobileAccordion data={data} />
        <div ref={sentinelRef} className="toc-sentinel" />

        <div className="policy-content-wrap">
          <div className="hidden lg:block">
            <TocSidebar tocItems={tocItems} isSticky={isSticky} sidebarCard={data.sidebarCard} />
          </div>
          <ContentBody parts={data.parts} />
        </div>
      </div>
```
With:
```tsx
      <div className="policy-content-root">
        <TocMobileAccordion data={data} />

        <div className="policy-content-wrap">
          <div className="hidden lg:block policy-sidebar">
            <TocSidebar tocItems={tocItems} sidebarCard={data.sidebarCard} />
          </div>
          <ContentBody parts={data.parts} />
        </div>
      </div>
```

---

### Task 3: Verify build

- [ ] **Step 1: Run TypeScript check**

Run: `pnpm build` (or `npx tsc --noEmit`)

Expected: No TypeScript errors

- [ ] **Step 2: Run linter**

Run: `pnpm lint`

Expected: No lint errors

- [ ] **Step 3: Run dev server and visually verify**

Run: `pnpm dev`

Navigate to each policy page (privacy-policy, terms-of-use, return-policy) on a desktop-sized viewport. Verify:
- Sidebar is visible on the left
- Sidebar sticks at top:82px when scrolling down
- Progress bar fills as you scroll
- TOC item highlighting works (clicking updates active state)
- Mobile viewport hides the sidebar and shows the mobile accordion instead
