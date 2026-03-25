import { Check, Search, Lock } from "lucide-react"
import React from "react"
import Link from "next/link"

import { CollegePredictorTest } from "../college-predictor/CollegePredictorTest"

export function Hero() {
  return (
    <section id="predict" className="grid pc:grid-cols-[50%_50%] gap-6 lg:gap-12 pt-4 pb-12 pc:pt-8 relative w-full -mt-16 sm:-mt-0">
      {/* LEFT SIDE CONTENT */}
      {/* <div className="flex flex-col justify-center items-start w-full"> */}
      <div className="flex flex-col justify-center items-start w-full text-left px-5 sm:px-0">
        {/* <div className="space-y-6 w-full max-w-[650px]"> */}
        <div className="space-y-2 sm:space-y-6 w-full max-w-[650px]">

          
          
          {/* Top Badge (Pill 1) - Fading effect from peach/orange to transparent */}
          <span className="inline-block bg-gradient-to-r from-[#ffedd5] to-transparent text-[#0A5092] text-xs sm:text-sm font-medium pl-4 pr-8 py-[6px] rounded-full">
            India’s Most Accurate NEET College Predictor
          </span>

          {/* Heading */}
          {/* <h1 className="text-[32px] sm:text-[40px] md:text-[46px] lg:text-[50px] font-extrabold leading-[1.15] text-color-table-header tracking-tight"> */}
          <h1 className="text-[26px] sm:text-[40px] md:text-[46px] lg:text-[50px] font-semibold sm:font-extrabold leading-[1.15] text-[#0A5092] tracking-tight -mt-10 sm:mt-0">
            Check Which Medical{" "}
            <br className="hidden sm:block" />
            Colleges You Can Get
          </h1>

          {/* Subheading */}
          <p className="text-[14px] sm:text-[18px] text-gray-700">
            Find Your{" "}
            <span className="font-semibold text-[#f97316]">
              NEET 2026 College
            </span>{" "}
            Based on Official Closing Ranks
          </p>

          {/* Feature List */}
          <div className="space-y-1 sm:space-y-3  pt-0 sm:pt-2">
            {[
              "Based on official 2025 cutoffs",
              "Covers All India & State Quotas",
              "Includes Govt & Private Colleges",
              "Shows last 2 years trends",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <Check
                  className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-orange-500"
                  strokeWidth={3}
                />
                <span className="text-[13px] sm:text-[16px] md:text-[17px] text-gray-700 font-normal">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Trust Strip (Pill 2) - Fading effect from light blue to transparent */}
          <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#e1effe] to-transparent rounded-full pl-4 pr-8 sm:pl-5 sm:pr-10 py-2.5 w-fit">
            <Search className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-[#244B78]" />
            <span className="text-[10px] sm:text-[14px] md:text-[15px] font-semibold text-gray-700">
              12,000+ Students<span className="font-normal"> Already Checked Their Chances</span>
            </span>
          </div>

          {/* MOBILE FORM */}
          <div className="pc:hidden mt-6 mb-8 w-full">
            <CollegePredictorTest />
          </div>

          {/* Preview Table */}
          <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-white/50 p-5 w-full sm:w-[480px] relative mt-4 pc:mt-8">
            {/* Header */}
            <div className="grid grid-cols-3 text-[13px] md:text-[14px] font-bold text-gray-500 border-b border-gray-200 pb-3">
              <span>College Name <span className="text-gray-400 font-normal">↕</span></span>
              <span className="text-center">Closing Rank</span>
              <span className="text-center">Fees <span className="text-gray-400 font-normal">↕</span></span>
            </div>

            {/* Rows */}
            <div className="space-y-4 mt-4">
              {[
                { rank: "21,507", fees: "₹92,154" },
                { rank: "12,683", fees: "₹46,597" },
                { rank: "12,305", fees: "₹93,273" },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded-full blur-[2px]"></div>
                    <div className="h-[12px] sm:h-[14px] w-[90px] sm:w-[120px] bg-gray-300 rounded blur-[3px]" />
                  </div>
                  <span className="text-center text-[14px] sm:text-[15px] text-gray-700 font-medium">
                    {row.rank}
                  </span>
                  <span className="flex justify-center items-center gap-1 text-gray-400 text-[13px] sm:text-[14px] blur-[2.5px]">
                    {row.fees}
                    <Lock size={12} className="text-gray-400 blur-none" />
                  </span>
                </div>
              ))}
            </div>

            {/* See How It Works Floating Button */}
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
              <Link href="#how-it-works">
                <button className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-[14px] md:text-[15px] font-semibold px-8 py-[10px] rounded-md shadow-lg hover:opacity-95 transition whitespace-nowrap">
                  See How it Works ›
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE FORM (Desktop Only) */}
      <div className="hidden pc:flex justify-end items-center w-full">
        <CollegePredictorTest />
      </div>
    </section>

    // <section className="grid pc:grid-cols-[50%_50%] gap-6 lg:gap-12 pt-4 pb-12 pc:pt-8 relative w-full -mt-16 sm:-mt-0">
    //   {/* LEFT SIDE CONTENT */}
    //   {/* Changed: strictly items-start and text-left for both mobile and desktop */}
    //   <div className="flex flex-col justify-center items-start w-full text-left px-5 sm:px-0">
    //     <div className="space-y-5 sm:space-y-6 w-full max-w-[650px]">
          
    //       {/* Top Badge (Pill 1) */}
    //       {/* Changed: Removed centered gradient, kept it left-aligned per Image 2 */}
    //       <span className="inline-block bg-gradient-to-r from-[#ffedd5] to-transparent text-yellow-700 text-xs sm:text-sm font-semibold pl-4 pr-10 py-[6px] rounded-full">
    //         India’s Most Accurate NEET College Predictor
    //       </span>

    //       {/* Heading */}
    //       <h1 className="text-[30px] sm:text-[40px] md:text-[46px] lg:text-[50px] font-extrabold leading-[1.15] text-[#0A5092] tracking-tight">
    //         Check Which Medical{" "}
    //         <br className="hidden sm:block" />
    //         Colleges You Can Get
    //       </h1>

    //       {/* Subheading */}
    //       <p className="text-[16px] sm:text-[18px] text-gray-700 leading-relaxed">
    //         Find Your{" "}
    //         <span className="font-semibold text-[#f97316]">
    //           NEET 2025 College
    //         </span>{" "}
    //         Based on Official <br className="sm:hidden" /> Closing Ranks
    //       </p>

    //       {/* Feature List */}
    //       {/* Changed: Strictly left-aligned with consistent indentation */}
    //       <div className="space-y-3 pt-1">
    //         {[
    //           "Based on official 2025 cutoffs",
    //           "Covers All India & State Quotas",
    //           "Includes Govt & Private Colleges",
    //           "Shows last 2 years trends",
    //         ].map((item, i) => (
    //           <div key={i} className="flex items-center gap-3">
    //             <Check
    //               className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px] text-orange-500 shrink-0"
    //               strokeWidth={3}
    //             />
    //             <span className="text-[15px] sm:text-[16px] md:text-[17px] text-gray-700 font-medium">
    //               {item}
    //             </span>
    //           </div>
    //         ))}
    //       </div>

    //       {/* Trust Strip (Pill 2) */}
    //       {/* Changed: Left-aligned gradient matching Image 2 */}
    //       <div className="flex items-center gap-3 bg-gradient-to-r from-[#e1effe] to-transparent rounded-full pl-4 pr-10 py-2.5 w-fit mt-4">
    //         <Search className="w-[18px] h-[18px] text-[#244B78] shrink-0" />
    //         <span className="text-[13px] sm:text-[14px] md:text-[15px] font-semibold text-gray-700">
    //           12,000+ Students Already Checked Their Chances
    //         </span>
    //       </div>

    //       {/* MOBILE FORM */}
    //       <div className="pc:hidden mt-8 mb-8 w-full">
    //         <CollegePredictorTest />
    //       </div>

    //       {/* Preview Table */}
    //       {/* Changed: Kept left-aligned with a max-width for mobile */}
    //       <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-white/50 p-5 w-full sm:w-[480px] relative mt-4 pc:mt-8">
    //         <div className="grid grid-cols-3 text-[13px] md:text-[14px] font-bold text-gray-500 border-b border-gray-200 pb-3">
    //           <span className="text-left">College Name <span className="text-gray-400 font-normal">↕</span></span>
    //           <span className="text-center">Closing Rank</span>
    //           <span className="text-center">Fees <span className="text-gray-400 font-normal">↕</span></span>
    //         </div>

    //         <div className="space-y-4 mt-4">
    //           {[
    //             { rank: "21,507", fees: "₹92,154" },
    //             { rank: "12,683", fees: "₹46,597" },
    //             { rank: "12,305", fees: "₹93,273" },
    //           ].map((row, i) => (
    //             <div key={i} className="grid grid-cols-3 items-center">
    //               <div className="flex items-center gap-2">
    //                 <div className="w-5 h-5 bg-gray-200 rounded-full blur-[2px]"></div>
    //                 <div className="h-[12px] w-[70px] sm:w-[120px] bg-gray-300 rounded blur-[3px]" />
    //               </div>
    //               <span className="text-center text-[14px] sm:text-[15px] text-gray-700 font-medium">
    //                 {row.rank}
    //               </span>
    //               <span className="flex justify-center items-center gap-1 text-gray-400 text-[13px] sm:text-[14px] blur-[2.5px]">
    //                 {row.fees}
    //                 <Lock size={12} className="text-gray-400 blur-none" />
    //               </span>
    //             </div>
    //           ))}
    //         </div>

    //         <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
    //           <Link href="#how-it-works">
    //             <button className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white text-[14px] md:text-[15px] font-semibold px-8 py-[10px] rounded-md shadow-lg hover:opacity-95 transition whitespace-nowrap">
    //               See How it Works ›
    //             </button>
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* RIGHT SIDE FORM (Desktop Only) */}
    //   <div className="hidden pc:flex justify-end items-center w-full">
    //     <CollegePredictorTest />
    //   </div>
    // </section>
  )
}