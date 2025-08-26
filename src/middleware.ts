import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Permitir acceso libre a /register si NO hay token
  if (!token && pathname === "/register") {
    return NextResponse.next();
  }

  if (!token && pathname == "/api/auth/error") {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/principal", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/error", "/register"],
};
