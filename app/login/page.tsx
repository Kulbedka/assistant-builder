import AppHeader from "@/components/AppHeader";
import LoginForm from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    email?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen">
      <AppHeader />

      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <LoginForm error={params.error} email={params.email} />
      </div>
    </main>
  );
}