"use client"

import React, { ReactNode } from "react"

import { Button } from "../Button"
import AnimatedPopup from "./AnimatedPopup"

interface IConfirmationPopupProps {
  title: ReactNode
  isOpen: boolean
  text?: ReactNode

  disableInstantSubmit?: boolean

  onConfirm: () => void
  onCancel?: () => void
  onClose: () => void
}

export function ConfirmationPopup({
  title,
  text,
  isOpen,
  onConfirm,
  disableInstantSubmit,
  onCancel,
  onClose,
}: IConfirmationPopupProps) {
  return (
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      height="200px"
      popupClass="w-[350px] tab:w-[700px]"
    >
      <div className="bg-color-form-background py-12 grid place-items-center">
        <div>
          <h2 className="text-center pc:text-3xl tab:text-2xl text-[22px] text-color-text">
            {title}
          </h2>
          <p className="text-color-subtext font-light text-[20px] tab:text-lg text-base text-center mt-2">
            {text}
          </p>

          <div className="flex justify-end gap-4 mt-12 pr-6 tab:pr-0">
            <Button
              variant="outline"
              className="py-2 px-8"
              onClick={() => {
                onClose()
                onCancel?.()
              }}
            >
              Cancel
            </Button>
            <Button
              className="py-2 px-8"
              onClick={() => {
                if (!disableInstantSubmit) {
                  onClose()
                }
                onConfirm()
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </AnimatedPopup>
  )
}

