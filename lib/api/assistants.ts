import { apiFetch } from "./client";

export type Assistant = {
  id: number;
  name: string;
  description: string;
  instruction: string;
};

export async function getAssistants() {
  const response = await apiFetch("/api/assistants");

  if (!response.ok) {
    return {
      success: false as const,
      status: response.status,
    };
  }

  const data = (await response.json()) as Assistant[];

  return {
    success: true as const,
    data,
  };
}
