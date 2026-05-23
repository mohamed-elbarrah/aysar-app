# Policy Sidebar Sticky Layout Design

## Problem

On policy pages (privacy-policy, terms-of-use, return-policy), the desktop TOC sidebar does not stay sticky while scrolling through the content body. The current implementation uses:

1. A CSS Grid layout (`grid-template-columns: 260px 1fr`) with `align-items: start` for the sidebar + content row
2. A sentinel-based IntersectionObserver that toggles `position: sticky` on the sidebar via an `isSticky` state
3. Conditional `.toc-sticky` class applied only after the sentinel is scrolled past

This approach is fragile because:
- `align-items: start` limits the grid item's box to content height, leaving insufficient room for `position: sticky` to operate
- The IntersectionObserver may not fire reliably on the 1px sentinel element
- The sidebar has zero sticky behavior until `isSticky` becomes true, so at page load it scrolls away immediately

## Solution

Replace the grid + sentinel toggle approach with a pure CSS flex layout where the sidebar is always sticky.

### Layout Architecture

```
.policy-content-wrap (display: flex; align-items: flex-start)
├── .policy-sidebar (position: sticky; top: 82px; width: 260px; flex-shrink: 0)
│   └── TocSidebar (always rendered with panel styling)
└── .policy-body (flex: 1; min-width: 0)
    └── ContentBody
```

### Changes

#### 1. `app/components/PolicyTemplate.tsx`

**Removals:**
- `isSticky` state variable (useState)
- `sentinelRef` ref (useRef)
- IntersectionObserver useEffect (lines 128-134)
- Sentinel `<div>` from JSX (line 176)
- `isSticky` prop from `<TocSidebar>` component
- `isSticky` prop from `<TocSidebar>` usage

**TocSidebar component simplification:**
- Remove `isSticky` from interface
- Change `className={cn("toc", isSticky && "toc-sticky")}` to `className="toc"` (always styled)
- Remove `{isSticky && (...)}` wrapper around progress bar — always render it
- Remove `docHeight`/`scrollTop`/`progress` redundant calculations (consolidate if progress bar kept)

**Wrapper structure:**
- Replace `<div className="hidden lg:block">` with `<div className="hidden lg:block policy-sidebar">`

#### 2. `app/globals.css`

**`.policy-content-wrap`** — grid → flex:
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

**New `.policy-sidebar`:**
```css
.policy-sidebar {
    position: sticky;
    top: 82px;          /* 62px navbar + 20px breathing room */
    width: 260px;
    flex-shrink: 0;
    align-self: flex-start;
}
```

**`.policy-body`:**
```css
.policy-body {
    flex: 1;
    min-width: 0;
}
```

**`.`toc`:** — always styled as panel:
```css
.toc {
    box-shadow: 0 4px 20px rgba(12, 41, 84, 0.06);
    border-radius: 14px;
    padding: 0 0 4px;
}
```

**Remove `.toc.toc-sticky`** — no longer needed.

**`.toc-progress-bar / .toc-progress-fill`** — keep as-is, always rendered.

**`.toc-sentinel` styles** — remove or leave unused (element removed from DOM).

**Mobile override** (max-width: 1023px):
```css
.policy-content-wrap {
    flex-direction: column;
    padding: 40px 24px 60px;
}
```

### Behavioral Flow

1. **Page load**: Sidebar is in normal flow, positioned naturally below the hero within the flex container
2. **User scrolls down**: When the sidebar's top reaches 82px from viewport top, `position: sticky` activates — it locks in place
3. **User scrolls through content**: Sidebar stays locked at top:82px while content scrolls beneath it
4. **Bottom of page**: When `.policy-content-wrap` is about to scroll out of view, the sidebar scrolls naturally with it (standard sticky parent-containment behavior)

### Non-Goals

- Mobile behavior: unchanged (TocMobileAccordion already handles mobile, sidebar is `hidden` on small screens)
- Page hero: unchanged
- PolicyFooterBar: unchanged
- TOC intersection tracking (active section highlighting): unchanged — IntersectionObserver on `.policy-section` elements stays

### Risk Assessment

| Risk | Mitigation |
|------|-----------|
| `.policy-sidebar` wrapper might interfere with sticky in flex | Direct child of flex container — known to work reliably |
| Shadow/border-radius shows at page load (not just after scroll) | Acceptable — sidebar looks like a panel from the start, consistent UX |
| Progress bar always visible (not gated on isSticky) | Acceptable — useful context regardless of scroll position |
| Mobile flex-direction change | Verify `hidden lg:block` hides sidebar on mobile, only ContentBody renders |
