"use client"

import { ResponsiveGrid } from "@/components/admin-panel/ResponsiveGrid"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { createAdminSupabaseClient } from "@/lib/supabase"
import { IOption } from "@/types/GlobalTypes"
import { courseType, instituteTypes, states, years } from "@/utils/static"
import {
  autoComplete,
  clearReactHookFormValueAndStates,
  createPayload,
  isEmpty,
  onOptionSelected,
  onTextFieldChange,
} from "@/utils/utils"
import { Delete, Loader2, Save } from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const filteredStates = states.slice(1)

interface IFormData {
  instituteName?: string
  instituteType?: IOption
  state?: IOption
  stateOption?: IOption
  courses?: IOption
  quotas?: IOption
  subQuota?: IOption
  subCategory?: IOption
  categories?: IOption
  fees?: number | string
  closingRankR1?: string
  closingRankR2?: string
  closingRankR3?: string
  strayRound?: string
  lastStrayRound?: string
  prevClosingRankR1?: string
  prevClosingRankR2?: string
  prevClosingRankR3?: string
  prevStrayRound?: string
  prevLastStrayRound?: string
  year?: IOption
  counsellingType?: IOption
  counsellingTypeList?: IOption
  courseType?: IOption
  predictorDataList?: IOption
  filteredCounsellingTypeDataList?: IOption
  quotaTypeList?: IOption
}

type State = {
  id?: number
  code?: string
  name?: string
}
export interface IOptionProps {
  sub_categories?: never[]
  id: any
  text: string
  disable?: boolean
  otherValues?: any
  code?: string
  type?: string
}
const predictorDataList: IOption[] = [
  { id: 1, text: "NEET UG" },
  { id: 2, text: "NEET PG" },
  { id: 3, text: "NEET MDS" },
  { id: 4, text: "DNB" },
  { id: 5, text: "INICET" },
  { id: 6, text: "NEET SS" },
]

