import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://185-117-116-100.sslip.io";

async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return null;
  }

  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return data.user;
}

export default async function AppHeader() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-300/50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="flex w-fit items-center gap-3 rounded-xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-sm font-bold text-white">
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
          {user ? (
            <>
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Dashboard
              </Link>

              <Link
                href="/assistants/new"
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                New assistant
              </Link>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="inline-flex min-h-10 items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}