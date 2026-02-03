"use client"

import { useLink } from "@/hooks/useLink"
import { cn } from "@/utils/utils"
import { usePathname, useSearchParams } from "next/navigation"
import React from "react"

export default function Link({
  href,
  children,
  className,
  params,
  options,
  onClick,
}: {
  href: string
  children: React.ReactNode
  className?: string
  params?: Record<string, string>
  options?: any
  onClick?: () => void
}) {
  const navigation = useLink()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  let currentURL = pathname

  if (searchParams.size > 0) {
    currentURL += `?${searchParams.toString()}`
  }

  return (
    <button
      type="button"
      className={cn("block", className)}
      onClick={() => {
        onClick?.()

        const queryString = params ? `?${new URLSearchParams(params)}` : ""

        const targetURL = href + queryString

        if (currentURL === targetURL) return

        navigation(href, params, options)
      }}
    >
      {children}
    </button>
  )
}
