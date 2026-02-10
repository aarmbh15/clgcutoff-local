"use client"

import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { PageSizeSelector } from "@/components/common/PageSizeSelector"
import { Pagination } from "@/components/common/Pagination"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { UnlockPopover } from "@/components/common/UnblockPopover"
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
  isEmpty,
  onPageChange,
  saveToLocalStorage,
  shouldRenderComponent,
} from "@/utils/utils"
import {
  ArrowRight,
  ChevronLeft,
  CircleCheckBig,
  Eye,
  Users,
  X,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function CollegeListClosingRanksPage() {
  const {
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()

  const [tableData, setTableData] = useState<any>(null)

  const [updateUI, setUpdateUI] = useState(false)
const [isLoading,setIsLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState<any>(false)
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [rowData, setRowData] = useState<any>(null)
  const [stateAmount, setStateAmount] = useState<number>(299)
  const [statePaymentPopup, setStatePaymentPopup] = useState(false)
  const [paymentChecker, setPaymentChecker] = useState(false)
  const [statePurchaseMode, setStatePurchaseMode] = useState(false)
  //changes made on 3feb2026
  // const currentYear = new Date().getFullYear()-1
  const currentYear = new Date().getFullYear()
  const prevYear = currentYear - 1
  const [selectedInstituteType, setSelectedInstituteType] = useState<
    IOption | undefined
  >()
  const [selectedState, setSelectedState] = useState<IOption | undefined>()
  const [amount, setAmount] = useState<number>(49)

  const params = useParams()

  const searchParams = useSearchParams()

  const courseType = searchParams.get("courseType")
  const course = searchParams.get("course")
  const stateCode = decodeURIComponent(params.state as any)
  const state = searchParams.get("state")

  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("size") || 20),
  )
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") || 1),
  )

  const { fetchData } = useFetch()

  const router = useRouter()

  const { showToast, setAppState } = useAppState()
  function updateURL(newPage: number, newSize: number) {
    const params = new URLSearchParams(window.location.search)
    params.set("page", newPage.toString())
    params.set("size", newSize.toString())
    router.replace(`${window.location.pathname}?${params.toString()}`)
  }

  const [showUnlockPopover, setShowUnlockPopover] = useState(false);
// const [rowData, setRowData] = useState<any>(null);
// const [processingPayment, setProcessingPayment] = useState<any>(false);

  async function handleStatePurchase() {
  const user = await fetchData({
    url: "/api/user",
    method: "GET",
    noToast: true,
  })

  if (user?.success) {
    setProcessingPayment(rowData?.id)
    setStatePurchaseMode(true)
    setStatePaymentPopup(true)
    setPaymentChecker(true)
  } else {
    setAppState({ signInModalOpen: true })
  }
}
  // useEffect(() => {
  //   setCurrentPage(1)
  //   updateURL(1, pageSize)
  //   getData(1,"update")
  // }, [updateUI, selectedInstituteType, selectedState, pageSize])

  // useEffect(() => {
  //   //     setCurrentPage(currentPage);
  //   updateURL(currentPage, pageSize)
  //   getData(currentPage,"first")
  // }, [currentPage])
  useEffect(() => {
    const timeout = setTimeout(() => getData(currentPage, "new One"), 200)
    return () => clearTimeout(timeout)
  }, [updateUI, selectedInstituteType, selectedState, pageSize, currentPage])

  async function getData(page: number, data: string) {
    // console.log("GET DATA: ", data)
    // Type guard to ensure the key is valid
   function isValidPriceTypeKey(key: string): key is keyof typeof priceType {
      return key in priceType
    }
    try {

    setIsLoading(true)
 

    // const page = Number(getSearchParams("page") || 1)
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
        page: page || currentPage,
        size: pageSize,
        state,
        courseType,
        course,
        stateCode,
        filterState: selectedState?.text || "",
        instituteType: selectedInstituteType?.text || "",
      }

      const [price, res, statePrice] = await Promise.all([
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
          url: "/api/closing_ranks/college_list",
          params,
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
      // console.log("Price: ",price)
      if (price?.success) {
        setAmount(price?.payload?.data?.price)
      }

      if (statePrice?.success) {
        setStateAmount(statePrice?.payload?.data?.price)
      }

      if (res?.success) {
        // console.log("Data: ",res.payload)
        setTableData(res?.payload)
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

      const [price, res, allIndiaPrice] = await Promise.all([
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
          url: "/api/closing_ranks/college_list",
          params: {
            page: currentPage,
            size: pageSize,
            state,
            courseType: courseType,
            course: course,
            stateCode: stateCode,
            filterState: selectedState?.text || "",
            instituteType: selectedInstituteType?.text || "",
          },
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

      if (res?.success) {
        // console.log("ResP ",res.payload)
        setTableData(res?.payload)
      }
    }
          
    } catch (error) {
      console.log("error",error)
    }
    finally{
      setIsLoading(false)
    }
  }

  function buttonText(rowData: any) {
    return processingPayment === rowData?.id
      ? "Processing..."
      : `Unlock @ ₹${amount}`
  }

  function generateCols() {
    const columns: TableColumn[] = [
      {
        title: "Institute Name",
        tableKey: "instituteName",
        width: "150px",
        disableMobStaticLeft: true,
      },
      { title: "Institute Type", tableKey: "instituteType", width: "150px" },
      // { title: "State", tableKey: "state", width: "150px" },
      {
        title: "Course Type",
        tableKey: "courseType",

        width: "150px",
        renderer({ cellData }) {
          return courseType
        },
      },
      {
        title: "Unlock Cut-off",
        tableKey: "action",
        width: "120px",
        renderer({ rowData }) {
          const paymentStatus = getLocalStorageItem<any>(
            `payment-${state?.replaceAll(" ", "-").toLowerCase()}-${courseType?.replaceAll(" ", "-").toLowerCase()}-${rowData.instituteName.toLowerCase().trim().split(" ").join("-")}`,
          )
          return (
            <div className="w-[120px] md:m-3">
              {rowData?.purchased || paymentStatus ? (
                <Link
                  href={`/closing-ranks/${stateCode}/college-details?state=${state}&college=${rowData?.instituteName}&courseType=${courseType}&course=${course || ""}&collegeCount=${tableData?.totalItems || 0}`}
                  className="text-[14px] disabled:bg-color-table-header disabled:text-white disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={() => {
                    saveToLocalStorage(
                      paymentType.SINGLE_COLLEGE_CLOSING_RANK,
                      {
                        ...rowData,
                        course: course,
                        courseType: courseType,
                        state: state,
                      },
                    )
                  }}
                >
                  <Button
                    className="py-2 px-2 text-[14px] w-fit disabled:bg-color-table-header disabled:text-white disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center gap-1"
                    variant="primary"
                  >
                    <Eye size={20} /> View
                  </Button>
                </Link>
              ) : (
                <Button
                  className="py-2 px-2 text-[14px] w-fit disabled:bg-color-table-header disabled:text-white disabled:cursor-not-allowed min-w-[100px] flex items-center gap-2"
                  variant="primary"
                  onClick={() => {
                    setPaymentChecker(true)

                    saveToLocalStorage(
                      paymentType.SINGLE_COLLEGE_CLOSING_RANK,
                      {
                        ...rowData,
                        course: course,
                        courseType: courseType,
                        state: state,
                      },
                    )

                    setRowData(rowData)
                    // handleBuyNow()
                        setShowUnlockPopover(true);
                  }}
                  disabled={processingPayment === rowData?.id}
                >
                  {buttonText(rowData)}
                </Button>
              )}
            </div>
          )
        },
      },
      // In your generateCols() function, update the renderer for the "Unlock Cut-off" column:
// {
//   title: "Unlock Cut-off",
//   tableKey: "action",
//   width: "120px",
//   renderer({ rowData }) {
//     const paymentStatus = getLocalStorageItem<any>(
//       `payment-${state?.replaceAll(" ", "-").toLowerCase()}-${courseType?.replaceAll(" ", "-").toLowerCase()}-${rowData.instituteName.toLowerCase().trim().split(" ").join("-")}`,
//     )
    
//     return (
//       <div className="w-[120px] md:m-3">
//         {rowData?.purchased || paymentStatus ? (
//           <Link
//             href={`/closing-ranks/${stateCode}/college-details?state=${state}&college=${rowData?.instituteName}&courseType=${courseType}&course=${course || ""}&collegeCount=${tableData?.totalItems || 0}`}
//              className="text-[14px] disabled:bg-color-table-header disabled:text-white disabled:cursor-not-allowed flex items-center gap-2"
//             onClick={() => {
//               saveToLocalStorage(
//                 paymentType.SINGLE_COLLEGE_CLOSING_RANK,
//                 {
//                   ...rowData,
//                   course: course,
//                   courseType: courseType,
//                   state: state,
//                 },
//               )
//             }}
//           >
//             <Button
//               className="py-2 px-2 text-[14px] w-fit disabled:bg-color-table-header disabled:text-white disabled:cursor-not-allowed min-w-[100px] flex items-center gap-2"
//               variant="primary"
//             >
//               <Eye size={20} /> View
//             </Button>
//           </Link>
//         ) : (
//           <UnlockPopover
//             amount={amount}
//             stateAmount={stateAmount}
//             stateName={state || ""}
//             processingPayment={processingPayment === rowData?.id}
//             onBuySingle={() => {
//               setPaymentChecker(true)
//               saveToLocalStorage(
//                 paymentType.SINGLE_COLLEGE_CLOSING_RANK,
//                 {
//                   ...rowData,
//                   course: course,
//                   courseType: courseType,
//                   state: state,
//                 },
//               )
//               setRowData(rowData)
//               handleBuyNow()
//             }}
//             onBuyState={() => {
//               setPaymentChecker(true)
//               saveToLocalStorage(
//                 paymentType.SINGLE_COLLEGE_CLOSING_RANK,
//                 {
//                   ...rowData,
//                   course: course,
//                   courseType: courseType,
//                   state: state,
//                 },
//               )
//               setRowData(rowData)
//               handleStatePurchase()
//             }}
//             // pitch={`Choose to unlock just ${rowData?.instituteName} or all colleges in ${state}`}
//           />
//         )}
//       </div>
//     )
//   },
// }
    ]
    if (stateCode === "all" || stateCode === "All") {
      columns.splice(
        columns.length - 1, // Insert before the last column
        0,
        { title: "State", tableKey: "state", width: "150px" },
      )
    }
    return columns
  }

  async function handleBuyNow() {
    const user = await fetchData({
      url: "/api/user",
      method: "GET",
      noToast: true,
    })

    if (user?.success) {
      setProcessingPayment(rowData?.id)
      setShowPaymentPopup(true)
      setStatePurchaseMode(false)
    } else {
      setAppState({ signInModalOpen: true })
    }
  }

  async function successCallback(orderId: string) {
    setShowPaymentPopup(false)

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
      payment_type: paymentType?.SINGLE_COLLEGE_CLOSING_RANK,
      closing_rank_details: {
        instituteName: rowData?.instituteName,
        instituteType: rowData?.instituteType,
        courseType: courseType,
        course: course,
        state: stateCode === "all" ? "All India" : state,
        stateCode:
          stateCode?.toLowerCase() === "all" ? "all" : stateCode.toLowerCase(),
      },
    }

    const res = await fetchData({
      url: "/api/purchase",
      method: "POST",
      data: payload,
    })

    console.log("Response: ", res)
    if (res?.success) {
      // setUpdateUI((prev) => !prev)

      const priceRes = await fetchData({
        url: "/api/payment",
        method: "POST",
        data: {
          [paymentType?.SINGLE_COLLEGE_CLOSING_RANK]: amount,
        },
        noToast: true,
      })
      console.log("Price Response: ",priceRes)
      if (priceRes?.success) {
        router.push(
          `/closing-ranks/${stateCode}/college-details?state=${state}&college=${rowData?.instituteName}&courseType=${courseType}&course=${course || ""}&collegeCount=${tableData?.totalItems || 0}`,
        )
      }
    }

    setProcessingPayment(false)
  }

  async function successCallbackStatePayment(orderId: string) {
    setShowPaymentPopup(false)
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
        instituteName: rowData?.instituteName,
        instituteType: rowData?.instituteType,
        courseType: courseType,
        course: course,
        state: stateCode === "all" ? "All India" : state,
        stateCode:
          stateCode?.toLowerCase() === "all" ? "all" : stateCode.toLowerCase(),
        // year: configYear?.text,
      },
    }
    // console.log("Payload: ",payload)
    const res = await fetchData({
      url: "/api/purchase",
      method: "POST",
      data: payload,
    })
    // console.log("Res state datas: ",res)
    if (res?.success) {
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
        setStatePaymentPopup(false)
        setUpdateUI((prev) => !prev)
      }
    }

    setProcessingPayment(false)
  }

  function backURL() {
    return `/closing-ranks?courseType=${courseType}&course=${course}`
  }
  const handleClose = () => {
    setProcessingPayment(false)
    setShowPaymentPopup(false)
  }
