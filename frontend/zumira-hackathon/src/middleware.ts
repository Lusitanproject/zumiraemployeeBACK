import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt, deleteSession } from "@/app/_lib/session";

const protectedRoutes = ["/chat", "/autoconhecimento", "/autoconhecimento", "/biblioteca", "/rede-apoio", "/admin"];
const publicRoutes = ["/", "/entrar", "/verificar"];

export default async function middleware(req: NextRequest) {
  const cookie = await cookies();
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = path.includes("/admin");

  const session = decrypt(cookie.get("session")?.value);

  // Adicionar path aos headers para usar em server components/actions
  const res = NextResponse.next();
  res.headers.set("x-current-path", req.nextUrl.pathname);

  if (isProtectedRoute && !session?.token) {
    deleteSession();
    return NextResponse.redirect(new URL("/entrar", req.nextUrl));
  }

  if (isAdminRoute && session?.role !== "admin") {
    NextResponse.redirect(new URL("/404", req.nextUrl));
  }

  if (isPublicRoute && session?.token) {
    if (session.role === "admin") {
      return NextResponse.redirect(new URL("/admin/testes", req.nextUrl));
    }

    return NextResponse.redirect(new URL("/chat", req.nextUrl));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)"],
};
