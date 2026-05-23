import AppHeader from "@/components/AppHeader";
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
    <main className="min-h-screen bg-[#eef1f4]">
      <AppHeader />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
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