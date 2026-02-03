"use client"

import PaymentCard from "@/app/[id]/cutoff/PaymentCard"
import AnimatedPopup from "@/components/common/popups/AnimatedPopup"
import React, { ReactNode } from "react"

interface IPaymentPopupCardProps {
  isOpen: boolean

  title: ReactNode
 btnText: string | ReactNode
  paymentDescription: string
  amount: number
  whatWillYouGet?: ReactNode
  onClose: () => void
  onConfirm?: () => void
}

export function PaymentPopupCard({
  isOpen,
  title,
  btnText,
  paymentDescription,
  whatWillYouGet,
  amount,
  onConfirm,
  onClose,
}: IPaymentPopupCardProps) {
  return (
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      height="150px"
      popupClass="w-[340px] pc:w-[380px]"
      closeIconClass="text-white hover:text-white tab:top-2 tab:right-2"
    >
      <PaymentCard
        amount={amount}
        paymentDescription={paymentDescription}
        whatWillYouGet={whatWillYouGet}
        title={title}
        btnText={btnText}
        onConfirm={onConfirm}
      />
    </AnimatedPopup>
  )
}

