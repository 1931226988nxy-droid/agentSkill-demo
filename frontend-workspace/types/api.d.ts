export class HttpError extends Error {
  constructor(message: string, status: number, details?: unknown);
  status: number;
  details: unknown;
}
export interface HttpClientOptions {
  baseURL?: string;
  fetch?: typeof globalThis.fetch;
  getHeaders?: () => HeadersInit | Promise<HeadersInit>;
  onUnauthorized?: (response: Response) => void | Promise<void>;
}
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Record<string, unknown>;
  body?: BodyInit | Record<string, unknown> | unknown[] | null;
  responseType?: 'json' | 'text' | 'blob' | 'response';
}
/** 204 在 json/text/blob 模式返回 null；response 模式保留原始 Response。 */
export interface HttpClient {
  (path: string, options: RequestOptions & { responseType: 'response' }): Promise<Response>;
  (path: string, options: RequestOptions & { responseType: 'blob' }): Promise<Blob | null>;
  (path: string, options: RequestOptions & { responseType: 'text' }): Promise<string | null>;
  <T = unknown>(
    path: string,
    options?: Omit<RequestOptions, 'responseType'> & { responseType?: 'json' },
  ): Promise<T | null>;
  (path: string, options: RequestOptions): Promise<unknown>;
}
export function createHttpClient(options?: HttpClientOptions): HttpClient;
