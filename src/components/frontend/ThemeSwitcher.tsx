"use client"

import { cn } from "@/utils/utils"
import { MoonStar, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRef, useState } from "react"

import { Portal } from "../common/Portal"

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)

  function toggleThemeClicked() {
    if (btnRef.current) {
      const { x, y, width, height } = btnRef.current.getBoundingClientRect()
      // Calculate the center of the button
      setBubblePos({ x: x + width / 2, y: y + height / 2 })
    }
    setIsAnimating(true)
  }

  function handleAnimationEnd() {
    setIsAnimating(false)
    if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return (
    <div className="relative">
      <button ref={btnRef} type="button" onClick={toggleThemeClicked}>
        <div
          className={cn(
            "size-10 pc:hover:bg-white/20 transition-colors rounded-full grid place-items-center text-color-text pc:text-white",
            className,
          )}
        >
          {theme === "light" ? <Sun size={26} /> : <MoonStar size={26} />}
        </div>
      </button>

      {isAnimating && (
        <Portal>
          <div
            className={cn(
              "fixed rounded-full z-[1500] animate-bubble-expand",
              theme === "light" ? "bg-[#181818]" : "bg-[#e9e9e9]",
            )}
            style={{
              top: bubblePos.y,
              left: bubblePos.x,
              transform: "translate(-50%, -50%)",
            }}
            onAnimationEnd={handleAnimationEnd}
          ></div>
        </Portal>
      )}
    </div>
  )
}
