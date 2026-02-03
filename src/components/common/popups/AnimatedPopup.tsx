"use client"

import useWindowSize from "@/hooks/useWindowSize"
import { cn } from "@/utils/utils"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import React from "react"

import { Portal } from "../Portal"

interface IAnimatedPopupProps {
  children: React.ReactNode
  height: string
  isOpen: boolean
  popupClass?: string
  onClose?: () => void
  closeIconClass?: string
}

export default function AnimatedPopup({
  children,
  height,
  isOpen,
  popupClass,
  onClose,
  closeIconClass,
}: IAnimatedPopupProps) {
  const windowSize = useWindowSize()

  const animVariants = {
    hidden: {
      opacity: 0,
      y: windowSize.height,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      y: windowSize.height - extractNumber(height),
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.1,
      },
    },
  }

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 w-full z-[1100] grid place-items-center bg-[rgba(0,0,0,0.6)]"
            style={{ height: windowSize.height }}
          >
            <motion.div
              key="popup"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={animVariants}
              className={cn("relative", popupClass)}
            >
              {typeof onClose === "function" && (
                <X
                  className={cn(
                    "cursor-pointer absolute top-3 right-3 tab:top-5 tab:right-5 z-10",
                    closeIconClass,
                  )}
                  onClick={onClose}
                />
              )}

              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}

function extractNumber(value: string): number {
  const regex = /-?\d+(\.\d+)?/
  const match = regex.exec(value)
  if (match) {
    return parseFloat(match[0])
  }
  return 0
}
