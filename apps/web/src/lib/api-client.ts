import { ApiResponse } from '@career-clarity/shared-types';

const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001/api';

export class ApiError extends Error {
  statusCode: number;
  error?: string;

  constructor(message: string, statusCode = 500, error?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
  }
}

export interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | object | null;
}

export async function apiClient<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('career_clarity_access_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  let requestBody: BodyInit | null | undefined;
  if (options.body !== undefined && options.body !== null) {
    if (
      typeof options.body === 'object' &&
      !(options.body instanceof FormData) &&
      !(options.body instanceof Blob) &&
      !(options.body instanceof ArrayBuffer)
    ) {
      requestBody = JSON.stringify(options.body);
    } else {
      requestBody = options.body as BodyInit;
    }
  }

  const response = await fetch(url, {
    ...options,
    body: requestBody,
    headers,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message = json?.message || json?.error || `Request failed with status ${response.status}`;
    throw new ApiError(
      Array.isArray(message) ? message.join(', ') : message,
      response.status,
      json?.error,
    );
  }

  // If response matches our standard envelope
  if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
    return (json as ApiResponse<T>).data;
  }

  return json as T;
}
