# Decision Trees

Quick reference for making consistent decisions.

## Design System Selection

**Question:** Tailwind + shadcn/ui or Ant Design?

```
Is it an admin/operator dashboard? YES → Ant Design (optional)
                                   NO  → Tailwind + shadcn/ui

Is it a complex CRUD interface? YES → Ant Design (optional)
                                NO  → Tailwind + shadcn/ui

Is rapid implementation priority #1? YES → Ant Design (optional)
                                     NO  → Tailwind + shadcn/ui

When in doubt → Tailwind + shadcn/ui
```

**Default: Always Tailwind + shadcn/ui unless explicitly choosing Ant Design**

---

## Page Template Selection

**Question:** Which template should I use?

```
Displaying a collection? → List Page
  - Multiple records
  - Search/filter needed
  - Pagination needed
  Examples: Users list, Orders list, Products list

Displaying one record? → Detail Page
  - Single item details
  - Related data sections
  - View-only or with edit action
  Examples: User profile, Order details, Product view

Creating or editing? → Form Page
  - Input fields
  - Validation required
  - Submit action
  Examples: Create user, Edit profile, New product

Showing metrics/overview? → Dashboard Page
  - Key metrics cards
  - Charts/graphs
  - Summary information
  Examples: Analytics dashboard, System overview, Reports
```

---

## Component Selection

**Question:** Which component should I use?

```
Need a button? → components/common/Button
  - Primary action? → variant="primary"
  - Secondary action? → variant="secondary"
  - Destructive action? → variant="destructive"
  - Subtle action? → variant="ghost"
  - With border? → variant="outline"

Need text input? → components/common/Input
  - With error? → Pass error prop
  - Different type? → Pass type="email|password|number"

Need a form? → React Hook Form + Zod
  - See references/form-patterns.md

Need a table? → TanStack Table
  - See references/table-patterns.md

Need a modal? → components/common/Modal (when implemented)

Need page layout? → components/common/PageLayout
```

---

## Spacing Selection

**Question:** How much space should I use?

```
Between page sections? → gap-6 or space-y-6
  <div className="space-y-6">

Between cards in grid? → gap-6
  <div className="grid gap-6">

Between form fields? → gap-4 or space-y-4
  <div className="space-y-4">

Between buttons? → gap-4
  <div className="flex gap-4">

Between inline elements? → gap-2
  <div className="flex gap-2">

Card padding? → p-6
  <div className="p-6">

Tight spacing? → gap-2 or p-2
  <div className="gap-2">
```

**Rule: When in doubt, use gap-6 for sections, gap-4 for elements**

---

## Color Selection

**Question:** Which color should I use?

```
Primary action (Submit, Create, Save)? → bg-primary text-primary-foreground

Secondary action (Cancel, Close)? → bg-secondary or variant="outline"

Destructive action (Delete, Remove)? → bg-destructive text-destructive-foreground

Success message? → text-success or bg-success

Error message? → text-destructive or bg-destructive

Warning? → text-warning or bg-warning

Secondary/muted text? → text-muted-foreground

Border? → border-border

Background? → bg-background or bg-card
```

**Rule: Always use semantic color tokens, never hardcode hex values**

---

## Typography Selection

**Question:** Which text style should I use?

```
Page title (H1)? → text-3xl font-semibold
  <h1 className="text-3xl font-semibold">

Section title (H2)? → text-xl font-semibold
  <h2 className="text-xl font-semibold">

Subsection (H3)? → text-lg font-medium
  <h3 className="text-lg font-medium">

Body text? → text-base
  <p className="text-base">

Secondary/caption text? → text-sm text-muted-foreground
  <p className="text-sm text-muted-foreground">

Small text? → text-xs
  <p className="text-xs">
```

---

## Validation Strategy

**Question:** When should validation occur?

```
Form validation? → onSubmit (React Hook Form)

Individual field validation? → onBlur (React Hook Form)

Real-time validation? → onChange (with debounce if API check)

Show errors? → After first submit attempt OR after field blur

Error placement? → Below field
  <Input error={errors.field?.message} />
```

**See:** `references/form-patterns.md` for complete patterns

---

## State Management

**Question:** Where should I put state?

```
Local to component? → useState
  const [open, setOpen] = useState(false)

Form state? → React Hook Form
  const { register, handleSubmit } = useForm()

Shared across pages? → Context or URL params
  - User preferences → Context
  - Filters/search → URL params

Server state? → React Query or SWR (if needed)
```

---

## Import Decisions

**Question:** Where should I import components from?

```
Need Button, Input, Form, etc.?
  ✅ import { Button } from '@/components/common'
  ❌ import { Button } from '@/components/ui/button'

Need page-specific component?
  ✅ Create in components/features/
  ✅ Import from @/components/features/FeatureName

Need utility function?
  ✅ import { cn } from '@/lib/utils'

Need icon?
  ✅ import { IconName } from 'lucide-react'
```

---

## Quick Decision Matrix

| Scenario | Decision | Reasoning |
|----------|----------|-----------|
| Admin dashboard | Ant Design (optional) | Heavy CRUD focus |
| Marketing site | shadcn/ui | Public-facing |
| Form validation | Zod + React Hook Form | Type-safe, standard |
| Data table | TanStack Table | Flexible, powerful |
| Spacing choice | Start with gap-6 | Consistent default |
| Button variant | Match semantic meaning | Not appearance |
| Color choice | Use semantic tokens | Consistency |
| Import source | components/common | Enforce consistency |
