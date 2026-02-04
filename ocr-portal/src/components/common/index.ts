/**
 * Common Components
 *
 * All pages MUST use these components instead of importing from ui/ directly.
 * This enforces consistency across the application.
 */

export { Button } from './Button'
export type { ButtonProps } from './Button'

export { Input } from './Input'
export type { InputProps } from './Input'

export { PageLayout } from './PageLayout'

export { Table } from './Table'
export type { TableProps } from './Table'

export { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody, ModalFooter } from './Modal'
export type { ModalProps, ModalContentProps } from './Modal'

export { Tabs } from './Tabs'
export type { Tab, TabsProps } from './Tabs'

export { ToastProvider, useToast } from './Toast'
export type { Toast, ToastType } from './Toast'

export { FileUpload } from './FileUpload'
export type { FileUploadProps } from './FileUpload'

export { Loading } from './Loading'
export type { LoadingProps } from './Loading'

export { EmptyState } from './EmptyState'
export type { EmptyStateProps } from './EmptyState'
