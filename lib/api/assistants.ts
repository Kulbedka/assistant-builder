import { apiFetch } from "./client";

export type Assistant = {
  id: number;
  name: string;
  description: string;
  instruction: string;
};

export type CreateAssistantInput = {
  name: string;
  description?: string;
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

export async function getAssistantById(id: number) {
  const response = await apiFetch(`/api/assistants/${id}`);

  if (!response.ok) {
    return {
      success: false as const,
      status: response.status,
    };
  }

  const data = (await response.json()) as Assistant;

  return {
    success: true as const,
    data,
  };
}

export async function createAssistant(input: CreateAssistantInput) {
  const response = await apiFetch("/api/assistants", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    return {
      success: false as const,
      status: response.status,
    };
  }

  const data = (await response.json()) as Assistant;

  return {
    success: true as const,
    data,
  };
}

export async function deleteAssistant(id: number) {
  const response = await apiFetch(`/api/assistants/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    return {
      success: false as const,
      status: response.status,
    };
  }

  return {
    success: true as const,
  };
}
