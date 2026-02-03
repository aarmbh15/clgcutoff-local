"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import RevenueAnalyticsChart from "@/components/admin-panel/dashboard/RevenueAnalyticsChart"
import UserAnalyticsChart from "@/components/admin-panel/dashboard/UserAnalyticsChart"
import UserTable from "@/components/admin-panel/dashboard/UserTable"
import { Card } from "@/components/common/Card"
import useFetch from "@/hooks/useFetch"
import { IndianRupee } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboardPage() {
  const { fetchData } = useFetch()

  const [revenue, setRevenue] = useState({
    monthlyRevenue: 0,
    totalRevenue: 0,
  })

  const [user, setUser] = useState({
    monthlyUser: 0,
    totalUser: 0,
  })

  useEffect(() => {
    Promise.all([
      fetchData({ url: `/api/admin/dashboard/revenue/get_total` }),
      fetchData({ url: `/api/admin/dashboard/user/get_total` }),
    ]).then(([revenueRes, userRes]) => {
      setRevenue({
        monthlyRevenue: revenueRes?.payload?.monthlyRevenue || 0,
        totalRevenue: revenueRes?.payload?.totalRevenue || 0,
      })

      setUser({
        monthlyUser: userRes?.payload?.thisMonthUsers || 0,
        totalUser: userRes?.payload?.totalUsers || 0,
      })
    })
  }, [])

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
        <Card className="w-[300px] space-y-2">
          <div className="flex items-center justify-between">
            <div className="hidden tab:block">Monthly Reg. User:</div>
            <div className="block tab:hidden">
              Monthly Reg. <br /> User:
            </div>
            <p className="font-semibold">{user?.monthlyUser}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="hidden tab:block">Total Reg. User:</div>
            <div className="block tab:hidden">
              Total Reg. <br /> User:
            </div>

            <p className="font-semibold">{user?.totalUser}</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col tab:flex-row gap-6">
        <RevenueAnalyticsChart />
        <UserAnalyticsChart />
      </div>

      <UserTable totalUser={user?.totalUser} />
    </BELayout>
  )
}

