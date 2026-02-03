# Image Components

This directory contains components for displaying and managing extracted images from PDF files.

## Components

### ImageGallery

A comprehensive image gallery component that displays extracted images in a thumbnail grid with filtering capabilities.

**Features:**
- Thumbnail grid layout (4 columns)
- Filter by image type (EMBEDDED/RENDERED/ALL)
- Page number and type badges on each thumbnail
- Image metadata display (dimensions, format, size)
- Click to open full-size viewer
- Hover effects with view icon
- Loading and error states
- Empty state when no images

**Usage:**
```tsx
import { ImageGallery } from '@/components/images';

function MyPage() {
  return (
    <div>
      <h1>Extracted Images</h1>
      <ImageGallery fileId="file-123" />
    </div>
  );
}
```

**Props:**
- `fileId` (string, required): The file ID to load images for
- `className` (string, optional): Additional CSS classes

### ImageViewer

A full-featured image viewer modal with zoom controls, navigation, and download capabilities.

**Features:**
- Full-size image display with presigned URL handling
- Zoom controls (zoom in, zoom out, fit to screen)
- Previous/Next navigation between images
- Download button
- Image metadata display
- Keyboard navigation:
  - Arrow Left/Right: Navigate between images
  - Plus/Minus: Zoom in/out
  - Escape: Close viewer
- Loading and error states

**Usage:**
```tsx
import { ImageViewer } from '@/components/images';

function MyComponent() {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const allImageIds = ['img1', 'img2', 'img3'];

  return (
    <>
      {/* Your image thumbnails */}
      {selectedImageId && (
        <ImageViewer
          imageId={selectedImageId}
          allImageIds={allImageIds}
          onClose={() => setSelectedImageId(null)}
        />
      )}
    </>
  );
}
```

**Props:**
- `imageId` (string, required): The currently displayed image ID
- `allImageIds` (string[], required): Array of all image IDs for navigation
- `onClose` (function, required): Callback when viewer is closed

## PRD Requirements

These components implement the following requirements from the PRD:

- **FR-060**: List extracted images with filtering by type
- **FR-061**: View individual image details
- **FR-062**: Generate and handle presigned URLs for image viewing
- **FR-063**: Download images with presigned URLs
- **FR-064**: Navigate between images

## Dependencies

- React hooks (useState, useEffect)
- `imageService` from `@/services/imageService`
- `Modal` component from `@/components/common/Modal`
- `lucide-react` for icons
- Tailwind CSS for styling

## Design System

The components follow the project's design system:
- Uses CSS custom properties for colors
- Follows 8px spacing scale
- Responsive design
- Consistent button and badge styles
- Smooth transitions and animations
