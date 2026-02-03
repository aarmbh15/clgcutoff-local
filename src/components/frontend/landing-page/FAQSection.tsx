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

  const faqs = [
    {
      question: "What is a closing rank in NEET counselling?",
      answer: `The closing rank is the last rank at which admission was granted to a particular course in a specific college during the previous year’s counselling. If your rank is better than the closing rank, your chances of getting that seat are high.`,
    },
    {
      question: "How does the college predictor tool work?",
      answer: `The tool uses your NEET rank, category, state, and course preferences to compare with past admission data. Based on this, it predicts a list of colleges where you’re likely to get a seat.`,
    },
    {
      question: "Is the college predictor accurate?",
      answer: `College predictors are based on previous years' data, so they give a realistic estimate, not a guarantee. Seat availability, competition, and counseling rounds can affect actual results.`,
    },
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
            Frequently Asked Questions by the students
          </h2>
          <p
            className={`max-w-[900px] md:text-xl/relaxed ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Find answers to commonly asked questions about our college predictor
            and counselling services
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
