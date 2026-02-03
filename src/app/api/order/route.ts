import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { v4 } from "uuid"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "INR" } = await request.json()

    // Generate a UUID and truncate it to fit within 40 characters with prefix
    const uuid = v4() // e.g., "550e8400-e29b-41d4-a716-446655440000" (36 chars)
    const shortReceipt = `rcpt_${uuid}`.substring(0, 40) // "rcpt_" (5 chars) + truncated UUID

    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency,
      receipt: shortReceipt, // Ensure this is 40 characters or less
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 },
    )
  }
}
