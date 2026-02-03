"use client"

import AnimatedPopup from "@/components/common/popups/AnimatedPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { cn, getLocalStorageItem, removeFromLocalStorage } from "@/utils/utils"
import React, { useEffect, useState } from "react"

const time = 600

export function PaymentRedirectPopup({
  successCallback,
}: {
  successCallback: (orderId: string) => void
}) {
  const { appState, setAppState, showToast } = useAppState()
  const { fetchData } = useFetch()
  const [secondsLeft, setSecondsLeft] = useState(time)

  useEffect(() => {
    if (!appState.paymentRedirectPopupOpen) return

    setSecondsLeft(time)
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onTimerExpired()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [appState.paymentRedirectPopupOpen])

  useEffect(() => {
    if (secondsLeft < time && secondsLeft % 20 === 0) {
      onEvery20Seconds()
    }
  }, [secondsLeft])

  function onTimerExpired() {
    showToast("error", "Timeout Expired pls try again")
    setAppState({ paymentRedirectPopupOpen: false })
    removeFromLocalStorage("orderId")
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  async function onEvery20Seconds() {
    const orderId = getLocalStorageItem<string>("orderId")
    if (!orderId) return

    const res = await fetchData({
      url: "/api/check-payment-status",
      params: {
        orderId,
      },
      noToast: true,
      noLoading: true,
    })

    if (res?.payload?.status === "captured") {
      setAppState({ paymentRedirectPopupOpen: false })
      successCallback(orderId)
      removeFromLocalStorage("orderId")
    }
  }

  return (
    <AnimatedPopup
      isOpen={appState.paymentRedirectPopupOpen}
      onClose={() => {
        setAppState({ paymentRedirectPopupOpen: false })
      }}
      height="fit-content"
      popupClass="w-[340px] pc:w-[500px]"
      closeIconClass="text-white hover:text-white tab:top-2 tab:right-2 pointer-events-none hidden"
    >
      <div className="bg-color-form-background rounded-lg overflow-hidden">
        <div className="bg-[#0054A4] py-3 px-4 text-white text-2xl pc:text-3xl font-semibold">
          Redirecting...
        </div>

        <div className={"loader w-fit mx-auto mt-4"}></div>

        <div className="text-center text-xl pc:text-2xl font-medium text-[#0054A4] pt-5">
          Please wait few minutes...
        </div>

        <div className="py-5 px-4 text-center text-lg pc:text-base text-gray-800 leading-relaxed">
          <p className="mb-2 font-bold text-lg">{`PLEASE DON'T PRESS BACK OR RELOAD THE PAGE.`}</p>
          <p className="text-lg">{`This will interrupt payment and cause financial loss.`}</p>
        </div>
      </div>
    </AnimatedPopup>
  )
}

