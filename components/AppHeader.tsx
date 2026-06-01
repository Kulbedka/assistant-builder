import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-300/50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex w-fit items-center gap-3 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white shadow-sm shadow-teal-900/20">
            AB
          </span>
          <div>
            <p className="text-base font-semibold leading-none text-slate-950">
              Assistant Builder
            </p>
            <p className="mt-1 text-sm text-slate-500">AI workspace</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Dashboard
          </Link>

          <Link
            href="/assistants/new"
            className="inline-flex min-h-10 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-teal-900/10 transition hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            New assistant
          </Link>

          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}