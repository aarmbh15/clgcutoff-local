import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { cookies, cookies as nextCookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// === USER CLIENT ===
export function createUserSupabaseClient() {
  const cookieStore = nextCookies()

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: "sb-user-auth-token",
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        },
      },
    },
  )
}

// === ADMIN CLIENT ===
export function createAdminSupabaseClientMiddleware(request: NextRequest) {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: "sb-admin-auth-token",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {
          // Do nothing in middleware — cannot set cookies here
        },
      },
    },
  )
}

// === ADMIN CLIENT ===
export function createAdminSupabaseClient() {
  const cookieStore = cookies() // from `next/headers`

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: "sb-admin-auth-token",
      },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    },
  )
}

// === GET USER SESSION ===
export async function getUserSession() {
  const supabase = createUserSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// === GET ADMIN SESSION ===
export async function getAdminSession(request: NextRequest) {
  const supabase = createAdminSupabaseClientMiddleware(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// === UPDATE USER SESSION ===
export function updateUserSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: "sb-user-auth-token",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  return supabaseResponse
}

// === UPDATE ADMIN SESSION ===
export function updateAdminSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: "sb-admin-auth-token",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  return supabaseResponse
}




