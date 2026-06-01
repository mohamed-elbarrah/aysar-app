# Manual Yearly Pricing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove all automatic yearly price calculations and allow the admin to set `priceYearly` manually per plan, while keeping the global discount badge as a display-only value.

**Architecture:** We strip out `computeYearlyPrice` from three server/data-layer files, then update the admin editor UI to expose `priceYearly` as a direct input field. No database schema changes.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Supabase (JSONB plans column).

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `lib/plans-data.ts` | Shared types, hardcoded defaults, utility functions | Remove `computeYearlyPrice` |
| `app/lib/plans-page-data.ts` | Server-side data fetcher for public plans page | Remove auto-calculation in `getPlansPageData` |
| `app/api/plans-page/route.ts` | Admin API: read/update plans page JSON | Remove auto-calculation in PATCH handler |
| `app/(dashboard)/dashboard/plans-page/page.tsx` | Admin CMS editor UI | Add `priceYearly` input, remove auto-calc logic, relabel discount |

---

### Task 1: Remove `computeYearlyPrice` from shared utilities

**Files:**
- Modify: `lib/plans-data.ts:3-7`

- [ ] **Step 1: Remove the `computeYearlyPrice` function**

Remove the function entirely; `YEARLY_DISCOUNT_DEFAULT` remains as a constant:

```typescript
// Keep this
export const YEARLY_DISCOUNT_DEFAULT = 15;

// DELETE these lines (3-7)
export function computeYearlyPrice(monthly: number, discountPercent: number): number {
  return Math.round(monthly * 12 * (1 - discountPercent / 100));
}
```

- [ ] **Step 2: Verify the file still exports cleanly (`YEARLY_DISCOUNT_DEFAULT` remains)**

Run:
```bash
grep -n "YEARLY_DISCOUNT_DEFAULT\|computeYearlyPrice" lib/plans-data.ts
```
**Expected:** Only `YEARLY_DISCOUNT_DEFAULT` is found, not `computeYearlyPrice`.

- [ ] **Step 3: Commit**

```bash
git add lib/plans-data.ts
git commit -m "refactor(plans): remove computeYearlyPrice — yearly price will be manual"
```

---

### Task 2: Remove auto-calculation from server-side data fetcher

**Files:**
- Modify: `app/lib/plans-page-data.ts:1,41-45,63-68`

- [ ] **Step 1: Remove `computeYearlyPrice` import and usage in fallback path**

Current import line 1:
```typescript
import { PLANS, COMPARE_ROWS, FAQ_ITEMS, YEARLY_DISCOUNT_DEFAULT, computeYearlyPrice } from "@/lib/plans-data";
```

Change to:
```typescript
import { PLANS, COMPARE_ROWS, FAQ_ITEMS, YEARLY_DISCOUNT_DEFAULT } from "@/lib/plans-data";
```

- [ ] **Step 2: Remove calculation in the `!page` fallback block (lines 41-45)**

Current:
```typescript
  if (!page) {
    const discount = YEARLY_DISCOUNT_DEFAULT;
    const plans = PLANS.map((p) =>
      !p.isFree && p.priceMonthly != null
        ? { ...p, priceYearly: computeYearlyPrice(p.priceMonthly, discount) }
        : p,
    );
    return {
      id: "PLANS",
      hero: { ...PLANS_HERO_DEFAULTS },
      plans,
      compareRows: { ...COMPARE_ROWS, rows: [...COMPARE_ROWS.rows], columns: [...COMPARE_ROWS.columns] },
      faqItems: [...FAQ_ITEMS],
      yearlyDiscountPercent: discount,
      updatedAt: new Date().toISOString(),
    };
  }
```

Replace with:
```typescript
  if (!page) {
    return {
      id: "PLANS",
      hero: { ...PLANS_HERO_DEFAULTS },
      plans: [...PLANS],
      compareRows: { ...COMPARE_ROWS, rows: [...COMPARE_ROWS.rows], columns: [...COMPARE_ROWS.columns] },
      faqItems: [...FAQ_ITEMS],
      yearlyDiscountPercent: YEARLY_DISCOUNT_DEFAULT,
      updatedAt: new Date().toISOString(),
    };
  }
```

- [ ] **Step 3: Remove calculation in the DB-loaded path (lines 63-68)**

Current:
```typescript
  const rawPlans = page.plans as unknown as Plan[];
  const plans = rawPlans.map((p) =>
    !p.isFree && p.priceMonthly != null
      ? { ...p, priceYearly: computeYearlyPrice(p.priceMonthly, discount) }
      : p,
  );
```

Replace with:
```typescript
  const plans = page.plans as unknown as Plan[];
```

