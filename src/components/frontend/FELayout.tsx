"use client"

import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { paymentType } from "@/utils/static"
import { isExpired } from "@/utils/utils"
import Script from "next/script"
import { useEffect, useState } from "react"
import { Tooltip } from "react-tooltip"

import FloatingWhatsAppButton from "./FloatingWhatsAppButton"
import { Footer } from "./Footer"
import { Navbar } from "./Navbar"
import { ScrollToTopButton } from "./ScrollToTopButton"

export function FELayout({ children }: { children: React.ReactNode }) {
  const [isThemeLoaded, setIsThemeLoaded] = useState(false)

  const { fetchData } = useFetch()
  const { setAppState } = useAppState()

  async function getCurrentUser() {
    const [userRes, premiumPlansRes] = await Promise.all([
      fetchData({
        url: "/api/user",
        noToast: true,
        noLoading: true,
      }),
      fetchData({
        url: "/api/purchase",
        method: "GET",
        params: {
          paymentType: paymentType?.PREMIUM_PLAN,
        },
        noToast: true,
      }),
    ])

    if (userRes?.success) {
      setAppState({ user: userRes?.payload?.user })
    } else {
      setAppState({ user: null })
    }

    if (premiumPlansRes?.success) {
      const purchases = premiumPlansRes.payload.data

      const hasUGPurchased = purchases.some(
        (purchase: any) =>
          purchase.plans === "UG Package" && !isExpired(purchase.created_at, 6),
      )
      const hasPGPurchased = purchases.some(
        (purchase: any) =>
          purchase.plans === "PG Package" && !isExpired(purchase.created_at, 6),
      )

      const UGPurchased = purchases.find((pr: any) => pr.plans === "UG Package")
      const PGPurchased = purchases.find((pr: any) => pr.plans === "PG Package")

      setAppState({
        hasUGPackage: hasUGPurchased ?? false,
        hasPGPackage: hasPGPurchased ?? false,
        ugPackage: UGPurchased,
        pgPackage: PGPurchased,
      })
    }
  }

  useEffect(() => {
    setIsThemeLoaded(true)
    getCurrentUser()
  }, [])

  if (!isThemeLoaded) {
    return null
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Navbar />

      <div className="flex-grow">{children}</div>

      <FloatingWhatsAppButton />

      <Footer />

      <Tooltip id="tooltip" place="top" className="z-[1100]" />

      <ScrollToTopButton />
    </main>
  )
}

