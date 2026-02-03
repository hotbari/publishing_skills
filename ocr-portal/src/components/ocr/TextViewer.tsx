import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ExtractedText, TextGranularity } from '@/types';

/**
 * TextViewer Component (FR-050 to FR-054)
 *
 * Features:
 * - FR-050: Display extracted OCR text with empty state
 * - FR-051: Display mode (DOCUMENT: full scroll, PAGE: pagination)
 * - FR-052: In-viewer search with client-side highlighting
 * - FR-053: Download as .txt button
 * - FR-054: Version selection for multiple OCR results
 */

export interface TextViewerProps {
  extractedTexts: ExtractedText[];
  granularity: TextGranularity;
  fileTitle?: string;
}

export const TextViewer: React.FC<TextViewerProps> = ({
  extractedTexts,
  granularity,
  fileTitle = 'Document',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<number>(
    extractedTexts.length > 0 ? extractedTexts[0].version : 0
  );
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Get current extracted text based on selected version
  const currentExtractedText = useMemo(() => {
    return extractedTexts.find((t) => t.version === selectedVersion);
  }, [extractedTexts, selectedVersion]);

  // Handle version change
  const handleVersionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const version = parseInt(e.target.value, 10);
      setSelectedVersion(version);
      setCurrentPage(0); // Reset to first page on version change
      setSearchQuery(''); // Clear search on version change
    },
    []
  );

  // Highlight search matches in text
  const highlightText = useCallback((text: string, query: string): React.ReactNode => {
    if (!query.trim()) {
      return text;
    }

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, idx) => {
      if (!regex.test(part)) {
        return <React.Fragment key={idx}>{part}</React.Fragment>;
      }
      return (
        <mark key={idx} className="bg-warning text-warning-foreground px-1 rounded">
          {part}
        </mark>
      );
    });
  }, []);

  // Get text to display based on granularity and page
  const displayText = useMemo(() => {
    if (!currentExtractedText) {
      return '';
    }

    if (granularity === 'DOCUMENT') {
      return currentExtractedText.text;
    }

    // For PAGE granularity, return only the current page text
    if (granularity === 'PAGE' && currentExtractedText.pageNo !== undefined) {
      return currentExtractedText.text;
    }

    return currentExtractedText.text;
  }, [currentExtractedText, granularity]);

  // Filter pages based on search query if PAGE granularity
  const pageCount = useMemo(() => {
    if (granularity === 'DOCUMENT' || !currentExtractedText) {
      return 1;
    }

    // For PAGE granularity, count is based on number of page records
    const pageNumbers = extractedTexts
      .filter((t) => t.version === selectedVersion)
      .map((t) => t.pageNo)
      .filter((p) => p !== undefined);

    return Math.max(1, pageNumbers.length);
  }, [granularity, currentExtractedText, extractedTexts, selectedVersion]);

  // Get text for current page
  const pageText = useMemo(() => {
    if (granularity === 'DOCUMENT') {
      return displayText;
    }

    // For PAGE granularity, get the text for the current page
    if (granularity === 'PAGE') {
      const pageRecords = extractedTexts.filter(
        (t) => t.version === selectedVersion && t.pageNo === currentPage
      );
      return pageRecords.length > 0 ? pageRecords[0].text : '';
    }

    return displayText;
  }, [granularity, displayText, extractedTexts, selectedVersion, currentPage]);

  // Handle text download
  const handleDownload = useCallback(() => {
    const textToDownload =
      granularity === 'DOCUMENT' ? displayText : pageText;
    const filename = `${fileTitle.replace(/[^a-z0-9]/gi, '_')}_page${currentPage + 1}.txt`;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(textToDownload)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [displayText, pageText, granularity, fileTitle, currentPage]);

  // Handle page navigation
  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1));
  }, [pageCount]);

  // Empty state
  if (extractedTexts.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-muted-foreground bg-muted/30 p-8 text-center space-y-4">
        <div className="text-muted-foreground text-base font-medium">
          OCR 결과가 없습니다
        </div>
        <p className="text-sm text-muted-foreground">
          이 문서에서 텍스트를 추출하려면 "OCR 실행" 버튼을 클릭하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="space-y-4">
        {/* Version Selector and Download Button */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Version Selection */}
          <div className="flex-1">
            {extractedTexts.length > 1 ? (
              <div className="space-y-2">
                <label htmlFor="version-select" className="text-sm font-medium text-foreground">
                  OCR 버전
                </label>
                <select
                  id="version-select"
                  value={selectedVersion}
                  onChange={handleVersionChange}
                  className={cn(
                    'w-full flex h-10 rounded-md border border-input bg-background px-4 py-2',
                    'text-sm ring-offset-background',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  {extractedTexts.map((text) => (
                    <option key={text._id} value={text.version}>
                      버전 {text.version} (최신)
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          {/* Download Button */}
          <div className="w-full sm:w-auto">
            <Button
              onClick={handleDownload}
              variant="secondary"
              size="md"
              className="w-full sm:w-auto"
            >
              .txt로 다운로드
            </Button>
          </div>
        </div>

        {/* Search Input */}
        <div className="space-y-2">
          <label htmlFor="search-input" className="text-sm font-medium text-foreground">
            텍스트 검색
          </label>
          <Input
            id="search-input"
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <p className="text-xs text-muted-foreground">
              일치하는 항목이 노란색으로 강조 표시됩니다
            </p>
          )}
        </div>
      </div>

      {/* Text Display Area */}
      <div className="border border-input rounded-md bg-card p-6 min-h-96 max-h-96 overflow-y-auto">
        <div className="prose prose-sm max-w-none dark:prose-invert text-foreground">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {highlightText(pageText, searchQuery)}
          </div>
        </div>
      </div>

      {/* Page Navigation for PAGE granularity */}
      {granularity === 'PAGE' && pageCount > 1 && (
        <div className="space-y-4">
          {/* Page Counter */}
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            {currentPage + 1} / {pageCount} 페이지
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              variant="outline"
              size="md"
            >
              이전 페이지
            </Button>

            {/* Page Input */}
            <div className="w-20">
              <input
                type="number"
                min="1"
                max={pageCount}
                value={currentPage + 1}
                onChange={(e) => {
                  const page = parseInt(e.target.value, 10) - 1;
                  setCurrentPage(Math.max(0, Math.min(pageCount - 1, page)));
                }}
                className={cn(
                  'w-full flex h-10 rounded-md border border-input bg-background px-4 py-2',
                  'text-sm text-center ring-offset-background',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              />
            </div>

            <Button
              onClick={handleNextPage}
              disabled={currentPage === pageCount - 1}
              variant="outline"
              size="md"
            >
              다음 페이지
            </Button>
          </div>
        </div>
      )}

      {/* Document Statistics */}
      {currentExtractedText && (
        <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground bg-muted/30 rounded-md p-4">
          <div>
            <span className="font-medium text-foreground">텍스트 길이:</span> {currentExtractedText.textLength.toLocaleString()} 자
          </div>
          <div>
            <span className="font-medium text-foreground">세분성:</span> {granularity}
          </div>
          {currentExtractedText.pageNo !== undefined && (
            <div>
              <span className="font-medium text-foreground">페이지:</span> {currentExtractedText.pageNo}
            </div>
          )}
          <div>
            <span className="font-medium text-foreground">추출일:</span> {new Date(currentExtractedText.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

TextViewer.displayName = 'TextViewer';
