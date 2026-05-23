import { scryptSync, timingSafeEqual } from "crypto";
import AppHeader from "@/components/AppHeader";
import Button from "@/components/Button";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    email?: string;
  }>;
};

function verifyPassword(password: string, storedPasswordHash: string) {
  const [salt, storedHash] = storedPasswordHash.split(":");

  const hash = scryptSync(password, salt, 64);

  const storedHashBuffer = Buffer.from(storedHash, "hex");

  return timingSafeEqual(hash, storedHashBuffer);
}

async function login(formData: FormData) {
  "use server";

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    redirect(`/login?error=1&email=${encodeURIComponent(email)}`);
  }

  const isPasswordCorrect = verifyPassword(password, user.passwordHash);

  if (!isPasswordCorrect) {
    redirect(`/login?error=1&email=${encodeURIComponent(email)}`);
  }

  const cookieStore = await cookies();

  cookieStore.set("isLoggedIn", "true", {
    httpOnly: true,
    path: "/",
  });

  redirect("/");
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen">
      <AppHeader />

      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <form
          action={login}
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
              <span className="text-sm font-semibold text-slate-800">
                Email
              </span>
              <input
                name="email"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
                type="email"
                placeholder="admin@test.com"
                defaultValue={params.email || ""}
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-800">
                Пароль
              </span>
              <input
                name="password"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
                type="password"
                placeholder="Введите пароль"
                required
              />
            </label>
          </div>

          {params.error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
              Неверный email или пароль.
            </p>
          )}

          <Button className="mt-6 w-full" type="submit">
            Войти
          </Button>
        </form>
      </div>
    </main>
  );
}
