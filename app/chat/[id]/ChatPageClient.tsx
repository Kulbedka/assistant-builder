"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import AuthGuard from "@/components/AuthGuard";
import Button from "@/components/Button";
import ChatWindow from "@/components/ChatWindow";
import {
  getAssistantById,
  type Assistant as ApiAssistant,
} from "@/lib/api/assistants";
import {
  createChat,
  deleteChat,
  duplicateChat,
  getChats,
  renameChat,
  type Chat,
} from "@/lib/api/chats";

type AssistantMessage = {
  id: number;
  role: string;
  text?: string;
  content?: string;
  createdAt: string;
  assistantId: number;
};

type Assistant = ApiAssistant & {
  messages?: AssistantMessage[];
};

type ChatPageClientProps = {
  assistantId: number;
};

function formatChatTitle(chat: Chat) {
  return chat.title?.trim() || `Чат #${chat.id}`;
}

export default function ChatPageClient({ assistantId }: ChatPageClientProps) {
  const router = useRouter();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [chatError, setChatError] = useState("");

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId) ?? null,
    [activeChatId, chats],
  );

  useEffect(() => {
    async function loadAssistantAndChats() {
      if (!Number.isInteger(assistantId) || assistantId <= 0) {
        setErrorMessage("Некорректный ID ассистента");
        setIsLoading(false);
        return;
      }

      try {
        const assistantResult = await getAssistantById(assistantId);

        if (!assistantResult.success) {
          if (assistantResult.status === 404) {
            setErrorMessage("Ассистент не найден");
            return;
          }

          if (assistantResult.status === 401) {
            router.replace("/login");
            return;
          }

          setErrorMessage("Не удалось загрузить ассистента");
          return;
        }

        const chatsResult = await getChats(assistantId);

        if (!chatsResult.success) {
          if (chatsResult.status === 401) {
            router.replace("/login");
            return;
          }

          setChatError("Не удалось загрузить список чатов");
        }

        const loadedChats = chatsResult.success ? chatsResult.data : [];

        setAssistant(assistantResult.data);
        setChats(loadedChats);
        setActiveChatId(loadedChats[0]?.id ?? null);
      } catch {
        setErrorMessage("Ошибка соединения с сервером");
      } finally {
        setIsLoading(false);
      }
    }

    loadAssistantAndChats();
  }, [assistantId, router]);

  async function handleCreateChat() {
    setChatError("");
    setIsCreatingChat(true);

    try {
      const result = await createChat(assistantId);

      if (!result.success) {
        if (result.status === 401) {
          router.replace("/login");
          return;
        }

        setChatError("Не удалось создать чат");
        return;
      }

      setChats((currentChats) => [result.data, ...currentChats]);
      setActiveChatId(result.data.id);
    } catch {
      setChatError("Ошибка соединения с сервером");
    } finally {
      setIsCreatingChat(false);
    }
  }

  async function handleRenameChat(chat: Chat) {
    const title = window.prompt("Новое название чата", formatChatTitle(chat));
    const normalizedTitle = title?.trim();

    if (!normalizedTitle) {
      return;
    }

    setChatError("");

    try {
      const result = await renameChat(chat.id, normalizedTitle);

      if (!result.success) {
        if (result.status === 401) {
          router.replace("/login");
          return;
        }

        setChatError("Не удалось переименовать чат");
        return;
      }

      setChats((currentChats) =>
        currentChats.map((currentChat) =>
          currentChat.id === chat.id ? result.data : currentChat,
        ),
      );
    } catch {
      setChatError("Ошибка соединения с сервером");
    }
  }

  async function handleDeleteChat(chat: Chat) {
    const shouldDelete = window.confirm(
      `Удалить чат “${formatChatTitle(chat)}”?`,
    );

    if (!shouldDelete) {
      return;
    }

    setChatError("");

    try {
      const result = await deleteChat(chat.id);

      if (!result.success) {
        if (result.status === 401) {
          router.replace("/login");
          return;
        }

        setChatError("Не удалось удалить чат");
        return;
      }

      setChats((currentChats) => {
        const nextChats = currentChats.filter(
          (currentChat) => currentChat.id !== chat.id,
        );

        if (activeChatId === chat.id) {
          setActiveChatId(nextChats[0]?.id ?? null);
        }

        return nextChats;
      });
    } catch {
      setChatError("Ошибка соединения с сервером");
    }
  }

  async function handleDuplicateChat(chat: Chat) {
    setChatError("");

    try {
      const result = await duplicateChat(chat.id);

      if (!result.success) {
        if (result.status === 401) {
          router.replace("/login");
          return;
        }

        setChatError("Не удалось дублировать чат");
        return;
      }

      setChats((currentChats) => [result.data, ...currentChats]);
      setActiveChatId(result.data.id);
    } catch {
      setChatError("Ошибка соединения с сервером");
    }
  }

  const initialMessages = (activeChat?.messages ?? assistant?.messages ?? []).map(
    (message) => ({
      role: message.role === "assistant" ? ("assistant" as const) : ("user" as const),
      text: message.text ?? message.content ?? "",
    }),
  );

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#eef1f4]">
        <AppHeader />

        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">Загружаем чат...</p>
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
              <h1 className="text-lg font-semibold text-slate-900">
                Чат не открылся
              </h1>
              <p className="mt-2 text-sm text-slate-600">{errorMessage}</p>
            </div>
          )}

          {!isLoading && assistant && (
            <div className="space-y-4">
              <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-300/35">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-950">
                      Чаты
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Выбери чат или создай новый для этого ассистента.
                    </p>
                  </div>

                  <Button
                    disabled={isCreatingChat}
                    onClick={handleCreateChat}
                    type="button"
                  >
                    {isCreatingChat ? "Создаем..." : "Новый чат"}
                  </Button>
                </div>

                {chatError && (
                  <p className="mt-3 text-sm font-medium text-red-600">
                    {chatError}
                  </p>
                )}

                {chats.length > 0 ? (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {chats.map((chat) => {
                      const isActive = chat.id === activeChatId;

                      return (
                        <div
                          className={
                            isActive
                              ? "min-w-56 rounded-2xl border border-teal-200 bg-teal-50 p-3 text-left text-sm font-semibold text-teal-800"
                              : "min-w-56 rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
                          }
                          key={chat.id}
                          onClick={() => setActiveChatId(chat.id)}
                          role="button"
                          tabIndex={0}
                        >
                          <span className="block truncate">
                            {formatChatTitle(chat)}
                          </span>
                          <span className="mt-3 flex flex-wrap gap-1">
                            <button
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:border-teal-200 hover:text-teal-700"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleRenameChat(chat);
                              }}
                              type="button"
                            >
                              Rename
                            </button>
                            <button
                              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:border-teal-200 hover:text-teal-700"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDuplicateChat(chat);
                              }}
                              type="button"
                            >
                              Duplicate
                            </button>
                            <button
                              className="rounded-lg border border-red-100 bg-white px-2 py-1 text-xs font-medium text-red-600 hover:border-red-200 hover:bg-red-50"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteChat(chat);
                              }}
                              type="button"
                            >
                              Delete
                            </button>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-[#f7f9fa] p-5 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      Чатов пока нет.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Создай первый чат, чтобы начать диалог.
                    </p>
                  </div>
                )}
              </section>

              {activeChat ? (
                <ChatWindow
                  assistantId={assistant.id}
                  chatId={activeChat.id}
                  assistantName={assistant.name}
                  assistantInstruction={assistant.instruction}
                  initialMessages={initialMessages}
                />
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm shadow-slate-300/35">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Создайте чат
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Нажмите “Новый чат”, чтобы начать общение с ассистентом.
                  </p>
                  <Button
                    className="mt-5"
                    disabled={isCreatingChat}
                    onClick={handleCreateChat}
                    type="button"
                  >
                    {isCreatingChat ? "Создаем..." : "Новый чат"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
