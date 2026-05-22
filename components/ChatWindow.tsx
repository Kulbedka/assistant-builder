"use client";

import { useState } from "react";
import Button from "@/components/Button";

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
    text: text,
  };

  const assistantMessage: ChatMessage = {
    role: "assistant",
    text: `Я получил твоё сообщение. Моя инструкция: ${assistantInstruction}`,
  };

  setMessages((prevMessages) => [
    ...prevMessages,
    userMessage,
    assistantMessage,
  ]);

  setMessage("");

  await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistantId: assistantId,
      role: userMessage.role,
      text: userMessage.text,
    }),
  });

  await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistantId: assistantId,
      role: assistantMessage.role,
      text: assistantMessage.text,
    }),
  });
}

  return (
    <section className="mt-8 rounded-xl border border-gray-700 p-6">
      <div>
        <p className="font-semibold">{assistantName}</p>
        <p className="mt-2 text-gray-400">Привет! Чем могу помочь?</p>
      </div>

      <div className="mt-6 space-y-2">
        {messages.length === 0 && (
          <p className="text-sm text-gray-500">Сообщений пока нет.</p>
        )}

        {messages.map((item, index) => (
          <div
            key={index}
            className={
              item.role === "user"
                ? "rounded-lg bg-gray-800 p-3"
                : "rounded-lg bg-gray-700 p-3"
            }
          >
            <p className="text-sm font-semibold">
              {item.role === "user" ? "Вы" : assistantName}
            </p>

            <p className="mt-1 text-gray-300">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <input
          className="flex-1 rounded border border-gray-400 px-3 py-2 text-black"
          placeholder="Введите сообщение..."
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSendMessage();
            }
          }}
        />

        <Button onClick={handleSendMessage}>Отправить</Button>
      </div>
    </section>
  );
}