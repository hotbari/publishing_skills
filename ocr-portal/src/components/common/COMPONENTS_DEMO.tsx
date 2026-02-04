/**
 * Component Library Demo
 *
 * This file demonstrates all common components.
 * Import this page to see all components in action.
 */

import { useState } from 'react'
import {
  Button,
  Input,
  Table,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter,
  Tabs,
  useToast,
  FileUpload,
  Loading,
  EmptyState,
} from './index'
import { type ColumnDef } from '@tanstack/react-table'

interface DemoUser {
  id: string
  name: string
  email: string
}

export function ComponentsDemo() {
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Table demo data
  const users: DemoUser[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
    { id: '3', name: 'Carol Davis', email: 'carol@example.com' },
  ]

  const columns: ColumnDef<DemoUser>[] = [
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

  // Tabs demo data
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Overview Tab</h3>
          <p className="text-sm text-muted-foreground">
            This is the overview tab content. You can put any React component here.
          </p>
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Details Tab</h3>
          <p className="text-sm text-muted-foreground">
            This is the details tab content with additional information.
          </p>
        </div>
      ),
    },
  ]

  const handleFilesSelected = (files: File[]) => {
    toast({
      type: 'success',
      title: 'Files selected',
      description: `${files.length} file(s) ready to upload`,
    })
  }

  const simulateLoading = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({
        type: 'success',
        title: 'Operation complete',
      })
    }, 2000)
  }

  return (
    <div className="container mx-auto p-6 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Component Library Demo</h1>
        <p className="text-sm text-muted-foreground">
          All common components in one place for testing and reference
        </p>
      </div>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Inputs</h2>
        <div className="max-w-md space-y-4">
          <Input placeholder="Normal input" />
          <Input placeholder="Email" type="email" />
          <Input placeholder="With error" error="This field is required" />
        </div>
      </section>

      {/* Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Table</h2>
        <Table data={users} columns={columns} pageSize={5} />
      </section>

      {/* Modal */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Modal</h2>
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <ModalHeader>
            <ModalTitle>Confirm Action</ModalTitle>
            <ModalClose onClose={() => setModalOpen(false)} />
          </ModalHeader>
          <ModalBody>
            <p className="text-sm">
              This is a modal dialog. Click outside, press ESC, or use the close button to dismiss.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setModalOpen(false)
                toast({ type: 'success', title: 'Action confirmed' })
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </Modal>
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Tabs</h2>
        <Tabs tabs={tabs} defaultTab="overview" />
      </section>

      {/* Toast */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Toast Notifications</h2>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => toast({ type: 'success', title: 'Success message' })}
          >
            Success Toast
          </Button>
          <Button
            onClick={() => toast({ type: 'error', title: 'Error message' })}
          >
            Error Toast
          </Button>
          <Button
            onClick={() => toast({ type: 'warning', title: 'Warning message' })}
          >
            Warning Toast
          </Button>
          <Button
            onClick={() => toast({ type: 'info', title: 'Info message' })}
          >
            Info Toast
          </Button>
        </div>
      </section>

      {/* FileUpload */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">File Upload</h2>
        <FileUpload
          onFilesSelected={handleFilesSelected}
          accept="image/*,.pdf"
          multiple
          maxSize={10 * 1024 * 1024}
          maxFiles={3}
        />
      </section>

      {/* Loading */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Loading States</h2>
        <div className="flex items-center gap-8">
          <Loading size="sm" text="Small" />
          <Loading size="md" text="Medium" />
          <Loading size="lg" text="Large" />
        </div>
        <div>
          <Button onClick={simulateLoading}>
            Simulate Loading (2s)
          </Button>
          {loading && <Loading fullScreen text="Processing..." />}
        </div>
      </section>

      {/* EmptyState */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Empty States</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-border rounded-lg">
            <EmptyState
              icon="inbox"
              title="No items"
              description="Start by adding your first item"
            />
          </div>
          <div className="border border-border rounded-lg">
            <EmptyState
              icon="search"
              title="No results"
              description="Try adjusting your search"
            />
          </div>
          <div className="border border-border rounded-lg">
            <EmptyState
              icon="file"
              title="No files"
              description="Upload files to get started"
              action={{
                label: 'Upload File',
                onClick: () => toast({ type: 'info', title: 'Upload clicked' }),
              }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