And update the return object on line 73-74 to use `plans` directly:
```typescript
  return {
    id: page.id,
    hero: page.hero as PlansPageResponse["hero"],
    plans,
    compareRows: isOldCompareFormat(rawCompareRows)
      ? migrateCompareRows(rawCompareRows)
      : (rawCompareRows as CompareTableData),
    faqItems: page.faq_items as unknown as PlansPageResponse["faqItems"],
    yearlyDiscountPercent: discount,
    updatedAt: page.updated_at,
  };
```

- [ ] **Step 4: Verify no `computeYearlyPrice` remains in the file**

Run:
```bash
grep -n "computeYearlyPrice" app/lib/plans-page-data.ts
```
**Expected:** No output.

- [ ] **Step 5: Commit**

```bash
git add app/lib/plans-page-data.ts
git commit -m "refactor(plans): stop auto-calculating priceYearly on server fetch"
```

---

### Task 3: Remove auto-calculation from API PATCH handler

**Files:**
- Modify: `app/api/plans-page/route.ts:5,99-105`

- [ ] **Step 1: Remove `computeYearlyPrice` import**

Current import line 5:
```typescript
import { PLANS, COMPARE_ROWS, FAQ_ITEMS, isOldCompareFormat, migrateCompareRows, YEARLY_DISCOUNT_DEFAULT, computeYearlyPrice } from "@/lib/plans-data";
```

Change to:
```typescript
import { PLANS, COMPARE_ROWS, FAQ_ITEMS, isOldCompareFormat, migrateCompareRows, YEARLY_DISCOUNT_DEFAULT } from "@/lib/plans-data";
```

- [ ] **Step 2: Remove the re-calculation block inside PATCH (lines 99-105)**

Current:
```typescript
  if (Array.isArray(merged.plans)) {
    merged.plans = (merged.plans as Plan[]).map((plan) =>
      !plan.isFree && plan.priceMonthly != null
        ? { ...plan, priceYearly: computeYearlyPrice(plan.priceMonthly, discount) }
        : plan,
    );
  }
```

Delete entirely. The `merged` object is already the correct combination of existing data + admin changes.

- [ ] **Step 3: Remove unused `Plan` type import if no longer needed**

Check if `Plan` type is used elsewhere in the file. If only in the deleted block:

Current line 6:
```typescript
import type { Plan } from "@/lib/plans-data";
```

If `Plan` is unused after deletions, remove this line entirely.

- [ ] **Step 4: Verify no `computeYearlyPrice` remains in the file**

Run:
```bash
grep -n "computeYearlyPrice" app/api/plans-page/route.ts
grep -n "type Plan" app/api/plans-page/route.ts
```
**Expected:** No output.

- [ ] **Step 5: Commit**

```bash
git add app/api/plans-page/route.ts
git commit -m "refactor(plans): stop auto-calculating priceYearly in PATCH endpoint"
```

---

### Task 4: Expose manual `priceYearly` input in Admin Editor

**Files:**
- Modify: `app/(dashboard)/dashboard/plans-page/page.tsx`

- [ ] **Step 1: Remove `handleDiscountChange` auto-calculation function**

Delete the entire `handleDiscountChange` function (current lines 189-199):

```typescript
  const handleDiscountChange = (v: number) => {
    setDiscount(v);
    onDiscountChange(v);
    const newPlans = plans.map((plan) =>
      !plan.isFree && plan.priceMonthly != null
        ? { ...plan, priceYearly: Math.round(plan.priceMonthly * 12 * (1 - v / 100)) }
        : plan,
    );
    setPlans(newPlans);
    onPlansChange(newPlans);
  };
```

Replace with a simple handler:
```typescript
  const handleDiscountChange = (v: number) => {
    setDiscount(v);
    onDiscountChange(v);
  };
```

- [ ] **Step 2: Remove the computed yearly price display block**

Delete the following block (current lines 258-265):

```tsx
                {!plan.isFree && plan.priceMonthly != null && (
                  <div className="text-xs text-[#6b7a94] bg-[#f5f6f9] rounded-lg px-3 py-2">
                    السعر السنوي المحسوب:{" "}
                    <span className="font-semibold text-[#0c2954]">
                      {Math.round(plan.priceMonthly * 12 * (1 - discount / 100)).toLocaleString("en-US")} ر.س
                    </span>
                  </div>
                )}
```

- [ ] **Step 3: Remove auto-recalculation inside `updatePlan`**

Current lines 201-210 inside the `updatePlan` function:

