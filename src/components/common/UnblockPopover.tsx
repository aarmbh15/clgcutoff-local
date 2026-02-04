"use client"

import { Button } from "@/components/common/Button"
import AnimatedPopup from "@/components/common/popups/AnimatedPopup"
import { useAppState } from "@/hooks/useAppState"
import { cn, saveToLocalStorage } from "@/utils/utils"
import { ArrowRight, CircleCheckBig } from "lucide-react"
import React, { ReactNode, useEffect, useState } from "react"
import { isMobile } from "react-device-detect"

interface IUnlockPopoverProps {
  isOpen: boolean
  // generic fallback title (used if specific tab titles are not provided)
  title?: ReactNode

  // optional tab-specific titles
  titleSingle?: ReactNode
  titleState?: ReactNode

  // generic fallback "what you'll get" content
  whatWillYouGet?: ReactNode

  // optional tab-specific "what you'll get" content (overrides default)
  whatWillYouGetSingle?: ReactNode
  whatWillYouGetState?: ReactNode

  btnText?: string | ReactNode
  paymentDescription?: string
  amount: number // price for single
  stateAmount?: number // price for state/all
  stateName?: string
  stateCode?: string
  collegeCount?: number
  onClose: () => void
  onConfirm?: (meta?: any) => void // called after successful verification (optional)
  onBuySingle?: () => void // parent hook to toggle payment UI / mark row as processing
  onBuyState?: () => void
  initialTab?: "single" | "state"
  courseType?: string | null
  course?: string | null
}

