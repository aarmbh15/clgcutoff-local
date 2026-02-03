import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import Link from "next/link"

export default function PricingPolicyPage() {
  return (
    <FELayout>
      <Container className="max-w-[1600px] py-4 mx-4 pc:mx-6 text-sm text-color-text">
        <div className="my-4 space-y-4 text-color-text">
          <h1 className="text-3xl md:text-4xl font-bold pb-4 text-color-table-header">
            Pricing Policy
          </h1>

          <p>
            At{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              CollegeCutoff.net
            </Link>
            , we provide various packages designed to suit the needs of students
            preparing for NEET UG (MBBS) and NEET PG (MD/MS) admissions.
          </p>

          <ul className="list-disc list-inside pl-4 leading-relaxed space-y-2">
            <li>
              Pricing varies depending on the package selected (per-college
              access, combo plans, multi-college bundles, etc.).
            </li>
            <li>
              Our base plans currently start at ₹49 for NEET UG college cut-off
              details and ₹149 for NEET PG college data.
            </li>
            <li>All prices are inclusive of applicable taxes.</li>
            <li>
              Each package clearly lists what is included, and users are advised
              to review the details before making payment
            </li>
          </ul>
        </div>
      </Container>
    </FELayout>
  )
}

