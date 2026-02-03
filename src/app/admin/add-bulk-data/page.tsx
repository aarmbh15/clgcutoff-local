import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import AddBulkDataForm from "@/components/admin-panel/add-bulk-data/AddBulkDataForm"
import React from "react"

export default function AddDataPage() {
  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Add Data</Heading>

      <AddBulkDataForm />
    </BELayout>
  )
}
