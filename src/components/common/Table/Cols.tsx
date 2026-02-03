import { TableColumn } from "@/components/common/Table/Table"
import { Copy, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

import { isEmpty } from "../../../utils/utils"

interface adminMode {
  isAdmin: boolean
  setRowData: React.Dispatch<React.SetStateAction<any>>
  setPopupOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSingleDelete: React.Dispatch<React.SetStateAction<any[]>>
}

export function generateCols(
  configYear: any[],
  adminMode?: adminMode,
  showToast?: any,
  courseType?: string,
  state?: any,
) {
  let currentYear = new Date().getFullYear()-1
  let previousYear = currentYear - 1
  const percentile_Marks =
    courseType?.includes("UG") || courseType?.includes("MDS")
      ? "Marks"
      : "Percentile"

  if (!isEmpty(configYear)) {
    previousYear = configYear[0]
    currentYear = configYear[1]
  }

  const columns: TableColumn[] = [
    {
      title: "Institute Name",
      tableKey: "instituteName",
      width: "150px",
    },
    { title: "Course", tableKey: "course" },
    { title: "Quota", tableKey: "quota", width: "150px" },
    { title: "Sub-Quota", tableKey: "subQuota", width: "150px" },
    // { title: "Category", tableKey: "category", width: "150px" },
    {
      title: (
        <div>
          Allotted
          <br />
          Category
        </div>
      ),
      tableKey: "category",
    },
    { title: "Sub-Category", tableKey: "subCategory", width: "150px" },

    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${currentYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R1] ${currentYear}`}
        </div>
      ),
      tableKey: `showClosingRankR1`,
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${currentYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R2] ${currentYear}`}
        </div>
      ),
      tableKey: `showClosingRankR2`,
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${currentYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R3] ${currentYear}`}
        </div>
      ),
      tableKey: `showClosingRankR3`,
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
        >
          {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
        </div>
      ),
      tableKey: `showStrayRound`,
      width: "210px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
        >
          Last {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
        </div>
      ),
      tableKey: `showLastStrayRound`,
      width: "210px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },

    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${previousYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R1] ${previousYear}`}
        </div>
      ),
      tableKey: "showPrevClosingRankR1",
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${previousYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R2] ${previousYear}`}
        </div>
      ),
      tableKey: "showPrevClosingRankR2",
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },

    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${previousYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R3] ${previousYear}`}
        </div>
      ),
      tableKey: "showPrevClosingRankR3",
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
        >
          {`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
        </div>
      ),
      tableKey: `showPrevStrayRound`,
      width: "210px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
        >
          Last {`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
        </div>
      ),
      tableKey: `showPrevLastStrayRound`,
      width: "210px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },

    { title: "Institute Type", tableKey: "instituteType", width: "150px" },
    { title: "Fees", tableKey: "fees", width: "100px" },
  ]
  if (state?.code === "all" || state?.code === "All") {
    columns.splice(
      columns.length - 1, // Insert before the last column
      0,
      { title: "State", tableKey: "state", width: "150px" },
    )
  }
  if (adminMode?.isAdmin) {
    const { setRowData, setPopupOpen, setSingleDelete } = adminMode

    const actions = {
      title: "Action",
      tableKey: "action",
      overrideInternalClick: true,
      width: "70px",
      renderer: ({ rowData }: any) => {
        // if (rowData?.id) {

        //   return (
        //     <div className="flex items-center gap-2 bg-color-form-background px-4 py-5">
        //       <Copy
        //         size={20}
        //         className="text-color-text cursor-pointer"
        //         onClick={() => {
        //           const link = `${process.env.NEXT_PUBLIC_BASE_URL}/${rowData?.courseType?.toString()?.toLowerCase()}/cutoff?college=${encodeURIComponent(rowData?.instituteName ?? "")}&state=${encodeURIComponent(rowData?.state ?? "")}`
        //           copyToClipboard(link)
        //           showToast?.("success", "Copied to clipboard")
        //         }}
        //       />
        //       <Pencil
        //         size={20}
        //         className="text-color-text cursor-pointer"
        //         onClick={() => {
        //           setRowData(rowData)
        //         }}
        //       />

        //       <Trash2
        //         size={20}
        //         className="text-color-text cursor-pointer"
        //         onClick={() => {
        //           setSingleDelete([rowData?.new_id, rowData?.prev_id])
        //           setPopupOpen(true)
        //         }}
        //       />
        //     </div>
        //   )
        // }

        const id = rowData?.id

        return (
          <div className="flex items-center gap-2 bg-color-form-background px-4 py-5">
            <Copy
              size={20}
              className="text-color-text cursor-pointer"
              onClick={() => {
                const link = `${process.env.NEXT_PUBLIC_BASE_URL}/${rowData?.courseType.replaceAll(" ", "-").toLowerCase()}/cutoff?stateCode=${state?.code.toLowerCase()}&college=${encodeURIComponent(rowData?.instituteName ?? "")}&state=${encodeURIComponent(state.text ?? "")}&course=${rowData?.course || ""}`
                copyToClipboard(link)
                showToast?.("success", "Copied to clipboard")
              }}
            />

            <Link
              href={`/admin/edit-data/${id}?stateCode=${state?.code}`}
              target="_blank"
            >
              <Pencil
                size={20}
                className="text-color-text hover:text-blue-600 cursor-pointer"
              />
            </Link>
            <Trash2
              size={20}
              className="text-color-text hover:text-red-600 cursor-pointer"
              onClick={() => {
                setSingleDelete([id])
                setPopupOpen(true)
              }}
            />
          </div>
        )
      },
    }

    columns.push(actions)
  }

  return columns
}

