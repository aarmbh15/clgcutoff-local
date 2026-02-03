import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"

export default function PrivacyPolicyPage() {
  return (
    <FELayout>
      <Container className="max-w-[1600px] py-4 mx-4 pc:mx-6 text-sm text-color-text">
        <div className="my-4 space-y-4 text-color-text">
          <h1 className="text-3xl md:text-4xl font-bold pb-4">
            Privacy Policy
          </h1>

          <p>Effective Date: April 05, 2025</p>
          <p>Last Updated: May 14, 2025</p>
          <p>
            At collegecutoff.net, we are committed to protecting your privacy
            and ensuring a safe experience while using our website. This Privacy
            Policy outlines how we collect, use, and safeguard your personal
            information.
          </p>

          <p>
            <strong>1. Information We Collect</strong>
          </p>
          <p>
            When you use our website, we may collect the following types of
            data:
          </p>
          <ul className="list-disc list-inside pl-4 leading-relaxed space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email address, phone
              number (only when entered by you during sign-up or payment).
            </li>
            <li>
              <strong>Transaction Information:</strong> Payment details
              (processed securely via third-party payment gateways; we do not
              store card details).
            </li>
            <li>
              <strong>Technical Information:</strong> IP address, browser type,
              device used, and access time.
            </li>
            <li>
              <strong>Usage Data:</strong> Pages visited, features used, time
              spent on the platform.
            </li>
          </ul>

          <p>
            <strong>2. How We Use Your Information</strong>
          </p>
          <p>We use the information we collect for the following purposes:</p>
          <ul className="list-disc list-inside pl-4 leading-relaxed space-y-2">
            <li>
              To process your payment and grant access to selected services.
            </li>
            <li>To improve website functionality and user experience.</li>
            <li>
              To communicate with you regarding your purchase or support
              queries.
            </li>
            <li>
              To send you updates or relevant service information (you can opt
              out anytime).
            </li>
          </ul>

          <p>
            <strong>3. Sharing and Disclosure</strong>
          </p>
          <p>
            We do not sell, rent, or share your personal information with third
            parties for their marketing purposes.
          </p>
          <p>Your data may be shared only with:</p>
          <ul className="list-disc list-inside pl-4 leading-relaxed space-y-2">
            <li>Trusted third-party payment processors (for transactions).</li>
            <li>
              Legal authorities, if required by law or to protect our rights.
            </li>
          </ul>

          <p>
            <strong>4. Data Security</strong>
          </p>
          <p>
            We use industry-standard encryption and secure hosting to protect
            your data. However, no online service is 100% secure. We recommend
            not sharing login credentials.
          </p>

          <p>
            <strong>5. Your Rights</strong>
          </p>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside pl-4 leading-relaxed space-y-2">
            <li>Access your personal information.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Opt out of marketing emails.</li>
          </ul>
          <p>
            To exercise any of the above rights, email us at{" "}
            <a
              href="mailto:collegecutoff.net@gmail.com"
              className="text-blue-600 underline"
            >
              collegecutoff.net@gmail.com
            </a>
          </p>
        </div>
      </Container>
    </FELayout>
  )
}

