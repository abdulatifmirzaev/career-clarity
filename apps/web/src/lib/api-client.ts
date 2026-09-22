import { ApiResponse } from '@career-clarity/shared-types';

function getBaseUrl(): string {
  if (process.env['NEXT_PUBLIC_API_URL']) {
    return process.env['NEXT_PUBLIC_API_URL'].replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return '/api';
  }
  if (process.env['VERCEL_URL']) {
    return `https://${process.env['VERCEL_URL']}/api`;
  }
  return 'http://localhost:3000/api';
}

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
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

export async function apiClient<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
  const isBrowser = typeof window !== 'undefined';
  const token = isBrowser ? localStorage.getItem('career_clarity_access_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

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

  // Handle 401 Unauthorized with Automatic Token Refresh
  if (response.status === 401 && !options._retry && isBrowser && !endpoint.includes('/auth/')) {
    const refreshToken = localStorage.getItem('career_clarity_refresh_token');

    if (refreshToken) {
      if (isRefreshing) {
        // Wait for current refresh to complete
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          return apiClient<T>(endpoint, {
            ...options,
            _retry: true,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshJson = await refreshResponse.json();
          const refreshData = refreshJson.data || refreshJson;
          const newAccessToken = refreshData.accessToken;
          const newRefreshToken = refreshData.refreshToken;

          localStorage.setItem('career_clarity_access_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('career_clarity_refresh_token', newRefreshToken);
          }

          processQueue(null, newAccessToken);
          isRefreshing = false;

          return apiClient<T>(endpoint, {
            ...options,
            _retry: true,
            headers: {
              ...headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
        } else {
          throw new Error('Refresh token invalid or expired');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        localStorage.removeItem('career_clarity_access_token');
        localStorage.removeItem('career_clarity_refresh_token');
        localStorage.removeItem('career_clarity_user');
      }
    }
  }

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
