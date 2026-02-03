"use client"

import { ChevronUp, ChevronsUp } from "lucide-react"
import { useEffect, useState } from "react"

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 100)
    }
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-[95px] pc:bottom-[120px] right-6 z-50 rounded-full bg-[#EAEBFF] text-white shadow-lg transition-all duration-300 size-14 pc:size-16 grid place-items-center ${
        visible ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"
      }`}
    >
      <div className="flex items-center flex-col gap-1">
        <ChevronsUp color="#3F53D8" size={20} />
        <p className="text-gray-900 text-xs">TOP</p>
      </div>
    </button>
  )
}

