import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { decrypt, deleteSession } from "@/app/_lib/session"

const protectedRoutes = [
  "/chat",
  "/automonitoramento",
  "/autogestao",
  "/biblioteca",
  "/rede-apoio",
  "/admin"
]
const publicRoutes = ["/", "/entrar", "/verificar"]

export default async function middleware(req: NextRequest) {
  const cookie = await cookies()
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  const session = decrypt(cookie.get("session")?.value)

  if (isProtectedRoute && !session?.token) {
    deleteSession()
    return NextResponse.redirect(new URL("/entrar", req.nextUrl))
  }

  if (isPublicRoute && session?.token) {
    if (session.role === "admin") {
      return NextResponse.redirect(new URL("/admin/testes", req.nextUrl))
    }

    return NextResponse.redirect(new URL("/chat", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)"]
}
