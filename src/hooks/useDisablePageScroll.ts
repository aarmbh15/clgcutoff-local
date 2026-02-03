"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

import { useAppStateStore } from "./appStateStore"

export function useDisablePageScroll(dependencies: boolean[]) {
  const { appState, setAppState } = useAppStateStore((state) => state)
  const pathname = usePathname()

  const prevOverflowState = useRef(appState?.overFlowYHidden)

  useEffect(() => {
    const shouldHideOverflow = dependencies.some(Boolean)

    if (prevOverflowState.current !== shouldHideOverflow) {
      setAppState({
        overFlowYHidden: shouldHideOverflow,
      })

      prevOverflowState.current = shouldHideOverflow
    }
  }, [dependencies])

  useEffect(() => {
    if (appState?.overFlowYHidden) {
      setAppState({
        overFlowYHidden: false,
      })

      prevOverflowState.current = false
    }
  }, [pathname])
}
