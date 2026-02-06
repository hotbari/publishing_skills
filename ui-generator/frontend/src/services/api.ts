import type { GenerateRequest, GenerateResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function generateUI(request: GenerateRequest): Promise<GenerateResponse> {
  const response = await fetch(`${API_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function healthCheck(): Promise<{ status: string; service: string }> {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error('Health check failed');
  }

  return response.json();
}
