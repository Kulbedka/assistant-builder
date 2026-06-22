"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { getCurrentUser, type CurrentUser } from "@/lib/api/auth";

export default function AppHeader() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

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
          {isLoading ? null : user ? (
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
