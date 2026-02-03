"use client"

import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import useOutsideClick from "@/hooks/useOutsideClick"
import { cn } from "@/utils/utils"
import { Menu, UserRound } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Button } from "../common/Button"
import { Logo } from "../common/Logo"
import { Container } from "./Container"
import { ThemeSwitcher } from "./ThemeSwitcher"

export const navbarMenus = [
  {
    title: "COLLEGE PREDICTOR",
    href: "/",
  },
  {
    title: "CLOSING RANKS",
    href: "/closing-ranks",
  },
  // {
  //   title: "PACKAGES",
  //   href: "/packages",
  // },
  {
    title: "CONTACT US",
    href: "/contact-us",
  },
]

export function NavbarItem({
  href,
  title,
  className,
}: {
  href: string
  title: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-color-text hover:text-color-accent poppinsFont font-[600]",
        className,
      )}
    >
      {title}
    </Link>
  )
}

export function Navbar() {
  const { theme } = useTheme()

  const pathname = usePathname()
  const [isUser, setIsUser] = useState(false)

  const { appState, setAppState, showToast } = useAppState()
  const [mobSidebar, setMobSidebar] = useState(false)

  const [popOver, setPopOver] = useState(false)
  const ref = useRef(null)

  useOutsideClick(ref, () => setPopOver(false))
  const { fetchData } = useFetch()

  const router = useRouter()

  async function handleLogout() {
    const res = await fetchData({
      url: "/api/user/logout",
    })

    if (res?.success) {
      showToast("success", "Logged out successfully")
      router.replace("/")
    }
  }

  return (
    <Container className="flex-shrink-0 w-full">
      <div className="flex items-center justify-between h-[70px]">
        <div className="flex items-center tab:gap-16 gap-2 px-4">
          <Menu
            size={28}
            className="text-color-text pc:hidden"
            onClick={() => setMobSidebar(true)}
          />

          <Logo
            className="gap-2 tab:gap-3"
            textStyle="text-color-text font-semibold text-[14px] pc:text-[20px]"
            imgStyle="size-[42px] pc:size-[62px]"
          />
          <nav className="hidden pc:flex gap-8">
            {navbarMenus.map((item) => (
              <NavbarItem key={item.href} {...item} />
            ))}
          </nav>
        </div>

        <div className="pc:w-[400px] tab:w-[200px] w-[160px] h-[70px] flex items-center justify-between relative pc:px-8">
          <div
            className={cn(
              "absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-950 to-slate-800 skew-x-[-10deg] -z-10 hidden pc:block",
              theme === "dark" ? "opacity-0" : "opacity-100",
            )}
          ></div>
          <div
            className={cn(
              "translate-x-[70px] pc:translate-x-0",
              !appState?.user && "translate-x-[10px] pc:translate-x-0",
            )}
          >
            <ThemeSwitcher />
          </div>

          {appState?.user ? (
            <div
              className="bg-color-accent size-10 grid place-items-center rounded-full relative cursor-pointer"
              ref={ref}
              onClick={() => setPopOver((prev) => !prev)}
            >
              <UserRound className="text-white" />

              {popOver && (
                <div className="bg-color-form-background absolute top-0 right-0 w-[100px] mt-12 rounded-[4px] shadow-lg z-10 overflow-hidden">
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
            </div>
          ) : (
            <Button
              className="text-[10px] tab:text-sm pc:text-base py-2"
              onClick={() => {
                if (!pathname?.includes("admin")) {
                  setAppState({ signInModalOpen: true })
                }
              }}
            >
              {pathname?.includes("admin")
                ? "Admin Panel"
                : " Sign in / Sign up"}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}

      <div
        className={cn(
          "fixed w-full h-dvh bg-[rgba(0,0,0,0.5)] z-[9999] top-0 left-0 translate-x-[-100%] opacity-0 transition-all duration-500 ease-in-out",
          mobSidebar && "translate-x-0 opacity-100",
        )}
        onClick={() => setMobSidebar(false)}
      >
        <div className={cn("w-[240px] h-full bg-color-form-background py-6")}>
          <Logo textStyle="text-color-text" className="px-6" sidebar />
          <nav className="flex flex-col gap-2 mt-8">
            {navbarMenus.map((item) => (
              <NavbarItem
                key={item.href}
                {...item}
                className="hover:bg-color-accent hover:text-white p-2 px-6"
              />
            ))}
          </nav>
        </div>
      </div>
    </Container>
  )
}

