import { apiFetch } from "./client";

export type ChatMessage = {
  id: number;
  assistantId: number;
  chatId?: number | null;
  role: string;
  text?: string;
  content?: string;
  createdAt?: string;
};

export type Chat = {
  id: number;
  assistantId: number;
  ownerId?: number;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  messages?: ChatMessage[];
};

export async function getChats(assistantId: number) {
  const response = await apiFetch(`/api/chats?assistantId=${assistantId}`);

  if (!response.ok) {
    return {
      success: false as const,
      status: response.status,
    };
  }

  const data = (await response.json()) as Chat[];

  return {
    success: true as const,
    data,
  };
}

export async function createChat(assistantId: number, title?: string) {
  const response = await apiFetch("/api/chats", {
    method: "POST",
    body: JSON.stringify({
      assistantId,
      title,
    }),
  });

  if (!response.ok) {
    return {
      success: false as const,
      status: response.status,
    };
  }

  const data = (await response.json()) as Chat;

  return {
    success: true as const,
    data,
  };
}

export async function renameChat(chatId: number, title: string) {
  const response = await apiFetch(`/api/chats/${chatId}`, {
    method: "PATCH",
    body: JSON.stringify({
      title,
    }),
  });

  if (!response.ok) {
    return {
      success: false as const,
      status: response.status,
    };
  }

  const data = (await response.json()) as Chat;

  return {
    success: true as const,
    data,
  };
}

export async function deleteChat(chatId: number) {
  const response = await apiFetch(`/api/chats/${chatId}`, {
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

export async function duplicateChat(chatId: number) {
  const response = await apiFetch(`/api/chats/${chatId}/duplicate`, {
    method: "POST",
  });

  if (!response.ok) {
    return {
      success: false as const,
      status: response.status,
    };
  }

  const data = (await response.json()) as Chat;

  return {
    success: true as const,
    data,
  };
}
