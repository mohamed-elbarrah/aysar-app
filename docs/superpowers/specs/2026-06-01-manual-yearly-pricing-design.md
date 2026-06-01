# Design Doc: Manual Yearly Pricing with Display-Only Badge Discount

**Date:** 2026-06-01  
**Approach:** Option 1 — Pure Manual Per-Plan + Global Badge (Recommended)

---

## Goal

Remove **all automatic calculations** of `priceYearly` from the plans page. The admin must be able to:

1. Set `priceMonthly` and `priceYearly` independently for each plan.
2. Set the global "discount percentage" shown in the billing toggle badge (e.g., "وفّر 15%") — this is **display-only** and does not affect any math.
3. Save and display exactly what was typed, with no hidden formulas.

---

## Current State vs. Desired State

| Aspect | Current | Desired |
|---|---|---|
| Yearly price | Auto-computed from `((monthly × 12) × (1 - discount/100))` | Manually typed per plan |
| Discount badge | Same global discount used for calculation **and** badge | Same field, but **only** drives the badge text |
| Admin editor shows | "السعر السنوي المحسوب" (read-only computed value) | Direct input field for "السعر السنوي" |
| FAQ answer text | Hardcoded "يوفر لك 15%" | Editable via CMS (already supported) |

---

## Files to Modify

1. **`lib/plans-data.ts`** — Remove `computeYearlyPrice` function. Keep `YEARLY_DISCOUNT_DEFAULT` as a fallback only.
2. **`app/lib/plans-page-data.ts`** — Stop applying `computeYearlyPrice` in `getPlansPageData`. Return DB values as-is.
3. **`app/api/plans-page/route.ts`** — Stop applying `computeYearlyPrice` in the PATCH handler.
4. **`app/(dashboard)/dashboard/plans-page/page.tsx`** — Remove auto-calculation logic from the admin editor. Add `priceYearly` input per plan. Re-label discount input.
5. **`app/components/PricingToggle.tsx`** — No changes needed (already displays `yearlyDiscountPercent` as-is).
6. **`app/components/PricingCard.tsx`** — No changes needed (already reads `priceYearly` directly).

---

## Admin UI Changes

### Plans Section Editor (`PlansSection` component)

- **Remove:**
  - `handleDiscountChange` (auto-updates all plans' `priceYearly` when discount changes)
  - Computed price display read-only block inside each plan card
  - Code inside `updatePlan` that recalculates `priceYearly` when `priceMonthly` changes

- **Add:**
  - New Input field: "السعر السنوي" next to "السعر الشهري" in the 2-column grid

- **Update label:**
  - "نسبة الخصم السنوي (%)" → "نسبة الخصم المعروضة في الشارة (%)" (clears up confusion)

---

## Data Flow (Fixed)

```
Admin Typing ──► PATCH /api/plans-page ──► Supabase (raw JSON, no math)
                    ▲
                    │
GET /api/plans-page ──► PlansPageContent ──► PricingToggle (badge: yearlyDiscountPercent)
                                    │
                                    └──► PricingCard (price: plan.priceYearly)
```

---

## Schema Notes

No database schema changes needed:
- `plans_page.yearly_discount_percent` (INTEGER) stays as the global badge text driver.
- `plans[*].priceYearly` already exists inside the JSONB `plans` column.
- `plans[*].priceMonthly` already exists inside the JSONB `plans` column.

---

## Testing / Verification Checklist

- [ ] Typing `priceYearly = 15000` and saving → refreshes to show exactly 15000 (not computed).
- [ ] Changing `priceMonthly` does NOT change `priceYearly` automatically.
- [ ] Changing global discount does NOT change any plan price.
- [ ] Badge text "وفّر X%" updates immediately when global discount is saved.
- [ ] FAQ answer on plans page remains editable via CMS (no hardcoded 15% logic).

---

## Migration / Seeding Impact

No migration needed. Existing rows keep their current values since `priceYearly` has been stored in DB all along.

However, the hardcoded fallback defaults in `PLANS` array (`lib/plans-data.ts`) still have old computed values. These are only shown if DB row is missing. No action needed unless you want to update the fallback constants.

---

## Out of Scope

- Per-plan badge discount (not requested).
- Any computed pricing analytics or validation (not requested).
- Bulk price updates or import tools (not requested).
