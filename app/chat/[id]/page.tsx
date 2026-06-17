import { notFound } from "next/navigation";
import ChatPageClient from "./ChatPageClient";

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

  return <ChatPageClient assistantId={assistantId} />;
}