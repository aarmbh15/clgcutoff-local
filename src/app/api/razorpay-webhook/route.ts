import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!
  const razorpaySignature = req.headers.get("x-razorpay-signature")
  const rawBody = await req.arrayBuffer()
  const bodyString = Buffer.from(rawBody).toString("utf-8")

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(bodyString)
    .digest("hex")

  if (expectedSignature !== razorpaySignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const payload = JSON.parse(bodyString)

  // ✅ Handle events
  // if (payload.event === "payment.captured") {
  //   const paymentInfo = payload.payload.payment.entity
  // } else if (payload.event === "payment.failed") {
  //   const paymentInfo = payload.payload.payment.entity
  // }

  return NextResponse.json({ received: true })
}

