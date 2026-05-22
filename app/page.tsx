import Link from "next/link";
import AssistantCard from "@/components/AssistantCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const assistants = await prisma.assistant.findMany();

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Assistant Builder</h1>

      <p className="mt-2 text-gray-400">
        Здесь будет список твоих ИИ-ассистентов.
      </p>

      <Link
        href="/assistants/new"
        className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Создать ассистента
      </Link>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold">Мои ассистенты</h2>

        <div className="mt-4 grid gap-4">
          {assistants.map((assistant) => (
            <AssistantCard
              key={assistant.id}
              id={assistant.id}
              title={assistant.name}
              description={assistant.instruction}
            />
          ))}
        </div>
      </section>
    </main>
  );
}