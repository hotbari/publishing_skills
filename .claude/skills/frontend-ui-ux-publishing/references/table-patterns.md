# Table Patterns with TanStack Table

For complex tables, use TanStack Table. For simple tables, use plain HTML with consistent styling.

## Simple Table Pattern (HTML)

```tsx
<div className="border rounded-lg">
  <table className="w-full">
    <thead className="border-b bg-muted/50">
      <tr>
        <th className="text-left p-4 font-medium">Column 1</th>
        <th className="text-left p-4 font-medium">Column 2</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row) => (
        <tr key={row.id} className="border-b last:border-0 hover:bg-muted/50">
          <td className="p-4">{row.col1}</td>
          <td className="p-4">{row.col2}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

**Spacing:** `p-4` for cells (consistent)

**Styling:**
- Header: `border-b bg-muted/50`
- Rows: `border-b last:border-0 hover:bg-muted/50`
- Container: `border rounded-lg`

## Pagination Pattern (Standardized)

```tsx
<div className="flex items-center justify-between">
  <p className="text-sm text-muted-foreground">
    Showing {start}-{end} of {total}
  </p>
  <div className="flex gap-2">
    <Button variant="outline" size="sm" disabled={!canPrev}>
      Previous
    </Button>
    <Button variant="outline" size="sm" disabled={!canNext}>
      Next
    </Button>
  </div>
</div>
```

**Position:** Below table
**Alignment:** Space between count and buttons
**Spacing:** `gap-2` between buttons

## Empty State (Standardized)

```tsx
{data.length === 0 ? (
  <div className="text-center py-12">
    <p className="text-muted-foreground">No records found</p>
  </div>
) : (
  <table>...</table>
)}
```

## Complete Example

See `assets/examples/ListPage.example.tsx` for full table implementation.
