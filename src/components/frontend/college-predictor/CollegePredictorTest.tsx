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
import React from "react"
import { Check, Search, Lock } from "lucide-react"

interface IFormData {
  rank?: number | string
  state?: IOption
  courses?: IOption
  quotas?: IOption
  subQuota?: IOption
  subCategory?: IOption
  categories?: IOption
  counsellingType?: IOption
  counsellingTypeList?: IOption
  courseType?: IOption
  predictorDataList?: IOption
  filteredCounsellingTypeDataList?: IOption
  quotaTypeList?: IOption
}

const counsellingTypeDataList = [
  { id: 1, text: "All India Counselling" },
  { id: 2, text: "State Counselling" },
]

export function CollegePredictorTest() {
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

  const [defaultValues, setDefaultValues] = useState<IFormData>()
  const [quotasList, setQuotasList] = useState<IOption[]>([])
  const [categoriesList, setCategoriesList] = useState<IOption[]>([])
  const [subQuotasList, setSubQuotasList] = useState<IOption[]>([])
  const [subCategoriesList, setSubCategoriesList] = useState<IOption[]>([])

  const [stateList, setStateList] = useState<IOption[]>([])
  const [radioOption, setRadioOption] = useState(["Rank", "Marks"])
  const [selected, setSelected] = useState("Rank")
  const [courseTypeList, setcourseTypeList] = useState<IOption[]>([])
  const [coursesList, setCoursesList] = useState<IOption[]>([])

  const [isCourseLoading,setIsCourseLoading]=useState(false)
  const [isQuotaLoading,setIsQuotaLoading]=useState(false)
  const [isCourseTypeLoading,setIsCourseTypeLoading]=useState(false)
  const [isStateLoading,setIsStateLoading]=useState(false)
  const [isCategoryLaoding,setIsCategoryLaoding]=useState(false)

  const allowedPredictorIds = ["NEET UG", "NEET PG", "NEET MDS","AIAPGET (Ayurveda)"]

  const filteredCounsellingTypeDataList: IOption[] =
    allowedPredictorIds.includes(formData?.courseType?.text || "")
      ? counsellingTypeDataList
      : [counsellingTypeDataList[0]]
  const { fetchData } = useFetch()
  const { setAppState } = useAppState()
  const router = useRouter()

  async function fetchQuotas(counsellingTypeId: string, stateCode?: string, courseType?: string) {
    setIsQuotaLoading(true)
    try {
      const url = new URL("/api/quota-types", window.location.origin)
      url.searchParams.set("counselling_type_id", counsellingTypeId)
      if (stateCode) url.searchParams.set("state_code", stateCode)
      if (courseType) url.searchParams.set("course_type", courseType)

      const res = await fetch(url.toString())
      const json = await res.json()

      const quotas = json.data.map((q: IOption) => ({
        ...q,
        id: q.id,
        text: q.text,
      }))
      return quotas
    } catch (error) {
      console.log(error)
      return []
    } finally {
      setIsQuotaLoading(false)
    }
  }

  async function fetchCategoryTypes(quotaId: string) {
    setIsCategoryLaoding(true)
    try {
      const url = new URL("/api/category-types", window.location.origin)
      url.searchParams.set("quota_type_id", quotaId)
      const res = await fetch(url.toString())
      const json = await res.json()
      const category = json.data.map((q: IOption) => ({
        ...q,
        id: q.id,
        text: q.text,
      }))
      return category
    } catch (error) {
      console.log("error",error)
    } finally {
      setIsCategoryLaoding(false)
    }
  }

  useEffect(() => {
    const fetchQ = async () => {
      try {
        const data = await fetchQuotas(
          formData?.counsellingType?.id,
          formData?.state?.code || formData?.state?.id,
          formData?.courseType?.code || formData?.courseType?.text,
        )
        setQuotasList(data)
      } catch (error) {
        console.error("Failed to load quota types:", error)
      }
    }

    if (
      formData?.counsellingType?.id === 1 ||
      (formData?.counsellingType?.id === 2 && formData?.state?.id)
    ) {
      fetchQ()
    }
  }, [
    formData?.counsellingType?.id,
    formData?.state?.id,
    formData?.state?.code,
  ])

  useEffect(() => {
    const loadCategories = async () => {
      if (formData?.quotas?.id) {
        const data = await fetchCategoryTypes(formData?.quotas?.id)
        setCategoriesList(data || [])
      }
    }
    loadCategories()
  }, [formData?.quotas?.id])

  async function getCourses() {
    setIsCourseTypeLoading(true)
    try {
      const res = await fetch("/api/get-courses-types")
      const json = await res.json()
      if (!json?.data || !Array.isArray(json.data)) {
        console.error("Invalid data structure from /api/get-courses-types", json)
        return []
      }

      const data = json.data.map((q: IOption) => ({
        id: q.id,
        text: q.type,
      }))
      return data
    } catch (error) {
      console.error("getCourses error:", error)
      return [] 
    } finally {
      setIsCourseTypeLoading(false)
    }
  }

  async function getCoursesBasedOncourseType(type: string) {
    setIsCourseLoading(true)
    try {
      const res = await fetch(`/api/get-courses?type=${encodeURIComponent(type)}`)
      const { data } = await res.json()

      if (Array.isArray(data)) {
        const mapped = data.map((item) => ({
          id: item.id,
          text: item.text,
        }))

        let sorted = mapped
        if (type.toLowerCase() === "neet pg") {
          const priority: Record<string, number> = {
            md: 1,
            ms: 2,
            diploma: 3,
          }

          sorted = mapped.sort((a, b) => {
            const aKey = a.text.toLowerCase()
            const bKey = b.text.toLowerCase()

            const aPriority = Object.keys(priority).find((k) => aKey.includes(k))
              ? priority[Object.keys(priority).find((k) => aKey.includes(k)) as string]
              : 99
            const bPriority = Object.keys(priority).find((k) => bKey.includes(k))
              ? priority[Object.keys(priority).find((k) => bKey.includes(k)) as string]
              : 99

            return aPriority - bPriority
          })
        }
        
        if (type.includes("PG") || type?.toUpperCase().includes("DNB")) {
          setCoursesList([{ id: "all", text: "All Course" }, ...sorted])
        } else {
          setCoursesList(sorted)
        }
      } else {
        setCoursesList([])
      }
    } catch (error) {
      console.log("Error in course list fetch", error)
    } finally {
       setIsCourseLoading(false)
    }
  }

  useEffect(() => {
    const courseType = async () => {
      try {
        const data = await getCourses()
        setcourseTypeList(data)
      } catch (error) {
        console.log(error)
      }
    }
    courseType()
  }, [])

  const fetchStates = async () => {
    setIsStateLoading(true)
    try {
      const res = await fetch("/api/states")
      const json = await res.json()
      return json.data
    } catch (error) {
      console.log("error",error)
    } finally {
      setIsStateLoading(false)
    }
  }

  useEffect(() => {
    fetchStates()
      .then(setStateList)
      .catch((err) => console.error("State load error:", err))
  }, [])

  function onSubmit() {
    if (selected === "Rank") {
      if (String(formData?.rank).length > 7) {
        setError("rank", { type: "manual", message: "Rank should not be greater than 7 digits" })
        return
      }
    } else {
      if (String(formData?.rank).length > 3) {
        setError("rank", { type: "manual", message: "Marks should not be greater than 3 digits" })
        return
      }
    }

    setAppState({ pageLoader: true })

    const searchParams = new URLSearchParams()
    searchParams.set("rank", formData?.rank?.toString() || "")
    searchParams.set("rankType", selected || "")
    searchParams.set("course", formData?.courses?.text || "")
    searchParams.set("courseType", formData?.courseType?.text || "")
    searchParams.set("state", formData?.state?.text || "All India")
    searchParams.set("stateCode", formData?.state?.code || "all")
    searchParams.set("counsellingTypeId", formData?.counsellingType?.id || "")
    searchParams.set("quota", formData?.quotas?.text || "")
    searchParams.set("subQuota", formData?.subQuota?.text || "")
    searchParams.set("category", formData?.categories?.text || "")
    searchParams.set("subCategory", formData?.subCategory?.text || "")
    router.push(`/results?${searchParams.toString()}`)
  }

  function disableCheck() {
    return (
      isEmpty(formData?.rank) ||
      isEmpty(selected) ||
      isEmpty(formData?.courseType?.text) ||
      isEmpty(formData?.courses?.text)
    )
  }

  const isNeetUG = formData?.courseType?.text === "NEET UG"
  const [step, setStep] = React.useState(1)

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <Card className="w-full max-w-[750px] p-6 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white relative">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Title */}
        <div className="space-y-1.5 mb-2">
          <h3 className="text-[24px] font-bold text-center">
            Predict Your College
          </h3>
          <p className="text-[14px] sm:text-[15px] text-gray-500 text-center">
            Enter your details to find the best college matches
          </p>
        </div>

        {/* STEP HEADER */}
        <div className="relative border-b border-gray-200 pb-2">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-medium text-gray-700">
              <span className="text-orange-500 font-bold">Step {step}/2:</span>{" "}
              {step === 1 && "Your Exam Details"}
              {step === 2 && "Course & Counselling"}
            </p>

            {/* dots */}
            <div className="flex gap-[4px] items-center">
              {[1, 2].map((s) => (
                <span
                  key={s}
                  className={`rounded-full ${
                    s === 1 ? "w-1.5 h-1.5 bg-gray-400" : "w-1.5 h-1.5 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          {/* Orange active underline */}
          <div className="absolute bottom-[-1px] left-0 h-[3px] bg-orange-500 w-20 rounded-full" />
        </div>

        {/* STEP CONTENT */}
        <div className="transition-all duration-300 ease-in-out flex flex-col gap-5">
          {/* ---------------- STEP 1 ---------------- */}
          {step === 1 && (
            <>
              <SearchAndSelect
                name="predictor Type"
                label=""
                placeholder="Select Predictor Type"
                value={formData?.courseType}
                onChange={({ name, selectedValue }) => {
                  onOptionSelected(name, selectedValue, setFormData)
                  if (selectedValue?.text)
                    getCoursesBasedOncourseType(selectedValue?.text)

                  setFormData((prev) => ({
                    ...prev,
                    courseType: selectedValue,
                    courses: undefined,
                    counsellingType: undefined,
                  }))

                  const neetBasedExams = ["NEET UG", "NEET MDS", "NEET SS", "AIAPGET (Ayurveda)"]
                  if (selectedValue?.text && neetBasedExams.includes(selectedValue.text)) {
                    setRadioOption(["Rank", "Marks"])
                  } else {
                    setRadioOption(["Rank", "Percentile"])
                  }
                }}
                loading={isCourseTypeLoading}
                control={control}
                setValue={setValue}
                required
                options={courseTypeList}
                wrapperClass="w-full"
                debounceDelay={0}
                searchAPI={(text, setOptions) => autoComplete(text, courseTypeList, setOptions)}
                errors={errors}
                disableSearch={true}
              />

              <div className="space-y-3">
                <p className="font-semibold text-[15px] text-gray-800">What do you have ?</p>
                <div className="flex gap-6">
                  {radioOption.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selected === option ? 'border-orange-500' : 'border-gray-300'}`}>
                        {selected === option && <div className="w-2 h-2 bg-orange-500 rounded-full" />}
                      </div>
                      <input
                        type="radio"
                        name="rankOrMarks"
                        value={option}
                        checked={selected === option}
                        onChange={() => setSelected(option)}
                        className="hidden"
                      />
                      <span className="text-[15px] text-gray-700 font-medium group-hover:text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-[15px] text-gray-800">{selected || "Rank"}</p>
                <Input
                  name="rank"
                  label=""
                  type="number"
                  placeholder={`e.g. 15234`}
                  setValue={setValue}
                  value={formData?.rank}
                  onChange={(e) => {
                    onTextFieldChange(e, setFormData)
                    clearErrors("rank")
                  }}
                  control={control}
                  errors={errors}
                />
              </div>
            </>
          )}

          {/* ---------------- STEP 2 ---------------- */}
          {step === 2 && (
            <>
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
                loading={isCourseLoading}
                errors={errors}
                wrapperClass="w-full"
                disabled={isEmpty(formData?.courseType?.text)}
                disableSearch={true}
              />

              <SearchAndSelect
                name="counselling Type"
                label="Counselling Type"
                placeholder="Select Counselling Type"
                value={formData?.counsellingType}
                onChange={({ name, selectedValue }) => {
                  onOptionSelected(name, selectedValue, setFormData)
                  setFormData((prev) => ({
                    ...prev,
                    counsellingType: selectedValue,
                    state: undefined,
                    quotas: undefined,
                    categories: undefined,
                  }))
                  setQuotasList([])
                  setCategoriesList([])
                }}
                control={control}
                setValue={setValue}
                required
                options={filteredCounsellingTypeDataList}
                wrapperClass="w-full"
                errors={errors}
                disableSearch={true}
              />

              {formData?.counsellingType?.id == 2 && (
                <SearchAndSelect
                  name="state"
                  label="State"
                  placeholder="Search and Select"
                  value={formData?.state}
                  onChange={({ name, selectedValue }) => {
                    onOptionSelected(name, selectedValue, setFormData)
                    setFormData((prev) => ({
                      ...prev,
                      state: selectedValue,
                      quotas: undefined,
                      categories: undefined,
                    }))
                  }}
                  loading={isStateLoading}
                  control={control}
                  setValue={setValue}
                  options={stateList}
                  wrapperClass="w-full"
                  disableSearch={true}
                />
              )}

              {isNeetUG && (
                <SearchAndSelect
                  name="quotas"
                  label="Quota"
                  placeholder="Select Quota"
                  value={formData?.quotas}
                  onChange={({ name, selectedValue }) => {
                    onOptionSelected(name, selectedValue, setFormData)
                  }}
                  control={control}
                  setValue={setValue}
                  options={quotasList}
                  loading={isQuotaLoading}
                  wrapperClass="w-full"
                  errors={errors}
                  disableSearch={true}
                />
              )}

              {isNeetUG && (
                <SearchAndSelect
                  name="categories"
                  label="Category"
                  placeholder="Select Category"
                  value={formData?.categories}
                  onChange={({ name, selectedValue }) => {
                    onOptionSelected(name, selectedValue, setFormData)
                  }}
                  control={control}
                  setValue={setValue}
                  options={categoriesList}
                  loading={isCategoryLaoding}
                  wrapperClass="w-full"
                  errors={errors}
                  disableSearch={true}
                />
              )}
            </>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3 mt-2">
          {step < 2 && (
            <button
              type="button"
              onClick={nextStep}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold text-[15px] py-3.5 rounded-md shadow-md hover:opacity-95 transition"
            >
              Next Step ›
            </button>
          )}

          {step === 2 && (
            <button
              type="submit"
              onClick={onSubmit}
              disabled={disableCheck()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-orange-600 disabled:opacity-50 text-white font-semibold text-[15px] py-3.5 rounded-md shadow-md hover:opacity-95 transition"
            >
              <Search size={18} strokeWidth={2.5} /> Show My Eligible Colleges
            </button>
          )}

          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="text-sm text-gray-400 hover:text-gray-600 font-medium"
            >
              ‹ Go Back
            </button>
          )}

          {/* Free Limit Text */}
          <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[13px] sm:text-[14px] mt-1 bg-gray-50/50 py-2 rounded-md">
            <Lock size={14} className="text-gray-400" />
            <span>
              Top 3 Colleges Free <span className="mx-1">|</span>{" "}
              <span className="text-gray-400">Unlock Full List</span>
            </span>
          </div>

          {/* Trust Points */}
          <div className="flex flex-col gap-2.5 mt-2 pt-4 border-t border-gray-100">
            {[
              "Updated for 2025 Counselling",
              "Based on Official MCC & State Data",
              "No Fake Predictions",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-[14px] sm:text-[15px] font-medium text-gray-600"
              >
                <div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-green-600 bg-green-50/50 shrink-0">
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" strokeWidth={3} />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Card>
  )
}