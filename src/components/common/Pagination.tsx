// "use client"

// import { cn, updateQueryParams } from "@/utils/utils"
// import {
//   ChevronFirst,
//   ChevronLast,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"
// import { useRouter } from "next/navigation"
// import React, { forwardRef, useEffect, useImperativeHandle } from "react"
// import ReactJsPagination from "react-js-pagination"

// interface PaginationProps {
//   currentPage: number
//   totalItems: number | undefined
//   pageRangeDisplayed?: number
//   itemsCountPerPage?: number
//   onPageChange: (page: number) => void
//   wrapperClass?: string
//   showOnlyOnePage?: boolean
// }

// // Define the ref type for the imperative handle
// export interface PaginationHandle {
//   setActivePage: (page: number) => void
// }

// export const Pagination = forwardRef<PaginationHandle, PaginationProps>(
//   (
//     {
//       currentPage = 1,
//       totalItems = 0,
//       itemsCountPerPage = 10,
//       onPageChange,
//       wrapperClass,
//       showOnlyOnePage,
//     },
//     ref,
//   ) => {
//     const [activePage, setActivePage] = React.useState(currentPage)
//     const router = useRouter()

//     // Expose setActivePage to the parent via ref
//     useImperativeHandle(ref, () => ({
//       setActivePage: (page: number) => {
//         setActivePage(page)
//       },
//     }))

//     useEffect(() => {
//       setActivePage(currentPage)
//     }, [currentPage])

//     function handlePageChange(pageNumber: number) {
//       updateQueryParams(router, { page: pageNumber })
//       setActivePage(pageNumber)
//       onPageChange(pageNumber)
//     }

//     function calcShowing() {
//       if (activePage * itemsCountPerPage > totalItems) {
//         return totalItems
//       }
//       return activePage * itemsCountPerPage
//     }

//     return (
//       <div
//         className={cn(
//           "pt-[16px] xl:pt-[18px] pb-16 tab:flex justify-between items-center w-full",
//           wrapperClass,
//         )}
//       >
//         <ReactJsPagination
//           activePage={activePage}
//           onChange={handlePageChange}
//           totalItemsCount={showOnlyOnePage ? 1 : totalItems || 1}
//           pageRangeDisplayed={5}
//           itemsCountPerPage={itemsCountPerPage}
//           innerClass="flex"
//           itemClass="size-[32px] text-color-text cursor-pointer text-[12px] font-normal grid place-items-center hover:bg-color-accent/40 rounded-full"
//           activeClass="!bg-color-accent !text-white !rounded-full"
//           disabledClass="opacity-50 !cursor-not-allowed"
//           itemClassFirst="rounded-tl-sm rounded-bl-sm"
//           itemClassLast="rounded-tr-sm rounded-br-sm"
//           firstPageText={
//             <ChevronFirst
//               className="!text-color-subtext"
//               size={22}
//               strokeWidth={1.5}
//             />
//           }
//           prevPageText={
//             <ChevronLeft
//               className="!text-color-subtext"
//               size={22}
//               strokeWidth={1.5}
//             />
//           }
//           nextPageText={
//             <ChevronRight
//               className="!text-color-subtext"
//               size={22}
//               strokeWidth={1.5}
//             />
//           }
//           lastPageText={
//             <ChevronLast
//               className="!text-color-subtext"
//               size={22}
//               strokeWidth={1.5}
//             />
//           }
//         />

//         <p className="text-xs text-color-subtext tab:pr-3 pl-2 tab:pl-0 pt-4">{`Showing ${calcShowing()} of ${totalItems} results`}</p>
//       </div>
//     )
//   },
// )

// Pagination.displayName = "Pagination"



"use client"

import { cn, updateQueryParams } from "@/utils/utils"
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import React, { forwardRef, useEffect, useImperativeHandle } from "react"

interface PaginationProps {
  currentPage: number
  totalItems: number | undefined
  itemsCountPerPage?: number
  onPageChange: (page: number) => void
  wrapperClass?: string
  showOnlyOnePage?: boolean
   disabled?: boolean 
}

// Define the ref type for the imperative handle
export interface PaginationHandle {
  setActivePage: (page: number) => void
}

