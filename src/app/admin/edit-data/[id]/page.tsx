import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import AddDataForm from "@/components/admin-panel/add-data/AddDataForm"
import React from "react"

export default function EditDataPage() {
  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Edit Data</Heading>

      <AddDataForm editMode />
    </BELayout>
  )
}
