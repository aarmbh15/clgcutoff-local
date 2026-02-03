import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const orderId = searchParams.get("orderId")

  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id" }, { status: 400 })
  }

  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!
  const key_secret = process.env.RAZORPAY_KEY_SECRET!
  const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64")

  const res = await fetch(
    `https://api.razorpay.com/v1/orders/${orderId}/payments`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
  )

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch payment info" },
      { status: 500 },
    )
  }

  const data = await res.json()

  // Razorpay returns a list of payments for the order
  const payment = data.items?.[0]

  if (!payment) {
    return NextResponse.json({ status: "no_payment_found" })
  }

  return NextResponse.json({
    status: payment.status, // "captured", "failed", etc.
    payment_id: payment.id,
    method: payment.method,
    email: payment.email,
  })
}

