export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  const json = (await res.json()) as T | { error: string };

  if (!res.ok) {
    const errorMessage =
      typeof json === "object" && json !== null && "error" in json
        ? (json as { error: string }).error
        : "요청에 실패했습니다";
    throw new ApiError(res.status, errorMessage);
  }

  return json as T;
}
