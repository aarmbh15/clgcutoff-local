"use client"

import { Heading } from "@/components/admin-panel/Heading"
import { Button } from "@/components/common/Button"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const Page = () => {
      const { theme } = useTheme()
      // console.log("LTHeme",theme)
  const [closingRankData, setClosingRankData] = useState<any[]>([])
  const [collegeCutOffData, setCollegeCutOffData] = useState<any[]>([])
  const [collegePredictorData, setCollegePredictorData] = useState<any[]>([])
  const router = useRouter()
  const { fetchData } = useFetch()
  const { appState } = useAppState()

//   async function getCurrentUser() {
//     const [allPurchaseData] = await Promise.all([
//       fetchData({
//         url: "/api/purchase/all-purchase",
//         method: "GET",
//         noToast: true,
//       }),
//     ])

//     if (allPurchaseData?.success) {
//       const purchases = allPurchaseData?.payload?.data || []

//       const closingRank: any[] = []
//       const cutOff: any[] = []
//       const predictor: any[] = []

//       purchases.forEach((purchase: any) => {
//         if (purchase.closing_rank_details) {
//           closingRank.push({
//             ...purchase.closing_rank_details,
//             purchaseDate: purchase.created_at,
//             purchaseId: purchase.id,
//           })
//         }
//         if (purchase.college_cut_off_details) {
//           cutOff.push({
//             ...purchase.college_cut_off_details,
//             purchaseDate: purchase.created_at,
//             purchaseId: purchase.id,
//           })
//         }
//         if (purchase.college_predictor_details) {
//           //   console.log(purchase)
//           predictor.push({
//             ...purchase.college_predictor_details,
//             purchaseDate: purchase.created_at,
//             purchaseId: purchase.id,
//           })
//         }
//       })

//       setClosingRankData(closingRank)
//       setCollegeCutOffData(cutOff)
//       setCollegePredictorData(predictor)
//     } else {
//       setClosingRankData([])
//       setCollegeCutOffData([])
//       setCollegePredictorData([])
//     }
//   }

async function getCurrentUser() {
  const [allPurchaseData] = await Promise.all([
    fetchData({
      url: "/api/purchase/all-purchase",
      method: "GET",
      noToast: true,
    }),
  ])

  if (allPurchaseData?.success) {
    const purchases = allPurchaseData?.payload?.data || []

    const filterDate = new Date("2025-08-12")

    const validPurchases = purchases
      .filter((p: any) => new Date(p.created_at) >= filterDate)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const closingRank: any[] = []
    const cutOff: any[] = []
    const predictor: any[] = []

    validPurchases.forEach((purchase: any) => {
      if (purchase.closing_rank_details) {
        // console.log(purchase)
        closingRank.push({
          ...purchase.closing_rank_details,
          purchaseDate: purchase.created_at,
          purchaseId: purchase.id,
          amount: purchase?.amount,
          paymentType:purchase?.payment_type

        })
      }
      if (purchase.college_cut_off_details) {
        cutOff.push({
          ...purchase.college_cut_off_details,
          purchaseDate: purchase.created_at,
          purchaseId: purchase.id,
           amount: purchase?.amount,
            paymentType:purchase?.payment_type
        })
      }
      if (purchase.college_predictor_details) {
        predictor.push({
          ...purchase.college_predictor_details,
          purchaseDate: purchase.created_at,
          purchaseId: purchase.id,
           amount: purchase?.amount,
            paymentType:purchase?.payment_type
        })
      }
    })

    setClosingRankData(closingRank)
    setCollegeCutOffData(cutOff)
    setCollegePredictorData(predictor)
  } else {
    setClosingRankData([])
    setCollegeCutOffData([])
    setCollegePredictorData([])
  }
}


  function getExpiryDate(dateString: string) {
    const created = new Date(dateString)
    const expiryDate = new Date(created)
    expiryDate.setMonth(expiryDate.getMonth() + 6)

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      weekday: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(expiryDate)
  }

  function formatPurchaseDate(dateString: string) {
    const date = new Date(dateString)

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      weekday: "short",
      year: "numeric",
    //   hour: "numeric",
    //   minute: "2-digit",
    //   hour12: true,
    }).format(date)
  }

  useEffect(() => {
    if (appState?.user) getCurrentUser()
  }, [appState?.user])

  function isExpired(date: string) {
    const created = new Date(date)
    const expiryDate = new Date(created)
    expiryDate.setMonth(expiryDate.getMonth() + 6) // 6 months validity
    return new Date() > expiryDate
  }
  return (
    <FELayout>
      <div className="dark:bg-color-form-background text-black">
        <div className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
          <Container className="px-2 sm:px-4 min-h-[calc(100vh-70px)]">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 shadow-sm border border-yellow-200 mb-4">
                My Account
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8 text-color-table-header">
                Purchase History
              </h1>

              {appState?.user && (
                <div className="w-full space-y-8">
                  {/* Closing Rank Section */}
                  {closingRankData.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md sm:p-6 p-2">
                      <Heading className="text-2xl mb-6 text-center text-black">
                        Closing Rank Details
                      </Heading>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {closingRankData.map((item, index) => {
                          const expired = isExpired(item?.purchaseDate)
                          return (
                            <Link
                              key={item?.purchaseId}
                              // item?.paymentType==="SINGLE_COLLEGE_CLOSING_RANK"
                              href={item?.paymentType!=="SINGLE_COLLEGE_CLOSING_RANK"?`/closing-ranks/${item?.stateCode}?state=${item?.state}&courseType=${item?.courseType}&course=${item?.course||""}`:`/closing-ranks/${item?.stateCode}/college-details/?state=${item?.state}&instituteName=${item?.instituteName}&instituteType=${item?.instituteType}&courseType=${item?.courseType}&course=${item?.course}&fromAccount=${true}`}
                              className="block"
                            >
                              <div className="border rounded-lg sm:p-4 md:p-2 p-2 bg-gray-50 hover:shadow-lg transition ">
                                <div className="flex sm:items-center items-start justify-between mb-2 md:items-start">
                                  {item?.purchaseDate && (
                                    <p className="text-sm text-gray-500 flex items-start sm:items-center md:items-start md:flex-col flex-col sm:flex-row">
                                      <span>Purchase: </span>
                                      <span>
                                        {" "}
                                        {formatPurchaseDate(item?.purchaseDate)}
                                      </span>
                                    </p>
                                  )}
                                  <div className="flex justify-between items-center">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        expired
                                          ? "bg-red-100 text-red-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {expired ? "Expired" : "Active"}
                                    </span>
                                  </div>
                                </div>
                                    <p className="flex justify-between text-sm">
                                  <span className="font-medium">Amount:</span>
                                  <span>{item?.amount?`${item?.amount}.00 Rs`: "N/A"}</span>
                                </p>
                              { item?.paymentType==="SINGLE_COLLEGE_CLOSING_RANK"&&item?.course &&<p className="flex justify-between text-sm">
                                  <span className="font-medium">Course:</span>
                                  <span>{item?.course || "N/A"}</span>
                                </p>}
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">
                                    Course Type:
                                  </span>
                                  <span>{item?.courseType || "N/A"}</span>
                                </p>
                          {item?.paymentType==="SINGLE_COLLEGE_CLOSING_RANK"&&<><p className="flex justify-between text-sm">
                                  <span className="font-medium">
                                    Institute:
                                  </span>
                              
                                  <span className="truncate whitespace-nowrap overflow-hidden max-w-xs block">
  {item?.instituteName || "N/A"}
</span>
                                </p>
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">
                                    Institute Type:
                                  </span>
                                  <span>{item?.instituteType || "N/A"}</span>
                                </p></>}
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">State:</span>
                                  <span>{item?.state || "N/A"}</span>
                                </p>

                                <div className="mt-2 flex items-start sm:items-center justify-between border-t pt-2 md:flex-col">
                                  <p className="text-gray-500 md:mb-2 text-xs flex items-start flex-col sm:flex-row flex-nowrap text-nowrap">
                                    <span>Expires on:</span>
                                    <span>
                                      {getExpiryDate(item?.purchaseDate)}
                                    </span>
                                  </p>
                                  {!expired && (
                                    <Button
                                      onClick={() =>
                                        router.push(item?.paymentType!=="SINGLE_COLLEGE_CLOSING_RANK"?`/closing-ranks/${item?.stateCode}?state=${item?.state}&courseType=${item?.courseType}&course=${item?.course||""}`:`/closing-ranks/${item?.stateCode}/college-details/?state=${item?.state}&instituteName=${item?.instituteName}&instituteType=${item?.instituteType}&courseType=${item?.courseType}&course=${item?.course}&fromAccount=${true}`)
                                      }
                                      className="px-2 py-1"
                                    >
                                      show result
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  {/* College Cut Off Section */}
                  {collegeCutOffData.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md sm:p-6 p-2">
                      <Heading className="text-2xl mb-6 text-center text-black">
                        College Cut Off Details
                      </Heading>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collegeCutOffData.map((item, index) => {
                          const expired = isExpired(item?.purchaseDate)

                          return (
                            <Link
                              key={item?.purchaseId}
                              href={`/${item?.courseType.replaceAll(" ", "-").toLowerCase()}/cutoff?stateCode=${item?.stateCode}&college=${item?.instituteName}&state=${item?.state}&course=${item?.course||""}&fromAccount=${true}`}
                              className="block"
                            >
                              <div className="border rounded-lg sm:p-4 p-2 bg-gray-50 hover:shadow-lg transition space-y-2">
                              <div className="flex sm:items-center items-start justify-between mb-2 md:items-start">
                                  {item?.purchaseDate && (
                                    <p className="text-sm text-gray-500 flex items-start sm:items-center md:items-start md:flex-col flex-col sm:flex-row">
                                      <span>Purchase: </span>
                                      <span>
                                        {" "}
                                        {formatPurchaseDate(item?.purchaseDate)}
                                      </span>
                                    </p>
                                  )}
                                  <div className="flex justify-between items-center">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        expired
                                          ? "bg-red-100 text-red-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {expired ? "Expired" : "Active"}
                                    </span>
                                  </div>
                              </div>
                                     <p className="flex justify-between text-sm">
                                  <span className="font-medium">Amount:</span>
                                  <span>{item?.amount?`${item?.amount}.00 Rs`: "N/A"}</span>
                                </p>
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">
                                    Course Type:
                                  </span>
                                  <span>{item?.courseType || "N/A"}</span>
                                </p>
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">
                                    Institute:
                                  </span>
                                  {/* <span>
                                    {item?.instituteName &&
                                    item.instituteName.length > 25
                                      ? item.instituteName.slice(0, 25) + "..."
                                      : item.instituteName || "N/A"}
                                  </span> */}
                                  <span className="truncate whitespace-nowrap overflow-hidden max-w-xs block">
  {item?.instituteName || "N/A"}
</span>
                                </p>
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">State:</span>
                                  <span>{item?.state || "N/A"}</span>
                                </p>
                                <div className="mt-2 flex items-start sm:items-center justify-between border-t pt-2 md:flex-col">
                                  <p className="text-gray-500 md:mb-2 text-xs flex items-start flex-col sm:flex-row flex-nowrap text-nowrap">
                                    <span>Expires on:</span>
                                    <span>
                                      {getExpiryDate(item?.purchaseDate)}
                                    </span>
                                  </p>
                                  {!expired && (
                                    <Button
                                      onClick={() =>
                                        router.push(
                                          `/${item?.courseType.replaceAll(" ", "-").toLowerCase()}/cutoff?stateCode=${item?.stateCode}&college=${item?.instituteName}&state=${item?.state}&course=${item?.course||""}&fromAccount=${true}`,
                                        )
                                      }
                                      className="px-2 py-1"
                                    >
                                      show result
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* College Predictor Section */}
                  {collegePredictorData.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
                      <Heading className="text-2xl mb-6 text-center text-black">
                        College Predictor Details
                      </Heading>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collegePredictorData.map((item, index) => {
                          const expired = isExpired(item?.purchaseDate)

                          return (
                            <Link
                              key={item?.purchaseId}
                              href={`results?rank=${item?.rank}&rankType=${item?.rankType}&course=${item?.course}&&courseType=${item?.courseType}&&state=${item?.state}&stateCode=${item?.stateCode}&fromAccount=${true}`}
                              className="block"
                            >
                              <div className="border rounded-lg sm:p-4 p-2 bg-gray-50 hover:shadow-lg transition space-y-2">
                               <div className="flex sm:items-center items-start justify-between mb-2 md:items-start">
                                  {item?.purchaseDate && (
                                    <p className="text-sm text-gray-500 flex items-start sm:items-center md:items-start md:flex-col flex-col sm:flex-row">
                                      <span>Purchase: </span>
                                      <span>
                                       
                                        {formatPurchaseDate(item?.purchaseDate)}
                                      </span>
                                    </p>
                                  )}
                                 
                                  <div className="flex justify-between items-center">
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        expired
                                          ? "bg-red-100 text-red-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {expired ? "Expired" : "Active"}
                                    </span>
                                  </div>
                                </div>
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">Amount:</span>
                                  <span>{item?.amount?`${item?.amount}.00 Rs`: "N/A"}</span>
                                </p>
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">Course:</span>
                                  <span>{item?.course || "N/A"}</span>
                                </p>
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">
                                    Course Type:
                                  </span>
                                  <span>{item?.courseType || "N/A"}</span>
                                </p>
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">Rank Type:</span>
                                  <span>{item?.rankType || "N/A"}</span>
                                </p>
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">Rank:</span>
                                  <span>{item?.rank || "N/A"}</span>
                                </p>
                                <p className="flex justify-between text-sm">
                                  <span className="font-medium">State:</span>
                                  <span>{item?.state || "N/A"}</span>
                                </p>


                                <div className="mt-2 flex items-start sm:items-center justify-between border-t pt-2 md:flex-col">
                                  <p className="text-gray-500 md:mb-2 text-xs flex items-start flex-col sm:flex-row flex-nowrap text-nowrap">
                                    <span>Expires on:</span>
                                    <span>
                                      {getExpiryDate(item?.purchaseDate)}
                                    </span>
                                  </p>
                                  {!expired && (
                                    <Button
                                   onClick={() =>
                                        router.push(
                                          `results?rank=${item?.rank}&rankType=${item?.rankType}&course=${item?.course}&&courseType=${item?.courseType}&&state=${item?.state}&stateCode=${item?.stateCode}&fromAccount=${true}`,
                                        )
                                      }
                                      className="px-2 py-1"
                                    >
                                      show result
                                    </Button>
                                  )}
                                </div>
                        
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {closingRankData.length === 0 &&
                    collegeCutOffData.length === 0 &&
                    collegePredictorData.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                          No purchase history found
                        </p>
                        <p className="text-gray-400 mt-2">
                          You haven&apos;t made any purchases yet.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          </Container>
        </div>
      </div>
    </FELayout>
  )
}

export default Page
