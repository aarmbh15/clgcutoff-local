"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import RevenueAnalyticsChart from "@/components/admin-panel/dashboard/RevenueAnalyticsChart"
import { Card } from "@/components/common/Card"
import { Pagination } from "@/components/common/Pagination"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { Table, TableColumn } from "@/components/common/Table/Table"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import {
  autoComplete,
  isEmpty,
  onOptionSelected,
  onPageChange,
} from "@/utils/utils"
import { format, parseISO } from "date-fns"
import { IndianRupee } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const columns: TableColumn[] = [
  {
    title: "Purchased On",
    tableKey: "created_at",
    width: "120px",
    renderer({ cellData }) {
      return format(parseISO(cellData as string), "dd MMM yyyy / hh:mm a")
    },
  },
  {
    title: "Amount",
    tableKey: "amount",
    renderer({ cellData }) {
      return <div className="text-green-600 font-medium">₹ {cellData}</div>
    },
  },
  {
    title: "Purchase Type",
    tableKey: "payment_type",
    renderer({ cellData }) {
      // @ts-ignore
      return cellData?.replaceAll("_", " ")
    },
  },

  {
    title: "Phone Number",
    tableKey: "phone",
    width: "150px",
    renderer({ cellData }) {
      if (isEmpty(cellData)) {
        return <div>Without Login</div>
      }

      return (
        <Link
          href={`https://wa.me/${cellData}`}
          target="_blank"
          className="cursor-pointer"
        >
          <div className="text-blue-600 hover:underline">+{cellData}</div>
        </Link>
      )
    },
  },

  {
    title: "Razorpay Order ID",
    tableKey: "orderId",
  },
  {
    title: "Details",
    tableKey: "orderId",
    renderer({ rowData }) {
      return <div>{detailsRenderer(rowData)}</div>
    },
  },
]

function detailsRenderer(rowData: any) {
  if (rowData?.payment_type === "SINGLE_COLLEGE_CLOSING_RANK") {
    const { instituteName, instituteType, course, courseType, state, year } =
      rowData?.closing_rank_details

    return (
      <div>
        <p>Institute Name: {instituteName}</p>
        <p>Institute Type: {instituteType}</p>
        <p>State: {state}</p>

        <p>Course Type: {courseType}</p>
        {course&& <p>Course: {course}</p>}
      </div>
    )
  } else if (rowData?.payment_type === "RANK_COLLEGE_PREDICTOR") {
    const { course, rank, courseType,state } = rowData?.college_predictor_details

    return (
      <div>
        <p>Rank: {rank}</p>
        <p>Course: {course}</p>
           <p>State: {state}</p>

        <p>Course Type: {courseType}</p>
      </div>
    )
  } else if (rowData?.payment_type === "COLLEGE_CUT_OFF") {
    const { instituteName, courseType, state, course } =
      rowData?.college_cut_off_details

    return (
      <div>
        <p>Institute Name: {instituteName}</p>
        <p>State: {state}</p>
        {/* <div className="flex gap-2"> */}
        <p>Course Type: {courseType}</p>
          {/* <p>Course {course}</p> */}
          {/* <p>Year: {year}</p> */}
        {/* </div> */}
      </div>
    )
  } else if (rowData?.payment_type === "STATE_CLOSING_RANK") {
    const { course, courseType, state } = rowData?.closing_rank_details
    return (
      <div>
        <p>State: {state}</p>

        <p>Course Type: {courseType}</p>
        <p>Course: {course}</p>

      </div>
    )
  } else if (rowData?.payment_type === "ALL_INDIA_CLOSING_RANK") {
    const { course, courseType, state } = rowData?.closing_rank_details
    return (
      <div>

        <p>Course Type: {courseType}</p>
        <p>State: {state}</p>
       {course&& <p>Course: {course}</p>}

      </div>
    )
  }
   else {
    return null
  }
}

const optionsList = [
  { id: "today", text: "Today" },
  { id: "last7Days", text: "Last 7 Days" },
  { id: "thisMonth", text: "This Month" },
  { id: "thisYear", text: "This Year" },
  { id: "allTime", text: "All Time" },
]

export default function PaymentInsightsPage() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm()

  const [formData, setFormData] = useState<{ range?: IOption }>()

  const { fetchData } = useFetch()

  const [revenue, setRevenue] = useState({
    monthlyRevenue: 0,
    totalRevenue: 0,
  })

  const [tableData, setTableData] = useState<any>(null)
  const { getSearchParams } = useInternalSearchParams()

  useEffect(() => {
    fetchData({ url: `/api/admin/dashboard/revenue/get_total` }).then(
      (revenueRes) => {
        setRevenue({
          monthlyRevenue: revenueRes?.payload?.monthlyRevenue || 0,
          totalRevenue: revenueRes?.payload?.totalRevenue || 0,
        })
      },
    )
  }, [])

  useEffect(() => {
    getData()
  }, [])

  async function getData(range?: string) {
    const page = Number(getSearchParams("page") || 1)

    const res = await fetchData({
      url: `/api/admin/payment_insights`,
      params: {
        page,
        size: 20,
        range,
      },
    })

    if (res?.success) {
      setTableData(res?.payload)
    }
  }

  return (
    <BELayout className="mb-10 tab:mb-0">
      <div className="flex items-center justify-between pc:justify-end gap-6 mb-6 text-color-text text-xs tab:text-sm pc:text-base">
        <Card className="w-[300px] space-y-2">
          <div className="flex items-center justify-between">
            <div className="hidden tab:block">Monthly Revenue:</div>
            <div className="block tab:hidden">
              Monthly <br /> Revenue:
            </div>
            <div className="flex items-center">
              <IndianRupee size={16} strokeWidth={3} />{" "}
              <span className="font-semibold">{revenue?.monthlyRevenue}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="hidden tab:block">Total Revenue:</div>
            <div className="block tab:hidden">
              Total <br /> Revenue:
            </div>

            <div className="flex items-center">
              <IndianRupee size={16} strokeWidth={3} />{" "}
              <span className="font-semibold">{revenue?.totalRevenue}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col tab:flex-row gap-6">
        <RevenueAnalyticsChart />
      </div>

      <div className="mt-10 w-full">
        <div className="ml-auto w-fit">
          <SearchAndSelect
            name="range"
            label="Select Range"
            value={formData?.range}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, setFormData)
              getData(selectedValue?.id)
            }}
            control={control}
            required
            setValue={setValue}
            options={optionsList}
            debounceDelay={0}
            defaultOption={{ id: "allTime", text: "All Time" }}
            searchAPI={(text, setOptions) =>
              autoComplete(text, optionsList, setOptions)
            }
            wrapperClass="max-w-[200px]"
            errors={errors}
          />
        </div>

        <Table
          columns={columns}
          data={tableData?.data || []}
          className="mt-4"
        />

        <Pagination
          currentPage={tableData?.currentPage}
          totalItems={tableData?.totalItems}
          itemsCountPerPage={tableData?.pageSize}
          wrapperClass="pb-[50px]"
          onPageChange={(page: number) => {
            onPageChange(
              page,
              `/api/admin/payment_insights`,
              fetchData,
              setTableData,
              {
                size: 20,
                range: formData?.range?.id,
              },
            )
          }}
        />
      </div>
    </BELayout>
  )
}

