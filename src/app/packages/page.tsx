"use client"

import { Button } from "@/components/common/Button"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { PaymentRedirectPopup } from "@/components/frontend/PaymentRedirectPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { paymentType } from "@/utils/static"
import { cn, isExpired, saveToLocalStorage } from "@/utils/utils"
import { addMonths, format, parseISO } from "date-fns"
import { motion } from "framer-motion"
import {
  BookOpenText,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Handshake,
  Hospital,
  Phone,
  Unlock,
} from "lucide-react"
import type React from "react"
import { ReactNode, useEffect, useState } from "react"

import { Tabs } from "./Tabs"

const tabMenu = [
  {
    id: "ug",
    name: "NEET UG",
  },
  {
    id: "pg",
    name: "NEET PG",
  },
]

type PackageFeature = {
  icon: React.ReactNode
  title: string
  description: ReactNode
}

type Package = {
  id: string
  name: string
  originalPrice: number
  discountedPrice: number
  validTill: string
  features: PackageFeature[]
  popular?: boolean
}

type SinglePurchasedPackage = {
  id: string
  created_at: string
  orderId: string
  amount: number
  payment_type: string
  phone: string
  college_cut_off_details: any | null
  college_predictor_details: any | null
  closing_rank_details: any | null
  plans: string
  isPurchased: boolean
}

type PurchasedPackage = {
  ug: SinglePurchasedPackage
  pg: SinglePurchasedPackage
}

const faqs = [
  {
    question: "What is included in the packages?",
    answer:
      "Our packages include various levels of counselling support, from basic information access to personalized guidance. Each package offers different features like priority support, premium content, advanced tools, and coverage of different counselling processes based on the tier you choose.",
  },
  {
    question: "How long is my package valid?",
    answer:
      "All packages are valid for 6 months from the date of purchase. This ensures you have access to our services throughout all counselling rounds and admission processes within this period.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "All purchases on our website are non-refundable. Please review the package details carefully before making a purchase. If you have any questions, contact our support team for clarification.",
  },
  {
    question: "How do I access the features after purchase?",
    answer:
      "You can access your features instantly after purchase—just revisit this page. For personalized counselling sessions, our team will contact you to schedule appointments.",
  },
]

function getDatePlusSixMonths(): string {
  const futureDate = addMonths(new Date(), 6)
  return format(futureDate, "dd, MMM, yyyy")
}

function getExpireDate(dateString: string): string {
  if (!dateString) {
    return "Loading..."
  }

  const parsedDate = parseISO(dateString)
  const futureDate = addMonths(parsedDate, 6)
  return format(futureDate, "dd, MMM, yyyy")
}

const packages: Package[] = [
  {
    id: "pro-ug",
    name: "Pro",
    originalPrice: 4499,
    discountedPrice: 3999,
    validTill: getDatePlusSixMonths(),
    popular: true,
    features: [
      {
        icon: <Phone className="h-5 w-5 text-yellow-600" />,
        title: " 1-on-1 Counselling (Call + Video Call)",
        description:
          "Priority Personal guidance via call and video call for MBBS admission under State, Management and NRI quotas.",
      },
      {
        icon: <Unlock className="h-5 w-5 text-yellow-600" />,
        title: "Access to All Paid Tools",
        description: (
          <ul className="list-disc pl-5">
            <li>College Predictor Tool</li>
            <li>
              Closing Rank Database with both NEET Rank & Marks Details
              (Round-wise/ Category-wise for State, Management and NRI Quota)
            </li>
          </ul>
        ),
      },
      {
        icon: <Handshake className="h-5 w-5 text-yellow-600" />,
        title: "NRI Quota Documentation Support",
        description:
          "Full assistance for NRI Eligibility, Embassy Docs, Affidavit formats, and Submission Guidance.",
      },
      {
        icon: <Hospital className="h-5 w-5 text-yellow-600" />,
        title: "Management/ Institutional Quota (IQ) Admission Support",
        description:
          "Strategic Support in Choosing Colleges, Understanding Fee Structures, and Maximizing Seat Chances Under Management/ Institutional Quota.",
      },
      {
        icon: <BookOpenText className="h-5 w-5 text-yellow-600" />,
        title: `Private & Deemed Medical Colleges Only – MBBS Course`,
        description:
          "Data & Prediction limited to Private and Deemed Medical Colleges.",
      },
    ],
  },
  {
    id: "pro-pg",
    name: "Pro",
    originalPrice: 4499,
    discountedPrice: 3999,
    validTill: getDatePlusSixMonths(),
    popular: true,
    features: [
      {
        icon: <Phone className="h-5 w-5 text-yellow-600" />,
        title: "Expert Video Call + Phone Counselling",
        description:
          "Speak to experienced counsellors for NEET PG Admission under State, Management and NRI quotas in MD/MS courses.",
      },
      {
        icon: <Unlock className="h-5 w-5 text-yellow-600" />,
        title: "Access to PG Tools",
        description: (
          <ul className="list-disc pl-5">
            <li>Medical PG College Predictor Tool</li>
            <li>
              Closing Rank Database with NEET PG Rank & Percentile Details
              (Specialization-wise, Category-Wise For State, Management and NRI
              Quota)
            </li>
          </ul>
        ),
      },
      {
        icon: <Handshake className="h-5 w-5 text-yellow-600" />,
        title: "NRI Quota Admission Support (PG Level)",
        description:
          "Guidance on PG-level NRI documentation, eligibility verification, and admission formalities.",
      },
      {
        icon: <Hospital className="h-5 w-5 text-yellow-600" />,
        title: "College Selection & Counselling Support",
        description:
          "Support for shortlisting PG Colleges Based on your Rank/ Percentile, Stream, and Preferred quota.",
      },
      {
        icon: <BookOpenText className="h-5 w-5 text-yellow-600" />,
        title: `Private & Deemed Medical Colleges Only – MD/MS`,
        description:
          "Focused on PG medical courses — MD/MS seats only in Private and Deemed institutions",
      },
    ],
  },
]

