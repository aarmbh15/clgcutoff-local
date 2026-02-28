"use client"

import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { useState } from "react"

type FAQItemProps = {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  isDarkMode: boolean
}

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
  isDarkMode,
}: FAQItemProps) {
  return (
    <div
      className={`border rounded-lg overflow-hidden mb-4 transition-all duration-200 ${isOpen ? "shadow-md" : ""} ${
        isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <button
        className={`flex justify-between items-center w-full text-left p-5 ${
          isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
        }`}
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <h3
          className={`font-medium text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}
        >
          {question}
        </h3>
        <div
          className={`flex-shrink-0 ml-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div
          className={`p-5 border-t ${isDarkMode ? "border-gray-700 text-gray-300" : "border-gray-200 text-gray-600"}`}
        >
          {answer}
        </div>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // const faqs = [
  //   {
  //     question: "What is a closing rank in NEET counselling?",
  //     answer: `The closing rank is the last rank at which admission was granted to a particular course in a specific college during the previous year’s counselling. If your rank is better than the closing rank, your chances of getting that seat are high.`,
  //   },
  //   {
  //     question: "How does the college predictor tool work?",
  //     answer: `The tool uses your NEET rank, category, state, and course preferences to compare with past admission data. Based on this, it predicts a list of colleges where you’re likely to get a seat.`,
  //   },
  //   {
  //     question: "Is the college predictor accurate?",
  //     answer: `College predictors are based on previous years' data, so they give a realistic estimate, not a guarantee. Seat availability, competition, and counseling rounds can affect actual results.`,
  //   },
  // ]

  const faqs = [
  {
    question: "What is NEET College Predictor 2026 and how does it work?",
    answer: `NEET College Predictor 2026 is a tool that analyzes previous year NEET UG, NEET PG and NEET MDS counselling data to estimate your admission chances. It compares your rank or marks with past closing ranks and generates a list of possible government, private and deemed medical colleges under All India Quota and State Quota.`
  },
  {
    question: "Can I use the NEET college predictor based on rank?",
    answer: `Yes. You can use the NEET college predictor based on rank to check which colleges you may get according to your AIR (All India Rank). The system compares your rank with previous year NEET rank vs college data to provide realistic predictions.`
  },
  {
    question: "Is there a NEET college predictor based on marks?",
    answer: `Yes. If you only know your marks, you can use the NEET college predictor based on marks. The tool converts marks into expected rank using previous year trends and then predicts colleges accordingly.`
  },
  {
    question: "What is the minimum marks required in NEET for MBBS in government college?",
    answer: `The minimum marks required in NEET for MBBS in government college vary every year depending on difficulty level, competition and category. Generally, higher ranks increase chances in top government colleges, especially under All India Quota.`
  },
  {
    question: "Does the predictor include State Quota colleges?",
    answer: `Yes. Our NEET college predictor includes both All India Quota and State Quota counselling data. You can select your state to check colleges where you may have better chances under state reservation policies.`
  },
  {
    question: "Is NEET college predictor 100% accurate?",
    answer: `No predictor can guarantee admission because actual results depend on counselling rounds, seat availability and student preferences. However, our predictions are based on previous year official counselling data to give you a realistic estimate.`
  }
]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <section className={`w-full py-16 md:py-24 transition-colors duration-300`}>
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div
            className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium shadow-sm border bg-yellow-100 text-yellow-800 border-yellow-200`}
          >
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2
            className={`text-3xl font-bold tracking-tighter sm:text-4xl md:text-4xl`}
          >
            {/* Frequently Asked Questions by the students */}
            NEET College Predictor 2026 – Frequently Asked Questions
          </h2>
          <p
            className={`max-w-[900px] md:text-xl/relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            {/* Find answers to commonly asked questions about our college predictor
            and counselling services */}
            Find answers to common questions about NEET college predictor based on rank, marks, state quota counselling and government college cutoffs.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid gap-2">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => toggleFAQ(index)}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
