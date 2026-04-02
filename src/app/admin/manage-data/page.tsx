"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { ClosingRankGuide } from "@/components/common/ClosingRankGuide"
import { Input } from "@/components/common/Input"
import { PageSizeSelector } from "@/components/common/PageSizeSelector"
import { Pagination, PaginationHandle } from "@/components/common/Pagination"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { generateCols } from "@/components/common/Table/Cols"
import { Table } from "@/components/common/Table/Table"
import { TableDeleteButton } from "@/components/common/Table/TableDeleteButton"
import { ConfirmEditYearPopup } from "@/components/common/popups/ConfirmEditYearPopup"
import { ConfirmationPopup } from "@/components/common/popups/ConfirmationPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { allInstituteTypes, stateInstituteTypes, states } from "@/utils/static"
import { autoComplete, cn, isEmpty } from "@/utils/utils"
import { X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip } from "react-tooltip"

interface IFormData {
  courses?: IOption
  courseType?: IOption
}

export default function ManageDataPage() {
  const [tableData, setTableData] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [popupOpen, setPopupOpen] = useState(false)
  const [updateUI, setUpdateUI] = useState(false)
  const [singleDelete, setSingleDelete] = useState<any>([])
  const [configYear, setConfigYear] = useState<any>([])
  const [stateList, setStateList] = useState<IOption[]>([])
  const [courseTypeList, setCourseTypeList] = useState<IOption[]>([])
  const [courseType, setCourseType] = useState<IOption | undefined>()
  const [seletectedState, setSeletectedState] = useState<IOption | undefined>()
  const [rowData, setRowData] = useState<any>([])
  const [searchInput, setSearchInput] = useState("")
  const [filteredStateList, setFilteredStateList] = useState<IOption[]>([])

  // const paginationRef = useRef<PaginationHandle>(null)

  const { fetchData } = useFetch()
  const { showToast } = useAppState()
  const searchParams = useSearchParams()
  const { setSearchParams } = useInternalSearchParams()

  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseType,
      state: seletectedState,
    },
  })
  const [selectedInstituteType, setSelectedInstituteType] = useState<
    IOption | undefined
  >()
  const [cachedData, setCachedData] = useState<Record<string, any[]>>({})
  const [selectedStateOption, setSelectedStateOption] = useState<
    IOption | undefined
  >()
  // 🔑 Utility to generate cache key consistently
  const getCacheKey = () =>
    JSON.stringify({
      page: currentPage,
      size: pageSize,
      state: seletectedState?.code,
      courseType: courseType?.text,
      filterState: selectedStateOption?.text,
      instituteType: selectedInstituteType?.text,
      search: searchInput,
    })

  const pathname = usePathname()
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("size") || 20),
  )
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") || 1),
  )
  const router = useRouter()

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [statesRes, coursesRes] = await Promise.all([
          fetchData({ url: "/api/states" }),
          fetchData({ url: "/api/get-courses-types" }),
        ])
        if (statesRes?.success) {
          const states = [
            { id: "All States", code: "all", text: "All India" },
            ...(statesRes?.payload?.data || []),
          ]
          setStateList(states)
          setFilteredStateList(states)
        }
        if (coursesRes?.success) {
          const courses =
            (coursesRes?.payload?.data || []).map((q: IOption) => ({
              id: q.id,
              text: q.type,
            })) || []

          setCourseTypeList(courses)
        }
      } catch (error) {
        console.error("Initial data load error:", error)
      }
    }

    fetchInitialData()
  }, [])

  async function getData(searchOverride?: string, page?: number) {
    if (!seletectedState?.code && !seletectedState?.text) {
      showToast("error", "Please Select Table Name")
      return
    }

    const search = searchOverride ?? searchInput
    const [dataRes, configRes] = await Promise.all([
      fetchData({
        url: "/api/admin/get_data",
        params: {
          page: page || currentPage,
          size: pageSize,
          stateCode: seletectedState?.code,
          courseType: courseType?.text,
          filterState: selectedStateOption?.text || "",
          instituteType: selectedInstituteType?.text || "",
          ...(search && { instituteName: search }),
        },
        noToast: false,
      }),
      fetchData({
        url: "/api/admin/configure/get",
        params: { type: "CONFIG_YEAR" },
      }),
    ])

    if (dataRes?.success) {
      setTableData(dataRes.payload)
      const key = getCacheKey()
      setCachedData((prev) => ({ ...prev, [key]: dataRes.payload }))
    }

    if (configRes?.success) {
      setConfigYear(
        configRes?.payload?.data?.[0]?.text
          ? configRes.payload.data[0].text
              .split("-")
              .map((item: string) => item.trim())
          : [],
      )
    }
  }


  useEffect(() => {
    const key = getCacheKey()

    if (cachedData[key]) {
      setTableData(cachedData[key])
      console.log("Calling from cached current")
      return
    }

    if (seletectedState) {
      console.log("Calling from API current")
      getData(searchInput, currentPage)
    }
  }, [currentPage])

  useEffect(() => {
    const key = getCacheKey()

    if (cachedData[key]) {
      setTableData(cachedData[key])
      console.log("Calling from cached page: 1")
      return
    }

    if (seletectedState) {
      console.log("Calling from Api page: 1")
      setCurrentPage(1)
      updateURL(1, pageSize)
      getData(searchInput, 1)
    }
  }, [
    selectedInstituteType,
    selectedStateOption,
    pageSize,
    updateUI,
    seletectedState,
    courseType,
  ])

  function updateURL(newPage: number, newSize: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    params.set("size", newSize.toString())
    router.replace(`${pathname}?${params.toString()}`)
  }

  async function deleteData() {
    const idsToDelete: string[] =
      singleDelete?.length > 0
        ? singleDelete
        : selectedRows?.map((row: any) => row.id)
    if (!idsToDelete.length) {
      showToast("error", "No rows selected for deletion.")
      return
    }
    try {
      const res = await fetchData({
        url: "/api/admin/delete_data",
        method: "POST",
        data: {
          id: idsToDelete,
          stateCode: seletectedState?.code,
        },
      })

      setSingleDelete([])
      setSelectedRows([])
      setPopupOpen(false)

      if (res?.success) {
        showToast("success", res?.payload?.msg || "Deleted successfully")
        setUpdateUI((prev) => !prev)
        getData()
      } else {
        showToast("error", res?.payload?.msg || "Failed to delete")
      }
    } catch (error) {
      showToast("error", "Something went wrong during deletion.")
      console.error("Delete error:", error)
    }
  }
  async function onSubmit() {
    if (!seletectedState?.text) {
      showToast("error", "Please select table")
      return
    }

    const key = getCacheKey()
    if (cachedData[key]) {
      setTableData(cachedData[key])
      // console.log("Calling from cached")
      return
    }
setCurrentPage(1)
     updateURL(1, pageSize)
    getData(searchInput, 1)
  }

  return (
    <BELayout className="mb-10 tab:mb-0 pc:max-w-[calc(100vw-213px)] p-0 ml-0 !px-0">
      <div className="pb-4 pc:pb-8 flex justify-between flex-col pc:flex-row">
        <h2 className="text-color-text text-2xl pc:text-3xl w-full text-left pc:pb-6 pb-4 pt-4">
          Manage Data
        </h2>
        <ClosingRankGuide className="max-w-[900px] flex-shrink-0" />
      </div>

      <Card className="mt-4 py-6 px-0">
        <div className="flex items-end sm:flex-row flex-col  px-2 md:gap-15 gap-5 mb-7">
          <SearchAndSelect
            name="state"
            label="Select Table"
            placeholder="Search and Select"
            // options={stateList}
            options={filteredStateList}
            control={control}
            setValue={setValue}
            required
            // searchAPI={(text, setOptions) =>
            //   autoComplete(text, stateList, setOptions)
            // }
  searchAPI={(text, setOptions) => {
  if (!text) {
    setFilteredStateList(stateList)
    setOptions(stateList)
    return
  }

  const filtered = stateList.filter((item) =>
    item.text.toLowerCase().includes(text.toLowerCase())
  )

  setFilteredStateList(filtered) // 🔥 update parent
  setOptions(filtered)           // 🔥 update child
}}
            defaultOption={{
              id: "",
              text: "",
            }}
            wrapperClass="md:max-w-[395px] w-full"
            onChange={({ name, selectedValue }) => {
              setValue("state", selectedValue)
              setSeletectedState(selectedValue)
              // setSearchParams("page", "1") // Reset page when state changes
              // paginationRef.current?.setActivePage(1) // Reset pagination UI
            }}
            value={seletectedState}
            errors={errors}
          />
          {/* {console.log(seletectedState)} */}
          {seletectedState?.text && (
            <SearchAndSelect
              name="courseType"
              label="Course Type"
              placeholder="Select Course Type"
              options={courseTypeList}
              control={control}
              setValue={setValue}
              searchAPI={(text, setOptions) =>
                autoComplete(text, courseTypeList, setOptions)
              }
              defaultOption={{
                id: "",
                text: "",
              }}
              wrapperClass="md:max-w-[395px] w-full"
              onChange={({ name, selectedValue }) => {
                setValue("courseType", selectedValue)
                setCourseType(selectedValue)
                // setSearchParams("page", "1") // Reset page when course changes
                // paginationRef.current?.setActivePage(1) // Reset pagination UI
              }}
              value={courseType}
              errors={errors}
            />
          )}
          {seletectedState?.text && (
            <SearchAndSelect
              name="instituteType"
              label="InstituteType"
              // boxWrapperClass="border-color-accent"
              placeholder="Institute Type"
              value={selectedInstituteType}
              onChange={({ selectedValue }) => {
                setSelectedInstituteType(selectedValue)
                clearErrors("instituteType")
              }}
              control={control}
              defaultOption={{
                id: "",
                text: "",
              }}
              setValue={setValue}
              options={
                seletectedState?.code?.toLowerCase() === "all"
                  ? allInstituteTypes
                  : stateInstituteTypes
              }
              debounceDelay={0}
              searchAPI={(text, setOptions) =>
                autoComplete(
                  text,
                  seletectedState?.code?.toLowerCase() === "all"
                    ? allInstituteTypes
                    : stateInstituteTypes,
                  setOptions,
                )
              }
              wrapperClass="md:max-w-[395px] w-full"
              errors={errors}
            />
          )}
          {seletectedState?.code?.toLowerCase() === "all" && (
            <SearchAndSelect
              name="stateOption"
              label="Select State"
              placeholder="Select state"
              value={selectedStateOption}
              // boxWrapperClass="border-color-accent"
              onChange={({ selectedValue }) => {
                setSelectedStateOption(selectedValue)

                clearErrors("stateOption")
              }}
              control={control}
              setValue={setValue}
              defaultOption={{
                id: "",
                text: "",
              }}
              errorClass="absolute"
              options={states}
              debounceDelay={0}
              wrapperClass="md:max-w-[395px] w-full"
              searchAPI={(text, setOptions) =>
                autoComplete(text, states, setOptions)
              }
              disabled={isEmpty(states)}
              errors={errors}
            />
          )}
          <Button
            onClick={() => {
              setUpdateUI((prev) => !prev)
            }}
            disabled={!seletectedState?.text}
          >
            Find
          </Button>

          {(selectedInstituteType?.text ||
            selectedStateOption?.text ||
            courseType?.text ||
            searchInput) && (
            <Button
              className="flex flex-nowrap text-nowrap items-center gap-2 text-white p-3.5 relative text-sm bg-color-table-header hover:bg-color-table-header"
              onClick={() => {
                setSelectedInstituteType(undefined)
                setSelectedStateOption(undefined)
                setCourseType(undefined)
                setSearchInput("")
                setUpdateUI((prev) => !prev)
              }}
            >
              <X size={18} className="md:hidden" />
              Clear Filters
            </Button>
          )}
        </div>

        {tableData?.data && (
          <div className="flex items-left flex-col  md:flex-row gap-4 md:gap-28 justify-between mb-4 px-2">
            <div className="flex md:items-center md:flex-row w-full md:justify-between items-end flex-col-reverse gap-5 ">
              <PageSizeSelector
                pageSize={pageSize}
                className={`${selectedRows?.length > 0 ? "hidden" : "block"} md:block mr-auto`}
                onChange={(size) => {
                  setPageSize(size)
                  setCurrentPage(1) // reset page
                  updateURL(1, size) // update URL
                  //  getData(searchInput)
                }}
              />

              <form
                className="flex items-center gap-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Input
                  name="searchInput"
                  type="text"
                  placeholder="Search by Institute Name..."
                  value={searchInput}
                  onChange={(e) => {
                    const val = e.target.value
                    setSearchInput(val)
                    // if (val === "") {
                    //   setTimeout(() => getData(val), 50)
                    // }
                  }}
                  control={control}
                  setValue={setValue}
                  rules={{ required: false }}
                  errors={errors}
                  dummyLabel="Search"
                  errorClass="absolute"
                  // wrapperClass="w-full max-w-[230px] shrink-0"
                  boxWrapperClass="p-2"
                />
                <Button
                  type="submit"
                  className={cn(
                    "text-white text-sm py-[10px] px-4",
                    !searchInput && "opacity-50",
                  )}
                  disabled={!searchInput}
                >
                  Search
                </Button>
              </form>
            </div>
            {selectedRows?.length > 0 && (
              <div className="flex">
                <PageSizeSelector
                  pageSize={pageSize}
                  className="md:hidden"
                  onChange={(size) => {
                    setPageSize(size)
                    setCurrentPage(1) // reset page
                    updateURL(1, size) // update URL
                    //  getData(searchInput)
                  }}
                />

                <TableDeleteButton
                  className="w-fit py-[10px] ml-auto flex-nowrap text-nowrap"
                  title={`Delete ${selectedRows.length} row${selectedRows.length > 1 ? "s" : ""}`}
                  onClick={() => setPopupOpen(true)}
                  disabled={isEmpty(selectedRows)}
                />
              </div>
            )}
          </div>
        )}
        {tableData?.data ? (
          <>
            <Table
              columns={generateCols(
                configYear,
                {
                  isAdmin: true,
                  setRowData,
                  setPopupOpen,
                  setSingleDelete,
                },
                showToast,
                courseType?.text,
                seletectedState,
              )}
              data={tableData?.data}
              itemsCountPerPage={pageSize}
              selectable
              onChange={(rows: any[]) => setSelectedRows(rows)}
            />

            <Pagination
              // ref={paginationRef}
              currentPage={currentPage}
              totalItems={tableData?.totalItems}
              itemsCountPerPage={pageSize}
              wrapperClass="pb-[50px]"
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </>
        ) : (
          <div className="font-medium text-xl p-2 min-h-screen flex items-start justify-center mt-10">
            {seletectedState
              ? "click on find button to see data"
              : " Please Select Table Name"}
          </div>
        )}
      </Card>

      <ConfirmEditYearPopup
        isOpen={!isEmpty(rowData)}
        onClose={() => setRowData(null)}
        rowData={rowData}
      />

      <ConfirmationPopup
        isOpen={popupOpen}
        title="Are You Sure You Want To Delete ?"
        text="This action cannot be undone."
        onClose={() => setPopupOpen(false)}
        onConfirm={deleteData}
      />

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
    </BELayout>
  )
}

