import { useState } from 'react';
import PromptInput from './components/PromptInput';
import GenerateButton from './components/GenerateButton';
import CodePreview from './components/CodePreview';
import DownloadButton from './components/DownloadButton';
import { generateUI } from './services/api';
import type { GenerateResponse } from './types';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('프롬프트를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await generateUI({ prompt });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '생성에 실패했습니다.');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">UI Generator</h1>
          <p className="text-sm text-muted-foreground mt-1">
            자연어로 React UI를 생성하세요
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel: Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-border p-6 space-y-6">
              <PromptInput value={prompt} onChange={setPrompt} disabled={loading} />
              <GenerateButton onClick={handleGenerate} loading={loading} disabled={!prompt.trim()} />

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Token Usage */}
              {result && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    토큰 사용량: {result.token_usage.input.toLocaleString()} 입력 /{' '}
                    {result.token_usage.output.toLocaleString()} 출력
                  </p>
                </div>
              )}
            </div>

            {/* Example Prompts */}
            <div className="bg-white rounded-lg border border-border p-6">
              <h3 className="text-sm font-medium text-foreground mb-3">예시 프롬프트</h3>
              <div className="space-y-2">
                {[
                  '이메일과 비밀번호를 입력받는 로그인 페이지',
                  '사용자 목록을 보여주는 테이블',
                  '프로필 정보를 보여주는 상세 페이지',
                  '통계를 보여주는 대시보드',
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    disabled={loading}
                    className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Preview */}
          <div>
            {result && result.files.length > 0 ? (
              <div className="bg-white rounded-lg border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">생성된 코드</h3>
                  <DownloadButton files={result.files} />
                </div>
                <CodePreview files={result.files} previewHtml={result.preview_html} />
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-border p-6 h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm">프롬프트를 입력하고 "만들기"를 클릭하세요</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
