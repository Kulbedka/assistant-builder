import { apiFetch } from "./client";

export type CurrentUser = {
  id: number;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt?: string;
};

export async function getCurrentUser() {
  const response = await apiFetch("/api/auth/me");

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.user as CurrentUser;
}

export async function logoutUser() {
  const response = await apiFetch("/api/auth/logout", {
    method: "POST",
  });

  return response.ok;
}

export async function loginUser(email: string, password: string) {
  const response = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.ok) {
    return {
      success: true as const,
    };
  }

  const data = await response.json().catch(() => null);

  return {
    success: false as const,
    error: data?.error as string | undefined,
  };
}

export async function registerUser(email: string, password: string) {
  const response = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.ok) {
    return {
      success: true as const,
    };
  }

  const data = await response.json().catch(() => null);

  return {
    success: false as const,
    error: data?.error as string | undefined,
  };
}
