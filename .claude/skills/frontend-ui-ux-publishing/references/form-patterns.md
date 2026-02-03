# Form Patterns with React Hook Form + Zod

All forms MUST use React Hook Form + Zod for consistency.

## Basic Form Pattern

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/components/common'

// 1. Define Zod schema
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

// 2. Use in component
function MyForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    // Submit logic
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input {...register('name')} error={errors.name?.message} />
        </div>
      </div>
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>Submit</Button>
      </div>
    </form>
  )
}
```

## Common Validation Schemas

```tsx
// Email
email: z.string().email('Invalid email')

// Required string
name: z.string().min(1, 'Required')

// Min length
password: z.string().min(8, 'Must be at least 8 characters')

// Number
age: z.number().min(0).max(120)

// Enum/Select
role: z.enum(['admin', 'user'], { required_error: 'Required' })

// Optional field
bio: z.string().optional()

// Date
birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date')

// Custom validation
username: z.string()
  .min(3, 'Too short')
  .max(20, 'Too long')
  .regex(/^[a-zA-Z0-9_]+$/, 'Alphanumeric only')
```

## Error Display (Standardized)

```tsx
// ALWAYS display errors below field
<Input
  {...register('email')}
  error={errors.email?.message}
/>

// For select/textarea, manually display errors
<select {...register('role')}>...</select>
{errors.role && (
  <p className="mt-2 text-sm text-destructive">{errors.role.message}</p>
)}
```

## Form Layout (Consistent Spacing)

```tsx
<form className="space-y-6">
  {/* Fields section */}
  <div className="space-y-4">
    {/* Individual fields */}
  </div>

  {/* Actions section */}
  <div className="flex gap-4 pt-4 border-t">
    <Button type="submit">Submit</Button>
    <Button type="button" variant="outline">Cancel</Button>
  </div>
</form>
```

## Complete Example

See `assets/examples/FormPage.example.tsx` for full implementation.
