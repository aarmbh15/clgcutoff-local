

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import AddQuotaCategorySubQuotaSubCategory from "@/components/admin-panel/add-meta-data/AddQuotaCategory"
import React from "react"

export default function AddDataPage() {
  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Add Quota Category Sub Quota Sub Category</Heading>

      <AddQuotaCategorySubQuotaSubCategory />
    </BELayout>
  )
}
