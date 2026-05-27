import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import Button from "@/components/Button";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function createAssistant(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const instruction = String(formData.get("instruction") || "").trim();

  if (!name || !instruction) {
    throw new Error("Name and instruction are required");
  }

  const response = await fetch(`${API_URL}/api/assistants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      instruction,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create assistant");
  }

  redirect("/");
}

export default function NewAssistantPage() {
  return (
    <main className="min-h-screen">
      <AppHeader />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            New assistant
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Создать ассистента
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Задай имя и инструкцию. После сохранения ассистент появится на
            главной странице и будет доступен для чата.
          </p>
        </div>

        <form
          action={createAssistant}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-md shadow-slate-300/45 sm:p-8"
        >
          <div className="grid gap-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Имя ассистента
              </span>
              <input
                name="name"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
                type="text"
                placeholder="Например: Fitness Coach"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Инструкция
              </span>
              <textarea
                name="instruction"
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
                placeholder="Например: Помогай мне составлять тренировки"
                rows={7}
                required
              />
            </label>
          </div>

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/"
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-300/40 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              Отмена
            </Link>
            <Button type="submit">Сохранить ассистента</Button>
          </div>
        </form>
      </div>
    </main>
  );
}