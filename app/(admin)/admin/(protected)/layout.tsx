import Link from "next/link";

import { LogoutButton } from "@/components/admin/logout-button";
import { Separator } from "@/components/ui/separator";
import { requireAuthenticatedAdminForPage } from "@/lib/auth/server";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/landing", label: "Landing" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/publishes", label: "Publicaciones" },
];

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAuthenticatedAdminForPage();

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-5 py-8 sm:px-8">
      <header className="space-y-4 rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Backoffice Power Amazónica</h1>
            <p className="text-sm text-muted-foreground">Sesión: {admin.user.email}</p>
          </div>
          <LogoutButton />
        </div>
        <Separator />
        <nav className="flex flex-wrap gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="py-6">{children}</main>
    </div>
  );
}
