"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { HeaderConfig } from "@/lib/content/types";

type LandingHeaderProps = {
  header: HeaderConfig;
};

function isAnchor(href: string): boolean {
  return href.trim().startsWith("#");
}

export function LandingHeader({ header }: LandingHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleMenuClick(href: string) {
    if (isAnchor(href)) {
      setIsOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="text-base font-semibold tracking-tight text-emerald-900 sm:text-lg">
          {header.brandText}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Menú principal">
          {header.menu.map((item, index) => (
            <a
              key={`${item.label}-${index}`}
              href={item.href}
              className="text-sm font-medium text-zinc-700 transition hover:text-emerald-800"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="outline" className="border-emerald-200 text-emerald-900 hover:bg-emerald-50">
            <a href={header.secondaryCtaHref}>{header.secondaryCtaText}</a>
          </Button>
          <Button asChild className="bg-emerald-700 text-white hover:bg-emerald-800">
            <a href={header.primaryCtaHref} target="_blank" rel="noopener noreferrer">
              {header.primaryCtaText}
            </a>
          </Button>
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="border-emerald-200 text-emerald-900 hover:bg-emerald-50 lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {isOpen ? (
        <div className="border-t border-emerald-100 bg-white/95 px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-2" aria-label="Menú móvil">
            {header.menu.map((item, index) => (
              <a
                key={`${item.label}-mobile-${index}`}
                href={item.href}
                onClick={() => handleMenuClick(item.href)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-zinc-700 hover:bg-emerald-50 hover:text-emerald-900"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-900 hover:bg-emerald-50">
              <a href={header.secondaryCtaHref}>{header.secondaryCtaText}</a>
            </Button>
            <Button asChild className="w-full bg-emerald-700 text-white hover:bg-emerald-800">
              <a href={header.primaryCtaHref} target="_blank" rel="noopener noreferrer">
                {header.primaryCtaText}
              </a>
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
