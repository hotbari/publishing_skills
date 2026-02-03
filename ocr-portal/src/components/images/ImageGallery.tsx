import { useState, useEffect } from 'react';
import { ExtractedImage, ImageType } from '../../types';
import { imageService } from '../../services/imageService';
import { ImageViewer } from './ImageViewer';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  fileId: string;
  className?: string;
}

/**
 * ImageGallery Component (FR-060 to FR-064)
 *
 * Displays extracted images in a thumbnail grid with filtering and viewer capabilities.
 *
 * Features:
 * - Thumbnail grid layout (grid-cols-4)
 * - Page number and type badges
 * - Filter by imageType (EMBEDDED/RENDERED)
 * - Click to open full-size viewer
 * - Loading and error states
 */
export function ImageGallery({ fileId, className }: ImageGalleryProps) {
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<ExtractedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [imageTypeFilter, setImageTypeFilter] = useState<ImageType | 'ALL'>('ALL');

  useEffect(() => {
    loadImages();
  }, [fileId]);

  useEffect(() => {
    // Apply filter whenever images or filter changes
    if (imageTypeFilter === 'ALL') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.imageType === imageTypeFilter));
    }
  }, [images, imageTypeFilter]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await imageService.listExtractedImages(fileId);

      if (response.success && response.data) {
        setImages(response.data.items);
      } else {
        setError(response.error || 'Failed to load images');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (imageId: string) => {
    setSelectedImageId(imageId);
  };

  const handleCloseViewer = () => {
    setSelectedImageId(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
        <p className="text-destructive font-medium">Error loading images</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
        <button
          onClick={loadImages}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-muted/30 rounded-lg p-12 text-center">
        <svg
          className="h-16 w-16 text-muted-foreground mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-lg font-medium text-foreground">No images found</p>
        <p className="text-sm text-muted-foreground mt-2">
          This file doesn't have any extracted images yet.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">Filter by type:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setImageTypeFilter('ALL')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                imageTypeFilter === 'ALL'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              All ({images.length})
            </button>
            <button
              onClick={() => setImageTypeFilter('EMBEDDED')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                imageTypeFilter === 'EMBEDDED'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Embedded ({images.filter((img) => img.imageType === 'EMBEDDED').length})
            </button>
            <button
              onClick={() => setImageTypeFilter('RENDERED')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                imageTypeFilter === 'RENDERED'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Rendered ({images.filter((img) => img.imageType === 'RENDERED').length})
            </button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredImages.length} of {images.length} images
        </div>
      </div>

      {/* Thumbnail Grid */}
      {filteredImages.length === 0 ? (
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No images match the selected filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image._id}
              className="group relative bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => handleImageClick(image._id)}
            >
              {/* Thumbnail Image */}
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                <img
                  src={`https://via.placeholder.com/300x300/6366f1/FFFFFF?text=${image.imageType}`}
                  alt={`${image.imageType} image from page ${image.pageNo}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>

              {/* Image Info */}
              <div className="p-4 space-y-2">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Image Type Badge */}
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                      image.imageType === 'EMBEDDED'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-primary/10 text-primary'
                    )}
                  >
                    {image.imageType}
                  </span>

                  {/* Page Number Badge */}
                  {image.pageNo && (
                    <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-medium">
                      Page {image.pageNo}
                      {image.indexInPage !== undefined && ` (${image.indexInPage + 1})`}
                    </span>
                  )}
                </div>

                {/* Image Details */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Dimensions:</span>
                    <span className="font-medium text-foreground">
                      {image.width} × {image.height}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Format:</span>
                    <span className="font-medium text-foreground uppercase">
                      {image.format}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Size:</span>
                    <span className="font-medium text-foreground">
                      {formatFileSize(image.sizeBytes)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="text-white text-center space-y-2">
                  <svg
                    className="h-10 w-10 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <p className="text-sm font-medium">Click to view</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImageId && (
        <ImageViewer
          imageId={selectedImageId}
          allImageIds={filteredImages.map((img) => img._id)}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
}
