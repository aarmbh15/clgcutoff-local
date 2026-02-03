"use client"

import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import Link from "@/components/common/Link"
import { PageSizeSelector } from "@/components/common/PageSizeSelector"
import { Pagination } from "@/components/common/Pagination"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { generateColsPublic } from "@/components/common/Table/Cols"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { PaymentPopupCard } from "@/components/frontend/PaymentPopupCard"
import { PaymentRedirectPopup } from "@/components/frontend/PaymentRedirectPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import {
  allInstituteTypes,
  paymentType,
  priceType,
  stateInstituteTypes,
  states,
} from "@/utils/static"
import {
  autoComplete,
  cn,
  getLocalStorageItem,
  getPhoneFromUser,
  isEmpty,
  isExpired,
  saveToLocalStorage,
} from "@/utils/utils"
import { ArrowRight, CircleCheckBig, X } from "lucide-react"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useEffect, useRef, useState } from "react"
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormSetValue,
  useForm,
} from "react-hook-form"

import PaymentCard from "./PaymentCard"

interface RendererProps {
  rendererStatus?: "PAID" | "NOT_PAID" | "NOT_FOUND" | null
  setRendererStatus: (state: "PAID" | "NOT_PAID" | "NOT_FOUND" | null) => void
  tableData: any
  generateCols: TableColumn[]
  showCutoff: () => void
  amount: number
  configYear?: string[]
  college?: string
  courseType: string
  course?: string
  stateCode: string
  state?: string
  stateAmount: number
  pageSize: number
  currentPage: number
  updateURL: (page: number, size: number) => void
  // setAppState:setAppState()
  // Pagination setters
  setPageSize: (size: number) => void
  setCurrentPage: (page: number) => void
  setStatePaymentPopup: (flag: boolean) => void
  setPaymentChecker: (flag: boolean) => void
  statePaymentPopup?: boolean
  paymentChecker?: boolean
  loading?: boolean
  // React Hook Form
  control: Control<any>
  setValue?: UseFormSetValue<any>
  clearErrors?: UseFormClearErrors<any>
  errors?: FieldErrors<any>
  // In the RendererProps interface, use:
  setAppState: (state: any) => void
  autoComplete?: (
    text: string,
    options: IOption[],
    setOptions: (opts: IOption[]) => void,
  ) => void
}

export function useUpdateURL() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function updateURL(newPage: number, newSize: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    params.set("size", newSize.toString())

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return updateURL
}

export default function CutOffPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [configYear, setConfigYear] = useState<any>([])
  const [amount, setAmount] = useState<number>(49)
  const { showToast, setAppState } = useAppState()
  const [priceLoading, setPriceLoading] = useState(true)
  const [stateAmount, setStateAmount] = useState<number>(299)
  const [statePaymentPopup, setStatePaymentPopup] = useState(false)
  const [paymentChecker, setPaymentChecker] = useState(false)
