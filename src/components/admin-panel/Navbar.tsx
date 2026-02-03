"use client"

import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import useOutsideClick from "@/hooks/useOutsideClick"
import { Menu } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

import { ThemeSwitcher } from "../frontend/ThemeSwitcher"

export function Navbar() {
  const [popOver, setPopOver] = useState(false)
  const ref = useRef(null)

  useOutsideClick(ref, () => setPopOver(false))
  const { fetchData } = useFetch()
  const { setAppState } = useAppState()

  const router = useRouter()

  async function handleLogout() {
    const res = await fetchData({
      url: "/api/admin/logout",
    })

    if (res?.success) {
      router.replace("/admin")
    }
  }

  return (
    <div className="flex items-center justify-between bg-color-accent-dark px-4 pc:px-8 py-3 fixed top-0 left-0 w-full z-[999]">
      <div className="flex items-center gap-4">
        <Menu
          size={28}
          className="text-white pc:hidden"
          onClick={() => {
            setAppState({
              isSidebarOpen: true,
            })
          }}
        />
        <h2 className="hidden tab:block tab:text-[18px] pc:text-[20px] text-white">
          College Predictor
        </h2>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <ThemeSwitcher className="text-white" />
        <button
          ref={ref}
          className="relative block"
          onClick={() => setPopOver((prev) => !prev)}
        >
          <Image
            className="rounded-full size-[40px]"
            src={"/Logo.png"}
            width={60}
            height={60}
            alt="admin-dp"
          />

          {popOver && (
            <div className="bg-color-form-background absolute top-0 right-0 w-[100px] mt-12 rounded-[4px] overflow-hidden shadow-lg">
              <button
                className="text-color-text py-2 hover:bg-color-accent w-full"
                onClick={()=>router.push("/profile")}
              >
                My Account
              </button>
              <button
                className="text-color-text py-2 hover:bg-color-accent w-full"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
