"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://185-117-116-100.sslip.io";

type LoginFormProps = {
  error?: string;
  email?: string;
};

export default function LoginForm({ error, email: initialEmail = "" }: LoginFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    setIsLoading(true);

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    setIsLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      if (data?.error === "Please verify your email before logging in") {
        router.push(`/login?error=verify&email=${encodeURIComponent(email)}`);
        return;
      }

      router.push(`/login?error=1&email=${encodeURIComponent(email)}`);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-400/20 sm:p-8"
    >
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          Login
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
          Вход в аккаунт
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Введи email и пароль, чтобы перейти к рабочему пространству.
        </p>
      </div>

      <div className="grid gap-4">
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Email</span>
          <input
            name="email"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
            type="email"
            placeholder="test-auth@example.com"
            defaultValue={initialEmail}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Пароль</span>
          <input
            name="password"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
            type="password"
            placeholder="Введите пароль"
            required
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
          {error === "verify"
            ? "Сначала подтверди email, потом войди."
            : "Неверный email или пароль."}
        </p>
      )}

      <Button className="mt-6 w-full" type="submit">
        {isLoading ? "Входим..." : "Войти"}
      </Button>

      <p className="mt-5 text-center text-sm text-slate-600">
        Нет аккаунта?{" "}
        <Link
          href="/register"
          className="font-semibold text-teal-700 hover:text-teal-800"
        >
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}