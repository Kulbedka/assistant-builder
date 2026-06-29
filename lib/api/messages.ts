import { apiFetch } from "./client";

export type CreateMessageInput = {
  assistantId: number;
  chatId?: number;
  role: "user" | "assistant";
  text: string;
};

export type Message = {
  id: number;
  assistantId: number;
  chatId?: number | null;
  role: string;
  text: string;
  createdAt?: string;
};

export async function createMessage(input: CreateMessageInput) {
  const response = await apiFetch("/api/messages", {
    method: "POST",
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    return {
      success: false as const,
      status: response.status,
    };
  }

  const data = (await response.json()) as Message;

  return {
    success: true as const,
    data,
  };
}
