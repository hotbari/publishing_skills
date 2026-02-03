// @ts-expect-error - apiClient will be used when real API calls are implemented
import { apiClient } from './api';
import {
  ApiResponse,
  PaginatedResponse,
  ExtractedImage,
  ImageType,
  PresignedUrlResponse,
} from '../types';

// Mock data for development
const MOCK_EXTRACTED_IMAGES: ExtractedImage[] = [
  {
    _id: 'img1',
    fileId: '2',
    jobId: 'job3',
    imageType: 'EMBEDDED',
    pageNo: 1,
    indexInPage: 0,
    minio: {
      bucket: 'images',
      objectKey: 'extracted/2/img1.png',
      etag: 'img-etag1',
    },
    width: 800,
    height: 600,
    format: 'png',
    sizeBytes: 102400,
    sha256: 'img-hash-123',
    createdAt: new Date(Date.now() - 7000000).toISOString(),
  },
  {
    _id: 'img2',
    fileId: '2',
    jobId: 'job3',
    imageType: 'EMBEDDED',
    pageNo: 1,
    indexInPage: 1,
    minio: {
      bucket: 'images',
      objectKey: 'extracted/2/img2.jpg',
      etag: 'img-etag2',
    },
    width: 1024,
    height: 768,
    format: 'jpeg',
    sizeBytes: 204800,
    sha256: 'img-hash-456',
    createdAt: new Date(Date.now() - 7000000).toISOString(),
  },
  {
    _id: 'img3',
    fileId: '2',
    jobId: 'job3',
    imageType: 'RENDERED',
    pageNo: 1,
    minio: {
      bucket: 'images',
      objectKey: 'extracted/2/page1.png',
      etag: 'img-etag3',
    },
    width: 2480,
    height: 3508,
    format: 'png',
    sizeBytes: 1048576,
    sha256: 'img-hash-789',
    createdAt: new Date(Date.now() - 7000000).toISOString(),
  },
];

