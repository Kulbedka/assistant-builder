"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api/auth";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        setIsAllowed(true);
      } catch {
        router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    }

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm font-medium text-slate-500 sm:px-6 lg:px-8">
          Проверяем авторизацию...
        </div>
      </main>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}
