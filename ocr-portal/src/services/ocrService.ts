// @ts-expect-error - apiClient will be used when real API calls are implemented
import { apiClient } from './api';
import {
  ApiResponse,
  PaginatedResponse,
  ExtractedText,
  TextGranularity,
  PresignedUrlResponse,
} from '../types';

// Mock data for development
const MOCK_EXTRACTED_TEXTS: ExtractedText[] = [
  {
    _id: 'text1',
    fileId: '1',
    jobId: 'job1',
    version: 1,
    granularity: 'DOCUMENT',
    text: 'This is the full text content of the document. It contains multiple paragraphs and sections...',
    preview: 'This is the full text content of the document...',
    textLength: 5432,
    createdAt: new Date(Date.now() - 2900000).toISOString(),
  },
  {
    _id: 'text2',
    fileId: '1',
    jobId: 'job1',
    version: 1,
    granularity: 'PAGE',
    pageNo: 1,
    text: 'This is the text content of page 1. It contains the introduction and first section...',
    preview: 'This is the text content of page 1...',
    textLength: 1823,
    createdAt: new Date(Date.now() - 2900000).toISOString(),
  },
  {
    _id: 'text3',
    fileId: '1',
    jobId: 'job1',
    version: 1,
    granularity: 'PAGE',
    pageNo: 2,
    text: 'This is the text content of page 2. It contains the main body and analysis...',
    preview: 'This is the text content of page 2...',
    textLength: 2145,
    createdAt: new Date(Date.now() - 2900000).toISOString(),
  },
];

class OcrService {
  /**
   * Get extracted texts for a file
   */
  async getExtractedTexts(
    fileId: string,
    granularity?: TextGranularity,
    page?: number,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<ExtractedText>>> {
    // TODO: Replace with real API call
    // const params = { granularity, page, pageSize };
    // const response = await apiClient.get<PaginatedResponse<ExtractedText>>(
    //   `/files/${fileId}/texts`,
    //   { params }
    // );

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredTexts = MOCK_EXTRACTED_TEXTS.filter((t) => t.fileId === fileId);

        if (granularity) {
          filteredTexts = filteredTexts.filter((t) => t.granularity === granularity);
        }

        const start = page ? (page - 1) * pageSize : 0;
        const end = start + pageSize;
        const paginatedTexts = filteredTexts.slice(start, end);

        resolve({
          success: true,
          data: {
            items: paginatedTexts,
            total: filteredTexts.length,
            page: page || 1,
            pageSize,
            totalPages: Math.ceil(filteredTexts.length / pageSize),
          },
        });
      }, 300);
    });
  }

  /**
   * Get extracted text by ID
   */
  async getExtractedText(textId: string): Promise<ApiResponse<ExtractedText>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<ExtractedText>(`/texts/${textId}`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const text = MOCK_EXTRACTED_TEXTS.find((t) => t._id === textId);

        if (!text) {
          resolve({
            success: false,
            error: 'Extracted text not found',
          });
          return;
        }

        resolve({
          success: true,
          data: text,
        });
      }, 300);
    });
  }

  /**
   * Get document-level extracted text for a file
   */
  async getDocumentText(fileId: string): Promise<ApiResponse<ExtractedText>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<ExtractedText>(`/files/${fileId}/texts/document`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const text = MOCK_EXTRACTED_TEXTS.find(
          (t) => t.fileId === fileId && t.granularity === 'DOCUMENT'
        );

        if (!text) {
          resolve({
            success: false,
            error: 'Document text not found',
          });
          return;
        }

        resolve({
          success: true,
          data: text,
        });
      }, 300);
    });
  }

  /**
   * Get page-level extracted texts for a file
   */
  async getPageTexts(fileId: string): Promise<ApiResponse<ExtractedText[]>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<ExtractedText[]>(`/files/${fileId}/texts/pages`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const texts = MOCK_EXTRACTED_TEXTS.filter(
          (t) => t.fileId === fileId && t.granularity === 'PAGE'
        ).sort((a, b) => (a.pageNo || 0) - (b.pageNo || 0));

        resolve({
          success: true,
          data: texts,
        });
      }, 300);
    });
  }

  /**
   * Get extracted text for a specific page
   */
  async getPageText(fileId: string, pageNo: number): Promise<ApiResponse<ExtractedText>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<ExtractedText>(
    //   `/files/${fileId}/texts/pages/${pageNo}`
    // );

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const text = MOCK_EXTRACTED_TEXTS.find(
          (t) => t.fileId === fileId && t.granularity === 'PAGE' && t.pageNo === pageNo
        );

        if (!text) {
          resolve({
            success: false,
            error: `Text for page ${pageNo} not found`,
          });
          return;
        }

        resolve({
          success: true,
          data: text,
        });
      }, 300);
    });
  }

  /**
   * Download extracted text as file
   */
  async downloadText(
    textId: string,
    format: 'txt' | 'json' = 'txt'
  ): Promise<ApiResponse<PresignedUrlResponse>> {
    // TODO: Replace with real API call
    // const response = await apiClient.get<PresignedUrlResponse>(
    //   `/texts/${textId}/download`,
    //   { params: { format } }
    // );

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            url: `https://mock-presigned-url.s3.amazonaws.com/texts/${textId}.${format}`,
            expiresAt: new Date(Date.now() + 3600000).toISOString(),
          },
        });
      }, 300);
    });
  }

  /**
   * Search within extracted texts
   */
  async searchTexts(
    fileId: string,
    query: string
  ): Promise<
    ApiResponse<
      Array<{
        textId: string;
        granularity: TextGranularity;
        pageNo?: number;
        matches: Array<{ text: string; position: number }>;
      }>
    >
  > {
    // TODO: Replace with real API call
    // const response = await apiClient.get(`/files/${fileId}/texts/search`, {
    //   params: { query }
    // });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = MOCK_EXTRACTED_TEXTS.filter(
          (t) => t.fileId === fileId && t.text.toLowerCase().includes(query.toLowerCase())
        ).map((t) => ({
          textId: t._id,
          granularity: t.granularity,
          pageNo: t.pageNo,
          matches: [
            {
              text: t.preview,
              position: t.text.toLowerCase().indexOf(query.toLowerCase()),
            },
          ],
        }));

        resolve({
          success: true,
          data: results,
        });
      }, 300);
    });
  }

  /**
   * Get text extraction statistics
   */
  async getTextStats(
    fileId: string
  ): Promise<
    ApiResponse<{
      totalTexts: number;
      totalCharacters: number;
      pageCount: number;
      averagePageLength: number;
    }>
  > {
    // TODO: Replace with real API call
    // const response = await apiClient.get(`/files/${fileId}/texts/stats`);

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const texts = MOCK_EXTRACTED_TEXTS.filter((t) => t.fileId === fileId);
        const pageTexts = texts.filter((t) => t.granularity === 'PAGE');

        const totalCharacters = texts.reduce((sum, t) => sum + t.textLength, 0);
        const averagePageLength =
          pageTexts.length > 0
            ? pageTexts.reduce((sum, t) => sum + t.textLength, 0) / pageTexts.length
            : 0;

        resolve({
          success: true,
          data: {
            totalTexts: texts.length,
            totalCharacters,
            pageCount: pageTexts.length,
            averagePageLength: Math.round(averagePageLength),
          },
        });
      }, 300);
    });
  }
}

export const ocrService = new OcrService();
export default ocrService;
