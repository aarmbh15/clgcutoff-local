"use client"

import { ReactNode } from "react"

import { useAppStateStore } from "./appStateStore"

export function useAppState() {
  const appState = useAppStateStore((state) => state.appState)
  const setAppState = useAppStateStore((state) => state.setAppState)

  const showToast = (type: "success" | "error", msg: ReactNode) => {
    setAppState({
      toast: {
        showToast: true,
        toastType: type,
        toastMsg: msg,
      },
    })
  }

  const removeToast = () => {
    setTimeout(() => {
      setAppState({
        toast: {
          ...appState.toast,
          showToast: false,
        },
      })
    }, 100)
  }

  return {
    appState,
    setAppState,
    showToast,
    removeToast,
  }
}