const counsellingTypeDataList = [
  { id: 1, text: "All India Counselling" },
  { id: 2, text: "State Counselling" },
]
export default function AddDataForm({ editMode }: { editMode?: boolean }) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    shouldFocusError: true,
  })

  const [formData, setFormData] = useState<IFormData>({})
  const [defaultValues, setDefaultValues] = useState<IFormData>({})
  const [quotasList, setQuotasList] = useState<IOption[]>([])
  const [categoriesList, setCategoriesList] = useState<IOption[]>([])
  const [coursesList, setCoursesList] = useState<IOption[]>([])
  const [counsellingTypeList, setCounsellingList] = useState<IOption[]>([])
  const [subQuotasList, setSubQuotasList] = useState<IOption[]>([])
  const [subCategoriesList, setSubCategoriesList] = useState<IOption[]>([])
  const [courseTypeList, setCourseTypeList] = useState<IOption[]>([])
  const [stateList, setStateList] = useState<IOption[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchParams = useSearchParams()
  const stateCode = searchParams.get("stateCode") || ""
  const params = useParams()

  const { showToast } = useAppState()
  const { fetchData } = useFetch()

  const allowedPredictorIds = [
    "NEET UG",
    "NEET PG",
    "NEET MDS",
    "AIAPGET (Ayurveda)",
  ]

  const filteredCounsellingTypeDataList: IOption[] =
    allowedPredictorIds.includes(formData?.courseType?.text || "")
      ? counsellingTypeDataList
      : [counsellingTypeDataList[0]]

  async function getCourses() {
    try {
      const res = await fetch("/api/get-courses-types")
      const json = await res.json()
      if (!json?.data || !Array.isArray(json.data)) {
        return []
      }
      return json.data.map((q: IOptionProps) => ({
        id: q.id,
        text: q.type,
      }))
    } catch (error) {
      console.error("getCourses error:", error)
      return []
    }
  }

  useEffect(() => {
    const fetchLists = async () => {
      const courseTypes = await getCourses()
      const counsellingTypes = await fetchCounsellingTypes()
      const statesData = await fetchStates()

      setCourseTypeList(courseTypes)
      setCounsellingList(counsellingTypes)
      setStateList(statesData)
    }

    fetchLists()
  }, [])

  // 2. When lists + editMode + id are ready, fetch data
  useEffect(() => {
    if (
      editMode &&
      params?.id &&
      stateList.length > 0 &&
      courseTypeList.length > 0
    ) {
      getDataById(params.id, stateCode)
    }
  }, [editMode, params?.id, stateList, courseTypeList])

  async function getDataById(id: any, stateCode: string) {
    setIsLoading(true)
    try {
      const res = await fetchData({
        url: "/api/admin/get_data_by_id",
        params: { id, stateCode },
      })

      const data = res?.payload?.data
      if (!data) {
        showToast("error", "Data not found")
        return
      }

      // Create base form data object
      const formatData: IFormData = {
        instituteName: data?.instituteName || "",
        fees: data?.fees || "",

        // Current year ranks
        closingRankR1:
          data?.closingRankR1 && data?.closingRankR1 !== "null"
            ? `${data.closingRankR1}${data?.cRR1 ? `/${data.cRR1}` : ""}`
            : "",

        closingRankR2:
          data?.closingRankR2 && data?.closingRankR2 !== "null"
            ? `${data.closingRankR2}${data?.cRR2 ? `/${data.cRR2}` : ""}`
            : "",

        closingRankR3:
          data?.closingRankR3 && data?.closingRankR3 !== "null"
            ? `${data.closingRankR3}${data?.cRR3 ? `/${data.cRR3}` : ""}`
            : "",

        strayRound:
          data?.strayRound && data?.strayRound !== "null"
            ? `${data.strayRound}${data?.sRR ? `/${data.sRR}` : ""}`
            : "",

        lastStrayRound:
          data?.lastStrayRound && data?.lastStrayRound !== "null"
            ? `${data.lastStrayRound}${data?.lSRR ? `/${data.lSRR}` : ""}`
            : "",

        // Previous year ranks
        prevClosingRankR1:
          data?.prevClosingRankR1 && data?.prevClosingRankR1 !== "null"
            ? `${data.prevClosingRankR1}${data?.prevCRR1 ? `/${data.prevCRR1}` : ""}`
            : "",

        prevClosingRankR2:
          data?.prevClosingRankR2 && data?.prevClosingRankR2 !== "null"
            ? `${data.prevClosingRankR2}${data?.prevCRR2 ? `/${data.prevCRR2}` : ""}`
            : "",

        prevClosingRankR3:
          data?.prevClosingRankR3 && data?.prevClosingRankR3 !== "null"
            ? `${data.prevClosingRankR3}${data?.prevCRR3 ? `/${data.prevCRR3}` : ""}`
            : "",

        prevStrayRound:
          data?.prevStrayRound && data?.prevStrayRound !== "null"
            ? `${data.prevStrayRound}${data?.prevSRR ? `/${data.prevSRR}` : ""}`
            : "",

        prevLastStrayRound:
          data?.prevLastStrayRound && data?.prevLastStrayRound !== "null"
            ? `${data.prevLastStrayRound}${data?.prevlSRR ? `/${data.prevlSRR}` : ""}`
            : "",
      }

      // Set basic fields first
      Object.entries(formatData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key, value)
        }
      })

      // Preselect courseType
      if (data?.courseType) {
        const courseTypeOption = courseTypeList.find(
          (ct) => ct.text === data.courseType,
        )
        if (courseTypeOption) {
          formatData.courseType = courseTypeOption
          setValue("courseType", courseTypeOption)

          // Load courses based on this courseType
          const coursesData = await getCoursesBasedOnCourseType(data.courseType)
          setCoursesList(coursesData)

          // Now preselect course
          if (data?.course) {
            const courseOption = coursesData.find((c) => c.text === data.course)
            if (courseOption) {
              formatData.courses = courseOption
              setValue("courses", courseOption)
            }
          }
        }
      }
      // 2. Counselling Type
      let counsellingTypeOption: IOption | undefined
      if (stateCode && stateCode !== "all") {
        counsellingTypeOption = counsellingTypeDataList.find(
          (ct) => ct.text === "State Counselling",
        )
      } else {
        counsellingTypeOption = counsellingTypeDataList.find(
          (ct) => ct.text === "All India Counselling",
        )
      }

      if (counsellingTypeOption) {
        formatData.counsellingType = counsellingTypeOption
        setValue("counsellingType", counsellingTypeOption)
      }

      // 3. State (only for state counselling)
      if (counsellingTypeOption?.text === "State Counselling" && stateCode) {
        const stateOption = stateList.find((s) => s.code === stateCode)
        if (stateOption) {
          formatData.state = stateOption
          setValue("state", stateOption)
        }
      }

      // 4. Institute Type
      if (data?.instituteType) {
        const instituteTypeOption = instituteTypes.find(
          (it) => it.text === data.instituteType,
        )
        if (instituteTypeOption) {
          formatData.instituteType = instituteTypeOption
          setValue("instituteType", instituteTypeOption)
        }
      }
      // console.log("Data; ",data)
      if (data?.state) {
        const state = states.find((it) => it.text === data.state)
        if (state) {
          formatData.stateOption = state
          setValue("stateOption", { id: 1, text: state })
        }
      }
      // console.log("counselingTYpe Id: ",counsellingTypeOption)
      // 5. Load quotas
      if (counsellingTypeOption?.id) {
        const quotas = await fetchQuotas(
          counsellingTypeOption.id,
          stateCode,
          data?.courseType,
        )

        // console.log(quotas,stateCode,data?.courseType)
        setQuotasList(quotas)

        // Set quota
        if (data?.quota) {
          const quotaOption = quotas.find(
            (q: IOptionProps) => q.text === data.quota,
          )
          if (quotaOption) {
            formatData.quotas = quotaOption
            setValue("quotas", quotaOption)

            // Handle sub-quotas
            if (quotaOption.sub_quotas) {
              setSubQuotasList(quotaOption.sub_quotas)
              if (data?.subQuota) {
                const subQuotaOption = quotaOption.sub_quotas.find(
                  (sq: IOptionProps) => sq.text === data.subQuota,
                )
                if (subQuotaOption) {
                  formatData.subQuota = subQuotaOption
                  setValue("subQuota", subQuotaOption)
                }
              }
            }
          }
        }
      }

      // 6. Load categories
      if (formatData.quotas?.id) {
        const categories = await fetchCategoryTypes(formatData.quotas.id)
        const formattedCategories = categories.map((cat: IOptionProps) => ({
          id: cat.id,
          text: cat.text,
          otherValues: {
            sub_categories: cat.sub_categories || [],
          },
        }))
        setCategoriesList(formattedCategories)

        // Set category
        if (data?.category) {
          const categoryOption = formattedCategories.find(
            (c: IOptionProps) => c.text === data.category,
          )
          if (categoryOption) {
            formatData.categories = categoryOption
            setValue("categories", categoryOption)

            // Handle sub-categories
            if (categoryOption.otherValues?.sub_categories) {
              setSubCategoriesList(categoryOption.otherValues.sub_categories)
              if (data?.subCategory) {
                const subCategoryOption =
                  categoryOption.otherValues.sub_categories.find(
                    (sc: IOptionProps) => sc.text === data.subCategory,
                  )
                if (subCategoryOption) {
                  formatData.subCategory = subCategoryOption
                  setValue("subCategory", subCategoryOption)
                }
              }
            }
          }
        }
      }

      // Update state
      setFormData(formatData)
      setDefaultValues(formatData)
    } catch (error) {
      console.error("Error loading data:", error)
      showToast("error", "Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  async function getCoursesBasedOnCourseType(type: string) {
    try {
      const res = await fetch(
        `/api/get-courses?type=${encodeURIComponent(type)}`,
      )
      const { data } = await res.json()

      const mapped = Array.isArray(data)
        ? data.map((item: any) => ({ id: item.id, text: item.text }))
        : []

      setCoursesList(mapped)
      return mapped
    } catch (error) {
      console.error("Error in course list fetch", error)
      setCoursesList([])
      return []
    }
  }

  async function fetchCounsellingTypes() {
    try {
      const res = await fetch("/api/counselling-types")
      const json = await res.json()
      return json.data || []
    } catch (error) {
      console.error("Error fetching counselling types:", error)
      return []
    }
  }

  const fetchStates = async () => {
    try {
      const res = await fetch("/api/states")
      const json = await res.json()
      return json.data || []
    } catch (error) {
      console.error("Error fetching states:", error)
      return []
    }
  }

  async function fetchQuotas(
    counsellingTypeId: string,
    stateCode?: string,
    courseType?: string,
  ) {
    try {
      const url = new URL("/api/quota-types", window.location.origin)
      url.searchParams.set("counselling_type_id", counsellingTypeId)
      if (stateCode) url.searchParams.set("state_code", stateCode)
      if (courseType) url.searchParams.set("course_type", courseType)

      const res = await fetch(url.toString())
      const json = await res.json()

      return (
        json.data?.map((q: IOptionProps) => ({
          ...q,
          id: q.id,
          text: q.text,
        })) || []
      )
    } catch (error) {
      console.error("Error fetching quotas:", error)
      return []
    }
  }

  async function fetchCategoryTypes(quotaId: string) {
    try {
      const url = new URL("/api/category-types", window.location.origin)
      url.searchParams.set("quota_type_id", quotaId)
      const res = await fetch(url.toString())
      const json = await res.json()
      return json.data || []
    } catch (error) {
      console.error("Error fetching categories:", error)
      return []
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

    if (formData?.counsellingType?.id) {
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
        if (data && Array.isArray(data)) {
          setCategoriesList(
            data.map((cat: IOptionProps) => ({
              id: cat?.id,
              text: cat?.text,
              otherValues: {
                sub_categories: cat?.sub_categories || [],
              },
            })),
          )
        }
      }
    }

    loadCategories()
  }, [formData?.quotas?.id])

  async function onSubmit() {
    const payload = createPayload({
      instituteName: formData?.instituteName,
      instituteType: formData?.instituteType?.text,
      course: formData?.courses?.text,
      courseType: formData?.courseType?.text,
      quota: formData?.quotas?.text,
      subQuota: formData?.subQuota?.text,
      category: formData?.categories?.text,
      subCategory: formData?.subCategory?.text,
      //  ( state:)
      fees: formData?.fees,
      closingRankR1: formData?.closingRankR1?.split("/")?.[0],
      closingRankR2: formData?.closingRankR2?.split("/")?.[0],
      closingRankR3: formData?.closingRankR3?.split("/")?.[0],
      strayRound: formData?.strayRound?.split("/")?.[0],
      lastStrayRound: formData?.lastStrayRound?.split("/")?.[0],
      cRR1: formData?.closingRankR1?.split("/")?.[1]?.trim() ?? null,
      cRR2: formData?.closingRankR2?.split("/")?.[1]?.trim(),
      cRR3: formData?.closingRankR3?.split("/")?.[1]?.trim(),
      sRR: formData?.strayRound?.split("/")?.[1]?.trim(),
      lSRR: formData?.lastStrayRound?.split("/")?.[1]?.trim(),

      prevClosingRankR1: formData?.prevClosingRankR1?.split("/")?.[0],
      prevClosingRankR2: formData?.prevClosingRankR2?.split("/")?.[0],
      prevClosingRankR3: formData?.prevClosingRankR3?.split("/")?.[0],
      prevStrayRound: formData?.prevStrayRound?.split("/")?.[0],
      prevLastStrayRound: formData?.prevLastStrayRound?.split("/")?.[0],
      prevCRR1: formData?.prevClosingRankR1?.split("/")?.[1]?.trim() ?? null,
      prevCRR2: formData?.prevClosingRankR2?.split("/")?.[1]?.trim(),
      prevCRR3: formData?.prevClosingRankR3?.split("/")?.[1]?.trim(),
      prevSRR: formData?.prevStrayRound?.split("/")?.[1]?.trim(),
      prevlSRR: formData?.prevLastStrayRound?.split("/")?.[1]?.trim(),

      stateCode: formData?.state?.code || stateCode,
       state: formData?.stateOption?.text || null,

    })
    // console.log("Payload: ",payload,stateCode,formData?.state?.code)

    if (editMode) {
      // console.log("Payload: ",payload)
      // console.log("FormData: : ",formData)
      const res = await fetchData({
        url: `/api/admin/update_data/${params?.id}?stateCode=${formData?.state?.code || stateCode}`,
        method: "PUT",
        data: payload,
      })

      if (res?.success) {
        showToast("success", res?.payload?.msg)
      } else {
        showToast("error", res?.payload?.msg || "Failed to update data")
      }
    } else {
      const res = await fetchData({
        url: "/api/admin/add_data",
        method: "POST",
        data: payload,
      })

      if (res?.success) {
        showToast("success", res?.payload?.msg)
        clearAll()
      } else {
        showToast("error", res?.payload?.msg || "Failed to add data")
      }
    }
  }

  function naCheck(text: string) {
    return text === "N/A"
  }

  function clearAll() {
    clearReactHookFormValueAndStates(
      [
        "instituteName",
        "instituteType",
        "state",
        "courses",
        "courseType",
        "quotas",
        "categories",
        "fees",
        "closingRankR1",
        "closingRankR2",
        "closingRankR3",
        "strayRound",
        "year",
        "counsellingType",
        "subQuota",
        "subCategory",
      ],
      setValue,
      setFormData,
    )
    setQuotasList([])
    setCategoriesList([])
    setSubQuotasList([])
    setSubCategoriesList([])
    setCoursesList([])
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading data...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center flex-wrap gap-8 w-full mb-4">
        <SearchAndSelect
          name="courseType"
          label="Course Type"
          placeholder="Select Course Type"
          value={formData?.courseType}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
            getCoursesBasedOnCourseType(selectedValue?.text)
            setFormData((prev) => ({
              ...prev,
              courseType: selectedValue,
              counsellingType: undefined,
              quotas: undefined,
              categories: undefined,
            }))
            setQuotasList([])
            setCategoriesList([])
          }}
          control={control}
          setValue={setValue}
          required
          options={courseTypeList}
          debounceDelay={0}
          defaultOption={defaultValues?.courseType}
          wrapperClass="max-w-[395px]"
          searchAPI={(text, setOptions) =>
            autoComplete(text, courseTypeList, setOptions)
          }
          errors={errors}
        />

        <SearchAndSelect
          name="counsellingType"
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
          debounceDelay={0}
          disabled={!formData?.courseType?.id}
          defaultOption={defaultValues?.counsellingType}
          wrapperClass="max-w-[395px]"
          searchAPI={(text, setOptions) =>
            autoComplete(text, filteredCounsellingTypeDataList, setOptions)
          }
          errors={errors}
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
                subQuota: undefined,
                subCategory: undefined,
              }))
              setQuotasList([])
              setCategoriesList([])
              setSubQuotasList([])
              setSubCategoriesList([])
            }}
            control={control}
            setValue={setValue}
            required
            options={stateList}
            debounceDelay={0}
            defaultOption={defaultValues?.state}
            searchAPI={(text, setOptions) =>
              autoComplete(text, stateList, setOptions)
            }
            errors={errors}
          />
        )}

        <div className="flex items-center flex-wrap gap-2">
          <SearchAndSelect
            name="quotas"
            label="Quota"
            placeholder="Select Quota"
            value={formData?.quotas}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, setFormData)
              setFormData((prev) => ({
                ...prev,
                quotas: selectedValue,
                subQuota: undefined,
                categories: undefined,
                subCategory: undefined,
              }))
              setCategoriesList([])
              setSubCategoriesList([])
              const found = quotasList.find((q) => q.id === selectedValue?.id)
              const subs = found?.sub_quotas || []
              setSubQuotasList(subs)
            }}
            control={control}
            setValue={setValue}
            required
            options={quotasList}
            debounceDelay={0}
            disabled={
              !formData?.courseType?.id ||
              !formData?.counsellingType?.id ||
              (formData?.counsellingType?.id == 2 && !formData?.state?.id)
            }
            defaultOption={defaultValues?.quotas}
            wrapperClass="max-w-[395px]"
            searchAPI={(text, setOptions) =>
              autoComplete(text, quotasList, setOptions)
            }
            errors={errors}
          />
          {subQuotasList.length > 0 && (
            <SearchAndSelect
              name="subQuota"
              label="Sub Quota"
              placeholder="Select Sub Quota"
              value={formData?.subQuota}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
              }}
              control={control}
              setValue={setValue}
              required
              options={subQuotasList}
              debounceDelay={0}
              defaultOption={defaultValues?.subQuota}
              wrapperClass="max-w-[395px]"
              searchAPI={(text, setOptions) =>
                autoComplete(text, subQuotasList, setOptions)
              }
              errors={errors}
            />
          )}
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <SearchAndSelect
            name="categories"
            label="Category"
            placeholder="Select Category"
            value={formData?.categories}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, setFormData)
              setFormData((prev) => ({
                ...prev,
                categories: selectedValue,
                subCategory: undefined,
              }))
              const found = categoriesList.find(
                (cat) => cat.id === selectedValue?.id,
              )
              const subs = found?.otherValues?.sub_categories || []
              setSubCategoriesList(subs)
            }}
            control={control}
            setValue={setValue}
            required
            options={categoriesList}
            debounceDelay={0}
            defaultOption={defaultValues?.categories}
            disabled={!formData?.quotas?.id || categoriesList.length === 0}
            wrapperClass="max-w-[395px]"
            searchAPI={(text, setOptions) =>
              autoComplete(text, categoriesList, setOptions)
            }
            errors={errors}
          />
          {subCategoriesList.length > 0 && (
            <SearchAndSelect
              name="subCategory"
              label="Sub Category"
              placeholder="Select Sub Category"
              value={formData?.subCategory}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
              }}
              control={control}
              setValue={setValue}
              required
              options={subCategoriesList}
              debounceDelay={0}
              defaultOption={defaultValues?.subCategory}
              wrapperClass="max-w-[395px]"
              searchAPI={(text, setOptions) =>
                autoComplete(text, subCategoriesList, setOptions)
              }
              errors={errors}
            />
          )}
        </div>
      </div>

      <SearchAndSelect
        name="courses"
        label="Course"
        placeholder="Search and Select"
        value={formData?.courses}
        onChange={({ name, selectedValue }) => {
          onOptionSelected(name, selectedValue, setFormData)
        }}
        control={control}
        required
        setValue={setValue}
        options={coursesList}
        debounceDelay={0}
        defaultOption={defaultValues?.courses}
        searchAPI={(text, setOptions) =>
          autoComplete(text, coursesList, setOptions)
        }
        disabled={isEmpty(coursesList)}
        errors={errors}
      />
      {(stateCode === "all" || formData?.counsellingType?.id == 1) && (
        <SearchAndSelect
          name="stateOption"
          label="Select State"
          placeholder="Search and Select"
          value={formData?.stateOption}
          onChange={({ name, selectedValue }) => {
            onOptionSelected(name, selectedValue, setFormData)
          }}
          control={control}
          required
          setValue={setValue}
          options={states}
          debounceDelay={0}
          defaultOption={defaultValues?.stateOption}
          searchAPI={(text, setOptions) =>
            autoComplete(text, states, setOptions)
          }
          disabled={isEmpty(states)}
          errors={errors}
        />
      )}

      <Card className="mt-4 p-6">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <ResponsiveGrid className="py-3">
            <Input
              name="instituteName"
              label="Institute Name"
              type="text"
              placeholder="Enter here"
              value={formData?.instituteName}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              setValue={setValue}
              rules={{
                required: true,
              }}
              errors={errors}
            />

            <SearchAndSelect
              name="instituteType"
              label="Institute Type"
              placeholder="Search and Select"
              value={formData?.instituteType}
              onChange={({ name, selectedValue }) => {
                onOptionSelected(name, selectedValue, setFormData)
              }}
              control={control}
              setValue={setValue}
              required
              options={instituteTypes}
              debounceDelay={0}
              defaultOption={defaultValues?.instituteType}
              searchAPI={(text, setOptions) =>
                autoComplete(text, instituteTypes, setOptions)
              }
              errors={errors}
            />

            <Input
              name="fees"
              label="Fees"
              type="text"
              setValue={setValue}
              placeholder="Enter here"
              value={formData?.fees}
              onChange={(e) => onTextFieldChange(e, setFormData)}
              control={control}
              errors={errors}
            />
          </ResponsiveGrid>

          <div className="">
            <div className="mb-2 text-bold text-xl">Current Year:-</div>
            <div className="flex flex-wrap gap-10">
              <Input
                name="closingRankR1"
                label="Closing Rank (R1)"
                type="text"
                setValue={setValue}
                placeholder="Enter here"
                value={formData?.closingRankR1 ?? ""}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                errors={errors}
              />
              <Input
                name="closingRankR2"
                label="Closing Rank (R2)"
                type="text"
                setValue={setValue}
                placeholder="Enter here"
                value={formData?.closingRankR2}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                errors={errors}
              />
              <Input
                name="closingRankR3"
                label="Closing Rank (R3)"
                type="text"
                placeholder="Enter here"
                value={formData?.closingRankR3}
                setValue={setValue}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                errors={errors}
              />
              <Input
                name="strayRound"
                label="Stray Round"
                type="text"
                placeholder="Enter here"
                value={formData?.strayRound}
                setValue={setValue}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                errors={errors}
              />
              <Input
                name="lastStrayRound"
                label="Last Stray Round"
                type="text"
                placeholder="Enter here"
                value={formData?.lastStrayRound}
                setValue={setValue}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                errors={errors}
              />
            </div>
          </div>

          <div className="">
            <div className="mb-2 text-bold text-xl">Previous Year:-</div>
            <div className="flex flex-row flex-wrap gap-10">
              <Input
                name="prevClosingRankR1"
                label="Prev Closing Rank (R1)"
                type="text"
                setValue={setValue}
                placeholder="Enter here"
                value={formData?.prevClosingRankR1 ?? ""}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                errors={errors}
              />
              <Input
                name="prevClosingRankR2"
                label="PrevClosing Rank (R2)"
                type="text"
                setValue={setValue}
                placeholder="Enter here"
                value={formData?.prevClosingRankR2}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                errors={errors}
              />
              <Input
                name="prevClosingRankR3"
                label="Prev Closing Rank (R3)"
                type="text"
                placeholder="Enter here"
                value={formData?.prevClosingRankR3}
                setValue={setValue}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                errors={errors}
              />
              <Input
                name="prevStrayRound"
                label="Prev Stray Round"
                type="text"
                placeholder="Enter here"
                value={formData?.prevStrayRound}
                setValue={setValue}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                errors={errors}
              />
              <Input
                name="prevLastStrayRound"
                label="Prev Last Stray Round"
                type="text"
                placeholder="Enter here"
                value={formData?.prevLastStrayRound}
                setValue={setValue}
                onChange={(e) => onTextFieldChange(e, setFormData)}
                control={control}
                errors={errors}
              />
            </div>
          </div>

          <div className="mt-6 ml-auto flex items-center gap-6">
            <Button
              className="px-4 bg-transparent border bg-red-500 flex items-center gap-2 hover:bg-red-600"
              type="button"
              onClick={clearAll}
            >
              <Delete size={22} />
              Clear Form
            </Button>

            <Button
              className="flex items-center gap-2 px-6 bg-green-500 hover:bg-green-600"
              type="submit"
            >
              {editMode ? "Update Data" : "Save Data"}
              <Save size={22} />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
