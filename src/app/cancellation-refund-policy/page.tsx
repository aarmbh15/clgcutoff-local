import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import Link from "next/link"

export default function CancellationRefundPolicyPage() {
  return (
    <FELayout>
      <Container className="max-w-[1600px] py-4 mx-4 pc:mx-6 text-sm text-color-text">
        <div className="my-4 space-y-4 text-color-text">
          <h1 className="text-3xl md:text-4xl font-bold pb-4">
            Cancellation / Refund Policy
          </h1>

          <ul className="list-disc list-inside pl-4 leading-relaxed space-y-2">
            <li>
              All purchases made on{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                CollegeCutoff.net
              </Link>{" "}
              are final and non-refundable
            </li>
            <li>
              Once payment is made and access is granted, no cancellations or
              refunds will be entertained, regardless of package type.
            </li>
            <li>
              This policy applies to all pricing tiers and packages due to the
              instant and irreversible nature of digital delivery.
            </li>
            <li>
              In the event of a failed transaction or technical issue, users are
              encouraged to contact our support team for resolutions
            </li>
          </ul>
        </div>
      </Container>
    </FELayout>
  )
}