```typescript
  const updatePlan = (idx: number, patch: Partial<Plan>) => {
    const newPlans = [...plans];
    const updated = { ...newPlans[idx], ...patch };
    if (patch.priceMonthly !== undefined && !updated.isFree && updated.priceMonthly != null) {
      updated.priceYearly = Math.round(updated.priceMonthly * 12 * (1 - discount / 100));
    }
    newPlans[idx] = updated;
    setPlans(newPlans);
    onPlansChange(newPlans);
  };
```

Replace with:
```typescript
  const updatePlan = (idx: number, patch: Partial<Plan>) => {
    const newPlans = [...plans];
    newPlans[idx] = { ...newPlans[idx], ...patch };
    setPlans(newPlans);
    onPlansChange(newPlans);
  };
```

- [ ] **Step 4: Add `priceYearly` input field next to `priceMonthly`**

Current lines 254-256:
```tsx
                <div className="form-grid-2">
                  <Input label="الاسم" value={plan.name} onChange={(e) => updatePlan(idx, { name: e.target.value })} />
                  <Input label="السعر الشهري" type="number" value={plan.priceMonthly ?? ""} onChange={(e) => updatePlan(idx, { priceMonthly: e.target.value ? Number(e.target.value) : null })} />
                </div>
```

Replace with:
```tsx
                <div className="form-grid-2">
                  <Input label="الاسم" value={plan.name} onChange={(e) => updatePlan(idx, { name: e.target.value })} />
                  <Input label="السعر الشهري" type="number" value={plan.priceMonthly ?? ""} onChange={(e) => updatePlan(idx, { priceMonthly: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <div className="form-grid-2">
                  <Input label="السعر السنوي" type="number" value={plan.priceYearly ?? ""} onChange={(e) => updatePlan(idx, { priceYearly: e.target.value ? Number(e.target.value) : null })} />
                </div>
```

> Note: putting `priceYearly` on its own in a second `form-grid-2` ensures it aligns under the monthly price on the right side in RTL layout.

- [ ] **Step 5: Relabel the global discount input**

Current line 237-243 (discount input label):
```tsx
          <Input 
            label="نسبة الخصم السنوي (%)" 
            type="number" 
            min={0} 
            max={100} 
            value={discount} 
            onChange={(e) => handleDiscountChange(e.target.value ? Number(e.target.value) : 0)} 
          />
```

Change the label only:
```tsx
          <Input 
            label="نسبة الخصم المعروضة في الشارة (%)" 
            type="number" 
            min={0} 
            max={100} 
            value={discount} 
            onChange={(e) => handleDiscountChange(e.target.value ? Number(e.target.value) : 0)} 
          />
```

- [ ] **Step 6: Verify no hidden calculation patterns remain**

Run:
```bash
grep -n "12 \*\|priceYearly=" app/(dashboard)/dashboard/plans-page/page.tsx
grep -n "Math.round" app/(dashboard)/dashboard/plans-page/page.tsx
```
**Expected:** No output matching plan-related calculations.

- [ ] **Step 7: Commit**

```bash
git add app/(dashboard)/dashboard/plans-page/page.tsx
git commit -m "feat(plans-editor): manual priceYearly input, remove auto-calc, relabel discount badge"
```

---

## Verification Checklist

After all tasks complete, verify:

- [ ] `computeYearlyPrice` is deleted and not imported anywhere.
- [ ] Run `pnpm lint` — no TypeScript errors.
- [ ] Run `pnpm dev` → open `/plans` page in browser.
- [ ] Open admin dashboard → Plans Page editor.
- [ ] Admin can type a new `priceYearly` value for any plan.
- [ ] Changing `priceMonthly` does NOT touch `priceYearly`.
- [ ] Changing global discount label does NOT touch any plan prices.
- [ ] Save in admin → refresh public `/plans` → new prices appear exactly as typed.
- [ ] Badge text updates immediately when global discount value is changed.

---

## Self-Review

1. **Spec coverage check:**
   - ✅ Remove `computeYearlyPrice` — Task 1
   - ✅ Stop server-side auto-calculation — Task 2
   - ✅ Stop API PATCH auto-calculation — Task 3
   - ✅ Add manual `priceYearly` input in admin — Task 4 Step 4
   - ✅ Remove computed read-only display — Task 4 Step 2
   - ✅ Relabel discount as display-only — Task 4 Step 5
   - ⬜ Verify zero remaining math references — covered in Task 4 Step 6

2. **Placeholder scan:** No TBDs, no vague steps. Every change shows exact code.

3. **Type consistency:** `Partial<Plan>` already supports `priceYearly`. No new types needed.

4. **No database changes:** `priceYearly` already exists in the JSONB Plan type.
