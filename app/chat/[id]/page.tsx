import ChatWindow from "@/components/ChatWindow";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type ChatPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  const assistantId = Number(id);

  if (!Number.isInteger(assistantId) || assistantId <= 0) {
    notFound();
  }

  const assistant = await prisma.assistant.findUnique({
  where: {
    id: assistantId,
  },
  include: {
    messages: {
      orderBy: {
        createdAt: "asc",
      },
    },
  },
  });

  if (!assistant) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">{assistant.name}</h1>

      <p className="mt-2 text-gray-400">{assistant.instruction}</p>

      <div className="mt-8">
        <ChatWindow
          assistantId={assistant.id}
          assistantName={assistant.name}
          assistantInstruction={assistant.instruction}
          initialMessages={assistant.messages.map((message) => ({
            role: message.role === "assistant" ? "assistant" : "user",
            text: message.text,
          }))}
        />
      </div>
    </main>
  );
}