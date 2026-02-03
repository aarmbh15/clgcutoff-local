import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import FAQSection from "@/components/frontend/landing-page/FAQSection"
import { Hero } from "@/components/frontend/landing-page/Hero"
import HowItWorks from "@/components/frontend/landing-page/HowItWorks"
import { StatsSection } from "@/components/frontend/landing-page/StatsSection"
import WhyChooseUs from "@/components/frontend/landing-page/WhyChooseUS"

export default function Home() {
  return (
    <FELayout>
      <div className="py-16 pc:py-20 relative bg-gradient-to-b from-white via-yellow-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 min-h-dvh">
        <Container className=" max-w-[1600px]">
          <Hero />
        </Container>
      </div>

      {/* <Container className="max-w-[1600px]">
        <TrustedBy />
      </Container> */}

      <Container className="max-w-[1600px]">
        <Container className="max-w-[1600px]">
          <HowItWorks />
        </Container>
      </Container>

      <div className="py-16 pc:py-20 relative bg-gradient-to-b from-white via-yellow-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <StatsSection />
      </div>

      <div className="py-16 pc:py-20 relative bg-gradient-to-b from-white via-yellow-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <Container className="max-w-[1600px]">
          <WhyChooseUs />
        </Container>
      </div>

      {/* <Container className="max-w-[1600px]">
        <TestimonialsSection />
      </Container>

      <div className="py-16 pc:py-20 relative bg-gradient-to-b from-white via-yellow-50 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <Container className="max-w-[1600px]">
          <CtaSection />
        </Container>
      </div> */}

      <Container className="max-w-[1600px]">
        <FAQSection />
      </Container>

      <SignInPopup />
    </FELayout>
  )
}

