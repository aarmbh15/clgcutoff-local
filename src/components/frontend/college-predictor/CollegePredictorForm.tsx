"use client"

import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import { states } from "@/utils/static"
import {
  autoComplete,
  isEmpty,
  onOptionSelected,
  onTextFieldChange,
} from "@/utils/utils"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"

const domicileStates: IOption[] = states.slice(1)

interface IFormData {
  rank?: number | string
  domicileState?: IOption
  courses?: IOption
  courseType?: IOption
}

export function CollegePredictorForm() {
  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

  const [formData, setFormData] = useState<IFormData>({
    rank: "",
  })

  const [radioOption, setRadioOption] = useState(["Rank", "Marks"])
  const [selected, setSelected] = useState("Rank")

  const [coursesList, setCoursesList] = useState<IOption[]>([])
  const { fetchData } = useFetch()

  const { setAppState } = useAppState()

  const router = useRouter()

  async function getCoursesData(type: string) {
    const res = await fetchData({
      url: "/api/admin/configure/courses/get",
      params: { type },
    })

    if (res?.payload?.data?.length > 0) {
      // setCoursesList([
      //   {
      //     id: "all",
      //     text: `All ${type === "ug" ? "UG" : "PG"} Courses`,
      //   },

      //   ...res?.payload?.data,
      // ])

      setCoursesList(res?.payload?.data || [])
    }
  }

  function onSubmit() {
    if (selected === "Rank") {
      if (String(formData?.rank).length > 7) {
        setError("rank", {
          type: "manual",
          message: "Rank should not be greater than 7 digits",
        })
        return
      }
    } else {
      if (String(formData?.rank).length > 3) {
        setError("rank", {
          type: "manual",
          message: "Marks should not be greater than 3 digits",
        })
        return
      }
    }

    setAppState({ pageLoader: true })

    const searchParams = new URLSearchParams()

    searchParams.set("rank", formData?.rank?.toString() || "")
    searchParams.set("rankType", selected || "")
    searchParams.set("domicileState", formData?.domicileState?.text || "")
    searchParams.set("course", formData?.courses?.text || "")
    searchParams.set("courseType", formData?.courseType?.text || "")

    router.push(`/results?${searchParams.toString()}`)
  }

  function disableCheck() {
    return (
      isEmpty(formData?.rank) ||
      isEmpty(selected) ||
      isEmpty(formData?.courseType?.text) ||
      isEmpty(formData?.domicileState?.text) ||
      isEmpty(formData?.courses?.text)
    )
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

// // Close dropdown on outside click
// useEffect(() => {
//   function handleClickOutside(event: MouseEvent) {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//       props.setOpenDropdownName(null)
//     }
//   }

//   document.addEventListener("mousedown", handleClickOutside)
//   return () => document.removeEventListener("mousedown", handleClickOutside)
// }, [])

  return (
    <Card className="mt-2 tab:mx-16 p-7 tab:p-10">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <h3 className="text-[25px] pc:text-4xl font-bold text-center">
            Predict Your College
          </h3>
          <p className="text-base text-gray-500 text-center poppinsFont">
            Enter your details to find the best college matches
          </p>
        </div>

        <SearchAndSelect
          name="courseType"
          label="Course Type"
          placeholder="Select your Course Type"
          value={formData?.courseType}
          // defaultOption={{
          //   id: "ug",
          //   text: "UG",
          // }}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)

            if (selectedValue?.id === "ug") {
              setRadioOption(["Rank", "Marks"])
            } else {
              setRadioOption(["Rank", "Percentile"])
            }

            getCoursesData(selectedValue?.id)
          }}
          control={control}
          setValue={setValue}
          options={[
            {
              id: "ug",
              text: "UG",
            },
            {
              id: "pg",
              text: "PG",
            },
          ]}
          debounceDelay={0}
          searchAPI={(text, setOptions) =>
            autoComplete(text, coursesList, setOptions)
          }
          errors={errors}
        />

        <p>What do you have ?</p>

        <div className="flex space-x-6 mt-[-20px]">
          {radioOption.map((option) => (
            <label
              key={option}
              className="relative flex items-center space-x-2 cursor-pointer text-color-text"
            >
              <input
                type="radio"
                name="rankOrMarks"
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                className="peer hidden"
              />
              <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:bg-orange-500 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full peer-checked:opacity-100 opacity-0 transition-opacity"></div>
              </div>
              <span className="peer-checked:text-orange-500 ">{option}</span>
            </label>
          ))}
        </div>

        <Input
          name="rank"
          label={selected || "Rank"}
          type="number"
          placeholder={`Enter your ${selected || "Rank"}`}
          setValue={setValue}
          value={formData?.rank}
          onChange={(e) => {
            onTextFieldChange(e, setFormData)
            clearErrors("rank")
          }}
          control={control}
          rules={{
            required: false,
          }}
          errors={errors}
        />

        <SearchAndSelect
          name="domicileState"
          label="State (Domicile State)"
          placeholder="Select your Domicile State"
          value={formData?.domicileState}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          setValue={setValue}
          options={domicileStates}
          debounceDelay={0}
          searchAPI={(text, setOptions) =>
            autoComplete(text, domicileStates, setOptions)
          }
          errors={errors}
        />

        <SearchAndSelect
          name="courses"
          label="Course"
          placeholder="Select your Course"
          value={formData?.courses}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          setValue={setValue}
          options={coursesList}
          debounceDelay={0}
          searchAPI={(text, setOptions) =>
            autoComplete(text, coursesList, setOptions)
          }
          errors={errors}
          disabled={isEmpty(formData?.courseType?.text)}
        />

        <Button
          className="mt-6"
          onClick={onSubmit}
          // data-tooltip-id={"tooltip"}
          // data-tooltip-content="Coming Soon"
          disabled={disableCheck()}
          // disabled
        >
          Predict My College
        </Button>
      </form>
    </Card>
  )
}

