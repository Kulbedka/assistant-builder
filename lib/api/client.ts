const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://185-117-116-100.sslip.io";

export async function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}