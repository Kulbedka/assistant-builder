import { redirect } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://185-117-116-100.sslip.io";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    email?: string;
    error?: string;
    success?: string;
  }>;
};

async function verifyEmailCode(formData: FormData) {
  "use server";

  const email = String(formData.get("email") || "");
  const code = String(formData.get("code") || "");

  const response = await fetch(`${API_URL}/api/auth/verify-email-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
    }),
  });

  if (!response.ok) {
    redirect(`/verify-email?email=${encodeURIComponent(email)}&error=1`);
  }

  redirect(`/login?email=${encodeURIComponent(email)}`);
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;
  const email = params.email || "";

  return (
    <main className="min-h-screen bg-[#eef1f4] flex items-center justify-center px-4">
      <form
        action={verifyEmailCode}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-slate-200"
      >
        <h1 className="text-2xl font-bold text-slate-900">
          Подтверждение email
        </h1>

        <p className="mt-3 text-sm text-slate-600">
          Введи 6-значный код подтверждения для аккаунта.
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-semibold text-slate-800">Email</span>
          <input
            name="email"
            type="email"
            defaultValue={email}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
            placeholder="you@example.com"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-slate-800">
            Код подтверждения
          </span>
          <input
            name="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            required
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-950 shadow-sm transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-100"
            placeholder="123456"
          />
        </label>

        {params.error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
            Неверный код подтверждения.
          </p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-teal-600 px-4 py-3 font-medium text-white hover:bg-teal-700"
        >
          Подтвердить email
        </button>
      </form>
    </main>
  );
}