import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { getAuthenticatedAdminFromServerCookies } from "@/lib/auth/server";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [admin, params] = await Promise.all([
    getAuthenticatedAdminFromServerCookies(),
    searchParams,
  ]);

  if (admin) {
    redirect("/admin");
  }

  const nextRaw = params.next;
  const nextPath = typeof nextRaw === "string" && nextRaw.startsWith("/") ? nextRaw : "/admin";

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-5 py-10">
      <LoginForm nextPath={nextPath} />
    </main>
  );
}
