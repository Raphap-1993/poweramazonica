import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/login", "/api/admin/login"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const hasSessionCookie = Boolean(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (hasSessionCookie) {
    return NextResponse.next();
  }

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
