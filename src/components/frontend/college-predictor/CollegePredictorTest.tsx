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

// const domicileStates: IOption[] = states.slice(1)

// interface IFormData {
//   rank?: number | string
//   domicileState?: IOption
//   courses?: IOption
//   courseType?: IOption
//   predictoryType?: IOption
// }

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

// DNB, AIAPGET (Ayurveda),NEET SS, INICET

  const { setAppState } = useAppState()

  const router = useRouter()

  async function fetchQuotas(
    counsellingTypeId: string,
    stateCode?: string,
    courseType?: string,
  ) {
    setIsQuotaLoading(true)
    try {
      

    const url = new URL("/api/quota-types", window.location.origin)
    url.searchParams.set("counselling_type_id", counsellingTypeId)
    if (stateCode) url.searchParams.set("state_code", stateCode)
    if (courseType) url.searchParams.set("course_type", courseType)

    const res = await fetch(url.toString())
    const json = await res.json()

    const quotas = json.data.map((q: IOption) => ({
      ...q, // Spread all fields including sub_quotas
      id: q.id,
      text: q.text,
    }))

    return quotas
        } catch (error) {
          console.log(error)
      return []
    }
    finally{
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
      ...q, // Spread all fields including sub_quotas
      id: q.id,
      text: q.text,
    }))
    return category
     } catch (error) {
      console.log("error",error)
    }
    finally{
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
        // console.log("Received quota data:", data)
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

        // setCategoriesList(
        //   data.map((cat:IOption) => ({
        //     id: cat.id,
        //     text: cat.text,
        //     otherValues: {
        //       sub_categories: cat.sub_categories || [],
        //     },
        //   })),
        // )

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
        console.error(
          "Invalid data structure from /api/get-courses-types",
          json,
        )
        return []
      }

      const data = json.data.map((q: IOption) => ({
        id: q.id,
        text: q.type,
      }))

      return data
    } catch (error) {
      console.error("getCourses error:", error)
      return [] // Always return fallback
    }
    finally{
    setIsCourseTypeLoading(false)

    }
  }

  async function getCoursesBasedOncourseType(type: string) {
    setIsCourseLoading(true)
    try {
      const res = await fetch(
        `/api/get-courses?type=${encodeURIComponent(type)}`,
      )
      const { data } = await res.json()

      if (Array.isArray(data)) {
        const mapped = data.map((item) => ({
          id: item.id,
          text: item.text,
        }))

        // Apply custom sorting only for NEET PG
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

            const aPriority = Object.keys(priority).find((k) =>
              aKey.includes(k),
            )
              ? priority[
                  Object.keys(priority).find((k) => aKey.includes(k)) as string
                ]
              : 99

            const bPriority = Object.keys(priority).find((k) =>
              bKey.includes(k),
            )
              ? priority[
                  Object.keys(priority).find((k) => bKey.includes(k)) as string
                ]
              : 99

            return aPriority - bPriority
          })
        }
        // console.log(formData)
        if (type.includes("PG")) {
          setCoursesList([{ id: "all", text: "All Course" }, ...sorted])
        }else if(type?.toUpperCase().includes("DNB")) {

               setCoursesList([{ id: "all", text: "All Course" }, ...sorted])
        }
        
        else {
          setCoursesList(sorted)
        }
        // console.log("Mapped & Sorted Course List: ", sorted, type)
      } else {
        setCoursesList([])
      }

      // console.log("Mapped Course List data: ", data, type)
    } catch (error) {
      console.log("Error in course list fetch", error)
    }
    finally{
       setIsCourseLoading(false)
    }
  }

  useEffect(() => {
    const courseType = async () => {
      try {
        const data = await getCourses()

        setcourseTypeList(data)
        // console.log("Course Data: ", data)
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
    // console.log("State: ", json)
    return json.data
      } catch (error) {
      console.log("error",error)
    }
    finally{
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
      // isEmpty(formData?.domicileState?.text) ||
      isEmpty(formData?.courses?.text)
    )
  }

  const isNeetUG = formData?.courseType?.text === "NEET UG"

//   return (
//     <Card className="mt-2 tab:mx-16 p-7 tab:p-10">
//       <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
//         <div className="space-y-2">
//           <h3 className="text-[25px] pc:text-4xl font-bold text-center">
//             Predict Your College
//           </h3>
//           <p className="text-base text-gray-500 text-center poppinsFont">
//             Enter your details to find the best college matches
//           </p>
//         </div>

//         <SearchAndSelect
//           name="predictor Type"
//           label="Pedictor Type"
//           placeholder="Select Predictor Type"
//           value={formData?.courseType}
//           // isSearchable={false} 
//           onChange={({ name, selectedValue }) => {
//             onOptionSelected(name, selectedValue, setFormData)
//             // console.log(selectedValue)
//             if (selectedValue?.text)
//               getCoursesBasedOncourseType(selectedValue?.text)
//             setFormData((prev) => ({
//               ...prev,
//               courseType: selectedValue,
//               courses:undefined,
//               counsellingType: undefined,
              
//             }))


//             const neetBasedExams = [
//               "NEET UG",
//               "NEET MDS",
//               "NEET SS",
//               "AIAPGET (Ayurveda)",
//             ]

//             if (
//               selectedValue?.text &&
//               neetBasedExams.includes(selectedValue.text)
//             ) {
//               setRadioOption(["Rank", "Marks"])
//             } else {
//               setRadioOption(["Rank", "Percentile"])
//             }
//           }}
//           loading = {isCourseTypeLoading}
//           control={control}
//           setValue={setValue}
//           required
//           options={courseTypeList}
//           debounceDelay={0}
          
//       wrapperClass="w-full"
//           searchAPI={(text, setOptions) =>
//             autoComplete(text, courseTypeList, setOptions)
//           }
//           errors={errors}
//           disableSearch={true}
//         />
//         {/* <SearchAndSelect
//   name="predictorType"
//   label="Predictor Type"
//   placeholder="Select Predictor Type"
//   value={formData?.courseType}
//   onChange={({ name, selectedValue }) => {
//     onOptionSelected(name, selectedValue, setFormData)

//     if (selectedValue?.text)
//       getCoursesBasedOncourseType(selectedValue?.text)

//     setFormData((prev) => ({
//       ...prev,
//       courseType: selectedValue,
//       courses: undefined,
//       counsellingType: undefined,
//     }))

//     const neetBasedExams = [
//       "NEET UG",
//       "NEET MDS",
//       "NEET SS",
//       "AIAPGET (Ayurveda)",
//     ]

//     if (
//       selectedValue?.text &&
//       neetBasedExams.includes(selectedValue.text)
//     ) {
//       setRadioOption(["Rank", "Marks"])
//     } else {
//       setRadioOption(["Rank", "Percentile"])
//     }
//   }}
//   loading={isCourseTypeLoading}
//   control={control}
//   setValue={setValue}
//   required
//   options={courseTypeList}
//   wrapperClass="w-full"
//   errors={errors}
// /> */}


//         <p>What do you have ?</p>

//         <div className="flex space-x-6 mt-[-20px]">
//           {radioOption.map((option) => (
//             <label
//               key={option}
//               className="relative flex items-center space-x-2 cursor-pointer text-color-text"
//             >
//               <input
//                 type="radio"
//                 name="rankOrMarks"
//                 value={option}
//                 checked={selected === option}
//                 onChange={() => setSelected(option)}
//                 className="peer hidden"
//               />
//               <div className="w-4 h-4 rounded-full border border-gray-300 peer-checked:bg-orange-500 flex items-center justify-center">
//                 <div className="w-2.5 h-2.5 bg-white rounded-full peer-checked:opacity-100 opacity-0 transition-opacity"></div>
//               </div>
//               <span className="peer-checked:text-orange-500 ">{option}</span>
//             </label>
//           ))}
//         </div>

//         <Input
//           name="rank"
//           label={selected || "Rank"}
//           type="number"
//           placeholder={`Enter your ${selected || "Rank"}`}
//           setValue={setValue}
//           value={formData?.rank}
//           onChange={(e) => {
//             onTextFieldChange(e, setFormData)
//             clearErrors("rank")
//           }}
//           control={control}
//           rules={{
//             required: false,
//           }}
//           errors={errors}
//         />
//         <SearchAndSelect
//           name="courses"
//           label="Course"
//           placeholder="Select your Course"
//           value={formData?.courses}
//           onChange={({ name, selectedValue }) => {
//             onOptionSelected(name, selectedValue, setFormData)
//           }}
//           control={control}
//           setValue={setValue}
//           options={coursesList}
//           debounceDelay={0}
//           searchAPI={(text, setOptions) =>
//             autoComplete(text, coursesList, setOptions)
//           }
//           loading={isCourseLoading}
//           errors={errors}
//              wrapperClass="w-full"
//           disabled={isEmpty(formData?.courseType?.text)}
//           disableSearch={true}
          
//         />


//         <SearchAndSelect
//           name="counselling Type"
//           label="Counselling Type"
//           placeholder="Select Counselling Type"
//           value={formData?.counsellingType}
//           onChange={({ name, selectedValue }) => {
//             onOptionSelected(name, selectedValue, setFormData)
      
//             setFormData((prev) => ({
//               ...prev,
//               counsellingType: selectedValue,
//               state: undefined,
//               quotas: undefined,
//               categories: undefined,
//             }))

//             setQuotasList([])
//             setCategoriesList([])
//           }}
//           control={control}
//           setValue={setValue}
//           required
//           options={filteredCounsellingTypeDataList}
//           debounceDelay={0}
//           disabled={!formData?.courseType?.id}
//           defaultOption={defaultValues?.filteredCounsellingTypeDataList}
//           wrapperClass="w-full"
//           searchAPI={(text, setOptions) =>
//             autoComplete(text, filteredCounsellingTypeDataList, setOptions)
//           }
//           errors={errors}
//           disableSearch={true}
          
          
//         />
//         {formData?.counsellingType?.id == 2 && (
//           <SearchAndSelect
//             name="state"
//             label="State"
//             placeholder="Search and Select"
//             value={formData?.state}
           
//             onChange={({ name, selectedValue }) => {
//               onOptionSelected(name, selectedValue, setFormData)

//               setFormData((prev) => ({
//                 ...prev,
//                 state: selectedValue,
//                 quotas: undefined,
//                 categories: undefined,
//                 subQuota: undefined, // <-- Add this
//                 subCategory: undefined, // <-- Add this
//               }))

//               setQuotasList([])
//               setCategoriesList([])
//               setSubQuotasList([]) // <-- Add this
//               setSubCategoriesList([]) // <-- Add this
//             }}
//             loading = {isStateLoading}
//             control={control}
//             setValue={setValue}
//             required
//              disabled={
//                 isStateLoading
//               }
//             options={stateList}
//             debounceDelay={0}
//             defaultOption={defaultValues?.state}
//                wrapperClass="w-full"
//             searchAPI={(text, setOptions) =>
//               autoComplete(text, stateList, setOptions)
//             }
//             errors={errors}
//             disableSearch={true}
//           />
//         )}

//         {isNeetUG && (
//           <div className="flex items-center flex-wrap gap-2">
//             <SearchAndSelect
//               name="quotas"
//               label="Quota"
//               placeholder="Select Quota"
//               value={formData?.quotas}
//               onChange={({ name, selectedValue }) => {
//                 onOptionSelected(name, selectedValue, setFormData)
//                 setFormData((prev) => ({
//                   ...prev,
//                   quotas: selectedValue,
//                   subQuota: undefined,
//                   categories: undefined,
//                   subCategory: undefined,
//                 }))
//                 setCategoriesList([])
//                 setSubCategoriesList([])
//                 const found = quotasList.find((q) => q.id === selectedValue?.id)
//                 const subs = found?.sub_quotas || []
//                 setSubQuotasList(subs)
//               }}
//               control={control}
//               setValue={setValue}
//               required
//               options={quotasList}
//               debounceDelay={0}
//               loading={isQuotaLoading}
//               disabled={
//                 !formData?.courseType?.id ||
//                 !formData?.counsellingType?.id ||
//                 (formData?.counsellingType?.id == 2 && !formData?.state?.id)
//               }
//               defaultOption={defaultValues?.quotas}
//        wrapperClass="w-full"
//               searchAPI={(text, setOptions) =>
//                 autoComplete(text, quotasList, setOptions)
//               }
//               errors={errors}
//               disableSearch={true}
//             />

//           </div>
//         )}

//         {isNeetUG && (
//           <div className="flex items-center flex-wrap gap-2">
//             <SearchAndSelect
//               name="categories"
//               label="Category"
//               placeholder="Select Category"
//               value={formData?.categories}
//               onChange={({ name, selectedValue }) => {
//                 onOptionSelected(name, selectedValue, setFormData)
//                 setFormData((prev) => ({
//                   ...prev,
//                   categories: selectedValue,
//                   subCategory: undefined,
//                 }))
//                 const found = categoriesList.find(
//                   (cat) => cat.id === selectedValue?.id,
//                 )
//                 const subs = found?.otherValues?.sub_categories || []
//                 setSubCategoriesList(subs)
//               }}
//               control={control}
//               setValue={setValue}
//               required
//               options={categoriesList}
//               debounceDelay={0}
//               defaultOption={defaultValues?.categories}
//               loading = {isCategoryLaoding}
//               disabled={!formData?.quotas?.id}
//    wrapperClass="w-full"
//               searchAPI={(text, setOptions) =>
//                 autoComplete(text, categoriesList, setOptions)
//               }
//               errors={errors}
//               disableSearch={true}
//             />
            
//           </div>
//         )}

//         <Button
//           className="mt-6"
//           onClick={onSubmit}
//           // data-tooltip-id={"tooltip"}
//           // data-tooltip-content="Coming Soon"
//           disabled={disableCheck()}
//           // disabled
//         >
//           Predict My College
//         </Button>
//       </form>
//     </Card>
//   )



const [step, setStep] = React.useState(1)

const nextStep = () => setStep((prev) => prev + 1)
const prevStep = () => setStep((prev) => prev - 1)

return (
<Card className="mt-2 tab:mx-16 p-6 tab:p-8 rounded-xl shadow-lg transition-all duration-300">

<form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>

{/* Title */}
<div className="space-y-1">
<h3 className="text-[24px] pc:text-[32px] font-bold text-center">
Predict Your College
</h3>
<p className="text-[15px] text-gray-500 text-center">
Enter your details to find the best college matches
</p>
</div>


{/* STEP HEADER */}
<div className="space-y-3">

<div className="flex items-center justify-between">

<p className="text-[15px] font-semibold text-gray-700">

Step {step}/3:{" "}

{step === 1 && "Your Exam Details"}
{step === 2 && "Course & Counselling"}
{step === 3 && "Quota & Category"}

</p>

{/* dots */}
<div className="flex gap-2">
{[1,2,3].map((s)=>(
<span
key={s}
className={`w-2 h-2 rounded-full ${
step === s ? "bg-gray-600" : "bg-gray-300"
}`}
/>
))}
</div>

</div>

{/* progress bar */}
<div className="w-full h-[3px] bg-gray-200 rounded-full overflow-hidden">
<div
className="h-full bg-orange-500 transition-all duration-300"
style={{ width: `${(step/3)*100}%` }}
/>
</div>

</div>



{/* STEP CONTENT */}
<div className="transition-all duration-300 ease-in-out flex flex-col gap-6">


{/* ---------------- STEP 1 ---------------- */}

{step === 1 && (
<>

<SearchAndSelect
name="predictor Type"
label="Predictor Type"
placeholder="Select Predictor Type"
value={formData?.courseType}
onChange={({ name, selectedValue }) => {

onOptionSelected(name, selectedValue, setFormData)

if (selectedValue?.text)
getCoursesBasedOncourseType(selectedValue?.text)

setFormData((prev) => ({
...prev,
courseType: selectedValue,
courses:undefined,
counsellingType: undefined,
}))

const neetBasedExams = [
"NEET UG",
"NEET MDS",
"NEET SS",
"AIAPGET (Ayurveda)",
]

if (
selectedValue?.text &&
neetBasedExams.includes(selectedValue.text)
) {
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
errors={errors}
disableSearch={true}
/>



<p className="font-medium">What do you have ?</p>

<div className="flex gap-6">

{radioOption.map((option)=>(
<label
key={option}
className="flex items-center gap-2 cursor-pointer"
>

<input
type="radio"
name="rankOrMarks"
value={option}
checked={selected === option}
onChange={()=>setSelected(option)}
className="accent-orange-500"
/>

<span className="text-[15px]">{option}</span>

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
errors={errors}
/>

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

</>
)}



{/* ---------------- STEP 3 ---------------- */}

{step === 3 && (
<>

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

<div className="flex flex-col gap-3 mt-4">

{step < 3 && (

<button
type="button"
onClick={nextStep}
className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold py-3 rounded-md shadow hover:opacity-95"
>
Next Step →
</button>

)}


{step === 3 && (

<button
type="submit"
onClick={onSubmit}
disabled={disableCheck()}
className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold py-3 rounded-md shadow hover:opacity-95"
>
🔍 Show My Eligible Colleges
</button>

)}


{step > 1 && (

<button
type="button"
onClick={prevStep}
className="text-sm text-gray-500 hover:underline"
>
← Go Back
</button>

)}

</div>


</form>

</Card>
)
}

