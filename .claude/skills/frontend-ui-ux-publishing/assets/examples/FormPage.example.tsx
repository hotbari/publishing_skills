/**
 * Form Page Example
 *
 * Template for creating or editing records with:
 * - Form validation (React Hook Form + Zod)
 * - Error handling
 * - Submit/cancel actions
 *
 * Consistency rules applied:
 * - Spacing: 8px scale (gap-4, gap-6, p-6)
 * - Layout: Fixed structure (title → form fields → actions)
 * - Validation: Standardized error display
 * - Components: Only from components/common
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, PageLayout } from '@/components/common'

// Validation schema with Zod
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'user'], { required_error: 'Role is required' }),
})

type UserFormData = z.infer<typeof userSchema>

export function UserFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  const onSubmit = async (data: UserFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Form data:', data)
  }

  return (
    <PageLayout>
      <div className="max-w-2xl space-y-6">
        {/* Page Header - FIXED STRUCTURE */}
        <div>
          <h1 className="text-3xl font-semibold">Create User</h1>
          <p className="text-muted-foreground mt-2">
            Add a new user to the system
          </p>
        </div>

        {/* Form Card - FIXED STRUCTURE */}
        <div className="border rounded-lg p-6 bg-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Fields - CONSISTENT SPACING */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email <span className="text-destructive">*</span>
                </label>
                <Input
                  {...register('email')}
                  type="email"
                  error={errors.email?.message}
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Role <span className="text-destructive">*</span>
                </label>
                <select
                  {...register('role')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-4 py-2"
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                {errors.role && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </div>
            </div>

            {/* Form Actions - FIXED STRUCTURE */}
            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create User'}
              </Button>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  )
}
