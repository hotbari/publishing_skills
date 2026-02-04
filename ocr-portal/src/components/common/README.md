# Common Component Library

All pages MUST use components from `@/components/common/` instead of direct DOM elements or ui/ components.

## Components Overview

### Button
Primary action component with semantic variants.

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

### Input
Text input component with error state support.

```tsx
import { Input } from '@/components/common'

// Basic usage
<Input placeholder="Enter text" />

// With error
<Input error="Invalid value" />

// With React Hook Form
<Input {...register('field')} error={errors.field?.message} />

// Types
<Input type="email" />
<Input type="password" />
<Input type="number" />
```

### Table
TanStack Table wrapper with built-in sorting and pagination.

```tsx
import { Table } from '@/components/common'
import { type ColumnDef } from '@tanstack/react-table'

interface User {
  id: string
  name: string
  email: string
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
]

<Table
  data={users}
  columns={columns}
  pageSize={10}
/>
```

### Modal
Dialog component for overlays with composable sub-components.

```tsx
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter,
  Button
} from '@/components/common'

const [open, setOpen] = useState(false)

<Modal open={open} onOpenChange={setOpen}>
  <ModalHeader>
    <ModalTitle>Confirm Action</ModalTitle>
    <ModalClose onClose={() => setOpen(false)} />
  </ModalHeader>
  <ModalBody>
    <p>Are you sure you want to proceed?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleConfirm}>
      Confirm
    </Button>
  </ModalFooter>
</Modal>
```

### Tabs
Tab navigation component for organizing content.

```tsx
import { Tabs } from '@/components/common'

const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    content: <OverviewContent />,
  },
  {
    id: 'details',
    label: 'Details',
    content: <DetailsContent />,
  },
]

<Tabs
  tabs={tabs}
  defaultTab="overview"
  onTabChange={(tabId) => console.log('Active tab:', tabId)}
/>
```

### Toast
Notification system with ToastProvider context.

```tsx
// 1. Add ToastProvider to your app root
import { ToastProvider } from '@/components/common'

function App() {
  return (
    <ToastProvider>
      {/* Your app content */}
    </ToastProvider>
  )
}

// 2. Use toast notifications in your components
import { useToast } from '@/components/common'

function MyComponent() {
  const { toast } = useToast()

  const handleSuccess = () => {
    toast({
      type: 'success',
      title: 'File uploaded successfully',
      description: 'Your file has been processed',
    })
  }

  const handleError = () => {
    toast({
      type: 'error',
      title: 'Upload failed',
      description: 'Please try again',
    })
  }

  return <Button onClick={handleSuccess}>Upload</Button>
}
```

### FileUpload
Drag-and-drop upload component with progress tracking.

```tsx
import { FileUpload } from '@/components/common'

<FileUpload
  onFilesSelected={(files) => {
    console.log('Selected files:', files)
    // Handle file upload
  }}
  accept="image/*,.pdf"
  multiple={true}
  maxSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
/>
```

### Loading
Loading spinner component for async operations.

```tsx
import { Loading } from '@/components/common'

// Inline spinner
<Loading size="md" text="Loading data..." />

// Fullscreen overlay
<Loading size="lg" text="Processing..." fullScreen />

// Small spinner
<Loading size="sm" />
```

### EmptyState
Empty state placeholder for empty lists or searches.

```tsx
import { EmptyState } from '@/components/common'

// With built-in icon
<EmptyState
  icon="inbox"
  title="No files found"
  description="Upload your first file to get started"
  action={{
    label: 'Upload File',
    onClick: () => openUploadModal(),
  }}
/>

// With custom icon
<EmptyState
  icon={<CustomIcon />}
  title="No results"
  description="Try adjusting your search"
/>
```

### PageLayout
Standard page layout wrapper.

```tsx
import { PageLayout } from '@/components/common'

<PageLayout>
  <div className="space-y-6">
    {/* Page content */}
  </div>
</PageLayout>
```

## Design System Rules

All components follow these rules:

1. **Design Tokens**: No hardcoded values - all spacing, colors, and typography use design tokens from `src/styles/tokens.css`
2. **8px Spacing Scale**: All spacing follows the scale: 4px, 8px, 16px, 24px, 32px, 40px, 48px
3. **Dark Mode**: Full support via CSS custom properties
4. **Accessibility**: Keyboard navigation, ARIA labels, focus states
5. **Consistency**: Semantic variants only, standardized sizing

## Import Rules

```tsx
// ✅ Correct - Import from common/
import { Button, Input, Table, Modal } from '@/components/common'

// ❌ Wrong - Never import from ui/ directly
import { Button } from '@/components/ui/button'
```

Pages should NEVER import from `ui/` directly. The `common/` components wrap `ui/` components and enforce consistency rules.
