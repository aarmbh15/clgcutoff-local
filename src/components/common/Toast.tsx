"use client"

import { useAppState } from "@/hooks/useAppState"
import { cn } from "@/utils/utils"
import { AnimatePresence, motion } from "framer-motion"
import { CircleCheckBig, CircleX } from "lucide-react"
import { useEffect } from "react"

import { Portal } from "./Portal"

export function Toast() {
  const { appState, removeToast } = useAppState()

  const toastType = appState.toast.toastType

  useEffect(() => {
    if (appState.toast.showToast) {
      const timer = setTimeout(() => {
        removeToast()
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [appState.toast.showToast])

  return (
    <Portal>
      <AnimatePresence>
        {appState.toast.showToast && (
          <motion.div
            className={cn(
              `fixed right-11 z-[1200] border rounded-sm bg-white min-w-[316px] max-w-[350px] min-h-[76px] shadow-lg top-[90px] left-4 tab:left-auto`,
              toastType === "success" ? "border-[#13CE66]" : "border-[#FF0016]",
            )}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-[14px] px-6 py-5">
              {toastType === "success" ? (
                <CircleCheckBig color="#13CE66" size={40} />
              ) : (
                <CircleX color="#FF0016" size={40} />
              )}
              <div className="space-y-1">
                <h2
                  className={cn(
                    "text-base font-bold capitalize",
                    toastType === "success"
                      ? "text-[#13CE66]"
                      : "text-[#FF0016]",
                  )}
                >
                  {toastType}
                </h2>
                <div
                  className={cn(
                    "text-[#3B4856] text-xs",
                    typeof appState.toast.toastMsg === "string"
                      ? "line-clamp-2"
                      : "",
                  )}
                >
                  {appState.toast.toastMsg}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
