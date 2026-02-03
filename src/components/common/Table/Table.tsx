import { cn, isEmpty, shouldRenderComponent } from "@/utils/utils"
import { useSearchParams } from "next/navigation"
import React, { ReactNode, useEffect, useState } from "react"
import { isMobile } from "react-device-detect"
import { Loader } from "../Loader"
import { Loader2Icon } from "lucide-react"

interface TableProps {
  columns: TableColumn[]
  data: any[]
  hideSLNo?: boolean
  selectable?: boolean
  itemsCountPerPage?: number
  className?: string
   loading?: boolean
  onChange?: (selectedRows: any[]) => void
  renderBelowTable?: React.ReactNode
}

export interface TableColumn {
  title: ReactNode
  tableKey: string
  width?: string
  hidden?: boolean
 
  overrideInternalClick?: boolean
  disableMobStaticLeft?: boolean
  renderer?: (props: {
    rowData: any
    cellData: React.ReactNode
  }) => React.ReactNode
}

const headerTHClass =
  "border-b border-color-border px-4 py-3 text-left text-white font-medium text-sm title"

export function Table({
  selectable,
  hideSLNo,
  columns,
  className,
  data,
  onChange,
  itemsCountPerPage,
  renderBelowTable,
  loading
}: TableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const searchParams = useSearchParams()

  useEffect(() => {
    setSelectedRows(new Set())
    onChange?.([])
  }, [data])

  const handleSelectRow = (index: number) => {
    const newSelectedRows = new Set(selectedRows)
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index)
    } else {
      newSelectedRows.add(index)
    }
    setSelectedRows(newSelectedRows)
    onChange?.(Array.from(newSelectedRows).map((i) => data[i]))
  }

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set())
      onChange?.([])
    } else {
      const allSelected = new Set(data.map((_, index) => index))
      setSelectedRows(allSelected)
      onChange?.(data)
    }
  }

  function getRowSLNumber(rowIndex: number) {
    let pageSize = 10
    if (itemsCountPerPage) {
      pageSize = itemsCountPerPage
    }

    return (
      (parseInt(searchParams.get("page") || "1") - 1) * pageSize +
      (rowIndex + 1)
    )
  }

  function handleStaticLeft(column: TableColumn, isHeader?: boolean) {
    const bgColor = isHeader ? "bg-color-table-header" : "bg-color-white_black"

    if (column?.tableKey === "instituteName") {
      if (column?.disableMobStaticLeft && isMobile) {
        return ""
      }
      return `tableStaticLeft ${bgColor}`
    }

    return ""
  }

  function handleBold(tableKey: string) {
    if (tableKey.includes("Round") || tableKey.includes("Rank")) {
      return "!font-[500]"
    }
  }

  return (
    <div className={cn("relative")}>
      {/* {isEmpty(data) && (
        <div className="defaultTextStyles font-normal absolute top-1/2 left-1/2 -translate-x-1/2">
          No Data Available...
        </div>
      )} */}

      { loading?<div className="defaultTextStyles font-normal absolute top-1/2 left-1/2 -translate-x-1/2">
          <Loader2Icon className="animate-spin text-color-accent"/>
        </div>: <div className="defaultTextStyles font-normal absolute top-1/2 left-1/2 -translate-x-1/2">
          No Data Available...
        </div>}
      <div
        className={cn(
          "overflow-auto border rounded-lg border-color-border relative min-h-[543px] max-h-[750px]",
          data?.length === 10 && "min-h-0",
          isMobile &&
            "landscape:min-h-[250px] landscape:max-h-[calc(100vh-10px)]",
          className,
        )}
      >
        <table className="min-w-full border-collapse table-fixed">
          <thead className="sticky top-0 z-[11] bg-color-table-header">
            <tr>
              {selectable && (
                <th
                  className={cn(
                    "border-b border-color-border p-3 tableCheckboxStatic bg-color-table-header",
                  )}
                >
                  <input
                    className="translate-y-[2px]"
                    type="checkbox"
                    checked={
                      selectedRows?.size === data?.length && !isEmpty(data)
                    }
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {!hideSLNo && <th className={cn(headerTHClass, "px-3")}>#</th>}
              {columns?.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    headerTHClass,
                    "uppercase",
                    column?.tableKey === "action" &&
                      "tableActionStatic bg-color-table-header",
                    handleStaticLeft(column, true),
                  )}
                  style={{ minWidth: column?.width }}
                >
                  {column?.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "cursor-pointer group",
                  "border-b border-color-border",
                )}
                onClick={() => handleSelectRow(rowIndex)}
              >
                {selectable && (
                  <td className="p-3 bg-color-form-background tableCheckboxStatic">
                    <input
                      className="translate-y-[2px]"
                      type="checkbox"
                      checked={selectedRows.has(rowIndex)}
                    />
                  </td>
                )}
                {!hideSLNo && (
                  <td className="p-3 text-left text-[13px] bg-color-white_black">
                    <div>{getRowSLNumber(rowIndex)}</div>
                  </td>
                )}
                {columns?.map((column, colIndex) => {
                  return (
                    <td
                      key={colIndex}
                      className={cn(
                        "px-4 py-3 text-left text-[13px] bg-color-white_black",
                        column?.overrideInternalClick && "cursor-auto",
                        column?.tableKey === "action" &&
                          "tableActionStatic px-0 py-0",
                        handleStaticLeft(column, false),
                      )}
                      onClick={(e) =>
                        column?.overrideInternalClick
                          ? e.stopPropagation()
                          : null
                      }
                    >
                      <div
                        className={cn(
                          "min-h-8 flex items-center text-[13px]",
                          handleBold(column?.tableKey),
                        )}
                      >
                        {column?.renderer
                          ? column?.renderer({
                              rowData: row,
                              cellData: row[column?.tableKey],
                            })
                          : shouldRenderComponent(
                                [
                                  row[column?.tableKey] === "-",
                                  !row[column?.tableKey],
                                ],
                                "OR",
                              )
                            ? "NA"
                            : row[column?.tableKey]}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {renderBelowTable}
      </div>
    </div>
  )
}

