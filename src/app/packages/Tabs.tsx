"use client"

import { cn } from "@/utils/utils"

export function Tabs({
  activeTab,
  setActiveTab,
  setSelectedPackage,
  packages,
  tabMenu,
}: {
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
  setSelectedPackage: React.Dispatch<React.SetStateAction<any>>
  packages: any[]
  tabMenu: any[]
}) {
  return (
    <div className="max-w-[570px] mx-auto mt-8 px-3">
      <div className="grid grid-cols-2 items-center gap-2 bg-gray-100 rounded-full w-full p-1">
        {tabMenu.map((tab, index) => (
          <button
            key={index}
            className={cn(
              "px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-black",
              activeTab === tab.id &&
                "border border-color-accent bg-white text-color-accent hover:bg-white",
            )}
            onClick={() => {
              setActiveTab(tab.id)
              setSelectedPackage(packages[index])
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  )
}

