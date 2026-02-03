import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import Link from "next/link"

export default function TermAndConditionsPage() {
  return (
    <FELayout>
      <Container className="max-w-[1600px] py-4 mx-4 pc:mx-6 text-sm text-color-text">
        <div className="my-4 space-y-4 text-color-text">
          <h1 className="text-3xl md:text-4xl font-bold pb-4">
            Terms and Conditions
          </h1>

          <p>Effective Date: April 05, 2025</p>

          <p>
            Welcome to{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              CollegeCutoff.net
            </Link>
            . By using our website and services, you agree to be bound by the
            following terms and conditions. Please read them carefully before
            making a purchase.
          </p>

          <p>
            <strong>1. Services Offered</strong>
          </p>
          <p>
            We provide digital access to NEET UG (MBBS) and NEET PG (MD/MS)
            previous year cut-off data based on category and quota.
            <br />
            This information is based on publicly available and historical data
            for the purpose of reference and decision-making.
          </p>

          <p>
            <strong>2. User Eligibility</strong>
          </p>
          <p>
            You must be 18 years or older, or have permission from a
            parent/guardian, to use this website and make payments.
          </p>

          <p>
            <strong>3. Pricing and Payments</strong>
          </p>
          <p>
            Pricing is clearly displayed on the service selection page.
            <br />
            Current base pricing: ₹49 for MBBS colleges, ₹149 for MD/MS
            colleges.
            <br />
            We may offer bundles or other package options in the future.
            <br />
            Payments are processed securely through third-party gateways.
          </p>

          <p>
            <strong>4. Access & Delivery</strong>
          </p>
          <p>
            Upon successful payment, you will receive instant access to the
            purchased data on the website.
            <br />
            If access is not provided due to a technical issue, please contact
            support for resolution.
          </p>

          <p>
            <strong>5. Refund and Cancellation</strong>
          </p>
          <p>
            All purchases are final and non-refundable.
            <br />
            No cancellations are allowed once payment is made due to the instant
            digital delivery.
          </p>

          <p>
            <strong>6. User Responsibilities</strong>
          </p>
          <ul className="list-disc list-inside pl-4 leading-relaxed space-y-2">
            <li>Copy, share, redistribute, or sell the purchased content.</li>
            <li>Use our content for commercial or unauthorized purposes.</li>
            <li>
              Violate any local laws using information obtained from this
              platform.
            </li>
          </ul>

          <p>
            <strong>7. Limitation of Liability</strong>
          </p>
          <p>
            We strive for accuracy but cannot guarantee the completeness or
            exactness of the data.
            <br />
            Admission decisions are subject to changes in official counselling
            rules, and we do not guarantee admission based on cut-off
            predictions.
          </p>

          <p>
            <strong>8. Changes to the Terms</strong>
          </p>
          <p>
            We reserve the right to update these terms and policies at any time.
            Any significant changes will be notified on the website.
          </p>
        </div>
      </Container>
    </FELayout>
  )
}

