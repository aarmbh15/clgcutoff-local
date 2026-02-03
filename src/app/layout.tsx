import { CoreLayout } from "@/components/common/CoreLayout"
import { cn } from "@/utils/utils"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Poppins, Roboto } from "next/font/google"
import { Suspense } from "react"

import "../styles/colors.css"
import "../styles/reset.css"
import "../styles/style.css"

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-roboto",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "College Cutoff - NEET - Closing Rank",
  description:
    "College Cutoff a platform to check NEET Cutoff, closing ranks and Predict colleges",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          roboto.variable,
          poppins.variable,
          "antialiased bg-color-background",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Suspense fallback={null}>
            <CoreLayout>{children}</CoreLayout>
          </Suspense>
        </ThemeProvider>

        {process.env.VERCEL_ENVIRONMENT === "PRODUCTION" && <Analytics />}
      </body>
    </html>
  )
}