const showCollege =
  courseType?.toUpperCase().includes("UG")
    ? course === "MBBS"
      ? "Medical"
      : course === "BDS"
      ? "Dental"
      : course === "BAMS"
      ? "Ayurveda"
      : course === "BHMS"
      ? "Homeopathy"
      : "Medical"
    : "";

  const totalCost = amount * (tableData?.totalItems || 0)
  // const savingsPercent = ((totalCost - stateAmount) * 100) / stateAmount
  // const savingsMultiplier = (totalCost / stateAmount).toFixed(0)
  return (
    <FELayout>
      <div>
        <section className="w-full py-12 md:py-16 bg-gradient-to-r from-yellow-50 to-emerald-50 relative overflow-hidden">
          <Container className="container px-4 md:px-6">
            <Link
              href={backURL()}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 mb-6"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to All States
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-3">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 capitalize text-color-table-header">
                  {state} {showCollege} Colleges
                </h1>
                <p className="text-gray-600">
                  {courseType}{" "}
                  {courseType?.includes("PG") ? prevYear : currentYear}
                  <span className="capitalize"> {state} </span> {showCollege} Colleges
                  List
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Main Content */}
        <section className="w-full">
          <Container className="container px-4 md:px-6">
            <div
              className={cn(
                "bg-sky-50 border border-sky-200 p-4 rounded-md text-color-text flex gap-2 pc:hidden overflow-hidden my-3",
              )}
            >
              <p className="animated-new text-center">
                Rotate your Phone to Landscape or Horizontal For Better view.
              </p>
            </div>
            <div className="flex flex-col-reverse md:flex-row md:items-end">
              {/* PageSize + Table */}
              <div className="flex justify-between items-center mb-4">
                <PageSizeSelector
                  pageSize={pageSize}
                  onChange={(size) => {
                    setPageSize(size)
                    setCurrentPage(1) // reset page
                    updateURL(1, size) // update URL
                    // getData();   // fetch new data
                  }}
                />
              </div>
              <div className="flex relative items-end md:justify-end flex-col md:flex-row w-full mb-4 gap-2 md:gap-8">
                <SearchAndSelect
                  name="instituteType"
                  labelNode={
                    <div className="md:text-lg text-sm font-bold text-nowrap">
                      Select InstituteType
                    </div>
                  }
                  // boxWrapperClass="border-color-accent"
                  placeholder="Institute Type"
                  value={selectedInstituteType}
                  onChange={({ selectedValue }) => {
                    setSelectedInstituteType(selectedValue)
  setCurrentPage(1) // reset page
                    updateURL(1, pageSize) // update URL
                    clearErrors("instituteType")
                  }}
                  control={control}
                  defaultOption={{
                    id: "",
                    text: "",
                  }}
                  setValue={setValue}
                  options={
                    stateCode?.toLowerCase() === "all"
                      ? allInstituteTypes(courseType)
                      : stateInstituteTypes
                  }
                  debounceDelay={0}
                  searchAPI={(text, setOptions) =>
                    autoComplete(
                      text,
                      stateCode?.toLowerCase() === "all"
                        ?allInstituteTypes(courseType)
                        : stateInstituteTypes,
                      setOptions,
                    )
                  }
                  wrapperClass="w-full md:max-w-[200px]"
                  errors={errors}
                />
                {stateCode?.toLowerCase() === "all" && (
                  <SearchAndSelect
                    name="state"
                    labelNode={
                      <div className="md:text-lg text-sm font-bold text-nowrap">
                        Select State
                      </div>
                    }
                    placeholder="Select state"
                    value={selectedState}
                    // boxWrapperClass="border-color-accent"
                    onChange={({ selectedValue }) => {
                      setSelectedState(selectedValue)
  setCurrentPage(1) // reset page
                    updateURL(1, pageSize) // update URL
                      clearErrors("state")
                    }}
                    control={control}
                    setValue={setValue}
                    defaultOption={{
                      id: "",
                      text: "",
                    }}
                    required
                    errorClass="absolute"
                    options={states}
                    debounceDelay={0}
                    wrapperClass="w-full md:max-w-[200px]"
                    searchAPI={(text, setOptions) =>
                      autoComplete(text, states, setOptions)
                    }
                    disabled={isEmpty(states)}
                    errors={errors}
                  />
                )}
                {(selectedInstituteType?.text || selectedState?.text) && (
                  <Button
                    className="flex items-center gap-2 text-white p-3 relative text-sm bg-color-table-header hover:bg-color-table-header"
                    onClick={() => {
                      setSelectedInstituteType(undefined)
                      setSelectedState(undefined)
                    }}
                  >
                    <X size={18} />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
            <Table
              columns={generateCols()}
              data={tableData?.data}
              itemsCountPerPage={pageSize}
              loading={isLoading}
            />

            <Pagination
              currentPage={currentPage}
              totalItems={tableData?.totalItems}
              itemsCountPerPage={pageSize}
              wrapperClass="pb-[20px]"
              onPageChange={(page) => {
                setCurrentPage(page)
              }}
            />
          </Container>
        </section>

        {tableData?.data?.length > 0 &&
          !tableData?.data?.[0]?.statePurchased && (
            <section className="w-full  p-3 flex items-center justify-center">
              <Card className="max-w-xl md:p-6 p-4 shadow-lg bg-gradient-to-b from-yellow-50/50 to-emerald-50/50 text-left">
                {/* <Card className="p-6 shadow-lg bg-green-50 text-center"> */}
                <h2 className="text-xl font-bold text-color-table-header">
                  {`Unlock All ${state}'s ${courseType} ${course} Closing Ranks`}
                </h2>
                <p className="text-gray-600 mt-2">
                  Get access to <strong>{tableData?.total_table_count || 0}</strong>{" "}
                  colleges across <br className="md:hidden" />
                  <strong>{state}</strong> round-wise closing ranks in one
                  place.
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
                  className="w-full uppercase font-bold mt-6 py-3 text-white bg-color-table-header/95  hover:bg-color-table-header active:bg-color-table-header rounded-md shadow-md hover:scale-105 transition flex items-center justify-center gap-2"
                  onClick={() => {
                    fetchData({
                      url: "/api/user",
                      method: "GET",
                      noToast: true,
                    }).then((user) => {
                      if (user?.success) {
                        setStatePurchaseMode(true)
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
          )}

        <section className="w-full my-10">
          <Container className="container px-4 md:px-6">
            {/* Expert Guidance CTA */}
            <div className="border border-color-accent rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
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
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 font-medium px-6 py-3 rounded-lg shadow-md flex items-center gap-2 text-white"
              >
                <Users className="h-5 w-5" />
                Book Counselling Session
              </Link>
            </div>
          </Container>
        </section>
      </div>
      <SignInPopup
        successCallback={() => {
          setUpdateUI((prev) => !prev)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
      />



      <PaymentPopupCard
        isOpen={statePaymentPopup}
        onClose={() => setStatePaymentPopup(false)}
        onConfirm={() => setStatePaymentPopup(false)}
        paymentDescription="CollegeCutOff.net Payment for State Closing Ranks"
        title={
          <p className="p-0 uppercase poppinsFont">
            {`Please make payment to Unlock: All ${state}'s NEET ${course} Closing Ranks`}
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
                    ? `Access All Round's of MD/MS/Diploma Cut-off Rank / Marks / Percentile Details (NEET PG ${
  ["all", "br", "ka"].includes(stateCode?.toLowerCase() ?? "")
    ? " 2025 & 2024"
    //: "2024"
    :"2025 & 2024"
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

<UnlockPopover
  isOpen={showUnlockPopover}
  onClose={() => {
    setShowUnlockPopover(false);
    setProcessingPayment(false);      // ensure UI resets if user closes modal
    setStatePurchaseMode(false);
  }}
  // You can pass tab-specific header text:
  titleSingle={<p className="p-0 uppercase poppinsFont">Please make payment to Unlock: {rowData?.instituteName}</p>}
  titleState={<p className="p-0 uppercase poppinsFont">Please make payment to Unlock: All {state?.toUpperCase()} Colleges</p>}
  // props
  amount={amount}
  stateAmount={stateAmount}
  stateName={state || ""}
  collegeCount={tableData?.total_table_count || 0}
  paymentDescription="CollegeCutOff.net Payment for Closing Ranks"
  courseType={courseType}
  course={course}
  initialTab="single" // optional: 'single' or 'state'
  onBuySingle={() => {
    // called immediately before starting payment when user confirms the "single" tab
    setProcessingPayment(rowData?.id);
    setPaymentChecker(true);
  }}
  onBuyState={() => {
    // called immediately before starting payment when user confirms "state" tab
    setProcessingPayment(rowData?.id);
    setStatePurchaseMode(true);
    setPaymentChecker(true);
  }}
  onConfirm={(verifyData) => {
    // verifyData is the object returned by your /api/verify
    // prefer handling the full payload rather than assuming fields
    // const orderId = verifyData?.orderId ?? verifyData?.razorpay_order_id ?? "";
    // successCallback(orderId); // or pass entire verifyData if your successCallback supports it
    setShowUnlockPopover(false);
  }}
  stateCode={stateCode}
/>
      {paymentChecker && (
        <PaymentRedirectPopup
          successCallback={
            statePurchaseMode ? successCallbackStatePayment : successCallback
          }
        />
      )}
    </FELayout>
  )
}