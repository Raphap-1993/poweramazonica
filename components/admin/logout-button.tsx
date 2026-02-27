"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onLogout() {
    setIsLoading(true);
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.push("/admin/login");
      router.refresh();
      setIsLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={onLogout} disabled={isLoading}>
      {isLoading ? "Cerrando..." : "Cerrar sesión"}
    </Button>
  );
}