function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    // Modern clipboard API
    navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed" // Prevent scrolling to bottom
    textArea.style.top = "-1000px"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand("copy")
    } catch (err) {
      console.error("Fallback copy failed:", err)
    }

    document.body.removeChild(textArea)
  }
}

export function generateColsPublic(
  configYear: any[],
  details?: { paid?: boolean; courseType?: string; stateCode: string },
) {
  let currentYear = new Date().getFullYear()
  let previousYear = currentYear - 1

  let paid, courseType

  if (details) {
    paid = details?.paid
    courseType = details?.courseType
  }

  // console.log(paid,courseType)

  const percentile_Marks =
    courseType?.toUpperCase().includes("UG") ||
    courseType?.toUpperCase().includes("MDS")
      ? "Marks"
      : "Percentile"

  if (!isEmpty(configYear)) {
    previousYear = configYear[0]
    currentYear = configYear[1]
  }

  const columns: TableColumn[] = [
    {
      title: "Institute Name",
      tableKey: "instituteName",
      width: "150px",
    },
    { title: "Course", tableKey: "course" },
    { title: "Quota", tableKey: "quota", width: "150px" },
    { title: "Sub-Quota", tableKey: "subQuota", width: "150px" },
    {
      title: (
        <div>
          Allotted
          <br />
          Category
        </div>
      ),
      tableKey: "category",
    },
    { title: "Sub-Category", tableKey: "subCategory", width: "150px" },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${currentYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R1] ${currentYear}`}
        </div>
      ),
      tableKey: `showClosingRankR1`,
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },

  ...(courseType?.toUpperCase().includes("UG")?[ {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${currentYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R2] ${currentYear}`}
        </div>
      ),
      tableKey: `showClosingRankR2`,
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${currentYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R3] ${currentYear}`}
        </div>
      ),
      tableKey: `showClosingRankR3`,
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
        >
          {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
        </div>
      ),
      tableKey: `showStrayRound`,
      width: "210px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
        >
          Last {`Stray Round Rank/ ${percentile_Marks} ${currentYear}`}
        </div>
      ),
      tableKey: `showLastStrayRound`,
      width: "210px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
  ]:[]),

    
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${previousYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R1] ${previousYear}`}
        </div>
      ),
      tableKey: "showPrevClosingRankR1",
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${previousYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R2] ${previousYear}`}
        </div>
      ),
      tableKey: "showPrevClosingRankR2",
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${previousYear}`}
        >
          {`Closing Rank/ ${percentile_Marks} [R3] ${previousYear}`}
        </div>
      ),
      tableKey: "showPrevClosingRankR3",
      width: "190px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
        >
          {`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
        </div>
      ),
      tableKey: `showPrevStrayRound`,
      width: "210px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
    {
      title: (
        <div
          data-tooltip-id="tooltip"
          data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
        >
          Last {`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
        </div>
      ),
      tableKey: `showPrevLastStrayRound`,
      width: "210px",
      renderer({ cellData }) {
        return cellData !== "xxx" &&
          (cellData === "undefined" ||
            cellData === "null" ||
            cellData == null) ? (
          "NA"
        ) : (
          <div
            data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
            data-tooltip-content={`Unlock This College @ ₹49`}
          >
            {cellData ?? "NA"}
          </div>
        )
      },
    },
  ]

  // if (paid) {
  //   columns.push({
  //     title: (
  //       <div
  //         data-tooltip-id="tooltip"
  //         data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 1 ${previousYear}`}
  //       >
  //         {`Closing Rank/ ${percentile_Marks} [R1] ${previousYear}`}
  //       </div>
  //     ),
  //     tableKey: "showPrevClosingRankR1",
  //     width: "190px",
  //     renderer({ cellData }) {
  //       return cellData !== "xxx" &&
  //         (cellData === "undefined" ||
  //           cellData === "null" ||
  //           cellData == null) ? (
  //         "NA"
  //       ) : (
  //         <div
  //           data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
  //           data-tooltip-content={`Unlock This College @ ₹49`}
  //         >
  //           {cellData ?? "NA"}
  //         </div>
  //       )
  //     },
  //   })

  //   columns.push(
  //     {
  //       title: (
  //         <div
  //           data-tooltip-id="tooltip"
  //           data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 2 ${previousYear}`}
  //         >
  //           {`Closing Rank/ ${percentile_Marks} [R2] ${previousYear}`}
  //         </div>
  //       ),
  //       tableKey: "showPrevClosingRankR2",
  //       width: "190px",
  //       renderer({ cellData }) {
  //         return cellData !== "xxx" &&
  //           (cellData === "undefined" ||
  //             cellData === "null" ||
  //             cellData == null) ? (
  //           "NA"
  //         ) : (
  //           <div
  //             data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
  //             data-tooltip-content={`Unlock This College @ ₹49`}
  //           >
  //             {cellData ?? "NA"}
  //           </div>
  //         )
  //       },
  //     },

  //     {
  //       title: (
  //         <div
  //           data-tooltip-id="tooltip"
  //           data-tooltip-content={`Closing Rank/ ${percentile_Marks} Round 3 ${previousYear}`}
  //         >
  //           {`Closing Rank/ ${percentile_Marks} [R3] ${previousYear}`}
  //         </div>
  //       ),
  //       tableKey: "showPrevClosingRankR3",
  //       width: "190px",
  //       renderer({ cellData }) {
  //         return cellData !== "xxx" &&
  //           (cellData === "undefined" ||
  //             cellData === "null" ||
  //             cellData == null) ? (
  //           "NA"
  //         ) : (
  //           <div
  //             data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
  //             data-tooltip-content={`Unlock This College @ ₹49`}
  //           >
  //             {cellData ?? "NA"}
  //           </div>
  //         )
  //       },
  //     },
  //     {
  //       title: (
  //         <div
  //           data-tooltip-id="tooltip"
  //           data-tooltip-content={`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
  //         >
  //           {`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
  //         </div>
  //       ),
  //       tableKey: `showPrevStrayRound`,
  //       width: "210px",
  //       renderer({ cellData }) {
  //         return cellData !== "xxx" &&
  //           (cellData === "undefined" ||
  //             cellData === "null" ||
  //             cellData == null) ? (
  //           "NA"
  //         ) : (
  //           <div
  //             data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
  //             data-tooltip-content={`Unlock This College @ ₹49`}
  //           >
  //             {cellData ?? "NA"}
  //           </div>
  //         )
  //       },
  //     },
  //     {
  //       title: (
  //         <div
  //           data-tooltip-id="tooltip"
  //           data-tooltip-content={`Last Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
  //         >
  //           Last {`Stray Round Rank/ ${percentile_Marks} ${previousYear}`}
  //         </div>
  //       ),
  //       tableKey: `showPrevLastStrayRound`,
  //       width: "210px",
  //       renderer({ cellData }) {
  //         return cellData !== "xxx" &&
  //           (cellData === "undefined" ||
  //             cellData === "null" ||
  //             cellData == null) ? (
  //           "NA"
  //         ) : (
  //           <div
  //             data-tooltip-id={cellData === "xxx" ? "tooltip" : ""}
  //             data-tooltip-content={`Unlock This College @ ₹49`}
  //           >
  //             {cellData ?? "NA"}
  //           </div>
  //         )
  //       },
  //     },
  //   )
  // }

  columns.push(
    { title: "Institute Type", tableKey: "instituteType", width: "150px" },
    // { title: "State", tableKey: "state", width: "150px" },
    { title: "Fees", tableKey: "fees", width: "100px" },
  )

  if (details?.stateCode?.toLowerCase() === "all") {
    // console.log(details)
    columns.splice(
      columns.length - 1, // Insert before the last column
      0,
      { title: "State", tableKey: "state", width: "150px" },
    )
  }
  return columns
}

