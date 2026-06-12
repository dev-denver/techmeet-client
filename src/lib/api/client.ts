export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  // FormData body는 브라우저가 boundary 포함 Content-Type을 자동 설정하므로 덮어쓰지 않음
  const isFormData = options?.body instanceof FormData;

  const res = await fetch(url, {
    ...options,
    headers: isFormData
      ? options?.headers
      : { "Content-Type": "application/json", ...options?.headers },
  });

  const json = (await res.json()) as T | { error: string; code?: string };

  if (!res.ok) {
    const errorMessage =
      typeof json === "object" && json !== null && "error" in json
        ? (json as { error: string }).error
        : "요청에 실패했습니다";
    const code =
      typeof json === "object" && json !== null && "code" in json
        ? (json as { code?: string }).code
        : undefined;
    throw new ApiError(res.status, errorMessage, code);
  }

  return json as T;
}