class ImageService {
  /**
   * List extracted images for a file
   */
  async listExtractedImages(
    fileId: string,
    imageType?: ImageType,
    page?: number,
    pageSize: number = 20
  ): Promise<ApiResponse<PaginatedResponse<ExtractedImage>>> {
    // TODO: Replace with real API call
    // const params = { imageType, page, pageSize };
    // const response = await apiClient.get<PaginatedResponse<ExtractedImage>>(
    //   `/files/${fileId}/images`,
    //   { params }
    // );

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredImages = MOCK_EXTRACTED_IMAGES.filter((i) => i.fileId === fileId);

        if (imageType) {
          filteredImages = filteredImages.filter((i) => i.imageType === imageType);
        }

        const start = page ? (page - 1) * pageSize : 0;
        const end = start + pageSize;
        const paginatedImages = filteredImages.slice(start, end);

        resolve({
          success: true,
          data: {
            items: paginatedImages,
            total: filteredImages.length,
            page: page || 1,
            pageSize,
            totalPages: Math.ceil(filteredImages.length / pageSize),
          },
        });
      }, 300);
    });
  }

  /**
   * Get extracted image by ID
   */
  async getExtractedImage(imageId: string): Promise<ApiResponse<ExtractedImage>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<ExtractedImage>(`/images/${imageId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const image = MOCK_EXTRACTED_IMAGES.find((i) => i._id === imageId);

        if (!image) {
          resolve({
            success: false,
            error: 'Image not found',
          });
          return;
        }

        resolve({
          success: true,
          data: image,
        });
      }, 300);
    });
  }

  /**
   * Get images by page number
   */
  async getPageImages(fileId: string, pageNo: number): Promise<ApiResponse<ExtractedImage[]>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<ExtractedImage[]>(
    //   `/files/${fileId}/images/pages/${pageNo}`
    // );

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const images = MOCK_EXTRACTED_IMAGES.filter(
          (i) => i.fileId === fileId && i.pageNo === pageNo
        ).sort((a, b) => (a.indexInPage || 0) - (b.indexInPage || 0));

        resolve({
          success: true,
          data: images,
        });
      }, 300);
    });
  }

  /**
   * Get embedded images only
   */
  async getEmbeddedImages(fileId: string): Promise<ApiResponse<ExtractedImage[]>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<ExtractedImage[]>(
    //   `/files/${fileId}/images/embedded`
    // );

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const images = MOCK_EXTRACTED_IMAGES.filter(
          (i) => i.fileId === fileId && i.imageType === 'EMBEDDED'
        );

        resolve({
          success: true,
          data: images,
        });
      }, 300);
    });
  }

  /**
   * Get rendered page images
   */
  async getRenderedImages(fileId: string): Promise<ApiResponse<ExtractedImage[]>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<ExtractedImage[]>(
    //   `/files/${fileId}/images/rendered`
    // );

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const images = MOCK_EXTRACTED_IMAGES.filter(
          (i) => i.fileId === fileId && i.imageType === 'RENDERED'
        );

        resolve({
          success: true,
          data: images,
        });
      }, 300);
    });
  }

  /**
   * Get presigned URL for image download/viewing
   */
  async getImagePresignedUrl(imageId: string): Promise<ApiResponse<PresignedUrlResponse>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<PresignedUrlResponse>(`/images/${imageId}/url`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const image = MOCK_EXTRACTED_IMAGES.find((i) => i._id === imageId);

        if (!image) {
          resolve({
            success: false,
            error: 'Image not found',
          });
          return;
        }

        resolve({
          success: true,
          data: {
            url: `https://mock-presigned-url.s3.amazonaws.com/images/${imageId}.${image.format}`,
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
          },
        });
      }, 300);
    });
  }

  /**
   * Download image
   */
  async downloadImage(_imageId: string): Promise<ApiResponse<Blob>> {
    // TODO: Replace with real implementation
    // const urlResponse = await this.getImagePresignedUrl(imageId);
    // if (!urlResponse.success || !urlResponse.data) {
    //   return { success: false, error: urlResponse.error };
    // }
    // const response = await fetch(urlResponse.data.url);
    // const blob = await response.blob();

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a mock blob
        const mockBlob = new Blob(['mock image data'], { type: 'image/png' });

        resolve({
          success: true,
          data: mockBlob,
        });
      }, 500);
    });
  }

  /**
   * Get image statistics for a file
   */
  async getImageStats(
    fileId: string
  ): Promise<
    ApiResponse<{
      totalImages: number;
      embeddedCount: number;
      renderedCount: number;
      totalSizeBytes: number;
      averageSizeBytes: number;
      formatDistribution: Record<string, number>;
    }>
  > {
    // TODO: Replace with real API call
    // const response = await apiClient.get(`/files/${fileId}/images/stats`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const images = MOCK_EXTRACTED_IMAGES.filter((i) => i.fileId === fileId);

        const embeddedCount = images.filter((i) => i.imageType === 'EMBEDDED').length;
        const renderedCount = images.filter((i) => i.imageType === 'RENDERED').length;
        const totalSizeBytes = images.reduce((sum, i) => sum + i.sizeBytes, 0);
        const averageSizeBytes =
          images.length > 0 ? Math.round(totalSizeBytes / images.length) : 0;

        const formatDistribution: Record<string, number> = {};
        images.forEach((img) => {
          formatDistribution[img.format] = (formatDistribution[img.format] || 0) + 1;
        });

        resolve({
          success: true,
          data: {
            totalImages: images.length,
            embeddedCount,
            renderedCount,
            totalSizeBytes,
            averageSizeBytes,
            formatDistribution,
          },
        });
      }, 300);
    });
  }

  /**
   * Batch download images as ZIP
   */
  async downloadImagesZip(fileId: string): Promise<ApiResponse<PresignedUrlResponse>> {
    // TODO: Replace with real API call
    // const response = await apiClient.post<PresignedUrlResponse>(
    //   `/files/${fileId}/images/download-zip`
    // );

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            url: `https://mock-presigned-url.s3.amazonaws.com/zips/${fileId}-images.zip`,
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
          },
        });
      }, 1000);
    });
  }
}

export const imageService = new ImageService();
export default imageService;
