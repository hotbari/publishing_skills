# Consistency Rules (Non-Negotiable)

## Core Objective

**Consistency over creativity. Predictability over aesthetic variation. Rules over freedom.**

This document defines the strict rules that MUST be followed when building frontends with this skill.

## Priority Order (Fixed)

Consistency rules are enforced in this exact priority order:

### 1. Spacing and Layout (Highest Priority)

**8px Scale (Strictly Enforced)**

All spacing MUST use these values only:
- `4px` (--space-1, gap-1, p-1)
- `8px` (--space-2, gap-2, p-2)
- `16px` (--space-4, gap-4, p-4)
- `24px` (--space-6, gap-6, p-6)
- `32px` (--space-8, gap-8, p-8)
- `40px` (--space-10, gap-10, p-10)
- `48px` (--space-12, gap-12, p-12)

**Arbitrary values (margin: 20px, padding: 14px) are FORBIDDEN.**

**Page Templates (Required)**

All pages MUST follow one of four templates:
1. **List Page**: Tables, search, filters, pagination
2. **Detail Page**: Single record view, related data sections
3. **Form Page**: Create/edit with validation
4. **Dashboard Page**: Metrics cards, charts, summaries

No custom page layouts are allowed. Mix templates if needed, but maintain structure.

---

### 2. Component Behavior

**Same-purpose components MUST behave identically.**

**Forms:**
- Same validation timing (onBlur for individual fields, onSubmit for form)
- Same error message placement (below field)
- Same submit button state (disabled while submitting)

**Tables:**
- Same pagination position (bottom right)
- Same default page size (10 rows)
- Same empty state (centered message)
- Same loading state (skeleton rows)

**Modals:**
- Same open/close animation (fade + scale)
- Same backdrop behavior (click to close)
- Same close button position (top right)

No variations allowed. If behavior differs, it's wrong.

---

### 3. Typography Hierarchy

**Fixed text roles (use design tokens):**

```css
--text-page-title: 2rem (32px)
--text-section-title: 1.5rem (24px)
--text-body: 1rem (16px)
--text-caption: 0.875rem (14px)
```

**Font weights:**
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

**Line heights:**
- Tight: 1.25 (headings)
- Normal: 1.5 (body)
- Relaxed: 1.75 (long text)

Use Tailwind classes: `text-3xl`, `text-xl`, `text-base`, `text-sm`

Never use arbitrary sizes: `text-[18px]` ❌

---

### 4. Color Usage

**Semantic roles only. No decorative colors.**

**Brand Colors:**
- `--color-primary`: Purple (262 83% 58%) - Main actions
- `--color-primary-foreground`: White - Text on primary

**Semantic Colors:**
- `--color-success`: Green - Success states
- `--color-error`: Red - Error states
- `--color-warning`: Yellow - Warning states

**Neutral Colors:**
- `--color-background`: Page background
- `--color-foreground`: Default text
- `--color-muted`: Secondary backgrounds
- `--color-muted-foreground`: Secondary text
- `--color-border`: Borders

Use Tailwind classes: `text-primary`, `bg-success`, `border-muted`

Never hardcode: `bg-[#8b5cf6]` ❌

---

### 5. Interaction Patterns

**Modals:**
- Open: Fade in backdrop (200ms) + scale content (200ms)
- Close: Reverse animation
- Backdrop click: Close modal
- Escape key: Close modal

**Drawers:**
- Same as modals but slide from side

**Toasts:**
- Position: Top right
- Duration: 3s (success/info), 5s (error/warning)
- Max visible: 3
- Animation: Slide in from right

**Dropdowns:**
- Open on click, not hover
- Close on outside click
- Keyboard navigation: Arrow keys

No variations. Standardize all interactions.

---

## Component Import Rules

**Pages MUST NOT import from `ui/` directly.**

❌ Wrong:
```tsx
import { Button } from '@/components/ui/button'
```

✅ Correct:
```tsx
import { Button } from '@/components/common'
```

The `ui/` directory contains raw shadcn/ui components.
The `common/` directory contains consistency-enforcing wrappers.

All page imports must go through `common/`.

---

## Handling Incomplete Requirements

When requirements are unclear:

1. ✅ Apply fixed default layout (choose template)
2. ✅ Use existing common components
3. ✅ Reuse established patterns
4. ❌ Do NOT invent new patterns
5. ❌ Do NOT make assumptions about UX preferences

**Consistency > Speculation**

If unsure, pick the most common pattern and apply it consistently.

---

## Common Components (Mandatory)

These components MUST be used. Never reimplement:

- `Button` - All buttons
- `Input` - All text inputs
- `Form` - All forms (React Hook Form wrapper)
- `Table` - All data tables (TanStack Table wrapper)
- `Modal` - All modals
- `PageLayout` - All page layouts

Direct DOM elements (`<button>`, `<input>`, `<table>`) in pages are forbidden.

---

## Validation Before Completion

Before declaring work complete, verify:

- [ ] All spacing uses 8px scale
- [ ] All pages follow templates
- [ ] All colors use semantic tokens
- [ ] All typography uses hierarchy tokens
- [ ] All components imported from `common/`
- [ ] `npm run build` passes
- [ ] `python scripts/validate-consistency.py` passes

If any fail, fix before completion.

---

## Summary

This skill exists to guarantee consistent outputs regardless of:
- Requirement format
- Requirement completeness
- Project context

**Consistency is the primary objective. All decisions serve that goal.**
