import { Check } from "lucide-react"
import Link from "next/link"
import React from "react"

import { CollegePredictorForm } from "../college-predictor/CollegePredictorForm"
import { CollegePredictorTest } from "../college-predictor/CollegePredictorTest"

export function Hero() {
  return (
    <div className="grid pc:grid-cols-[45%_55%] gap-6 px-3">
      <div className="flex h-full items-center">
        <div className="max-w-[800px] mx-auto px-2 space-y-4 text-left">
          <h1 className="text-[42px] font-extrabold text-color-table-header leading-tight text-center">
            College Predictor 2025
          </h1>

          <h2 className="text-[22px] font-semibold text-color-accent text-center">
            One Predictor for All Medical & Allied Courses
          </h2>

          <p className="text-gray-700 leading-relaxed text-[18px]">
            Every year, lakhs of aspirants compete for seats in Medical, Dental,
            and Ayurveda programs at both UG and PG levels across India — the
            real challenge begins after the results — with multiple counselling
            authorities, different quotas, and complex rules, it&apos;s
            difficult to know which college is truly possible at your rank.
          </p>

          <p className="text-gray-700 leading-relaxed text-[18px]">
            That’s where{" "}
            <span className="text-color-table-header font-semibold hover:underline">
              CollegeCutoff.net
            </span>{" "}
            helps. Our College Predictor 2025 makes this simple.{" "}
            <span className="text-color-accent font-semibold">
              Backed by official
            </span>{" "}
            cut-off data, it shows the most likely colleges you can secure
            across Government and Private institutions nationwide.
          </p>

          <div className="space-y-4 w-80 md:w-full">
            <h6 className="font-bold md:text-xl text-lg">
              What Our Predictor Covers
            </h6>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 md:gap-x-12 gap-y-3">
              {[
                "NEET UG",
                "NEET PG",
                "NEET MDS",
                "NEET SS",
                "INI-CET",
                "DNB",
                "AIAPGET",
              ].map((exam) => (
                <div
                  key={exam}
                  className="flex items-center gap-2 md:text-lg text-base"
                >
                  <Check
                    className="md:h-5 md:w-5 h-4 w-4 text-color-accent"
                    strokeWidth={4}
                  />
                  <span className="font-medium">{exam}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* <CollegePredictorForm /> */}
      <CollegePredictorTest />
    </div>
  )
}

