"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useInternalSearchParams() {
  const router = useRouter()

  const getSearchParams = useCallback((key: string): string => {
    if (typeof window === "undefined") return ""
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(key) || ""
  }, [])

  const setSearchParams = useCallback(
    (key: string, value: string) => {
      if (typeof window === "undefined") return

      const searchParams = new URLSearchParams(window.location.search)

      if (value) {
        searchParams.set(key, value)
      } else {
        searchParams.delete(key)
      }

      const newUrl = `${window.location.pathname}?${searchParams.toString()}`
      router.push(newUrl)
    },
    [router],
  )

  return { getSearchParams, setSearchParams }
}