export default function PackagesPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const [activeTab, setActiveTab] = useState("ug")

  const [selectedPackage, setSelectedPackage] = useState(packages[0])
  const [loading, setLoading] = useState(false)

  const [amount, setAmount] = useState<number | null>(null)

  const { fetchData } = useFetch()
  const { showToast, appState, setAppState } = useAppState()

  useEffect(() => {
    getData()
  }, [activeTab])

  async function handleBuyNow() {
    setLoading(true)

    const user = await fetchData({
      url: "/api/user",
      method: "GET",
      noToast: true,
    })

    if (user?.success) {
      processPayment()
    } else {
      setAppState({ signInModalOpen: true })
    }
  }

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
    if (!amount) return

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
        description: `Payment for College Cutoff ${activeTab === "ug" ? "UG Package" : "PG Package"}`,
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

  async function successCallback(orderId: string) {
    showToast(
      "success",
      <p>
        Payment Successful
        <br />
        Thank You for purchasing!
      </p>,
    )

    const payload = {
      orderId,
      amount,
      payment_type: paymentType?.PREMIUM_PLAN,
      plans: activeTab === "ug" ? "UG Package" : "PG Package",
    }

    const res = await fetchData({
      url: "/api/purchase",
      method: "POST",
      data: payload,
    })

    if (res?.success) {
      const priceRes = await fetchData({
        url: "/api/payment",
        method: "POST",
        data: {
          [paymentType?.PREMIUM_PLAN]: amount,
        },
        noToast: true,
      })

      if (priceRes?.success) {
        setLoading(false)
        window.location.reload()
      }
    }
  }

  async function getData() {
    const priceRes = await fetchData({
      url: "/api/admin/configure_prices/get",
      params: {
        type: "Packages",
        item: activeTab === "ug" ? "UG Package" : "PG Package",
      },
    })

    if (priceRes?.success) {
      setAmount(Number(priceRes?.payload?.data?.price))
    }
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <FELayout>
      <div className="dark:bg-color-form-background">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-20 blur-3xl -z-10"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-200 to-emerald-400 opacity-20 blur-3xl -z-10"></div>

          <Container className="px-4">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200 mb-4">
                NEET UG 2025
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-color-table-header">
                Premium Counselling Packages
              </h1>
              <p className="text-gray-600 md:text-lg mb-8 max-w-2xl">
                Choose the right package for your NEET counselling needs and
                secure admission in your dream medical college with expert
                guidance
              </p>
            </div>
          </Container>
        </section>

        {/* Special Offer Banner */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-3 text-center text-white">
          <Container className="px-4">
            <p className="font-medium">
              Special Offer - Flat ₹500 Off on all packages!
            </p>
          </Container>
        </div>

        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabMenu={tabMenu}
          setSelectedPackage={setSelectedPackage}
          packages={packages}
        />

        {/* Packages Section */}
        <section className="w-full py-16 md:py-24 bg-white dark:bg-color-modal-background">
          <Container className="px-4">
            <div className="max-w-xl mx-auto">
              <motion.div
                key={selectedPackage.id}
                className={`relative rounded-2xl overflow-hidden border border-yellow-300 shadow-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-yellow-100`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {selectedPackage.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                <div className={`p-6`}>
                  <h3 className="text-2xl font-bold mb-1 text-black">
                    {selectedPackage.name}
                  </h3>
                  <div className="mb-6">
                    <span
                      className={cn(
                        "text-gray-500 text-lg",
                        amount && "line-through",
                      )}
                    >
                      {amount ? `₹${amount + 500}` : "Loading..."}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-yellow-600">
                        {amount ? `₹${amount}` : "Loading..."}
                      </span>
                      <span className="text-gray-600 text-sm">
                        (GST included.)
                      </span>
                    </div>

                    {activeTab === "ug" && !appState?.hasUGPackage && (
                      <p className="text-sm text-gray-500 mt-1">
                        Valid till {selectedPackage.validTill} (6 Months.)
                      </p>
                    )}
                    {activeTab === "pg" && !appState?.hasPGPackage && (
                      <p className="text-sm text-gray-500 mt-1">
                        Valid till {selectedPackage.validTill} (6 Months.)
                      </p>
                    )}
                  </div>
                  <Button
                    className={`w-full py-4 h-auto text-base bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium shadow-md disabled:from-gray-400 disabled:to-gray-400 disabled:opacity-60 disabled:text-white`}
                    onClick={handleBuyNow}
                    disabled={
                      loading || activeTab === "ug"
                        ? appState?.hasUGPackage
                        : appState?.hasPGPackage
                    }
                  >
                    {loading ? (
                      "Loading..."
                    ) : activeTab === "ug" ? (
                      appState?.hasUGPackage ? (
                        <div>
                          <p>Already Purchased</p>
                          <p>
                            Valid Till:
                            {getExpireDate(appState?.ugPackage.created_at)}
                          </p>
                        </div>
                      ) : (
                        "Purchase Now"
                      )
                    ) : appState?.hasPGPackage ? (
                      <div>
                        <p>Already Purchased</p>
                        <p>
                          Valid Till:{" "}
                          {getExpireDate(appState?.pgPackage?.created_at)}
                        </p>
                      </div>
                    ) : (
                      "Purchase Now"
                    )}
                  </Button>
                </div>
                <div className="p-6 border-t border-gray-200 pb-8 bg-white">
                  <h4 className="font-bold mb-4 text-black">Key Features</h4>
                  <ul className="space-y-4">
                    {selectedPackage.features.map((feature, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                          {feature.icon}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {feature.title}
                          </h5>
                          <p className="text-sm text-gray-600 mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Why Choose Our Packages */}
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-color-form-background">
          <Container className="px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Why Choose Our Packages
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our packages are designed to provide comprehensive support
                throughout your NEET counselling journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">
                  Expert Guidance
                </h3>
                <p className="text-gray-600">
                  Get personalized support from experienced counsellors to
                  navigate NEET counselling and admission processes confidently.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">
                  Accurate & Timely Information
                </h3>
                <p className="text-gray-600">
                  Access verified, up-to-date information and real-time updates
                  on colleges, cutoffs, and counselling schedules.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-black">
                  Strategic Approach
                </h3>
                <p className="text-gray-600">
                  Learn proven strategies for choice filling and seat selection
                  to maximize your chances of securing your dream college.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-16 md:py-24 bg-white dark:bg-color-background">
          <Container className="px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions about our counselling packages
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 py-5">
                  <button
                    className="flex justify-between items-center w-full text-left"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="text-lg font-medium text-color-text">
                      {faq.question}
                    </h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  <div
                    className={`mt-2 text-gray-600 transition-all duration-300 overflow-hidden ${
                      expandedFaq === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <p className="pb-4">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </div>

      <SignInPopup
        successCallback={() => {
          window.scrollTo({ top: 0, behavior: "smooth" })
          window.location.reload()
        }}
        onClose={() => {
          setLoading(false)
        }}
      />

      <PaymentRedirectPopup successCallback={successCallback} />
    </FELayout>
  )
}