const [loading,setLoading] = useState(false)
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm()
  const isFetchingCutoff = useRef(false)
  const { fetchData } = useFetch()
  const { getSearchParams } = useInternalSearchParams()
  const college = getSearchParams("college")
  const course = getSearchParams("course")
  const state = getSearchParams("state")
  const fromAccount = getSearchParams("fromAccount") === "true"
  const stateCode = getSearchParams("stateCode")
  const params = useParams()
  const router = useRouter()

  const [rendererStatus, setRendererStatus] = useState<
    "PAID" | "NOT_PAID" | "NOT_FOUND" | null
  >(null)
  const [pageSize, setPageSize] = useState(
    Number(getSearchParams("size") || 20),
  )
  const [currentPage, setCurrentPage] = useState(
    Number(getSearchParams("page") || 1),
  )

  const courseType = params?.id
    ? params?.id.toString().toUpperCase().replace(/-/g, " ")
    : ""

  const updateURL = useUpdateURL()

  async function checkPaymentStatus() {
    const collegeD = college.toLowerCase().trim().split(" ").join("-")

    const paymentStatus = getLocalStorageItem<any>(
      `payment-${state.replaceAll(" ", "-").toLowerCase()}-${params?.id}-${collegeD}`,
    )

    if (fromAccount || (paymentStatus && !isExpired(paymentStatus, 6))) {
      if (rendererStatus !== "PAID") setRendererStatus("PAID")
    } else {
      setRendererStatus("NOT_PAID")
    }
  }

  async function showCutoff() {


   setLoading(true)
    try {
      
  
    const payload: Record<string, any> = {
      instituteName: college?.trim(),
      courseType: courseType,
      course: course,
      state: state,
      stateCode: stateCode,
      page: currentPage,
      size: pageSize,
    }

    const res = await fetchData({
      url: "/api/college_cut_off",
      params: payload,
    })

    if (res?.success) {
      setTableData(res?.payload)
    }

      } catch (error) {
      console.log("error",error)
    }finally{
      setLoading(false)
    }
  }

  async function checkDataMode() {
    const payload: Record<string, any> = {
      instituteName: college?.trim(),
      dataCheckMode: true,
      courseType: courseType,
      state: state,
      stateCode: stateCode,
    }
    const priceTypeName =
      courseType && courseType.includes(" ")
        ? courseType.split(" ")[1]
        : courseType
    const fullKey = `ALL_INDIA_COLLEGE_CUT_OFF_${priceTypeName?.toUpperCase()}`
    const fullKeyState = `COLLEGE_CUT_OFF_${priceTypeName?.toUpperCase()}`

    // Type guard to ensure the key is valid
    function isValidPriceTypeKey(key: string): key is keyof typeof priceType {
      return key in priceType
    }

    const priceTypeValue = isValidPriceTypeKey(fullKey)
      ? priceType[fullKey]
      : undefined
    const priceTypeValueState = isValidPriceTypeKey(fullKeyState)
      ? priceType[fullKeyState]
      : undefined

    const [dataRes, price] = await Promise.all([
      fetchData({ url: "/api/college_cut_off", params: payload }),
      fetchData({
        url: "/api/admin/configure_prices/get",
        // params: {
        //   type: priceType[`COLLEGE_CUT_OFF_${courseType?.split(" ")[1]?.toUpperCase()}`],
        //   item: state,
        // },
        params: {
          type: stateCode === "all" ? priceTypeValue : priceTypeValueState,
          item: stateCode === "all" ? "All India" : state,
        },
      }),
    ])

    if (dataRes?.payload?.hasData) {
      checkPaymentStatus()
    } else {
      setRendererStatus("NOT_FOUND")
    }

    if (price?.success) {
      setAmount(price?.payload?.data?.price)
    }
  }

  const getStatePrice = async () => {
    setPriceLoading(true)
    function isValidPriceTypeKey(key: string): key is keyof typeof priceType {
      return key in priceType
    }

    const priceTypeName =
      courseType && courseType.includes(" ")
        ? courseType.split(" ")[1]
        : courseType
    const stateFullKey = `STATE_CLOSING_RANK_${priceTypeName?.toUpperCase()}`
    const allIndiaFullKey = `ALL_INDIA_CLOSING_RANK_${priceTypeName?.toUpperCase()}`

    const statePriceTypeValue = isValidPriceTypeKey(stateFullKey)
      ? priceType[stateFullKey]
      : undefined

    const allIndiaPriceTypeValueForAll = isValidPriceTypeKey(allIndiaFullKey)
      ? priceType[allIndiaFullKey]
      : undefined
    const params = {
      type:
        stateCode?.toLowerCase() === "all"
          ? allIndiaPriceTypeValueForAll
          : statePriceTypeValue,
      item: stateCode?.toLowerCase() === "all" ? "All India" : state,
    }

    const [statePrice] = await Promise.all([
      fetchData({
        url: "/api/admin/configure_prices/get",
        params,
        noLoading: true,
        noToast: true,
      }),
    ])

    if (statePrice?.success) {
      // console.log("Price: ", statePrice)
      setStateAmount(statePrice?.payload?.data?.price || 299)
      setPriceLoading(false)
    }
  }

  useEffect(() => {
    if (rendererStatus === "PAID") getStatePrice()
  }, [rendererStatus])
  useEffect(() => {
    if (college && state && stateCode && courseType && !rendererStatus) {
      checkDataMode()
    }
  }, [college, state, stateCode, courseType, rendererStatus])

  useEffect(() => {
    if (
      rendererStatus === "PAID" &&
      college &&
      state &&
      stateCode &&
      courseType
    ) {
      showCutoff()
    }
  }, [currentPage, pageSize, rendererStatus])

  return (
    <FELayout>
      <Container className="pb-10 pt-1 pc:pt-10 bg-color-background">
        <div className="pb-4 pc:pb-8 flex justify-between flex-col pc:flex-row">
          <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 pt-4">
            {college}
          </h2>
          {rendererStatus === "PAID" && (
            <ClosingRankGuide className="max-w-[900px] flex-shrink-0" />
          )}
        </div>

        {rendererStatus === "PAID" && (
          <div
            className={cn(
              "bg-sky-50 border border-sky-200 p-4 rounded-md text-color-text flex gap-2 pc:hidden overflow-hidden mb-3",
            )}
          >
            <p className="animated-new text-center">
              Rotate your Phone to Landscape or Horizontal For Better view.
            </p>
          </div>
        )}

        {rendererStatus === "PAID" && !priceLoading && stateAmount > 0 && (
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
              //  disabled={stateCode?.toLowerCase() !== "all"}
              //  data-tooltip-id={"tooltip"}
              //  data-tooltip-content={
              //    stateCode?.toLowerCase() !== "all" ? "" : ""
              //  }]
              className="w-full md:max-w-sm mt-6 md:mt-0 py-3 text-white rounded-md shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              // className="flex items-center gap-1 w-full mt-6 py-3 text-white bg-color-table-header/95  hover:bg-color-table-header active:bg-color-table-header rounded-md shadow-md hover:scale-105 transition"
              //  className="w-full mt-6 py-3 text-white rounded-xl shadow-md hover:scale-105 transition"
              onClick={() => {
                router.push(
                  `/closing-ranks/${stateCode}?state=${state}&courseType=${courseType}&course=${course ? course : ""}`,
                )
              }}
            >
              {/* Unlock {state} @ ₹{stateAmount} */}
              View {state} College list
              <ArrowRight size={18} strokeWidth={2} className="ml-1" />
            </Button>
          </Card>
        )}
        <Renderer
          setAppState={setAppState}
          loading={loading}
          setRendererStatus={setRendererStatus}
          control={control}
          amount={amount}
          stateAmount={stateAmount}
          setPaymentChecker={setPaymentChecker}
          setStatePaymentPopup={setStatePaymentPopup}
          statePaymentPopup={statePaymentPopup}
          paymentChecker={paymentChecker}
          state={state}
          course={course}
          updateURL={updateURL}
          // autoComplete={autoComplete}
          currentPage={currentPage}
          clearErrors={clearErrors}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
          rendererStatus={rendererStatus}
          generateCols={generateColsPublic(configYear, {
            paid: true,
            courseType: params?.id?.toString(),
            stateCode,
          } as any)}
          tableData={tableData}
          showCutoff={showCutoff}
          configYear={configYear}
          college={college}
          courseType={courseType}
          stateCode={stateCode}
        />
      </Container>
      <SignInPopup />
    </FELayout>
  )
}

