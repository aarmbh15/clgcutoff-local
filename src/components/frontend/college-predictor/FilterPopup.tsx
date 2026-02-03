"use client"

import { IOptionProps } from "@/components/admin-panel/add-data/AddDataForm"
import { Button } from "@/components/common/Button"
import MultiSelect from "@/components/common/MultiSelect"
import AnimatedPopup from "@/components/common/popups/AnimatedPopup"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { allInstituteTypes,stateInstituteTypes, states } from "@/utils/static"
import { autoComplete, cn, onOptionSelected } from "@/utils/utils"
import React, { SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { FeeRangeSlider, MAX_FEE } from "../FeeRangeSlider"
import { IFormData, IParams } from "./Filter"

interface IFilterPopupProps {
  isOpen: boolean

  setMobFilterFormData: React.Dispatch<SetStateAction<IFormData>>
  mobFilterFormData: IFormData

  setFilterParams: React.Dispatch<SetStateAction<any>>
  // categoryList: IOption[]
  // quotasList: IOption[]

  onConfirm: () => void
  onClose: () => void
}

export function FilterPopup({
  isOpen,
  setFilterParams,
  setMobFilterFormData,
  mobFilterFormData,
  onConfirm,
  onClose,
}: IFilterPopupProps) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

    const { getSearchParams } = useInternalSearchParams()
  const [range, setRange] = useState<[number, number]>([0, MAX_FEE])
  const [includeFeeRange, setIncludeFeeRange] = useState(false)
  const [categoryList, setCategoriesList] = useState<IOption[]>([])
  const [quotasList, setQuotasList] = useState<IOption[]>([])

  const courseType = getSearchParams("courseType")
  const stateCode = getSearchParams("stateCode")
  const counsellingTypeId = getSearchParams("counsellingTypeId")

  // Fetch quotas when relevant filter changes
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


    // console.log("Hari")
  }, [counsellingTypeId, stateCode, courseType])
  // Fetch categories when quota changes
  useEffect(() => {
    async function fetchCategoryTypes() {



    const quotas = mobFilterFormData?.quota


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
  }, [mobFilterFormData?.quota])


  async function onSubmit() {
    let params: IParams = {}

    if (includeFeeRange) {
      params = {
         ...params,
        feeFrom: range[0],
        feeTo: range[1],
      }
    }

    includeInParams(mobFilterFormData?.instituteType, "instituteType", params)
    includeInParams(mobFilterFormData?.category, "category", params)
    includeInParams(mobFilterFormData?.quota, "quota", params)

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
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      height="200px"
      popupClass="w-[350px] tab:w-[700px]"
    >
      <div className="bg-color-form-background py-12 grid place-items-center">
        <form
          className={cn("flex flex-col gap-4 w-full px-6")}
          onSubmit={handleSubmit(onSubmit)}
        >
          <MultiSelect
            name="instituteType"
            label="Institute Type"
            placeholder="Select Institute Type"
            value={mobFilterFormData?.instituteType}
            onChange={({ name, selectedOptions }) => {
              onOptionSelected(name, selectedOptions, setMobFilterFormData)
            }}
            control={control}
            setValue={setValue}
            options={stateCode?.toLowerCase()==="all" ?allInstituteTypes:stateInstituteTypes}
            defaultOption={mobFilterFormData?.instituteType}
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
            value={mobFilterFormData?.quota}
            onChange={({ name, selectedOptions }) => {
              onOptionSelected(name, selectedOptions, setMobFilterFormData)
            }}
            control={control}
            setValue={setValue}
            options={quotasList}
            debounceDelay={0}
            defaultOption={mobFilterFormData?.quota}
            searchAPI={(text, setOptions) =>
              autoComplete(text, quotasList, setOptions)
            }
            errors={errors}
          />

          <MultiSelect
            name="category"
            label="Category"
            placeholder="Select Category"
            value={mobFilterFormData?.category}
            onChange={({ name, selectedOptions }) => {
              onOptionSelected(name, selectedOptions, setMobFilterFormData)
            }}
            control={control}
            setValue={setValue}
            options={categoryList}
            debounceDelay={0}
             disabled={!mobFilterFormData?.quota || mobFilterFormData?.quota.length === 0} // ✅ Disable until quota is selected
            defaultOption={mobFilterFormData?.category}
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
            className="mt-2"
            type="submit"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Apply Filters
          </Button>
        </form>
      </div>
    </AnimatedPopup>
  )
}

