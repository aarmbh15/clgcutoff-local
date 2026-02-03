"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { useAppState } from "./useAppState"

export function useLink(noLoading?: boolean) {
  const router = useRouter()
  const { setAppState } = useAppState()

  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!noLoading) {
      timeout = setTimeout(() => {
        setAppState({ pageLoader: false })
      }, 200)
    }

    return () => {
      if (!noLoading) clearTimeout(timeout)
    }
  }, [pathname, searchParams])

  return (
    link: string,
    params?: Record<string, string>,
    options?: Parameters<typeof router.push>[1],
  ) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : ""

    if (!noLoading) setAppState({ pageLoader: true })

    router.push(`${link}${queryString}`, options)
  }
}
