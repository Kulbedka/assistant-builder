"use client";

import { useRouter } from "next/navigation";
import Button from "./Button";
import { logoutUser } from "@/lib/api/auth";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();

    router.push("/login");
    router.refresh();
  }

  return (
    <Button type="button" onClick={handleLogout}>
      Выйти
    </Button>
  );
}
