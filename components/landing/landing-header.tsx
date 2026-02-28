"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
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
  const logoUrl = header.logoUrl?.trim();

  function handleMenuClick(href: string) {
    if (isAnchor(href)) {
      setIsOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/92 shadow-[0_12px_30px_-24px_rgba(5,150,105,0.7)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-emerald-900 sm:text-lg">
          <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-transparent">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={header.brandText}
                fill
                sizes="48px"
                className="object-contain p-0.5"
              />
            ) : (
              <span className="rounded-md border border-zinc-200 bg-white px-1.5 py-1 text-xs font-bold text-emerald-800">
                {header.brandText.slice(0, 2).toUpperCase()}
              </span>
            )}
          </span>
          <span>{header.brandText}</span>
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
