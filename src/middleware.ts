import { type NextRequest, NextResponse } from "next/server"

import { getAdminSession } from "./lib/supabase"

export async function middleware(request: NextRequest) {
  const admin = await getAdminSession(request)

  const { pathname } = request.nextUrl

  if (pathname.startsWith("/admin/") && !admin) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  if (admin && pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}
