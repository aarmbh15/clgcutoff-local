"use client"

import { Button } from "@/components/common/Button"
import { useAppState } from "@/hooks/useAppState"
import { cn, getLocalStorageItem, saveToLocalStorage } from "@/utils/utils"
import { ArrowRight, CircleCheckBig, Shield } from "lucide-react"
import React, { ReactNode, useState } from "react"
import { isMobile } from "react-device-detect"

interface IPaymentCardProps {
  whatWillYouGet: ReactNode
  amount: number
  title: ReactNode
  paymentDescription: string
  btnText: string|ReactNode
  onConfirm?: () => void
}

function PaymentCard({
  whatWillYouGet,
  amount,
  title,
  paymentDescription,
  btnText,
  onConfirm,
}: IPaymentCardProps) {
  const [loading, setLoading] = useState(false)

  const { showToast } = useAppState()

  const { setAppState } = useAppState()

  const createOrder = async () => {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error("Failed to create order")
    return data.orderId
  }

  const processPayment = async () => {
    onConfirm?.()
    setLoading(true)
    try {
      const orderId = await createOrder()

      saveToLocalStorage("orderId", orderId)

      setAppState({ paymentRedirectPopupOpen: true })

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "College Cutoff",
        description: paymentDescription,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyResponse.json()

            if (!verifyData.isOk) {
              showToast("error", "Payment verification failed!")
            }
          } catch (error) {
            console.error("Verification error:", error)
            showToast("error", "Payment verification failed!")
          }
        },
        theme: {
          color: "#E67817",
        },
        method: {
          upi_intent: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        // Add callback for failed payments
        "payment.failed": function (response: any) {
          console.error("Payment failed:", response)
          showToast("error", `Payment failed: ${response.error.description}`)
        },

        modal: {
          ondismiss: () => {
            setAppState({ paymentRedirectPopupOpen: false })
          },
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.on("payment.failed", (response: any) => {
        showToast("error", `Payment failed: ${response.error.description}`)
      })
      paymentObject.open()
    } catch (error: any) {
      console.error("Payment error:", error)

      showToast(
        "error",
        <p>
          Internal Server Error <br /> Please try again.
        </p>,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full pc:max-w-[380px] max-w-[350px] overflow-hidden rounded-xl bg-[#fff] dark:bg-[#000] shadow-xl">
      <div className="bg-[#0054A4] p-5 text-white">
        <h1 className="text-center text-xl font-bold leading-tight text-white">
          {title}
        </h1>
      </div>

      <div
        className={cn("px-6 my-4", isMobile && "landscape:h-[240px] overflow-y-auto")}
      >
        <div className="mb-4 rounded-lg bg-[#b3b3b3]/40 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Amount to pay
              </p>
              <p className="text-3xl font-bold text-primary">₹{amount}</p>
            </div>
            <div className="rounded-full bg-primary/10 p-3">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="mb-4 space-y-1.5">
          <h3 className="font-medium text-[20px]">{`What You'll Get :`}</h3>
          {whatWillYouGet}
        </div>

        <Button
          className="w-full text-lg font-medium flex items-center justify-center uppercase"
          onClick={processPayment}
          disabled={loading}
        >
          <span className="mr-2">{loading ? "Processing..." : btnText}</span>
          <ArrowRight className="h-5 w-5" />
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Secured by <span className="font-bold">Razorpay</span>
        </p>
      </div>
    </div>
  )
}

export default PaymentCard

