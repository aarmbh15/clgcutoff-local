"use client"

import { Card } from "@/components/common/Card"
import { Pagination } from "@/components/common/Pagination"
import { Table, TableColumn } from "@/components/common/Table/Table"
import useFetch from "@/hooks/useFetch"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { onPageChange } from "@/utils/utils"
import { format, parseISO } from "date-fns"
import Link from "next/link"
import React, { useEffect, useState } from "react"

const columns: TableColumn[] = [
  {
    title: "Joined On",
    tableKey: "created_at",
    width: "120px",
    renderer({ cellData }) {
      return (
        <div>
          {" "}
          {format(parseISO(cellData as string), "dd MMM yyyy / hh:mm a")}
        </div>
      )
    },
  },
  {
    title: "Phone Number",
    tableKey: "phone",
    width: "150px",
    renderer({ cellData }) {
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
  // {
  //   title: "Payment Status",
  //   tableKey: "paymentStatus",
  //   renderer: ({ cellData }) => {
  //     if (cellData === "Paid") {
  //       return (
  //         <div className="bg-green-500/80 text-white rounded-full px-2 py-1 w-[120px] text-center">
  //           Paid
  //         </div>
  //       )
  //     } else {
  //       return (
  //         <div className="bg-red-500/80 text-white rounded-full px-2 py-1 w-[120px] text-center">
  //           Unpaid
  //         </div>
  //       )
  //     }
  //   },
  // },
]

function UserTable({ totalUser }: { totalUser: number }) {
  const [tableData, setTableData] = useState<any>(null)

  const { getSearchParams } = useInternalSearchParams()

  const { fetchData } = useFetch()

  useEffect(() => {
    getData()
  }, [])

  async function getData() {
    const page = Number(getSearchParams("page") || 1)

    const res = await fetchData({
      url: `/api/admin/dashboard/user/get_user`,
      params: {
        page,
        size: 20,
      },
    })

    if (res?.success) {
      setTableData(res?.payload)
    }
  }

  return (
    <Card className="mt-6 py-6 px-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        Total Registered Users ({totalUser})
      </h2>

      <Table columns={columns} data={tableData?.data || []} />

      <Pagination
        currentPage={tableData?.currentPage}
        totalItems={tableData?.totalItems}
        itemsCountPerPage={tableData?.itemsCountPerPage}
        wrapperClass="pb-[50px]"
        onPageChange={(page: number) => {
          onPageChange(
            page,
            `/api/admin/dashboard/user/get_user`,
            fetchData,
            setTableData,
            {
              size: 20,
            },
          )
        }}
      />
    </Card>
  )
}

export default UserTable

