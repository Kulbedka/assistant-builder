"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { createMessage } from "@/lib/api/messages";

type ChatWindowProps = {
  assistantId: number;
  assistantName?: string;
  assistantInstruction?: string;
  initialMessages?: ChatMessage[];
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

const suggestions = [
  "Объясни эту тему простыми словами",
  "Помоги написать код",
  "Составь план действий",
];

export default function ChatWindow({
  assistantId,
  assistantName = "Ассистент",
  assistantInstruction = "Пока инструкции нет.",
  initialMessages = [],
}: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  async function handleSendMessage() {
    const text = message.trim();

    if (text === "") {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      text,
    };

    const assistantMessage: ChatMessage = {
      role: "assistant",
      text: `Я получил твое сообщение. Моя инструкция: ${assistantInstruction}`,
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      assistantMessage,
    ]);

    setMessage("");

    await createMessage({
      assistantId,
      role: userMessage.role,
      text: userMessage.text,
    });

    await createMessage({
      assistantId,
      role: assistantMessage.role,
      text: assistantMessage.text,
    });
  }

  return (
    <section className="grid min-h-[calc(100vh-132px)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-300/35 lg:flex lg:flex-col">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-sm font-bold text-teal-700">
            {assistantName.trim().charAt(0).toUpperCase() || "A"}
          </div>

          <div>
            <p className="font-semibold text-slate-950">{assistantName}</p>
            <p className="text-sm text-slate-500">AI assistant</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-[#f7f9fa] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
            Инструкция
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {assistantInstruction}
          </p>
        </div>

        <div className="mt-auto space-y-3 pt-6">
          <a
            className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
            href="/"
          >
            Назад к ассистентам
          </a>

          <p className="text-xs leading-5 text-slate-500">
            Сообщения сохраняются через текущий API сообщений.
          </p>
        </div>
      </aside>

      <article className="flex min-h-[calc(100vh-132px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-300/35">
        <header className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-100 text-sm font-bold text-teal-700">
              {assistantName.trim().charAt(0).toUpperCase() || "A"}
            </div>

            <div>
              <h1 className="font-semibold text-slate-950">{assistantName}</h1>
              <p className="text-sm text-slate-500">Готов к диалогу</p>
            </div>
          </div>

          <div className="hidden rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 sm:block">
            {messages.length} сообщений
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#f7f9fa] px-4 py-6 sm:px-6">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[420px] items-center justify-center text-center">
              <div className="max-w-xl">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-lg font-bold text-teal-700 shadow-sm ring-1 ring-slate-200">
                  AI
                </div>

                <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
                  Начни новый диалог
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Напиши сообщение ниже. Ассистент ответит, а история будет
                  сохранена через текущий API сообщений.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {suggestions.map((item) => (
                    <button
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100"
                      key={item}
                      onClick={() => setMessage(item)}
                      type="button"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              {messages.map((item, index) => (
                <div
                  className={
                    item.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                  key={index}
                >
                  <div
                    className={
                      item.role === "user"
                        ? "max-w-[82%] rounded-3xl rounded-br-lg bg-teal-600 px-5 py-4 text-white shadow-sm shadow-teal-900/10"
                        : "max-w-[82%] rounded-3xl rounded-bl-lg border border-slate-200 bg-white px-5 py-4 text-slate-800 shadow-sm"
                    }
                  >
                    <p
                      className={
                        item.role === "user"
                          ? "text-xs font-semibold uppercase tracking-[0.12em] text-teal-50"
                          : "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
                      }
                    >
                      {item.role === "user" ? "Вы" : assistantName}
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="border-t border-slate-100 bg-white p-4 sm:p-5">
          <div className="mx-auto flex max-w-3xl gap-3">
            <textarea
              className="min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
              placeholder="Введите сообщение..."
              rows={1}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSendMessage();
                }
              }}
            />

            <Button
              className="h-12 shrink-0 px-5"
              disabled={message.trim() === ""}
              onClick={handleSendMessage}
              type="button"
            >
              Отправить
            </Button>
          </div>

          <p className="mx-auto mt-2 max-w-3xl text-xs text-slate-500">
            Enter — отправить, Shift + Enter — новая строка.
          </p>
        </footer>
      </article>
    </section>
  );
}
