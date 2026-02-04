import { useState, useEffect } from 'react';
import { ExtractedImage } from '../../types';
import { imageService } from '../../services/imageService';
import { Modal, ModalHeader, ModalTitle, ModalClose, ModalBody } from '../common/Modal';
import { cn } from '@/lib/utils';
import {
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ImageViewerProps {
  imageId: string;
  allImageIds: string[];
  onClose: () => void;
}

/**
 * ImageViewer Component (FR-062 to FR-064)
 *
 * Full-size image viewer with zoom, navigation, and download capabilities.
 *
 * Features:
 * - Full-size image display
 * - Zoom controls (in/out/fit)
 * - Previous/Next navigation
 * - Download button with presigned URL handling
 * - Image metadata display
 * - Keyboard navigation (arrows, ESC)
 */
export function ImageViewer({ imageId, allImageIds, onClose }: ImageViewerProps) {
  const [image, setImage] = useState<ExtractedImage | null>(null);
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [downloading, setDownloading] = useState(false);
  const [fitToScreen, setFitToScreen] = useState(true);

  const currentIndex = allImageIds.indexOf(imageId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allImageIds.length - 1;

  useEffect(() => {
    loadImage(imageId);
  }, [imageId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrevious) {
        goToPrevious();
      } else if (e.key === 'ArrowRight' && hasNext) {
        goToNext();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageId, hasPrevious, hasNext, zoom]);

  const loadImage = async (imgId: string) => {
    setLoading(true);
    setError(null);
    setZoom(100);
    setFitToScreen(true);

    try {
      // Load image metadata
      const imageResponse = await imageService.getExtractedImage(imgId);
      if (!imageResponse.success || !imageResponse.data) {
        throw new Error(imageResponse.error || 'Failed to load image');
      }

      setImage(imageResponse.data);

      // Load presigned URL
      const urlResponse = await imageService.getImagePresignedUrl(imgId);
      if (!urlResponse.success || !urlResponse.data) {
        throw new Error(urlResponse.error || 'Failed to get image URL');
      }

      setPresignedUrl(urlResponse.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    if (hasPrevious) {
      const prevId = allImageIds[currentIndex - 1];
      loadImage(prevId);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      const nextId = allImageIds[currentIndex + 1];
      loadImage(nextId);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 400));
    setFitToScreen(false);
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 25));
    setFitToScreen(false);
  };

  const handleFitToScreen = () => {
    setFitToScreen(!fitToScreen);
    if (!fitToScreen) {
      setZoom(100);
    }
  };

  const handleDownload = async () => {
    if (!image) return;

    setDownloading(true);
    try {
      const response = await imageService.getImagePresignedUrl(image._id);

      if (response.success && response.data) {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = `image-page${image.pageNo}-${image.imageType.toLowerCase()}.${image.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Failed to download image: ' + response.error);
      }
    } catch (err) {
      alert('An error occurred while downloading the image');
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Modal open={true} onOpenChange={onClose} className="max-w-6xl">
      <ModalHeader>
        <div className="flex-1">
          <ModalTitle>
            {image
              ? `${image.imageType} 이미지 - 페이지 ${image.pageNo}`
              : '이미지 로딩 중...'}
          </ModalTitle>
          {image && (
            <p className="text-sm text-muted-foreground mt-1">
              {image.width} × {image.height} · {image.format.toUpperCase()} ·{' '}
              {formatFileSize(image.sizeBytes)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Navigation counter */}
          {allImageIds.length > 1 && (
            <span className="text-sm text-muted-foreground mr-2">
              {currentIndex + 1} / {allImageIds.length}
            </span>
          )}
          <ModalClose onClose={onClose} />
        </div>
      </ModalHeader>

      <ModalBody className="p-0">
        {/* Toolbar */}
        <div className="border-b border-border p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 25}
                className="p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="축소 (- 키)"
              >
                <ZoomOut className="h-5 w-5" />
              </button>

              <span className="text-sm font-medium text-foreground min-w-[60px] text-center">
                {fitToScreen ? '맞춤' : `${zoom}%`}
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoom >= 400}
                className="p-2 rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="확대 (+ 키)"
              >
                <ZoomIn className="h-5 w-5" />
              </button>

              <div className="w-px h-6 bg-border mx-2" />

              <button
                onClick={handleFitToScreen}
                className={cn(
                  'p-2 rounded-md hover:bg-muted transition-colors',
                  fitToScreen && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
                title="화면에 맞춤"
              >
                {fitToScreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={downloading || !image}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5" />
              <span>{downloading ? '다운로드 중...' : '다운로드'}</span>
            </button>
          </div>
        </div>

        {/* Image Display */}
        <div className="relative bg-muted/10 min-h-[400px] max-h-[600px] overflow-auto">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground">이미지 로딩 중...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="bg-destructive/10 border border-destructive rounded-lg p-6 max-w-md">
                <p className="text-destructive font-medium">이미지 로딩 오류</p>
                <p className="text-sm text-muted-foreground mt-2">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && presignedUrl && (
            <div className="flex items-center justify-center p-6">
              <img
                src={presignedUrl}
                alt={image ? `${image.imageType} image from page ${image.pageNo}` : 'Image'}
                className={cn(
                  'transition-all duration-200',
                  fitToScreen ? 'max-w-full max-h-[550px] w-auto h-auto' : ''
                )}
                style={
                  !fitToScreen
                    ? {
                        width: `${zoom}%`,
                        height: 'auto',
                      }
                    : undefined
                }
              />
            </div>
          )}

          {/* Navigation Arrows */}
          {!loading && !error && allImageIds.length > 1 && (
            <>
              {hasPrevious && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-background transition-colors"
                  title="이전 이미지 (← 키)"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {hasNext && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-background transition-colors"
                  title="다음 이미지 (→ 키)"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Image Metadata */}
        {image && !loading && (
          <div className="border-t border-border p-4 bg-muted/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">유형</div>
                <div className="font-medium text-foreground">{image.imageType}</div>
              </div>
              <div>
                <div className="text-muted-foreground">페이지</div>
                <div className="font-medium text-foreground">
                  {image.pageNo}
                  {image.indexInPage !== undefined && ` (이미지 ${image.indexInPage + 1})`}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">형식</div>
                <div className="font-medium text-foreground">{image.format.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">SHA256</div>
                <div className="font-mono text-xs text-foreground">
                  {image.sha256.substring(0, 16)}...
                </div>
              </div>
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
