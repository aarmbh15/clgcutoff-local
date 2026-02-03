"use client"

import { CalendarDays } from "lucide-react"
import Link from "next/link"
import React from "react"

import { Button } from "../Button"
import AnimatedPopup from "./AnimatedPopup"

interface IConfirmEditYearPopup {
  isOpen: boolean

  rowData: any

  onCancel?: () => void
  onClose: () => void
}

export function ConfirmEditYearPopup({
  isOpen,
  rowData,
  onClose,
}: IConfirmEditYearPopup) {
  const years = rowData?.year?.split("-")?.map((item: string) => item.trim())

  const previousYear = years?.[0]
  const currentYear = years?.[1]

  return (
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      height="200px"
      popupClass="w-[350px] tab:w-[700px]"
      closeIconClass=""
    >
      <div className="bg-color-form-background py-12 px-4">
        <div>
          <h2 className="text-center pc:text-3xl tab:text-2xl text-[18px] text-color-text">
            Please select year you want to edit
          </h2>
          <p className="text-color-subtext font-light text-[20px] tab:text-lg text-base text-center mt-2">
            This record contains 2 Years data, Pls select one to edit.
          </p>

          <div className="flex justify-center gap-6 mt-12">
            <Link
              href={`/admin/edit-data/${rowData?.prev_id}`}
              onClick={onClose}
              className="w-full max-w-[220px]"
            >
              <Button
                variant="outline"
                className="py-2 flex items-center justify-center w-full"
              >
                <div className="flex items-center gap-4">
                  <CalendarDays />

                  <p className="text-xl">{previousYear}</p>
                </div>
              </Button>
            </Link>

            <Link
              href={`/admin/edit-data/${rowData?.new_id}`}
              onClick={onClose}
              className="w-full max-w-[220px]"
            >
              <Button
                variant="outline"
                className="py-2 flex items-center justify-center w-full"
              >
                <div className="flex items-center gap-4">
                  <CalendarDays />

                  <p className="text-xl">{currentYear}</p>
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedPopup>
  )
}