export function Renderer({
  rendererStatus,
  setRendererStatus,
  generateCols,
  tableData,
  showCutoff,
  amount,
  configYear,
  course,
  college,
  courseType,
  pageSize,
  setPageSize,
  setCurrentPage,
  control,
  setValue,
  clearErrors,
  autoComplete,
  errors,
  setAppState,
  updateURL,
  state,
  stateAmount,
  stateCode,
  currentPage,
  setPaymentChecker,
  setStatePaymentPopup,
  statePaymentPopup,
  paymentChecker,
  loading
}: RendererProps) {
  const { getSearchParams } = useInternalSearchParams()
  const params = useParams()
  const { showToast } = useAppState()
  const { fetchData } = useFetch()
  const router = useRouter()

  // ADD THIS - Missing state for payment processing
  const [processingPayment, setProcessingPayment] = useState(false)

  async function successCallback(orderId: string) {
    showToast(
      "success",
      <p>
        Payment Successful
        <br />
        Thank You for purchasing!
      </p>,
    )

    const payload: any = {
      orderId,
      amount,
      payment_type: paymentType?.COLLEGE_CUT_OFF,
      college_cut_off_details: {
        instituteName: college?.trim(),
        state: getSearchParams("state"),
        stateCode: getSearchParams("stateCode")?.toLowerCase(),
        courseType: courseType,
        course: course,
      },
    }

    const user = await fetchData({
      url: "/api/user",
      method: "GET",
      noToast: true,
    })
    if (user?.success) {
      payload.phone = getPhoneFromUser(user)
    }

    const res = await fetchData({
      url: "/api/purchase",
      method: "POST",
      data: payload,
    })
    if (res?.success) {
      const state = getSearchParams("state")
      if (college && state) {
        const collegeKey = college.toLowerCase().trim().split(" ").join("-")
        saveToLocalStorage(
          `payment-${state.replaceAll(" ", "-").toLowerCase()}-${params?.id}-${collegeKey}`,
          new Date(),
        )

        await fetchData({
          url: "/api/payment",
          method: "POST",
          data: { [paymentType?.COLLEGE_CUT_OFF]: amount },
          noLoading: true,
          noToast: true,
        })

        setRendererStatus("PAID")
        await showCutoff()
      }
    }
  }
  // console.log("Render", rendererStatus)
  async function successCallbackStatePayment(orderId: string) {
    try {
      setStatePaymentPopup(false)
      const state = getSearchParams("state")
      const course = getSearchParams("course")
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
      console.log("Payload: ", payload)
      const res = await fetchData({
        url: "/api/purchase",
        method: "POST",
        data: payload,
      })

      if (!res?.success) {
        console.error("purchase call failed", res)
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
      // console.log("PRice Response: ",priceRes)
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
          // router.push(redirectUrl)

          router.replace(redirectUrl, { scroll: false })
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
  if (rendererStatus === "NOT_FOUND") {
    return (
      <div className="grid place-items-center min-h-[240px] w-full px-4">
        <p className="text-xl pc:text-3xl">Coming Soon... for {college}</p>
        <Link href="/closing-ranks" className="w-full mt-6 block">
          <Button className="w-full text-lg">
            To Access this College Cut Off Click Here
          </Button>
        </Link>
      </div>
    )
  } else if (rendererStatus === "PAID") {
    const totalCost = amount * (tableData?.totalTableCount || 0)
    // console.log("TAble Dats: ", tableData)
    return (
      <div className="flex-1 border-color-border" style={{ overflowX: "auto" }}>
        <div className="flex flex-col-reverse md:flex-row md:items-end">
          <div className="flex justify-between items-center mb-4">
            <PageSizeSelector
              pageSize={pageSize}
              onChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
                updateURL(1, size)
              }}
            />
          </div>
        </div>
        <Table
          columns={generateCols}
          data={tableData?.data}
          itemsCountPerPage={pageSize}
          loading={loading}
        />
        <Pagination
          currentPage={currentPage}
          totalItems={tableData?.totalItems}
          itemsCountPerPage={pageSize}
          wrapperClass="pb-[20px]"
          onPageChange={(page: number) => setCurrentPage(page)}
        />
        <section className="w-full  p-3 flex items-center justify-center">
          <Card className="max-w-xl p-6 shadow-lg bg-gradient-to-b from-yellow-50/50 to-emerald-50/50 text-left">
            <h2 className="text-xl font-bold text-color-table-header">
              {`Unlock All ${state}'s ${courseType} ${courseType?.toUpperCase()?.includes("UG") && course ? course : ""} Closing Ranks`}
            </h2>
            <p className="text-gray-600 mt-2">
              Get access to <strong>{tableData?.totalTableCount || 0}</strong>{" "}
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
              // disabled={processingPayment}
              // data-tooltip-id={"tooltip"}
              // data-tooltip-content={
              //   stateCode?.toLowerCase() !== "all" ? "Coming Soon" : ""
              // }
              className="w-full mt-6 py-3 text-white bg-color-table-header/95  hover:bg-color-table-header active:bg-color-table-header rounded-md shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
              onClick={async () => {
                setProcessingPayment(true)
                try {
                  const user = await fetchData({
                    url: "/api/user",
                    method: "GET",
                    noToast: true,
                  })
                  if (user?.success) {
                    setStatePaymentPopup(true)
                    setPaymentChecker(true)
                  } else {
                    setAppState({ signInModalOpen: true })
                    setProcessingPayment(false) // Only disable here if auth fails
                  }
                } catch (error) {
                  console.error("Error checking user:", error)
                  setProcessingPayment(false)
                }
              }}
            >
              Unlock {state} @ ₹{stateAmount}
              <ArrowRight size={18} strokeWidth={2} className="ml-1" />
            </Button>
          </Card>
        </section>
        <PaymentPopupCard
          isOpen={statePaymentPopup!}
          onClose={() => setStatePaymentPopup(false)}
          onConfirm={() => setStatePaymentPopup(false)}
          paymentDescription="CollegeCutOff.net Payment for State Closing Ranks"
          title={
            <p className="p-0 uppercase poppinsFont">
              {`Please make payment to Unlock All ${state}'s NEET ${course} Closing Ranks`}
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
                    ? `Access All Rounds of ${course ? course : "UG"} Cut-off (Rank/Marks) details (NEET UG 2025) for every college in ${stateCode?.toLowerCase() === "all" ? "MCC All India" : state}, covering all categories and quotas across ${stateCode?.toLowerCase() === "all" ? "Government & Deemed" : "Government & Private"} institutions.`
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
                              ? ` Access All Round's DNB/ DNB-Diploma Cut-off Rank / Marks Details (NEET PG 2025) – Specialization, Category Wise for Your Selected Hospital or College, sourced from official counselling authorities.`
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
      </div>
    )
  } else if (rendererStatus === "NOT_PAID") {
    return (
      <>
        <div className="grid place-items-center min-h-[240px] w-full mt-20 mb-4 -translate-y-24">
          <PaymentCard
            amount={amount}
            paymentDescription="Payment for Single College Cutoff at CollegeCutoff.net"
            title={
              <p className="uppercase poppinsFont text-center">
                Please Make Payment To View Cutoff of: <br /> {college}
              </p>
            }
            whatWillYouGet={
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex font-poppins gap-2">
                  <CircleCheckBig className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <h3 className="text-[15px] leading-[1.4]">
                    {courseType?.toUpperCase().includes("UG")
                      ? `Access All Round's Category and Quota-wise ${course} Cut-off (Rank/Marks) Details (NEET UG 2025) for your Selected College.`
                      : courseType?.toUpperCase().includes("PG")
                        ? `Access All Rounds MD/MS/ Diploma Cut-off Rank / Percentile Details / Percentile / Marks Details (NEET PG ${
  ["all", "br", "ka"].includes(stateCode?.toLowerCase() ?? "")
    ? " 2025 & 2024"
    : "2024"
}) - Specialization, Category & Quota Wise for Your Selected College.`
                        : courseType?.toUpperCase().includes("SS")
                          ? `Access All Round's Specialization Wise DM/MCH/DNBSS Cut-off Rank/Marks Details (NEET SS 2024) for Your Selected College or Hospital.`
                          : courseType?.toUpperCase().includes("MDS")
                            ? `Access All Round's MDS Cut-off Rank/Marks Details (NEET MDS 2025) – Specialization, Category and Quota Wise for Your Selected College.`
                            : courseType?.toUpperCase().includes("AIAPGET")
                              ? `Access All Round's Ayurveda PG Cut-off Rank/Marks Details (AIAPGET 2025) – Specialization, Category and Quota Wise for Your Selected College.`
                              : courseType?.toUpperCase().includes("DNB")
                                ? ` Access All Round's DNB/ DNB-Diploma Cut-off Rank/Marks Details (NEET PG 2025) – Specialization, Category Wise for Your Selected Hospital or College.`
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
                  <CircleCheckBig className="w-5 h-5 text-green-600" />
                  <h3 className="text-[15px]">Instant Access after Payment!</h3>
                </li>
              </ul>
            }
            // btnText={`Unlock Cut-Off Now @ ₹${amount}`}
            btnText={
  <>
    <span className="uppercase text-[16px]">Unlock Cut-Off Now @ ₹{amount}</span>
  </>
}
          />
        </div>
        <PaymentRedirectPopup successCallback={successCallback} />
      </>
    )
  } else {
    return (
      <div className="grid place-items-center min-h-[240px] w-full px-4">
        Loading College Details...
      </div>
    )
  }
}

