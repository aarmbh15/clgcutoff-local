import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await request.json()

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest("hex")

    if (generatedSignature === signature) {
      return NextResponse.json(
        { message: "Payment verified successfully", isOk: true },
        { status: 200 },
      )
    } else {
      return NextResponse.json(
        { message: "Payment verification failed", isOk: false },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    )
  }
}
