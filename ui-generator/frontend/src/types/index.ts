export interface GenerateRequest {
  prompt: string;
  page_type?: 'form' | 'list' | 'detail' | 'dashboard';
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface TokenUsage {
  input: number;
  output: number;
}

export interface GenerateResponse {
  success: boolean;
  files: GeneratedFile[];
  preview_html: string;
  token_usage: TokenUsage;
  error?: string;
}
