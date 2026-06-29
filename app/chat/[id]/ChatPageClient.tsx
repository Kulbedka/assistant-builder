"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import AuthGuard from "@/components/AuthGuard";
import ChatWindow from "@/components/ChatWindow";
import {
  getAssistantById,
  type Assistant as ApiAssistant,
} from "@/lib/api/assistants";

type AssistantMessage = {
  id: number;
  role: string;
  text: string;
  createdAt: string;
  assistantId: number;
};

type Assistant = ApiAssistant & {
  messages?: AssistantMessage[];
};

type ChatPageClientProps = {
  assistantId: number;
};

export default function ChatPageClient({ assistantId }: ChatPageClientProps) {
  const router = useRouter();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadAssistant() {
      if (!Number.isInteger(assistantId) || assistantId <= 0) {
        setErrorMessage("Некорректный ID ассистента");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getAssistantById(assistantId);

        if (!result.success) {
          if (result.status === 404) {
            setErrorMessage("Ассистент не найден");
            return;
          }

          if (result.status === 401) {
            router.replace("/login");
            return;
          }

          setErrorMessage("Не удалось загрузить ассистента");
          return;
        }

        setAssistant(result.data);
      } catch {
        setErrorMessage("Ошибка соединения с сервером");
      } finally {
        setIsLoading(false);
      }
    }

    loadAssistant();
  }, [assistantId, router]);

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
            <ChatWindow
              assistantId={assistant.id}
              assistantName={assistant.name}
              assistantInstruction={assistant.instruction}
              initialMessages={(assistant.messages ?? []).map((message) => ({
                role: message.role === "assistant" ? "assistant" : "user",
                text: message.text,
              }))}
            />
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
