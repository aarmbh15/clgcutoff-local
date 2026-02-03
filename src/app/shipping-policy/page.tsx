import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import Link from "next/link"

export default function ShippingPolicyPage() {
  return (
    <FELayout>
      <Container className="max-w-[1600px] py-4 mx-4 pc:mx-6 text-sm text-color-text">
        <div className="my-4 space-y-4 text-color-text">
          <h1 className="text-3xl md:text-4xl font-bold pb-4">
            Shipping Policy
          </h1>

          <ul className="list-disc list-inside pl-4 leading-relaxed space-y-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">
                CollegeCutoff.net
              </Link>{" "}
              offers only digital services—there is no physical product
              involved.
            </li>
            <li>
              Upon successful payment, users receive instant access to the
              cut-off data they have purchased.
            </li>
            <li>
              No delivery charges or shipping timelines apply, as all services
              are delivered online.
            </li>
            <li>
              In rare cases of technical issues, access may take up to a few
              hours and our support team will assist accordingly.
            </li>
          </ul>
        </div>
      </Container>
    </FELayout>
  )
}

