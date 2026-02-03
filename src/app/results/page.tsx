"use client"

import { IOptionProps } from "@/components/admin-panel/add-data/AddDataForm"
import { Button } from "@/components/common/Button"
import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import { PageSizeSelector } from "@/components/common/PageSizeSelector"
import { Pagination, PaginationHandle } from "@/components/common/Pagination"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { Table, TableColumn } from "@/components/common/Table/Table"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import {
  Filter,
  IFormData,
} from "@/components/frontend/college-predictor/Filter"
import { FilterPopup } from "@/components/frontend/college-predictor/FilterPopup"
import { SearchForm } from "@/components/frontend/college-predictor/SearchForm"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { instituteTypes, paymentType, priceType, states } from "@/utils/static"
import {
  autoComplete,
  cn,
  extractCourseName,
  getLocalStorageItem,
  isEmpty,
  isExpired,
} from "@/utils/utils"
import { Settings2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip } from "react-tooltip"

import TableSignup from "./TableSignup"

export default function ResultPage() {
  const {
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()
  const [tableData, setTableData] = useState<any>(null)
  const [configYear, setConfigYear] = useState<any>([])
  const [coursesList, setCoursesList] = useState<IOption[]>([])
  const [filterPopup, setFilterPopup] = useState(false)
  const [filterParams, setFilterParams] = useState<any>(null)
  const [updateUI, setUpdateUI] = useState(false)
const [loading,setLoading] = useState(false)
  const [paid, setPaid] = useState(false)
  const [amount, setAmount] = useState(149)

  const { fetchData } = useFetch()
  const { appState } = useAppState()
  const { getSearchParams, setSearchParams } = useInternalSearchParams()
  const [showTableSignup, setShowTableSignup] = useState(false) // Add this state
  const paginationRef = useRef<PaginationHandle>(null)

  const [mobFilterFormData, setMobFilterFormData] = useState<IFormData>({
    instituteType: [],
    category: [],
    quota: [],
  })
  const [fitlerFormData, setFilterFormData] = useState<IFormData>({
    instituteType: [],
    category: [],
    quota: [],
  })
  const stateCode = getSearchParams("stateCode")
  const courseType = getSearchParams("courseType")?.trim()
  const course = getSearchParams("course")?.trim()
  const state = getSearchParams("state")
  const rank = getSearchParams("rank")
  const [selectedInstituteType, setSelectedInstituteType] = useState<
    IOption | undefined
  >()
  const [selectedState, setSelectedState] = useState<IOption | undefined>()

  const [pageSize, setPageSize] = useState(
    Number(getSearchParams("size") || 20),
  )
  const [currentPage, setCurrentPage] = useState(
    Number(getSearchParams("page") || 1),
  )
  // useEffect(() => {
  //     if(state&& course&& courseType&&rank)
  //   verifyPurchases(state,course,courseType,rank)
  // }, [filterParams, updateUI,state,course,courseType,rank])
  const router = useRouter()
  useEffect(() => {
    if (state && course && courseType && pageSize && currentPage)
      getConfigs(state, course, courseType)
  }, [state, course, courseType, pageSize, currentPage])


  // console.log("Page SIze: ",pageSize)
  const [showSignup, setShowSignup] = useState(false)

  useEffect(() => {
    if (!paid && tableData) {
      setShowSignup(true)
    }
  }, [paid, tableData])

  function updateURL(newPage: number, newSize: number) {
    const params = new URLSearchParams(window.location.search)
    params.set("page", newPage.toString())
    params.set("size", newSize.toString())
    router.replace(`${window.location.pathname}?${params.toString()}`)
  }

  useEffect(() => {
    if (course && state && stateCode && courseType && rank) getData(currentPage)
  }, [state, course, courseType, rank, stateCode, filterParams, updateUI])

  async function getConfigs(state: string, course: string, courseType: string) {
    const getPriceParams = {
      type: "",
      item: "",
    }
    // Type guard to ensure the key is valid
    function isValidPriceTypeKey(key: string): key is keyof typeof priceType {
      return key in priceType
    }
    const courseTypeName =
      courseType && courseType.includes(" ")
        ? courseType.split(" ")[1].toUpperCase()
        : courseType.toUpperCase()
    let courseName = ""
    if (courseType?.toUpperCase() === "DNB") {
      const c = extractCourseName(course) || ""
      courseName =
        course === "All Course"
          ? "ALL"
          : c.includes(" ")
            ? c.split(" ").join("_").toUpperCase()
            : c.toUpperCase()
      // console.log("DNB: ",courseName)
    } else {
      courseName =
        course === "All Course"
          ? "ALL"
          : course.includes(" ")
            ? course.split(" ").join("_").toUpperCase()
            : course.toUpperCase()
    }

    if (stateCode !== "all") {
      const stateKeyCourse = `STATE_COLLEGE_PREDICTOR_${courseTypeName}_${courseName}`
      getPriceParams.type = isValidPriceTypeKey(stateKeyCourse)
        ? priceType[stateKeyCourse]
        : ""

      getPriceParams.item = state
    } else {
      const allIndiaKeyCourse = `ALL_INDIA_COLLEGE_PREDICTOR_${courseTypeName}_${courseName}`
      getPriceParams.type = isValidPriceTypeKey(allIndiaKeyCourse)
        ? priceType[allIndiaKeyCourse]
        : ""

      getPriceParams.item = "All India"
    }
    // console.log("Price Params: ",getPriceParams)
    const [coursesData, priceData] = await Promise.all([
      fetchData({
        url: "/api/get-courses",
        params: {
          type: courseType,
        },
      }),

      fetchData({
        url: "/api/admin/configure_prices/get",
        params: getPriceParams,
        noLoading: true,
        noToast: true,
      }),
    ])

    if (courseType?.toUpperCase().includes("PG")) {
      setCoursesList([
        { id: "all", text: "All Course" },
        ...coursesData?.payload?.data,
      ])
    } else if (courseType?.toUpperCase().includes("DNB")) {
      setCoursesList([
        { id: "all", text: "All Course" },
        ...coursesData?.payload?.data,
      ])
    } else {
      setCoursesList(coursesData?.payload?.data || [])
    }
    setAmount(priceData?.payload?.data?.price || 149)
  }

  async function getData(paginationPage: any) {
try {
  setLoading(true)

    const page = paginationPage || currentPage
    const size = pageSize
    const rank = getSearchParams("rank")
    const course = getSearchParams("course")
    const courseType = getSearchParams("courseType")
    const rankType = getSearchParams("rankType") ?? null
    const quota = getSearchParams("quota")
    const subQuota = getSearchParams("subQuota")
    const category = getSearchParams("category")
    const subCategory = getSearchParams("subCategory")

    const params: Record<string, any> = {
      page,
      size,
      rank,
      rankType,
      course,
      courseType,
      state: getSearchParams("state"),
      filterState: selectedState?.text || "",
      instituteType: selectedInstituteType?.text || "",
      stateCode: getSearchParams("stateCode"),
      quota,
      subCategory,
      subQuota,
      category,
    }

    if (!isEmpty(filterParams)) {
      Object.entries(filterParams).forEach(([key, value]: any) => {
        if (!isEmpty(value)) {
          params[key] = value
        }
      })

      // if (!paginationPage) {
      //   setSearchParams("page", "1")
      //   if (paginationRef.current) {
      //     paginationRef.current.setActivePage(1)
      //   }
      // }
    }


    console.log("SENDING PARAMS: ",params)
    const [dataRes] = await Promise.all([
      fetchData({
        url: "/api/predict_college",
        params,
      }),
    ])

    // console.log(dataRes)
    if (dataRes?.success) {
      setPaid(dataRes?.payload?.isPurchase || false)
      setTableData(dataRes?.payload)
      // console.log(dataRes.payload)
    }
    } catch (error) {
  console.log("Error",error)
}
finally{
    setLoading(false)
}
  
  }

  function generateCols(paid: boolean, stateCode?: any) {
    let currentYear = new Date().getFullYear()-1
    let previousYear = currentYear - 1
    const percentile_Marks =
      getSearchParams("rankType") === "Marks" ? "Marks" : "Percentile"

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
      { title: "Sub-Quota", tableKey: "subQuota", width: "150px" },
      // { title: "Category", tableKey: "category", width: "150px" },
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
          // console.log(cellData)
          // return cellData !== "xxx" &&
          //   (cellData === "undefined" ||
          //     cellData === "null" ||
          //     cellData == null) ? (
          //   !paid ? (
          //     "xxx"
          //   ) : (
          //     "NA"
          //   )
          return cellData !== "xxx" &&
            (cellData === "undefined" ||
              cellData === "null" ||
              cellData == null) ? (
            !paid ? (
              "xxx"
            ) : (
              "NA"
            )
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
      ...(getSearchParams("courseType") === "NEET UG"
        ? [
            {
              title: (
                <div
                  data-tooltip-id="tooltip"
                  data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${currentYear}`}
                >
                  {`Closing Rank/ ${percentile_Marks} [R2] ${currentYear}`}
                </div>
              ),
              tableKey: `showClosingRankR2`,
              width: "190px",
              renderer({ cellData }) {
                return cellData !== "xxx" &&
                  (cellData === "undefined" ||
                    cellData === "null" ||
                    cellData == null) ? (
                  !paid ? (
                    "xxx"
                  ) : (
                    "NA"
                  )
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
                  data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${currentYear}`}
                >
                  {`Closing Rank/ ${percentile_Marks} [R3] ${currentYear}`}
                </div>
              ),
              tableKey: `showClosingRankR3`,
              width: "190px",
              renderer({ cellData }) {
                return cellData !== "xxx" &&
                  (cellData === "undefined" ||
                    cellData === "null" ||
                    cellData == null) ? (
                  !paid ? (
                    "xxx"
                  ) : (
                    "NA"
                  )
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
                  data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
                >
                  {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
                </div>
              ),
              tableKey: `showStrayRound`,
              width: "210px",
              renderer({ cellData }) {
                return cellData !== "xxx" &&
                  (cellData === "undefined" ||
                    cellData === "null" ||
                    cellData == null) ? (
                  !paid ? (
                    "xxx"
                  ) : (
                    "NA"
                  )
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
                  data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
                >
                  Last {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
                </div>
              ),
              tableKey: `showLastStrayRound`,
              width: "210px",
              renderer({ cellData }) {
                return cellData !== "xxx" &&
                  (cellData === "undefined" ||
                    cellData === "null" ||
                    cellData == null) ? (
                  !paid ? (
                    "xxx"
                  ) : (
                    "NA"
                  )
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
          ]
        : []),

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
            !paid ? (
              "xxx"
            ) : (
              "NA"
            )
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
            !paid ? (
              "xxx"
            ) : (
              "NA"
            )
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
            !paid ? (
              "xxx"
            ) : (
              "NA"
            )
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
            !paid ? (
              "xxx"
            ) : (
              "NA"
            )
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
            !paid ? (
              "xxx"
            ) : (
              "NA"
            )
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
      // { title: "State", tableKey: "state", width: "150px" },
      { title: "Fees", tableKey: "fees", width: "100px" },
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

  function filterCount() {
    let count = 0

    if (!isEmpty(mobFilterFormData?.instituteType)) {
      count += mobFilterFormData?.instituteType?.length
    }

    if (!isEmpty(mobFilterFormData?.category)) {
      count += mobFilterFormData?.category?.length
    }

    if (!isEmpty(mobFilterFormData?.quota)) {
      count += mobFilterFormData?.quota?.length
    }

    return count
  }

  return (
    <FELayout>
      <Container className="pb-10 pt-1 pc:pt-10">
        <div className="pb-4 pc:pb-8 flex justify-between flex-col pc:flex-row">
          <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 pt-4">
            NEET Collage Predictor
          </h2>

          <ClosingRankGuide className="max-w-[900px] flex-shrink-0" />
        </div>

        <div
          className={cn(
            "bg-sky-50 border border-sky-200 p-4 rounded-md text-color-text flex gap-2 pc:hidden overflow-hidden my-3",
          )}
        >
          <p className="animated-new text-center">
            Rotate your Phone to Landscape or Horizontal For Better view.
          </p>
        </div>

        <div className="mt-10 block pc:flex items-start rounded-lg relative">
          {paid && (
            <>
              <Filter
                className="flex-shrink-0 w-[300px] hidden pc:flex"
                setFilterFormData={setFilterFormData}
                filterFormData={fitlerFormData}
                setFilterParams={setFilterParams}
              />

              <Button
                className="flex items-center ml-auto gap-2 text-white px-4 mt-2 relative text-sm pc:hidden mb-3 bg-color-table-header hover:bg-color-table-header"
                onClick={() => setFilterPopup(true)}
              >
                {filterCount() > 0 && (
                  <p className="bg-red-600 size-5 rounded-full absolute top-[-10px] right-[-3px] grid place-items-center text-white font-semibold text-xs">
                    {filterCount()}
                  </p>
                )}
                <Settings2 size={18} />
                Filter
              </Button>
            </>
          )}

          <div
            className="flex-1 border-color-border"
            style={{
              overflowX: "auto",
            }}
          >
            {paid && (
              <SearchForm
                coursesList={coursesList}
                setUpdateUI={setUpdateUI}
                setFilterParams={setFilterParams}
                setMobFilterFormData={setMobFilterFormData}
                disabled={!paid}
              />
            )}

            {/* PageSize + Table */}
            {paid && (
              <div className="flex justify-between items-center my-2">
                <PageSizeSelector
                  pageSize={pageSize}
                  onChange={(size) => {

                    console.log(size)
                    setPageSize(size)
                    setCurrentPage(1) // reset page
                    updateURL(1, size) // update URL
                  }}
                />
              </div>
            )}
            <Table
              columns={generateCols(paid, stateCode)}
              data={tableData?.data}
              className="min-h-[600px]"
              loading={loading}
            />

            <Pagination
              ref={paginationRef}
              currentPage={currentPage}
              totalItems={tableData?.totalItems}
              showOnlyOnePage={!paid}
              itemsCountPerPage={pageSize}
              wrapperClass="pb-[50px]"
              disabled={!paid}
              onPageChange={(page) => {
                setCurrentPage(page)
              }}
            />

            {/* in future we need to enable this paymen*/}

            {showSignup && !paid && (
              <TableSignup
                params={getSearchParams("courseType")}
                totalRecords={tableData?.totalItems}
                setUpdateUI={setUpdateUI}
                amount={amount}
                courseType={courseType}
                course={course}
                stateCode= {stateCode}
                // configYear={configYear}
              />
            )}
          </div>
        </div>

        <FilterPopup
          isOpen={filterPopup}
          setFilterParams={setFilterParams}
          setMobFilterFormData={setMobFilterFormData}
          mobFilterFormData={mobFilterFormData}
          onClose={() => setFilterPopup(false)}
          onConfirm={() => {}}
        />
      </Container>

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
    </FELayout>
  )
}