export const Pagination = forwardRef<PaginationHandle, PaginationProps>(
  (
    {
      currentPage = 1,
      totalItems = 0,
      itemsCountPerPage = 10,
      onPageChange,
      wrapperClass,
      showOnlyOnePage,
      disabled=false
    },

    ref,
  ) => {

    // console.log("Dislables: ",disabled)
    const [activePage, setActivePage] = React.useState(currentPage)
    const router = useRouter()

    const totalPages = Math.ceil((totalItems || 1) / itemsCountPerPage)

    // Expose setActivePage to the parent via ref
    useImperativeHandle(ref, () => ({
      setActivePage: (page: number) => {
        setActivePage(page)
      },
    }))

    useEffect(() => {
      setActivePage(currentPage)
    }, [currentPage])

    function handlePageChange(pageNumber: number) {
       if (disabled) return
      if (pageNumber < 1 || pageNumber > totalPages) return
      updateQueryParams(router, { page: pageNumber })
      setActivePage(pageNumber)
      onPageChange(pageNumber)
    }

    function calcShowing() {
      if (activePage * itemsCountPerPage > totalItems) {
        return totalItems
      }
      return activePage * itemsCountPerPage
    }

function renderPageNumbers() {
  const totalPages = Math.ceil(totalItems / itemsCountPerPage)
  const pages: (number | string)[] = []

  if (totalPages <= 5) {
    // Small dataset, show all pages
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    // Always show first two
    pages.push(1, 2)

    if (activePage > 3) {
      pages.push("...")
    }

    // Always show activePage (if it's not near start/end)
    if (activePage > 2 && activePage < totalPages - 1) {
      pages.push(activePage)
    }

    if (activePage < totalPages - 2) {
      pages.push("...")
    }

    // Always show last two
    pages.push(totalPages - 1, totalPages)
  }

  // Remove duplicates like "..., ..."
  const finalPages: (number | string)[] = []
  for (let i = 0; i < pages.length; i++) {
    if (!(pages[i] === "..." && pages[i - 1] === "...")) {
      finalPages.push(pages[i])
    }
  }

  return finalPages.map((p, i) =>
    p === "..." ? (
      <span key={i} className="px-2">...</span>
    ) : (
      <button
        key={i}
        // className={cn(
        //   "size-[32px] text-color-text cursor-pointer text-[12px] font-normal grid place-items-center hover:bg-color-accent/40 rounded-full",
        //   p === activePage && "!bg-color-accent !text-white !rounded-full",
        // )}
           className={cn(
              "size-[32px] text-color-text cursor-pointer text-[12px] font-normal grid place-items-center hover:bg-color-accent/40 rounded-full",
              p === activePage && "!bg-color-accent !text-white !rounded-full",
              disabled && "cursor-not-allowed opacity-50"
            )}
        onClick={() => handlePageChange(p as number)}
      >
        {p}
      </button>
    )
  )
}


    return (
      <div
        className={cn(
          "pt-[16px] xl:pt-[18px] pb-16 tab:flex justify-between items-center w-full",
          wrapperClass,
        )}
      >
        {/* Navigation */}
        <div className="flex items-center gap-2">
          {/* First */}
          <button
            className="size-[32px] grid place-items-center rounded-full hover:bg-color-accent/40 disabled:opacity-50"
            onClick={() => handlePageChange(1)}
            disabled={disabled || activePage === 1}
          >
            <ChevronFirst className="!text-color-subtext" size={20} strokeWidth={1.5} />
          </button>

          {/* Prev */}
          <button
            className="size-[32px] grid place-items-center rounded-full hover:bg-color-accent/40 disabled:opacity-50"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={disabled ||activePage === 1}
          >
            <ChevronLeft className="!text-color-subtext" size={20} strokeWidth={1.5} />
          </button>

          {/* Page Numbers */}
          {renderPageNumbers()}

          {/* Next */}
          <button
            className="size-[32px] grid place-items-center rounded-full hover:bg-color-accent/40 disabled:opacity-50"
            onClick={() => handlePageChange(activePage + 1)}
          disabled={disabled || activePage === totalPages}
          >
            <ChevronRight className="!text-color-subtext" size={20} strokeWidth={1.5} />
          </button>

          {/* Last */}
          <button
            className="size-[32px] grid place-items-center rounded-full hover:bg-color-accent/40 disabled:opacity-50"
            onClick={() => handlePageChange(totalPages)}
           disabled={disabled || activePage === totalPages}
          >
            <ChevronLast className="!text-color-subtext" size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Showing text */}
        <p className="text-xs text-color-subtext tab:pr-3 pl-2 tab:pl-0 pt-4">
          {`Showing ${calcShowing()} of ${totalItems} results`}
        </p>
      </div>
    )
  },
)

Pagination.displayName = "Pagination"
