import { Download } from 'lucide-react';
import JSZip from 'jszip';
import type { GeneratedFile } from '@/types';

interface DownloadButtonProps {
  files: GeneratedFile[];
}

export default function DownloadButton({ files }: DownloadButtonProps) {
  const handleDownload = async () => {
    if (!files || files.length === 0) return;

    try {
      const zip = new JSZip();

      // Add each file to the zip
      files.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });

      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated-ui.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create zip file:', error);
      alert('파일 다운로드에 실패했습니다.');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
    >
      <Download className="w-4 h-4" />
      <span>코드 다운로드</span>
    </button>
  );
}
