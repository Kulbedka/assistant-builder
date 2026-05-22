import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function createAssistant(formData:FormData) {
"use server";
const name = formData.get("name") as string;
const instruction = formData.get("instruction") as string;

  await prisma.assistant.create({
      data:{
        name: name,
        instruction: instruction,
      },
    });

    redirect("/");

  }

export default function NewAssistantPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Создать ассистента</h1>

      <p className="mt-2 text-gray-400">
        Здесь ты сможешь добавить нового ИИ-ассистента.
      </p>

      <form action={createAssistant} className="mt-8 max-w-xl space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Имя ассистента
          </label>

          <input
            name="name"
            className="mt-1 w-full rounded border border-gray-400 px-3 py-2 text-black"
            type="text"
            placeholder="Например: Fitness Coach"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Инструкция
          </label>

          <textarea
            name="instruction"
            className="mt-1 w-full rounded border border-gray-400 px-3 py-2 text-black"
            placeholder="Например: Помогай мне составлять тренировки"
            rows={5}
          />
        </div>

        <button
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          type="submit"
        >
          Сохранить ассистента
        </button>
      </form>
    </main>
  );
}