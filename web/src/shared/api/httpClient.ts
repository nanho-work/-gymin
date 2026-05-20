type QueryValue = string | number | boolean | null | undefined;

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  query?: Record<string, QueryValue>;
  body?: unknown;
  headers?: HeadersInit;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

function buildApiUrl(path: string, query?: Record<string, QueryValue>) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${apiBaseUrl}${normalizedPath}`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildApiUrl(path, options.query), {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    let message = "API 요청에 실패했습니다.";

    try {
      const errorBody = (await response.json()) as { detail?: string };
      message = errorBody.detail ?? message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function apiGet<T>(path: string, query?: Record<string, QueryValue>) {
  return apiRequest<T>(path, { query });
}

export function apiPost<T>(path: string, body?: unknown) {
  return apiRequest<T>(path, { method: "POST", body });
}

export function apiPatch<T>(path: string, body?: unknown) {
  return apiRequest<T>(path, { method: "PATCH", body });
}
