# Page Template Specifications

All pages MUST follow one of four standard templates. These templates are non-negotiable.

## 1. List Page Template

**Purpose:** Display collections of data with search, filtering, and pagination.

**Required Structure:**

```tsx
<PageLayout>
  <div className="space-y-6">
    {/* 1. Page Header */}
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      <Button>Add New</Button>
    </div>

    {/* 2. Search and Filters */}
    <div className="flex gap-4">
      <div className="flex-1">
        <Input placeholder="Search..." />
      </div>
      <Button variant="outline">Filters</Button>
    </div>

    {/* 3. Table */}
    <div className="border rounded-lg">
      <table className="w-full">
        {/* Table content */}
      </table>
    </div>

    {/* 4. Pagination */}
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">Showing X-Y of Z</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">Previous</Button>
        <Button variant="outline" size="sm">Next</Button>
      </div>
    </div>
  </div>
</PageLayout>
```

**Spacing:** `space-y-6` between sections, `gap-4` within sections

**See:** `assets/examples/ListPage.example.tsx`

---

## 2. Detail Page Template

**Purpose:** Display a single record with structured information and related data.

**Required Structure:**

```tsx
<PageLayout>
  <div className="space-y-6">
    {/* 1. Back Navigation */}
    <Button variant="ghost" size="sm">
      <ArrowLeft /> Back
    </Button>

    {/* 2. Page Header */}
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-semibold">{name}</h1>
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">Edit</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>

    {/* 3. Content Sections */}
    <div className="grid gap-6">
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4">Section Title</h2>
        <dl className="grid grid-cols-2 gap-4">
          {/* Key-value pairs */}
        </dl>
      </div>

      {/* Additional sections */}
    </div>
  </div>
</PageLayout>
```

**Spacing:** `space-y-6` between sections, `p-6` in cards, `gap-4` in grids

**See:** `assets/examples/DetailPage.example.tsx`

---

## 3. Form Page Template

**Purpose:** Create or edit records with validation.

**Required Structure:**

```tsx
<PageLayout>
  <div className="max-w-2xl space-y-6">
    {/* 1. Page Header */}
    <div>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>

    {/* 2. Form Card */}
    <div className="border rounded-lg p-6 bg-card">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 3. Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Field Label <span className="text-destructive">*</span>
            </label>
            <Input />
          </div>
          {/* More fields */}
        </div>

        {/* 4. Form Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline">Cancel</Button>
        </div>
      </form>
    </div>
  </div>
</PageLayout>
```

**Spacing:** `space-y-6` form sections, `space-y-4` between fields, `gap-4` actions

**Validation:** Always use React Hook Form + Zod

**See:** `assets/examples/FormPage.example.tsx`

---

## 4. Dashboard Page Template

**Purpose:** Overview pages with metrics, charts, and summaries.

**Required Structure:**

```tsx
<PageLayout>
  <div className="space-y-6">
    {/* 1. Page Header */}
    <div>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-2">{description}</p>
    </div>

    {/* 2. Metrics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard {...metric} />
    </div>

    {/* 3. Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="border rounded-lg p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4">Chart Title</h2>
        {/* Chart content */}
      </div>
    </div>

    {/* 4. Activity/Table */}
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      {/* Activity list */}
    </div>
  </div>
</PageLayout>
```

**Spacing:** `space-y-6` sections, `gap-6` grids, `p-6` cards

**See:** `assets/examples/DashboardPage.example.tsx`

---

## Template Selection Guide

| Requirement | Template |
|-------------|----------|
| "List of users" | List Page |
| "View user details" | Detail Page |
| "Create user", "Edit user" | Form Page |
| "Overview", "Dashboard", "Metrics" | Dashboard Page |
| "Manage X" | List Page + Detail Page + Form Page |

## Combining Templates

Complex pages can combine templates but must maintain structure:

**Example: List with inline editing**
- Base: List Page
- Add: Form fields in table rows
- Keep: List page spacing and structure

**Example: Dashboard with create action**
- Base: Dashboard Page
- Add: Modal with Form Page structure
- Keep: Dashboard layout

## Common Mistakes

❌ Custom layouts that don't follow templates
❌ Inconsistent spacing between template sections
❌ Missing required sections (e.g., header, actions)
❌ Improper nesting of components

✅ Strict adherence to template structure
✅ Consistent use of spacing scale
✅ All required sections present
✅ Proper component hierarchy

## Validation Checklist

Before completing a page:
- [ ] Follows one of the four templates
- [ ] Header structure matches template
- [ ] Spacing uses only 8px scale
- [ ] Components imported from `common/`
- [ ] All required sections present
