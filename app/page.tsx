import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import AssistantCard from "@/components/AssistantCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const assistants = await prisma.assistant.findMany();

  return (
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
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Создать ассистента
                </Link>
                <Link
                  href="/login"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-300/40 transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Страница входа
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
              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 shadow-sm shadow-teal-900/5">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
                  Status
                </p>
                <p className="mt-3 text-2xl font-bold text-teal-900">Live</p>
                <p className="mt-2 text-sm leading-6 text-teal-800/80">
                  Данные загружаются через текущий Prisma/Supabase слой.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Мои ассистенты
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Выбери ассистента, чтобы продолжить диалог.
              </p>
            </div>
          </div>

          {assistants.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-md shadow-slate-300/35">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl font-bold text-teal-700">
                +
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">
                Ассистентов пока нет
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Создай первого ассистента, и он появится здесь после сохранения
                в базе данных.
              </p>
              <Link
                href="/assistants/new"
                className="mt-6 inline-flex min-h-10 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Создать ассистента
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {assistants.map((assistant) => (
                <AssistantCard
                  key={assistant.id}
                  id={assistant.id}
                  title={assistant.name}
                  description={assistant.instruction}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
