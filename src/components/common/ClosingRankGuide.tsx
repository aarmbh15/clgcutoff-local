import { cn } from "@/utils/utils"
import { AlertCircle } from "lucide-react"
import React, { ReactNode } from "react"

const data = [
  {
    term: "Closing Rank/ Marks",
    description: `Closing Rank Refer to — "the rank of the last
                             candidate who secured a seat in a particular medical college
                             under a specific quota".`,
  },
  {
    term: "SRR/Marks",
    description: `Refers to Stray Round Rank/Marks.`,
  },
  {
    term: "Allotted Category",
    description:
      "Refers to the category under which a candidate is offered a seat during counselling.",
  },
  {
    term: "Rank",
    description: `Ranks Indicate All India Ranks.`,
  },
  {
    term: "NA",
    description: `Refers to No Allotment or No Seat Left for that round.`,
  },
]

export function ClosingRankGuide({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-sky-50 border border-sky-200 p-4 rounded-md text-color-text justify-end items-end",
        className,
      )}
    >
      <div className="flex gap-2 mb-1">
        <AlertCircle className="size-5 text-sky-600 translate-y-[3px]" />
        <h2 className="font-medium text-lg mb-2 text-sky-600">Key Terms</h2>
      </div>

      <div className="flex flex-col gap-3 text-sm text-color-text">
        {data.map((item) => (
          <div key={item.term} className="flex gap-2">
            <AlertCircle className="size-4 text-sky-600 translate-y-[3px] shrink-0" />

            <div className="space-y-[2px]">
              <Badge>{item.term}</Badge>
              <p className="text-black">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="font-medium border border-sky-300 rounded-[20px] px-2 flex-shrink-0 h-[23px] w-fit grid place-items-center text-sky-600">
      {children}
    </div>
  )
}
