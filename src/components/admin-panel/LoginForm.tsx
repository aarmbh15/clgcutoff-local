"use client"

import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import { FELayout } from "@/components/frontend/FELayout"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { onTextFieldChange } from "@/utils/utils"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })
  const { fetchData } = useFetch()
  const router = useRouter()
  const { showToast, setAppState } = useAppState()

  async function onSubmit() {
    const res = await fetchData({
      url: "/api/admin/login",
      method: "POST",
      data: {
        email: formData.email,
        password: formData.password,
      },
    })

    if (res?.success) {
      if (res?.payload?.isAuthenticated) {
        setAppState({ pageLoader: true })
        showToast("success", res?.payload?.msg)
        router.replace("/admin/dashboard")
      }
    }
  }

  return (
    <FELayout>
      <div className={`flex justify-center items-center min-h-screen`}>
        <Card className="w-full max-w-[400px] p-7 tab:p-10">
          <div className=" mb-6 text-center">
            <h2 className="text-2xl font-semibold text-color-text text-center">
              Admin Login
            </h2>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="Enter Rank"
              value={formData?.email}
              setValue={setValue}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              rules={{
                required: true,
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message:
                    "Invalid Email ID! Please enter a valid email address.",
                },
              }}
              errors={errors}
            />

            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="Enter Rank"
              value={formData?.password}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              setValue={setValue}
              rules={{
                required: true,
              }}
              errors={errors}
            />

            <Button className="mt-3" type="submit">
              Login
            </Button>
          </form>
        </Card>
      </div>
    </FELayout>
  )
}
