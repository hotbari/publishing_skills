import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code, Eye } from 'lucide-react';
import type { GeneratedFile } from '@/types';

interface CodePreviewProps {
  files: GeneratedFile[];
  previewHtml: string;
}

export default function CodePreview({ files, previewHtml }: CodePreviewProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  if (!files || files.length === 0) {
    return null;
  }

  const selectedFile = files[selectedFileIndex];

  return (
    <div className="space-y-4">
      {/* Tab Selector */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'code'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>코드</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'preview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>미리보기</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'code' ? (
        <div className="space-y-4">
          {/* File Tabs */}
          {files.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {files.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedFileIndex(index)}
                  className={`px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors ${
                    selectedFileIndex === index
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {file.path.split('/').pop()}
                </button>
              ))}
            </div>
          )}

          {/* Code Display */}
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="bg-muted px-4 py-2 border-b border-border">
              <p className="text-sm font-mono text-muted-foreground">{selectedFile.path}</p>
            </div>
            <div className="max-h-[600px] overflow-auto">
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.875rem',
                }}
              >
                {selectedFile.content}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <iframe
            sandbox="allow-scripts"
            srcDoc={previewHtml}
            className="w-full h-[600px] bg-white"
            title="UI Preview"
          />
        </div>
      )}
    </div>
  );
}
