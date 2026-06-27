// 마리벨 백엔드 API 클라이언트.
// - access token 은 메모리에만 보관한다 (XSS 노출 최소화).
// - refresh token 은 백엔드가 /api/auth 경로의 HttpOnly 쿠키로 관리하므로
//   브라우저가 자동으로 동봉한다. 401 발생 시 한 번 refresh 후 재시도한다.

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export interface ApiErrorBody {
  code: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
  refreshExpiresInSeconds: number;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** refresh/login 처럼 401 자동 재시도를 건너뛰어야 하는 호출에 사용 */
  skipAuthRetry?: boolean;
}

async function parseError(response: Response): Promise<ApiError> {
  let code = "UNKNOWN";
  let message = response.statusText || "요청을 처리하지 못했습니다.";
  try {
    const body = (await response.json()) as Partial<ApiErrorBody>;
    if (body?.code) code = body.code;
    if (body?.message) message = body.message;
  } catch {
    // 본문이 없거나 JSON 이 아니면 기본 메시지를 사용한다.
  }
  return new ApiError(response.status, code, message);
}

/** refresh token 쿠키로 새 access token 을 발급받는다. 실패 시 null. */
export async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = refreshAccessTokenOnce();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

async function refreshAccessTokenOnce(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      setAccessToken(null);
      return null;
    }
    const token = (await response.json()) as TokenResponse;
    setAccessToken(token.accessToken);
    return token.accessToken;
  } catch {
    setAccessToken(null);
    return null;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, skipAuthRetry = false } = options;

  const send = async (): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    return fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let response = await send();

  if (response.status === 401 && !skipAuthRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await send();
    }
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "POST", body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
