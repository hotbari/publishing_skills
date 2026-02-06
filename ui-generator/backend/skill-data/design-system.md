# Design System Reference

## Design Tokens

All design values MUST be accessed via tokens. Hardcoded values are forbidden.

### Spacing Tokens (8px Scale)

```css
--space-1: 4px   /* gap-1, p-1, m-1 */
--space-2: 8px   /* gap-2, p-2, m-2 */
--space-4: 16px  /* gap-4, p-4, m-4 */
--space-6: 24px  /* gap-6, p-6, m-6 */
--space-8: 32px  /* gap-8, p-8, m-8 */
--space-10: 40px /* gap-10, p-10, m-10 */
--space-12: 48px /* gap-12, p-12, m-12 */
```

**Usage in Tailwind:** `gap-4`, `p-6`, `mt-2`, `space-y-6`

**Common patterns:**
- Component internal spacing: `p-4` or `p-6`
- Between sections: `gap-6` or `space-y-6`
- Between elements: `gap-4` or `space-y-4`
- Tight spacing: `gap-2`

### Color Tokens

**Brand (Purple Primary):**
```css
--primary: 262 83% 58%           /* bg-primary, text-primary */
--primary-foreground: 0 0% 100%  /* text-primary-foreground */
```

**Semantic:**
```css
--success: 142 71% 45%     /* bg-success, text-success */
--error: 0 84.2% 60.2%     /* bg-destructive, text-destructive */
--warning: 38 92% 50%      /* bg-warning, text-warning */
```

**Neutral:**
```css
--background: 0 0% 100%        /* bg-background */
--foreground: 240 10% 3.9%     /* text-foreground */
--muted: 240 4.8% 95.9%        /* bg-muted */
--muted-foreground: 240 3.8% 46.1%
--border: 240 5.9% 90%         /* border-border */
```

**Usage:** Always use Tailwind classes: `bg-primary`, `text-success`, `border-muted`

### Typography Tokens

**Sizes:**
```css
--text-page-title: 2rem      /* text-3xl, 32px */
--text-section-title: 1.5rem /* text-xl, 24px */
--text-body: 1rem            /* text-base, 16px */
--text-caption: 0.875rem     /* text-sm, 14px */
```

**Weights:**
```css
--font-weight-normal: 400    /* font-normal */
--font-weight-medium: 500    /* font-medium */
--font-weight-semibold: 600  /* font-semibold */
--font-weight-bold: 700      /* font-bold */
```

**Line Heights:**
```css
--line-height-tight: 1.25    /* leading-tight */
--line-height-normal: 1.5    /* leading-normal */
--line-height-relaxed: 1.75  /* leading-relaxed */
```

**Typography Hierarchy:**
```tsx
/* Page Title */
<h1 className="text-3xl font-semibold">Title</h1>

/* Section Title */
<h2 className="text-xl font-semibold">Section</h2>

/* Body Text */
<p className="text-base">Content</p>

/* Caption / Secondary */
<p className="text-sm text-muted-foreground">Note</p>
```

### Border Radius

```css
--radius-sm: 4px   /* rounded-sm */
--radius-md: 8px   /* rounded-md */
--radius-lg: 12px  /* rounded-lg */
```

**Usage:**
- Buttons, inputs: `rounded-md`
- Cards, containers: `rounded-lg`
- Small elements: `rounded-sm`

### Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)      /* shadow-sm */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)    /* shadow-md */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)  /* shadow-lg */
```

**Usage:**
- Cards: `shadow-sm` or `shadow-md`
- Dropdowns, modals: `shadow-lg`

### Transitions

```css
--transition-fast: 150ms   /* transition-fast */
--transition-base: 200ms   /* transition-all */
--transition-slow: 300ms   /* transition-slow */
```

**Usage:**
```tsx
<button className="transition-colors hover:bg-primary/90">
  Button
</button>
```

## Font Stack

```css
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
  'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

Inter is the primary font. If not loaded, falls back to system fonts.

## Grid System

**Standard breakpoints (Tailwind defaults):**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Common grid patterns:**
```tsx
/* Responsive columns */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

/* Two-column layout */
<div className="grid grid-cols-2 gap-4">

/* Auto-fit cards */
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

## Component Spacing Standards

**Cards:**
```tsx
<div className="border rounded-lg p-6 bg-card">
  <h2 className="text-xl font-semibold mb-4">Title</h2>
  <div className="space-y-4">Content</div>
</div>
```

**Forms:**
```tsx
<form className="space-y-6">
  <div className="space-y-4">
    {/* Fields with gap-4 */}
  </div>
  <div className="flex gap-4 pt-4 border-t">
    {/* Actions */}
  </div>
</form>
```

**Page Layout:**
```tsx
<div className="container mx-auto p-6 space-y-6">
  {/* Page content with gap-6 */}
</div>
```

## Dark Mode

All tokens have dark mode variants defined in `globals.css`:

```css
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... other dark variants */
}
```

Enable dark mode by adding `dark` class to `<html>` element.

## Quick Reference

**Most common spacing:**
- Between sections: `gap-6` or `space-y-6`
- Between elements: `gap-4`
- Component padding: `p-6`
- Tight spacing: `gap-2`

**Most common text:**
- Page title: `text-3xl font-semibold`
- Section title: `text-xl font-semibold`
- Body: `text-base`
- Secondary: `text-sm text-muted-foreground`

**Most common colors:**
- Primary action: `bg-primary text-primary-foreground`
- Secondary action: `bg-secondary text-secondary-foreground`
- Success: `text-success`
- Error: `text-destructive`
