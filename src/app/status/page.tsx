"use client"

import useFetch from "@/hooks/useFetch"
import { useEffect, useState } from "react"

interface IStatusData {
  college_table_last_inserted: string
  courses_last_inserted: string
  dropdown_options_last_inserted: string
  payment_last_inserted: string
  price_last_inserted: string
  purchase_last_inserted: string
  user_last_inserted: string
}

function StatusPage() {
  const { fetchData } = useFetch()

  const [statusData, setStatusData] = useState<IStatusData>()

  useEffect(() => {
    fetchStatusData()
  }, [])

  async function fetchStatusData() {
    const data = await fetchData({ url: "/api/admin/status" })
    setStatusData(data?.payload)
  }

  return (
    <div className="p-4">
      <table className="max-w-[400px] w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">
              Table
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Last Inserted
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">College Table</td>
            <td className="border border-gray-300 px-4 py-2">
              {statusData?.college_table_last_inserted || "-"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Courses</td>
            <td className="border border-gray-300 px-4 py-2">
              {statusData?.courses_last_inserted || "-"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">
              Dropdown Options
            </td>
            <td className="border border-gray-300 px-4 py-2">
              {statusData?.dropdown_options_last_inserted || "-"}
            </td>
          </tr>

          <tr>
            <td className="border border-gray-300 px-4 py-2">
              --------------------
            </td>
            <td className="border border-gray-300 px-4 py-2">
              --------------------
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Payment</td>
            <td className="border border-gray-300 px-4 py-2">
              {statusData?.payment_last_inserted || "-"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Price</td>
            <td className="border border-gray-300 px-4 py-2">
              {statusData?.price_last_inserted || "-"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Purchase</td>
            <td className="border border-gray-300 px-4 py-2">
              {statusData?.purchase_last_inserted || "-"}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">User</td>
            <td className="border border-gray-300 px-4 py-2">
              {statusData?.user_last_inserted || "-"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default StatusPage

