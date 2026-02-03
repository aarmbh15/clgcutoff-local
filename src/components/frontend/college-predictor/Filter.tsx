

"use client"

import { Button } from "@/components/common/Button"
import MultiSelect from "@/components/common/MultiSelect"
import { IOption } from "@/types/GlobalTypes"
import { allInstituteTypes, stateInstituteTypes } from "@/utils/static"
import { autoComplete, cn, onOptionSelected } from "@/utils/utils"
import { Settings2 } from "lucide-react"
import { SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { FeeRangeSlider, MAX_FEE } from "../FeeRangeSlider"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"



export interface IFormData {
  instituteType: IOption[]
  category: IOption[]
  quota: IOption[]
}

export interface IParams {
  feeFrom?: number
  feeTo?: number
  category?: any
  instituteType?: any
  quota?: any
}

export function Filter({
  className,
  setFilterParams,
  setFilterFormData,
  filterFormData,
}: {
  className?: string
  setFilterFormData: React.Dispatch<SetStateAction<IFormData>>
  filterFormData: IFormData
  setFilterParams: React.Dispatch<SetStateAction<any>>
}) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

  const { getSearchParams } = useInternalSearchParams()
  const courseType = getSearchParams("courseType")
  const stateCode = getSearchParams("stateCode")
  const counsellingTypeId = getSearchParams("counsellingTypeId")

  const [categoryList, setCategoriesList] = useState<IOption[]>([])
  const [quotasList, setQuotasList] = useState<IOption[]>([])

  const [range, setRange] = useState<[number, number]>([0, MAX_FEE])
  const [includeFeeRange, setIncludeFeeRange] = useState(false)

  // ✅ Fetch quotas when relevant filter changes
  useEffect(() => {
    async function fetchQuotas() {
      if (!counsellingTypeId) return
      const url = new URL("/api/quota-types", window.location.origin)
      url.searchParams.set("counselling_type_id", counsellingTypeId)
      if (stateCode) url.searchParams.set("state_code", stateCode)
      if (courseType) url.searchParams.set("course_type", courseType)
      const res = await fetch(url.toString())
      const json = await res.json()
      setQuotasList(
        (json.data || []).map((q: any) => ({
          ...q,
          id: q.id,
          text: q.text,
        }))
      )
    }
    if (
      counsellingTypeId === "1" ||
      (counsellingTypeId === "2" && stateCode)
    ) {
      fetchQuotas()
    }
  }, [counsellingTypeId, stateCode, courseType])

  // ✅ Fetch categories when quota changes
useEffect(() => {
  async function fetchCategoryTypes() {
    const quotas = filterFormData?.quota
    if (!quotas || quotas.length === 0) return

    // take latest (last) quota instead of first
    const latestQuotaId = quotas[quotas.length - 1]?.id
    if (!latestQuotaId) return

    const url = new URL("/api/category-types", window.location.origin)
    url.searchParams.set("quota_type_id", latestQuotaId)

    const res = await fetch(url.toString())
    const json = await res.json()

    setCategoriesList(
      (json.data || []).map((cat: any) => ({
        id: cat.id,
        text: cat.text,
        otherValues: { sub_categories: cat.sub_categories || [] },
      }))
    )
  }
  fetchCategoryTypes()
}, [filterFormData?.quota])

  async function onSubmit() {
    let params: IParams = {}

    if (includeFeeRange) {
      params = {
        feeFrom: range[0],
        feeTo: range[1],
      }
    }

    includeInParams(filterFormData?.instituteType, "instituteType", params)
    includeInParams(filterFormData?.category, "category", params)
    includeInParams(filterFormData?.quota, "quota", params)

    setFilterParams(params)
  }

  function includeInParams(
    array: IOption[],
    key: "category" | "instituteType" | "quota",
    params: IParams,
  ) {
    if (array?.length > 0) {
      params[key] = array.map((item) => item.text)
    }
  }

  return (
    <form
      className={cn(
        "flex flex-col gap-4 border border-color-border p-4 rounded-md",
        className,
      )}
      onSubmit={handleSubmit(onSubmit)}
    >
      <MultiSelect
        name="instituteType"
        label="Institute Type"
        placeholder="Select Institute Type"
        value={filterFormData?.instituteType}
        onChange={({ name, selectedOptions }) => {
          onOptionSelected(name, selectedOptions, setFilterFormData)
        }}
        control={control}
        setValue={setValue}
        options={stateCode?.toLowerCase()==="all" ?allInstituteTypes:stateInstituteTypes}
        defaultOption={filterFormData?.instituteType}
        debounceDelay={0}
        searchAPI={(text, setOptions) =>
          autoComplete(text, stateCode?.toLowerCase()==="all" ?allInstituteTypes:stateInstituteTypes, setOptions)
        }
        errors={errors}
      />

      <MultiSelect
        name="quota"
        label="Quota"
        placeholder="Select Quota"
        value={filterFormData?.quota}
        onChange={({ name, selectedOptions }) => {
          onOptionSelected(name, selectedOptions, setFilterFormData)
        }}
        control={control}
        setValue={setValue}
        options={quotasList}
        debounceDelay={0}
        defaultOption={filterFormData?.quota}
        searchAPI={(text, setOptions) =>
          autoComplete(text, quotasList, setOptions)
        }
        errors={errors}
      />

      <MultiSelect
        name="category"
        label="Category"
        placeholder="Select Category"
        value={filterFormData?.category}
        onChange={({ name, selectedOptions }) => {
          onOptionSelected(name, selectedOptions, setFilterFormData)
        }}
        control={control}
        setValue={setValue}
        options={categoryList}
        debounceDelay={0}
        disabled={!filterFormData?.quota || filterFormData?.quota.length === 0} // ✅ Disable until quota is selected
        defaultOption={filterFormData?.category}
        searchAPI={(text, setOptions) =>
          autoComplete(text, categoryList, setOptions)
        }
        errors={errors}
      />

      <FeeRangeSlider
        range={range}
        setRange={setRange}
        includeFeeRange={includeFeeRange}
        setIncludeFeeRange={setIncludeFeeRange}
      />

      <Button
        type="submit"
        className="mt-4 w-full flex items-center gap-2 justify-center"
      >
        <Settings2 />
        Apply Filters
      </Button>
    </form>
  )
}
