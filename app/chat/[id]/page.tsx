import AppHeader from "@/components/AppHeader";
import AuthGuard from "@/components/AuthGuard";
import ChatWindow from "@/components/ChatWindow";
import { notFound } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://185-117-116-100.sslip.io"
    : "http://localhost:4000");

type ChatPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type AssistantMessage = {
  id: number;
  role: string;
  text: string;
  createdAt: string;
  assistantId: number;
};

type Assistant = {
  id: number;
  name: string;
  instruction: string;
  messages: AssistantMessage[];
};

export default async function ChatPage({ params }: ChatPageProps) {

  const { id } = await params;

  const assistantId = Number(id);

  if (!Number.isInteger(assistantId) || assistantId <= 0) {
    notFound();
  }

  const response = await fetch(`${API_URL}/api/assistants/${assistantId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Failed to load assistant");
  }

  const assistant: Assistant = await response.json();

  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}