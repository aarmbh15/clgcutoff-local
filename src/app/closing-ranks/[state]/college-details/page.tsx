"use client"

import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import { PageSizeSelector } from "@/components/common/PageSizeSelector"
import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { PaymentPopupCard } from "@/components/frontend/PaymentPopupCard"
import { PaymentRedirectPopup } from "@/components/frontend/PaymentRedirectPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { paymentType, priceType } from "@/utils/static"
import { cn, getLocalStorageItem, isEmpty } from "@/utils/utils"
import { ArrowRight, ChevronLeft, CircleCheckBig, Users } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default function StateClosingRanksPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast, setAppState } = useAppState()
  const { fetchData } = useFetch()

  // route / query values
  const stateCodeRaw = params?.state
  const stateCode = stateCodeRaw
    ? decodeURIComponent(stateCodeRaw as string)
    : ""
  const courseType = searchParams.get("courseType") || ""
  const course = searchParams.get("course") || ""
  const collegeCount = searchParams.get("collegeCount") || 0
  const instituteName = searchParams.get("instituteName") || ""
  const fromAccount = searchParams.get("fromAccount") === "true"
  const instituteType = searchParams.get("instituteType") || ""
  const state = searchParams.get("state") || ""
  const [stateAmount, setStateAmount] = useState<number>(299)
  const [amount, setAmount] = useState<number>(299)
  // local state
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get("size") || 20),
  )
  const [currentPage, setCurrentPage] = useState<number>(
    Number(searchParams.get("page") || 1),
  )
  const [tableData, setTableData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [configYear, setConfigYear] = useState<any>([])
  const [processingPayment, setProcessingPayment] = useState<any>(false)
  const [statePaymentPopup, setStatePaymentPopup] = useState(false)
  const [paymentChecker, setPaymentChecker] = useState(false)

  const currentYear = new Date().getFullYear()-1
  const prevYear = currentYear - 1

  // refs for safe async behavior
  const fetchIdRef = useRef(0)
  const debounceTimerRef = useRef<number | null>(null)

  useEffect(() => {
    async function call() {
      await getPriceData()
    }
    call()
  }, [])
  async function getPriceData() {
    // Type guard to ensure the key is valid
    function isValidPriceTypeKey(key: string): key is keyof typeof priceType {
      return key in priceType
    }

    if (stateCode !== "all") {
      const priceTypeName =
        courseType && courseType.includes(" ")
          ? courseType.split(" ")[1]
          : courseType

      const fullKey = `SINGLE_COLLEGE_CLOSING_RANK_${priceTypeName?.toUpperCase()}`

      const stateFullKey = `STATE_CLOSING_RANK_${priceTypeName?.toUpperCase()}`

      const priceTypeValue = isValidPriceTypeKey(fullKey)
        ? priceType[fullKey]
        : undefined
      const statePriceTypeValue = isValidPriceTypeKey(stateFullKey)
        ? priceType[stateFullKey]
        : undefined
      const params = {
        state,
        courseType,
        course,
        stateCode,
      }

      const [price, statePrice] = await Promise.all([
        fetchData({
          url: "/api/admin/configure_prices/get",
          params: {
            type: priceTypeValue,
            item: state,
          },
          noLoading: true,
          noToast: true,
        }),
        fetchData({
          url: "/api/admin/configure_prices/get",
          params: {
            type: statePriceTypeValue,
            item: state,
          },
          noLoading: true,
          noToast: true,
        }),
      ])
      if (price?.success) {
        setAmount(price?.payload?.data?.price)
      }

      if (statePrice?.success) {
        setStateAmount(statePrice?.payload?.data?.price)
      }
    } else {
      const priceTypeName =
        courseType && courseType.includes(" ")
          ? courseType.split(" ")[1]
          : courseType

      const allIndiaFullKey = `SINGLE_COLLEGE_CLOSING_RANK_${priceTypeName?.toUpperCase()}`
      const allIndiaFull = `ALL_INDIA_CLOSING_RANK_${priceTypeName?.toUpperCase()}`

      const allIndiaPriceTypeValue = isValidPriceTypeKey(allIndiaFullKey)
        ? priceType[allIndiaFullKey]
        : undefined

      const allIndiaPriceTypeValueForAll = isValidPriceTypeKey(allIndiaFull)
        ? priceType[allIndiaFull]
        : undefined

      const [price, allIndiaPrice] = await Promise.all([
        fetchData({
          url: "/api/admin/configure_prices/get",
          params: {
            type: allIndiaPriceTypeValue,
            item: stateCode === "all" ? "All India" : state,
          },
          noLoading: true,
          noToast: true,
        }),

        fetchData({
          url: "/api/admin/configure_prices/get",
          params: {
            type: allIndiaPriceTypeValueForAll,
            item: stateCode === "all" ? "All India" : state,
          },
          noLoading: true,
          noToast: true,
        }),
      ])
      if (price?.success) {
        setAmount(price?.payload?.data?.price)
      }

      if (allIndiaPrice?.success) {
        setStateAmount(allIndiaPrice?.payload?.data?.price)
      }
    }
  }

  function updateURLSafely(newPage: number, newSize: number) {
    try {
      const url = new URL(window.location.href)
      const existingPage = url.searchParams.get("page") || ""
      const existingSize = url.searchParams.get("size") || ""

      if (
        existingPage === String(newPage) &&
        existingSize === String(newSize)
      ) {
        return // ✅ No change, skip router.replace
      }

      url.searchParams.set("page", String(newPage))
      url.searchParams.set("size", String(newSize))
      const newUrl = `${url.pathname}?${url.searchParams.toString()}`
      router.replace(newUrl, { scroll: false }) // avoids reload
    } catch (err) {
      console.warn("updateURLSafely error", err)
    }
  }

  /**
   * Reflect pagination state in URL (no infinite loop)
   */
  useEffect(() => {
    // delay slightly to ensure state settled
    const timer = setTimeout(() => {
      updateURLSafely(currentPage, pageSize)
    }, 100)

    return () => clearTimeout(timer)
  }, [currentPage, pageSize])

  /**
   * getData - stable fetching logic, uses fetchIdRef to ensure only latest result applied.
   * - closingRankCollege can be from localStorage or fromAccount payload
   */
  const getData = useCallback(

    async (closingRankCollege: any, page = 1) => {
      // increment fetch id
      const id = ++fetchIdRef.current

      try {
        setLoading(true)
        const res = await fetchData({
          method: "POST",
          url: "/api/closing_ranks",
          params: {
            page: page,
            size: pageSize,
          },
          data: {
            closingRankCollege,
            stateCode,
          },
        })

        // only apply response if this is the latest fetch
        if (id !== fetchIdRef.current) return

        if (res?.success) {
          setTableData(res?.payload)
        }
      } catch (err) {
        console.error("getData error", err)
      }
      finally{
         setLoading(false)
      }
    },
    // intentionally include pageSize and stateCode
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchData, pageSize, stateCode],
  )

  /**
   * Effect to fetch data when relevant inputs change.
   * Debounced to avoid multiple rapid calls (e.g. changing pageSize then currentPage).
   */
  useEffect(() => {
    let mounted = true

    const closingRankCollege = getLocalStorageItem<any>(
      paymentType.SINGLE_COLLEGE_CLOSING_RANK,
    )

    const payload = fromAccount
      ? {
          course,
          courseType,
          state,
          stateCode,
          instituteName,
          instituteType,
        }
      : closingRankCollege

    // debounce so multiple state updates in quick succession won't fire multiple requests
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    debounceTimerRef.current = window.setTimeout(() => {
      if (!mounted) return
      if (payload) {
        // call with currentPage (source of truth)
        getData(payload, currentPage)
      }
    }, 120) // small debounce

    return () => {
      mounted = false
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [currentPage, pageSize])

  /**
   * When pageSize or currentPage change we also reflect in URL (but only if different).
   * The updateURL function avoids replace when unnecessary.
   */
  // useEffect(() => {
  //   updateURL(currentPage, pageSize)
  //   // we do NOT call getData here (main effect handles it). This avoids double fetching.
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentPage, pageSize])

  useEffect(() => {
    // delay slightly to ensure state settled
    const timer = setTimeout(() => {
      updateURLSafely(currentPage, pageSize)
    }, 100)

    return () => clearTimeout(timer)
  }, [currentPage, pageSize])
  /**
   * Columns generator (kept same with minor JSX fix for apostrophe & html entity)
   */
  function generateCols() {
    const percentile_Marks = courseType?.includes("UG") ? "Marks" : "Percentile"

    let currentYear = new Date().getFullYear()-1
    let previousYear = currentYear - 1

    if (!isEmpty(configYear)) {
      previousYear = configYear[0]
      currentYear = configYear[1]
    }

    const columns: TableColumn[] = [
      {
        title: "Institute Name",
        tableKey: "instituteName",
        width: "150px",
      },
      { title: "Course", tableKey: "course" },
      { title: "Quota", tableKey: "quota", width: "150px" },
      { title: "Sub - Quota", tableKey: "subQuota", width: "150px" },
      {
        title: (
          <div>
            Allotted
            <br />
            Category
          </div>
        ),
        tableKey: "category",
      },
      { title: "Sub-Category", tableKey: "subCategory", width: "150px" },

      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${currentYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R1] ${currentYear}`}
          </div>
        ),
        tableKey: `showClosingRankR1`,
        width: "190px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
      //  {
      //    title: (
      //      <div
      //        data-tooltip-id="tooltip"
      //        data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${currentYear}`}
      //      >
      //        {`Closing Rank/ ${percentile_Marks} [R2] ${currentYear}`}
      //      </div>
      //    ),
      //    tableKey: `showClosingRankR2`,
      //    width: "190px",
      //    renderer({ cellData }) {
      //      return cellData !== "xxx" &&
      //        (cellData === "undefined" ||
      //          cellData === "null" ||
      //          cellData == null) ? (
      //        "NA"
      //      ) : (
      //        <div
      //          data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
      //          data-tooltip-content={`Unlock This College @ ₹49`}
      //        >
      //          {cellData ?? "NA"}
      //        </div>
      //      )
      //    },
      //  },
      //  {
      //    title: (
      //      <div
      //        data-tooltip-id="tooltip"
      //        data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${currentYear}`}
      //      >
      //        {`Closing Rank/ ${percentile_Marks} [R3] ${currentYear}`}
      //      </div>
      //    ),
      //    tableKey: `showClosingRankR3`,
      //    width: "190px",
      //    renderer({ cellData }) {
      //      return cellData !== "xxx" &&
      //        (cellData === "undefined" ||
      //          cellData === "null" ||
      //          cellData == null) ? (
      //        "NA"
      //      ) : (
      //        <div
      //          data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
      //          data-tooltip-content={`Unlock This College @ ₹49`}
      //        >
      //          {cellData ?? "NA"}
      //        </div>
      //      )
      //    },
      //  },
      //  {
      //    title: (
      //      <div
      //        data-tooltip-id="tooltip"
      //        data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
      //      >
      //        {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
      //      </div>
      //    ),
      //    tableKey: `showStrayRound`,
      //    width: "210px",
      //    renderer({ cellData }) {
      //      return cellData !== "xxx" &&
      //        (cellData === "undefined" ||
      //          cellData === "null" ||
      //          cellData == null) ? (
      //        "NA"
      //      ) : (
      //        <div
      //          data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
      //          data-tooltip-content={`Unlock This College @ ₹49`}
      //        >
      //          {cellData ?? "NA"}
      //        </div>
      //      )
      //    },
      //  },
      //  {
      //    title: (
      //      <div
      //        data-tooltip-id="tooltip"
      //        data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
      //      >
      //        Last {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
      //      </div>
      //    ),
      //    tableKey: `showLastStrayRound`,
      //    width: "210px",
      //    renderer({ cellData }) {
      //      return cellData !== "xxx" &&
      //        (cellData === "undefined" ||
      //          cellData === "null" ||
      //          cellData == null) ? (
      //        "NA"
      //      ) : (
      //        <div
      //          data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
      //          data-tooltip-content={`Unlock This College @ ₹49`}
      //        >
      //          {cellData ?? "NA"}
      //        </div>
      //      )
      //    },
      //  },

      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${previousYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R1] ${previousYear}`}
          </div>
        ),
        tableKey: "showPrevClosingRankR1",
        width: "190px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${previousYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R2] ${previousYear}`}
          </div>
        ),
        tableKey: "showPrevClosingRankR2",
        width: "190px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${previousYear}`}
          >
            {`Closing Rank/ ${percentile_Marks} [R3] ${previousYear}`}
          </div>
        ),
        tableKey: "showPrevClosingRankR3",
        width: "190px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
          >
            {`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
          </div>
        ),
        tableKey: `showPrevStrayRound`,
        width: "210px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
      {
        title: (
          <div
            data-tooltip-id="tooltip"
            data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
          >
            Last {`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
          </div>
        ),
        tableKey: `showPrevLastStrayRound`,
        width: "210px",
        renderer({ cellData }) {
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            "NA"
          ) : (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },

      { title: "Institute Type", tableKey: "instituteType", width: "150px" },

      {
        title: "Fees",
        tableKey: "fees",
        width: "100px",
        renderer({ cellData }) {
          return (
            <div
              data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
              data-tooltip-content={`Unlock This College @ ₹49`}
            >
              {cellData ?? "NA"}
            </div>
          )
        },
      },
    ]

    if (stateCode === "all") {
      columns.splice(columns.length - 1, 0, {
        title: "State",
        tableKey: "state",
        width: "150px",
      })
    }

    return columns
  }

  /**
   * successCallbackStatePayment - called from PaymentRedirectPopup when payment completes
   * - Marks checkout/purchase (calls /api/purchase then /api/payment)
   * - Redirects user to `/closing-ranks/${stateCode}` on success
   */
  async function successCallbackStatePayment(orderId: string) {
    try {
      setStatePaymentPopup(false)
      // show immediate toast
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
        amount: stateAmount,
        payment_type:
          stateCode === "all"
            ? paymentType?.ALL_INDIA_CLOSING_RANK
            : paymentType?.STATE_CLOSING_RANK,
        closing_rank_details: {
          courseType: courseType,
          course: course,
          state: stateCode === "all" ? "All India" : state,
          stateCode:
            stateCode?.toLowerCase() === "all"
              ? "all"
              : stateCode.toLowerCase(),
        },
      }

      const res = await fetchData({
        url: "/api/purchase",
        method: "POST",
        data: payload,
      })

      if (!res?.success) {
        console.error("purchase call failed", res)
        setProcessingPayment(false)
        return
      }

      const priceRes = await fetchData({
        url: "/api/payment",
        method: "POST",
        data: {
          [stateCode === "all"
            ? paymentType?.ALL_INDIA_CLOSING_RANK
            : paymentType?.STATE_CLOSING_RANK]: stateAmount,
        },
        noToast: true,
      })

      if (priceRes?.success) {
        // unmount redirect popup
        setPaymentChecker(false)
        // small tick so UI updates then navigate
        setTimeout(() => {
          // build redirect url and navigate
          const redirectUrl = `/closing-ranks/${encodeURIComponent(
            stateCode,
          )}?state=${encodeURIComponent(state)}&courseType=${encodeURIComponent(
            courseType,
          )}&course=${encodeURIComponent(course)}`
          router.push(redirectUrl)
        }, 80)
      } else {
        console.error("payment endpoint failed", priceRes)
      }
    } catch (err) {
      console.error("successCallbackStatePayment error", err)
    } finally {
      setProcessingPayment(false)
    }
  }

  function backURL() {
    return `/closing-ranks/${stateCode}?state=${state}&courseType=${courseType}&course=${course}`
  }
  const totalCost = amount * (tableData?.totalTableCount || collegeCount || 0)
  return (
    <FELayout>
      <div>
        <section className="w-full py-12 md:py-16 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
          <Container className="container px-4 md:px-6">
            {/* <Link
              href={backURL()}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to {state} Colleges
            </Link> */}

            {/* ➡️ Right: Breadcrumbs */}
                          <div className="md:text-right">
                            <Breadcrumbs />
                          </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 capitalize text-color-table-header">
                  {searchParams.get("college")}
                </h1>
                <p className="text-gray-600">
                  {courseType}{" "}
                  {courseType?.includes("PG") ? prevYear : currentYear} Closing
                  Ranks
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Main Content */}
        <section className="w-full py-12">
          <Container className="container px-4 md:px-6">
            <div className="justify-between items-center mb-10 hidden pc:flex">
              <div></div>
              <ClosingRankGuide className="max-w-[900px] flex-shrink-0" />
            </div>

            <ClosingRankGuide className="max-w-[900px] flex-shrink-0 pc:hidden" />

            <div
              className={cn(
                "bg-sky-50 border border-sky-200 p-4 rounded-md text-color-text flex gap-2 pc:hidden overflow-hidden my-3",
              )}
            >
              <p className="animated-new text-center">
                Rotate your Phone to Landscape or Horizontal For Better view.
              </p>
            </div>
            <Card className="p-6 shadow-lg bg-gradient-to-b from-blue-50 to-green-50 text-center mb-10 md:flex items-start gap-20 justify-center">
              <div className="md:max-w-sm">
                <h2 className="text-xl font-bold text-color-table-header">
                  {`Don't Limit Yourself to One College`}
                </h2>
                <p className="text-gray-600 mt-2">
                  You&rsquo;ve unlocked this college. Now explore every Medical
                  college in {state} with round-wise cut-offs and closing rank
                  details
                </p>
              </div>
              <Button
                className="w-full md:max-w-sm mt-6 md:mt-0 py-3 text-white rounded-md shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
                onClick={() => {
                  router.push(
                    `/closing-ranks/${stateCode}?state=${state}&courseType=${courseType}&course=${course ? course : ""}`,
                  )
                }}
              >
                View {state} College list
                <ArrowRight size={18} strokeWidth={2} className="ml-1" />
              </Button>
            </Card>

            <div className="flex justify-between items-center mb-2">
              <PageSizeSelector
                pageSize={pageSize}
                onChange={(size) => {
                  setPageSize(size)
                  setCurrentPage(1)
                  updateURLSafely(1, size)
                }}
              />
            </div>

            <Table
              columns={generateCols()}
              data={tableData?.data}
              itemsCountPerPage={pageSize}
              loading={loading}
            />

            <Pagination
              currentPage={currentPage}
              totalItems={tableData?.totalItems}
              itemsCountPerPage={pageSize}
              wrapperClass="pb-[50px]"
              onPageChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </Container>
        </section>
        <section className="w-full  p-3 flex items-center justify-center">
          <Card className="max-w-xl p-6 shadow-lg bg-gradient-to-b from-yellow-50/50 to-emerald-50/50 text-left">
            <h2 className="text-xl font-bold text-color-table-header">
              {`Unlock All ${state}'s ${courseType} ${course} Closing Ranks`}
            </h2>
            <p className="text-gray-600 mt-2">
              {/* { console.log(tableData)} */}
              Get access to{" "}
              <strong>
                {tableData?.totalTableCount || collegeCount || 0}
              </strong>{" "}
              colleges across <br className="md:hidden" />
              <strong>{state}</strong> round-wise closing ranks in one place.
            </p>
            <p className="text-gray-600 mt-2">
              Worth <strong> ₹{totalCost} </strong>if unlocked One by one,{" "}
              <br className="md:hidden" />
              now just <strong>₹{stateAmount}</strong>
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="border rounded-md md:p-3 p-2 pt-2.5 text-gray-700">
                <p className="font-medium">Single College</p>
                <p className="text-xl">
                  <strong>₹{amount}</strong> each
                </p>
              </div>
              <div className="border border-blue-800 rounded-md md:p-3 pt-2.5 p-2 relative">
                <p className="font-medium flex items-center justify-start gap-1">
                  {state} Pack
                  <span className="absolute -top-2.5 right-2 text-xs bg-color-accent text-white px-2 py-0.5 rounded">
                    Most Popular
                  </span>
                </p>
                <p className="text-xl text-color-accent font-bold">
                  <strong> ₹{stateAmount} /-</strong>
                </p>
              </div>
            </div>

            <Button
              // disabled={stateCode?.toLowerCase()!=="all"}
              // data-tooltip-id={"tooltip"}
              // data-tooltip-content={
              //   stateCode?.toLowerCase() !== "all" ? "Coming Soon" : ""
              // }
              className="w-full font-bold mt-6 py-3 text-white bg-color-table-header/95  hover:bg-color-table-header active:bg-color-table-header rounded-md shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              onClick={() => {
                fetchData({
                  url: "/api/user",
                  method: "GET",
                  noToast: true,
                }).then((user) => {
                  if (user?.success) {
                    setStatePaymentPopup(true)
                    setPaymentChecker(true)
                  } else {
                    setAppState({ signInModalOpen: true })
                  }
                })
              }}
            >
              Unlock {state} @ ₹{stateAmount}
              <ArrowRight size={18} strokeWidth={2} className="ml-1" />
            </Button>
          </Card>
        </section>
        <section className="w-full py-12">
          <Container className="container px-4 md:px-6">
            {/* Expert Guidance CTA */}
            <div className="mt-16 border border-color-accent rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-black">
                  Need personalized guidance?
                </h3>
                <p className="text-gray-600">
                  Connect with our expert counselors to get personalized college
                  recommendations based on your NEET rank and preferences.
                </p>
              </div>
              <Link
                href="https://wa.me/919028009835"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                Book Counselling Session
              </Link>
            </div>
          </Container>
        </section>
      </div>

      <SignInPopup noRedirect />

      <PaymentPopupCard
        isOpen={statePaymentPopup}
        onClose={() => setStatePaymentPopup(false)}
        onConfirm={() => setStatePaymentPopup(false)}
        paymentDescription="CollegeCutOff.net Payment for State Closing Ranks"
        title={
          <p className="p-0 uppercase poppinsFont">
            {`Please make payment to Unlock: All ${state}'s NEET ${course ? course : ""} Closing Ranks`}
          </p>
        }
        btnText={
          <>
            <span className="uppercase">UNLOCK NOW @ ₹{stateAmount}</span>
          </>
        }
        whatWillYouGet={
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex font-poppins gap-2">
              <CircleCheckBig className="w-5 h-5 text-primary text-green-600 flex-shrink-0" />

              <h3>
                {courseType?.toUpperCase().includes("UG")
                  ? `Access All Rounds of ${course} Cut-off (Rank/Marks) details (NEET UG 2025) for every college in ${stateCode?.toLowerCase() === "all" ? "MCC All India" : state}, covering all categories and quotas across ${stateCode?.toLowerCase() === "all" ? "Government & Deemed" : "Government & Private"} institutions.`
                  : courseType?.toUpperCase().includes("PG")
                    ? `Access All Round's of MD/MS/Diploma Cut-off Rank / Percentile / Marks Details (NEET PG ${
  ["all", "br", "ka"].includes(stateCode?.toLowerCase() ?? "")
    ? " 2025 & 2024"
    : "2024"
}) for every college in ${state}, covering all specialization, category, and quota across Government & Private institutions.`
                    : courseType?.toUpperCase().includes("SS")
                      ? `Access All Round's Specialization Wise DM/MCH/DNBSS Cut-off Rank/Marks Details (NEET SS 2024) for Your Selected College or Hospital.`
                      : courseType?.toUpperCase().includes("MDS")
                        ? `Access All Round's MDS Cut-off Rank/Marks Details (NEET MDS 2025) – Specialization, Category and Quota Wise for Your Selected College.`
                        : courseType?.toUpperCase().includes("AIAPGET")
                          ? `Access All Round's Ayurveda PG Cut-off Rank/Marks Details (AIAPGET 2025) – Specialization, Category and Quota Wise for Your Selected College.`
                          : courseType?.toUpperCase().includes("DNB")
                            ? `Access All Round's of DNB/ DNB-Diploma Cut-off Rank/ Marks Details (NEET PG 2025) for every College and Hospital in All India, covering all specialization, category, and quota across Government & Private institutions.`
                            : "Access All Round's MD/MS/Diploma Cut-off Rank / Percentile Details (NEET PG 2024) – Specialization, Category & Quota Wise for Your Selected College."}
              </h3>
            </li>
            <li className="flex font-poppins gap-2">
              <CircleCheckBig className="w-5 h-5 text-primary text-green-600 flex-shrink-0" />
              <h3 className="text-[15px]">
                Data sourced from official counselling authorities
              </h3>
            </li>
            <li className="flex font-poppins gap-2">
              <CircleCheckBig className="w-5 h-5 text-primary text-green-600 flex-shrink-0" />

              <h3 className="text-[15px]">Instant Access after Payment!</h3>
            </li>
          </ul>
        }
        amount={stateAmount}
      />

      {paymentChecker && (
        <PaymentRedirectPopup successCallback={successCallbackStatePayment} />
      )}
    </FELayout>
  )
}

