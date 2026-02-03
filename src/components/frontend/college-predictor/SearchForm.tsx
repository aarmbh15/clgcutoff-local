"use client"

import { Button } from "@/components/common/Button"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import { useInternalSearchParams } from "@/hooks/useInternalSearchParams"
import { IOption } from "@/types/GlobalTypes"
import { states } from "@/utils/static"
import {
  autoComplete,
  onOptionSelected,
  onTextFieldChange,
} from "@/utils/utils"
import { useRouter } from "next/navigation"
import { SetStateAction, useEffect, useState } from "react"
import { useForm } from "react-hook-form"


interface IFormData {
  rank?: number | string
  course?: IOption
}

export function SearchForm({
  coursesList,
  setUpdateUI,
  setFilterParams,
  setMobFilterFormData,
  disabled
}: {
  coursesList: IOption[]
  setUpdateUI: React.Dispatch<SetStateAction<boolean>>
  setMobFilterFormData: React.Dispatch<SetStateAction<any>>
  setFilterParams: React.Dispatch<SetStateAction<any>>
  disabled?:boolean
}) {
  const {
    handleSubmit,
    control,
    setValue,
    setError,
    trigger,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

  const [formData, setFormData] = useState<IFormData>({
    rank: "",
  })

  const { getSearchParams } = useInternalSearchParams()

  const { setAppState } = useAppState()

  const router = useRouter()

  useEffect(() => {
    setFormData((prev) => ({ ...prev, rank: getSearchParams("rank") || "" }))
  }, [])

  function onSubmit() {
    const searchParams = new URLSearchParams()

    if (!formData?.rank) {
      setError("rank", {
        message: "Rank is required",
      })
      return
    }

    setMobFilterFormData(null)
    setFilterParams(null)

    searchParams.set("rank", formData?.rank?.toString() || "")
    searchParams.set("rankType", getSearchParams("rankType") || "")
    searchParams.set("course", formData?.course?.text || "")
    searchParams.set("courseType", getSearchParams("courseType") || "")
    searchParams.set("stateCode", getSearchParams("stateCode") || "")
    searchParams.set("state", getSearchParams("state") || "")
    searchParams.set("counsellingTypeId", getSearchParams("counsellingTypeId") || "")
    searchParams.set("page", getSearchParams("page") || "1")

    setAppState({ isLoading: true })

    router.push(`/results?${searchParams.toString()}`)

    setTimeout(() => {
      setUpdateUI((prev) => !prev)
    }, 800)
  }

  return (
    <form
      className="grid grid-cols-[repeat(1,minmax(0,1fr))] tab:grid-cols-[repeat(3,minmax(0,1fr))] pc:grid-cols-[repeat(4,minmax(0,1fr))_60px] gap-4 tab:gap-6 border border-color-border rounded-md p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        name="rank"
        label={getSearchParams("rankType")}
        type="number"
        placeholder="Enter Rank"
        value={formData?.rank}
        onChange={(e) => {
          onTextFieldChange(e, setFormData)
          setValue("rank", e.target.value)
          trigger("rank")
        }}
        control={control}
        setValue={setValue}
        required
        rules={{
          required: true,
        }}
        errorClass="absolute"
        errors={errors}
      />

      {/* <SearchAndSelect
        name="domicileState"
        label="State (Domicile State)"
        placeholder="Select your Domicile State"
        value={formData?.domicileState}
        defaultOption={
          getSearchParams("domicileState")
            ? { id: 0, text: getSearchParams("domicileState") }
            : undefined
        }
        onChange={({ name, selectedValue }) => {
          onOptionSelected(name, selectedValue, setFormData)
        }}
        control={control}
        setValue={setValue}
        required
        options={domicileStates}
        debounceDelay={0}
        searchAPI={(text, setOptions) =>
          autoComplete(text, domicileStates, setOptions)
        }
        errors={errors}
      /> */}

      <SearchAndSelect
        name="course"
        label="Course"
        placeholder="Select Course"
        value={formData?.course}
        defaultOption={
          getSearchParams("course")
            ? { id: 0, text: getSearchParams("course") }
            : undefined
        }
        onChange={({ name, selectedValue }) => {
          onOptionSelected(name, selectedValue, setFormData)
        }}
        control={control}
        setValue={setValue}
        options={coursesList}
        required
        debounceDelay={0}
        searchAPI={(text, setOptions) =>
          autoComplete(text, coursesList, setOptions)
        }
        errors={errors}
      />

      <Button
      disabled={disabled}
        className="h-[50px] mt-3 tab:mt-auto place-items-center"
        onClick={onSubmit}
      >
        Search
      </Button>
    </form>
  )
}

