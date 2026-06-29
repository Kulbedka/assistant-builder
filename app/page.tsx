"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import AppHeader from "@/components/AppHeader";
import AssistantCard from "@/components/AssistantCard";
import {
  deleteAssistant,
  getAssistants,
  type Assistant,
} from "@/lib/api/assistants";

export default function HomePage() {
  const router = useRouter();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAssistants() {
      try {
        const result = await getAssistants();

        if (!result.success) {
          if (result.status === 401) {
            router.replace("/login");
            return;
          }

          setError("Не удалось загрузить ассистентов");
          return;
        }

        setAssistants(result.data);
      } catch {
        setError("Не удалось загрузить ассистентов");
      } finally {
        setIsLoading(false);
      }
    }

    loadAssistants();
  }, [router]);

  async function handleDeleteAssistant(id: number) {
    const shouldDelete = window.confirm("Удалить ассистента?");

    if (!shouldDelete) {
      return;
    }

    setError("");

    try {
      const result = await deleteAssistant(id);

      if (!result.success) {
        if (result.status === 401) {
          router.replace("/login");
          return;
        }

        setError("Не удалось удалить ассистента");
        return;
      }

      setAssistants((currentAssistants) =>
        currentAssistants.filter((assistant) => assistant.id !== id),
      );
    } catch {
      setError("Не удалось удалить ассистента");
    }
  }

  return (
    <AuthGuard>
      <main className="min-h-screen">
        <AppHeader />

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md shadow-slate-300/45">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_320px] lg:p-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Dashboard
                </p>

                <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  Управляй своими AI-ассистентами
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Создавай ассистентов с разными ролями, открывай чат и храни
                  историю сообщений в одном рабочем пространстве.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/assistants/new"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 transition hover:bg-teal-700"
                  >
                    Создать ассистента
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200 bg-[#f7f9fa] p-5 shadow-sm shadow-slate-300/30">
                  <p className="text-4xl font-bold tracking-tight text-slate-950">
                    {assistants.length}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    ассистентов в базе
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Мои ассистенты
            </h2>

            {isLoading && (
              <p className="mt-4 text-sm text-slate-500">
                Загрузка ассистентов...
              </p>
            )}

            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}

            {!isLoading && !error && assistants.length === 0 && (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-md shadow-slate-300/35">
                <h3 className="text-lg font-semibold text-slate-950">
                  Ассистентов пока нет
                </h3>

                <Link
                  href="/assistants/new"
                  className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Создать ассистента
                </Link>
              </div>
            )}

            {!isLoading && !error && assistants.length > 0 && (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {assistants.map((assistant) => (
                  <AssistantCard
                    key={assistant.id}
                    id={assistant.id}
                    title={assistant.name}
                    description={assistant.instruction}
                    onDelete={handleDeleteAssistant}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}
