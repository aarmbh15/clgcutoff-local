"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { ConfirmationPopup } from "@/components/common/popups/ConfirmationPopup"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import { configYearOptions, years } from "@/utils/static"
import { autoComplete, isEmpty, onTextFieldChange } from "@/utils/utils"
import { Info, Skull } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function DeleteYearlyData() {
  const [selectedYear, setSelectedYear] = useState<IOption>()

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm({ shouldFocusError: true })
  const { fetchData } = useFetch()
  const { showToast } = useAppState()

  const [popupOpen, setPopupOpen] = useState(false)

  const [formData, setFormData] = useState({
    adminDataDeletePassword: "",
  })

  const router = useRouter()

  async function onSubmit() {
    if (
      formData?.adminDataDeletePassword !==
      process.env.NEXT_PUBLIC_ADMIN_DATA_DELETE_PASSWORD
    ) {
      setError("adminDataDeletePassword", {
        type: "manual",
        message: "Wrong Password",
      })
      return
    }

    const res = await fetchData({
      url: "/api/admin/delete_yearly_data",
      method: "POST",
      data: {
        year: selectedYear?.text,
      },
    })
    if (res?.success) {
      showToast("success", res?.payload?.msg)
      router.push("/admin/manage-data")
    }
  }

  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Delete Yearly Data</Heading>

      <Card className="mt-4 px-6 py-10 flex flex-col tab:flex-row items-start gap-8 w-fit max-w-[865px]">
        <form className="w-full max-w-96">
          <SearchAndSelect
            name="selectedYear"
            label="Select Year to Delete"
            labelClassName="text-sm pc:text-base"
            placeholder="Select Dropdown Type"
            value={selectedYear}
            onChange={({ selectedValue }) => {
              setSelectedYear(selectedValue)
            }}
            control={control}
            setValue={setValue}
            required
            options={years()}
            debounceDelay={0}
            searchAPI={(text, setOptions) =>
              autoComplete(text, years(), setOptions)
            }
            errors={errors}
          />

          <div className="flex mt-8 items-center justify-end">
            <Button
              className="py-2 flex items-center gap-2"
              disabled={isEmpty(selectedYear?.text)}
              onClick={() => setPopupOpen(true)}
            >
              <Skull />
              Delete All Data
            </Button>
          </div>
        </form>

        <div className="flex gap-2 text-color-text text-base font-light tracking-[1px] text-justify w-full max-w-[500px]">
          <Info
            className="text-blue-600 flex-shrink-0 translate-y-[2px]"
            size={20}
          />

          <div>
            <p className="text-xs tab:text-sm pc:text-base leading-relaxed text-color-text">
              This will deleted All Data of the selected year. This includes
              Both UG & PG.
            </p>
            <p className="mt-4">
              <span className="font-semibold text-red-600">Note:</span> This
              action is irreversible. Please proceed with caution.
            </p>
          </div>
        </div>
      </Card>

      <ConfirmationPopup
        isOpen={popupOpen}
        disableInstantSubmit
        title={
          <>
            <div className="hidden pc:block">
              <p>Are You Sure You Want To Delete All Data</p>
              <p>of: {selectedYear?.text} ?</p>
            </div>

            {/* Mobile */}
            <div className="pc:hidden px-1">
              <p>
                Are You Sure You Want To Delete All Data of:{" "}
                {selectedYear?.text} ?
              </p>
            </div>
          </>
        }
        text={
          <>
            <div className="text-color-accent font-medium text-lg pc:flex items-center gap-2 w-fit mx-auto hidden">
              <Skull />
              {`This data will Permanently Deleted and You can't undo it`}
            </div>

            {/* Mobile */}
            <div className="text-color-accent font-medium text-sm flex w-fit justify-center mx-auto pc:hidden translate-y-[6px]">
              <Skull className="flex-shrink-0" />
              <p className="max-w-[280px] text-center">
                {`This data will Permanently Deleted and You can't undo it`}
              </p>
            </div>

            <div className="mt-5 px-4 pc:px-0">
              <Input
                name="adminDataDeletePassword"
                label="Admin Data Delete Password"
                type="password"
                placeholder="Enter here"
                value={formData?.adminDataDeletePassword}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                setValue={setValue}
                errorClass="text-left text-base"
                rules={{
                  required: true,
                }}
                errors={errors}
              />
            </div>
          </>
        }
        onClose={() => {
          setPopupOpen(false)
          clearErrors("adminDataDeletePassword")
          setValue("adminDataDeletePassword", "")
          setFormData({
            adminDataDeletePassword: "",
          })
        }}
        onConfirm={() => handleSubmit(onSubmit)()}
      />
    </BELayout>
  )
}

