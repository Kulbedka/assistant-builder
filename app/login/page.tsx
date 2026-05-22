import { scryptSync, timingSafeEqual } from "crypto";
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
    <main className="flex min-h-screen items-center justify-center">
      <form
        action={login}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-gray-700 p-6"
      >
        <h1 className="text-2xl font-bold">Страница входа</h1>

        <label className="flex flex-col gap-2">
          Email
          <input
            name="email"
            className="rounded border border-gray-400 px-2 py-1 text-black"
            type="email"
            placeholder="admin@test.com"
            defaultValue={params.email || ""}
          />
        </label>

        <label className="flex flex-col gap-2">
          Пароль
          <input
            name="password"
            className="rounded border border-gray-400 px-2 py-1 text-black"
            type="password"
            placeholder="123"
          />
        </label>

        {params.error && (
          <p className="text-sm text-red-500">Неверный email или пароль</p>
        )}

        <Button>Войти</Button>
      </form>
    </main>
  );
}