export function UnlockPopover({
  isOpen,
  titleSingle,
  titleState,
  paymentDescription = "Purchase to unlock",
  amount,
  stateAmount,
  stateName,
  collegeCount = 0,
  onConfirm,
  onClose,
  onBuySingle,
  onBuyState,
  initialTab = "single",
  courseType,
  course,
  stateCode,
}: IUnlockPopoverProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"single" | "state">(initialTab)
  const { showToast, setAppState } = useAppState()
// console.log("State Code; ",stateCode,stateName)
  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab, isOpen])

  // compute feature description for individual college (used as default single content)
  const getFeatureDescriptionSingle = () => {
    const type = courseType?.toUpperCase() ?? ""

    if (type.includes("UG")) {
      return `Access All Round's Category and Quota-wise ${course} Cut-off (Rank/Marks) Details (NEET UG 2025) for your Selected College.`
    } else if (type.includes("PG")) {
      return `Access All Rounds MD/MS/Diploma Cut-off Rank / Marks / Percentile Details (NEET PG ${
  ["all", "br", "ka"].includes(stateCode?.toLowerCase() ?? "")
    ? " 2025 & 2024"
    // : "2024"
    //commented above one and added new one
    : "2025 & 2024"
})- Specialization, Category & Quota Wise for Your Selected College.`
    } else if (type.includes("SS")) {
      return `Access All Round's Specialization Wise DM/MCH/DNBSS Cut-off Rank/Marks Details (NEET SS 2024) for Your Selected College or Hospital.`
    } else if (type.includes("MDS")) {
      return `Access All Round's MDS Cut-off Rank/Marks Details (NEET MDS 2025) – Specialization, Category and Quota Wise for Your Selected College.`
    } else if (type.includes("AIAPGET")) {
      return `Access All Round's Ayurveda PG Cut-off Rank/Marks Details (AIAPGET 2025) – Specialization, Category and Quota Wise for Your Selected College.`
    } else if (type.includes("DNB")) {
      return `Access All Round's DNB/ DNB-Diploma Cut-off Rank/Marks Details (NEET PG 2025) – Specialization, Category Wise for Your Selected Hospital or College.`
    } else {
      return `Access All Round's MD/MS/Diploma Cut-off Rank / Percentile Details (NEET PG 2024) – Specialization, Category & Quota Wise for Your Selected College.`
    }
  }

  // compute default content for state/all pack (mentions collegeCount/stateName)
  const getFeatureDescriptionState = () => {
    const type = courseType?.toUpperCase() ?? ""
    const isAllIndia = stateCode?.toLowerCase() === "all"
    const location = isAllIndia ? "MCC All India" : stateName
    const institution = isAllIndia
      ? "Government & Deemed"
      : "Government & Private"

    if (type.includes("UG")) {
      return `Access All Rounds of ${course} Cut-off (Rank/Marks) details (NEET UG 2025) for every college in ${location}, covering all categories and quotas across ${institution} institutions.`
    } else if (type.includes("PG")) {
      return `Access All Round's of MD/MS/Diploma Cut-off Rank / Marks / Percentile Details (NEET PG ${
  ["all", "br", "ka"].includes(stateCode?.toLowerCase() ?? "")
    ? " 2025 & 2024"
    // : "2024"
   : "2025 & 2024" 
}) for every college in ${stateName}, covering all specialization, category, and quota across Government & Private institutions.`
    } else if (type.includes("SS")) {
      return `Access All Round's Specialization Wise DM/MCH/DNBSS Cut-off Rank/Marks Details (NEET SS 2024) for Your Selected College or Hospital.`
    } else if (type.includes("MDS")) {
      return `Access All Round's MDS Cut-off Rank/Marks Details (NEET MDS 2025) – Specialization, Category and Quota Wise for Your Selected College.`
    } else if (type.includes("AIAPGET")) {
      return `Access All Round's Ayurveda PG Cut-off Rank/Marks Details (AIAPGET 2025) – Specialization, Category and Quota Wise for Your Selected College.`
    } else if (type.includes("DNB")) {
      return `Access All Round's of DNB/ DNB-Diploma Cut-off Rank/ Marks Details (NEET PG 2025) for every College and Hospital in All India, covering all specialization, category, and quota across Government & Private institutions.`
    } else {
      return `Access All Round's MD/MS/Diploma Cut-off Rank / Percentile Details (NEET PG 2024) – Specialization, Category & Quota Wise for Your Selected College.`
    }
  }

  // decide header title based on activeTab, falling back to provided props or the generic title
  const renderHeaderTitle = (): ReactNode => {
    if (activeTab === "single") {
      return (
        <h1 className="text-center text-xl font-bold leading-tight text-white md:py-6">
          {titleSingle ? titleSingle : "Please make payment to unlock"}
        </h1>
      )
    } else {
      return (
        <h1 className="text-center text-xl font-bold leading-tight text-white md:py-6">
          {titleState ? titleState : "Please make payment to unlock all"}
        </h1>
      )
    }
  }

  // decide "what you'll get" content based on activeTab
  const renderWhatYouGet = (): ReactNode => {
    if (activeTab === "single") {
      // if (whatWillYouGetSingle) return whatWillYouGetSingle
      // if (whatWillYouGet) return whatWillYouGet
      return (
        <ul className="space-y-3 text-gray-700">
          <li className="flex gap-2">
            <CircleCheckBig className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-[16px] leading-tight">
              {getFeatureDescriptionSingle()}
            </span>
          </li>
          <li className="flex gap-2">
            <CircleCheckBig className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-[16px] leading-tight">
              Data sourced from official counselling authorities
            </span>
          </li>
          <li className="flex gap-2">
            <CircleCheckBig className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-[16px] leading-tight">
              Instant Access after Payment!
            </span>
          </li>
        </ul>
      )
    } else {
      // if (whatWillYouGetState) return whatWillYouGetState
      // if (whatWillYouGet) return whatWillYouGet
      return (
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-2">
            <CircleCheckBig className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-[16px] leading-tight">
              {getFeatureDescriptionState()}
            </span>
          </li>
          <li className="flex gap-2">
            <CircleCheckBig className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-[16px] leading-tight">
              Data sourced from official counselling authorities
            </span>
          </li>
          <li className="flex gap-2">
            <CircleCheckBig className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-[16px] leading-tight">
              Instant Access after Payment!
            </span>
          </li>
        </ul>
      )
    }
  }

  const createOrder = async (paymentAmount: number) => {
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: paymentAmount }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error("Failed to create order")
    return data.orderId
  }

  const processPayment = async (paymentAmount: number) => {
    setLoading(true)
    try {
      const orderId = await createOrder(paymentAmount)
      saveToLocalStorage("orderId", orderId)
      setAppState({ paymentRedirectPopupOpen: true })

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentAmount * 100,
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
              return
            }

            // successful verification -> notify parent
            showToast("success", "Payment verified!")
          //  await onConfirm?.(verifyData)
           await onConfirm?.({ verifyData, activeTab }); 
            onClose()
          } catch (error) {
            console.error("Verification error:", error)
            showToast("error", "Payment verification failed!")
          }
        },
        theme: { color: "#E67817" },
        method: {
          upi_intent: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        modal: {
          ondismiss: () => setAppState({ paymentRedirectPopupOpen: false }),
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.on("payment.failed", (response: any) => {
        showToast(
          "error",
          `Payment failed: ${response?.error?.description || "Unknown"}`,
        )
      })
      paymentObject.open()
    } catch (error: unknown) {
      console.error("Payment error:", error)
      showToast("error", "Internal Server Error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (activeTab === "single") {
      onBuySingle?.()
      processPayment(amount)
    } else {
      onBuyState?.()
      processPayment(stateAmount ?? amount)
    }
  }

  return (
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      height="150px"
      popupClass="w-[340px] pc:w-[480px] md:w-[560px]"
      closeIconClass="text-white hover:text-white"
    >
      <div className="w-full max-w-[560px] overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header - now dynamic based on active tab */}
        <div className="bg-[#0054A4] p-4 text-white relative">
          {/* renderHeaderTitle returns a ReactNode already styled (or uses provided title props) */}
          <div>{renderHeaderTitle()}</div>
        </div>

        <div
          className={cn(
            "p-4",
            isMobile && "landscape:h-[240px] overflow-y-auto",
          )}
        >
          {/* Tabs header */}
          <div className="mb-4">
            <div className="flex gap-4 font-semibold items-center">
              <button
                type="button"
                onClick={() => setActiveTab("single")}
                className={`flex-1 p-2 text-[15px] rounded-lg transition ${
                  activeTab === "single"
                    ? "bg-[#0F63BF] text-white"
                    : "bg-white border border-blue-800 text-gray-700"
                }`}
              >
                <div className="font-semibold pt-1">CONTINUE WITH</div>
                <div className="mt-1 font-semibold">THIS COLLEGE</div>
                <div className="font-bold">₹{amount}</div>
              </button>

              <span className="text-gray-500 text-[16px] font-medium">or</span>

              <button
                type="button"
                onClick={() => setActiveTab("state")}
                className={`relative flex-1 p-2 rounded-lg text-[15px] transition ${
                  activeTab === "state"
                    ? "bg-[#0F63BF] text-white"
                    : "bg-white border border-blue-800 text-gray-700"
                }`}
                disabled={stateAmount == null}
              >
                    <p className="font-medium flex items-center justify-start gap-1">
                      <span className="absolute -top-2.5 right-2 text-xs bg-color-accent text-white px-2 py-0.5 rounded">
                       Special Offer
                      </span>
                    </p>
                 
                <div className="font-semibold pt-1">
                  BUY ALL {collegeCount}{" "}
                  {stateName?.toUpperCase()} COLLEGES IN ONE CLICK
                </div>
                {stateAmount != null && (
                     <p className={`text-xl font-bold ${activeTab === "state"?"text-white":"text-color-accent "}`}>
                      <strong> ₹{stateAmount} /-</strong>
                    </p>
                )}
              </button>
            </div>

            {/* Tab content description */}
            {/* <div className="mt-4">
              {activeTab === "single" ? (
                <p className="text-sm text-gray-600">Unlock data for a single college.</p>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">Unlock all {collegeCount} colleges in {stateName}.</p>
                </div>
              )}
            </div> */}
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* What you'll get */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 text-lg mb-3 text-left">
              What You&#39;ll Get :
            </h3>
            <div className="space-y-3 text-[20px] text-gray-700">
              {renderWhatYouGet()}
            </div>
          </div>

          <div className="border-t border-gray-200 my-4"></div>

          {/* Unlock CTA */}
          <div className="text-center flex items-center justify-center">
            <Button
              className="flex items-center justify-center text-lg font-medium  uppercase"
              // className="text-base font-semibold uppercase py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0 mx-auto"
              onClick={handleConfirm}
              disabled={
                loading || (activeTab === "state" && stateAmount == null)
              }
            >
              <span className="mr-2">
                {loading
                  ? "Processing..."
                  : `UNLOCK NOW @ ₹${activeTab === "single" ? amount : (stateAmount ?? amount)}`}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-3">
            Secured by <span className="font-semibold">Razorpay</span>
          </p>
        </div>
      </div>
    </AnimatedPopup>
  )
}

export default UnlockPopover
