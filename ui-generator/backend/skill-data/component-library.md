# Common Component Library

All pages MUST use components from `@/components/common/` instead of direct DOM elements or ui/ components.

## Button

```tsx
import { Button } from '@/components/common'

// Variants (semantic only)
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Border Style</Button>
<Button variant="ghost">Subtle</Button>

// Sizes (8px scale enforced)
<Button size="sm">Small</Button>   // h-8
<Button size="md">Medium</Button>  // h-10 (default)
<Button size="lg">Large</Button>   // h-12
```

## Input

```tsx
import { Input } from '@/components/common'

// Basic usage
<Input placeholder="Enter text" />

// With error
<Input error="Invalid value" />

// With register (React Hook Form)
<Input {...register('field')} error={errors.field?.message} />

// Types
<Input type="email" />
<Input type="password" />
<Input type="number" />
```

## PageLayout

```tsx
import { PageLayout } from '@/components/common'

// Basic layout
<PageLayout>
  <div className="space-y-6">
    {/* Page content */}
  </div>
</PageLayout>

// With custom header
<PageLayout header={<CustomHeader />}>
  {/* Content */}
</PageLayout>

// With sidebar
<PageLayout sidebar={<Sidebar />}>
  {/* Content */}
</PageLayout>
```

## Adding New Common Components

When creating new common components:

1. **Location:** `src/components/common/ComponentName.tsx`
2. **Export:** Add to `src/components/common/index.ts`
3. **Enforce consistency:**
   - Use design tokens
   - Follow 8px spacing scale
   - Semantic variants only
4. **Document:** Add to this file

## Component Import Rules

```tsx
// ✅ Correct
import { Button, Input, PageLayout } from '@/components/common'

// ❌ Wrong
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
```

Pages should NEVER import from `ui/` directly. The `common/` components wrap `ui/` components and enforce consistency rules.
