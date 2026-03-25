
// "use client"

// import SearchAndSelect from "@/components/common/SearchAndSelect"
// import { SignInPopup } from "@/components/common/popups/SignInPopup"
// import { Container } from "@/components/frontend/Container"
// import { FELayout } from "@/components/frontend/FELayout"
// import { useAppState } from "@/hooks/useAppState"
// import useFetch from "@/hooks/useFetch"
// import { IOption } from "@/types/GlobalTypes"
// import { autoComplete, clearReactHookFormValueAndStates, isEmpty } from "@/utils/utils"
// import { ArrowRight, MapPin, Search, Users } from "lucide-react"
// import Link from "next/link"
// import { useRouter, useSearchParams } from "next/navigation"
// import React, { useEffect, useState, useCallback, useMemo } from "react"
// import { useForm } from "react-hook-form"

// // State list
// const STATES: { name: string; slug: string; code: string; popular?: boolean }[] = [
//   { name: "All India", slug: "all-india", code: "all" },
//   { name: "Andaman and Nicobar Islands", slug: "andaman-and-nicobar-islands", code: "AN" },
//   { name: "Andhra Pradesh", slug: "andhra-pradesh", popular: true, code: "AD" },
//   { name: "Arunachal Pradesh", slug: "arunachal-pradesh", code: "AR" },
//   { name: "Assam", slug: "assam", code: "AS" },
//   { name: "Bihar", slug: "bihar", code: "BR" },
//   { name: "Chandigarh", slug: "chandigarh", code: "CH" },
//   { name: "Chhattisgarh", slug: "chhattisgarh", code: "CG" },
//   { name: "Dadra and Nagar Haveli", slug: "dadra-and-nagar-haveli", code: "DN" },
//   { name: "Delhi", slug: "delhi", code: "DL" },
//   { name: "Daman and Diu", slug: "daman-and-diu", code: "DD" },
//   { name: "Goa", slug: "goa", code: "GA" },
//   { name: "Gujarat", slug: "gujarat", popular: true, code: "GJ" },
//   { name: "Haryana", slug: "haryana", code: "HR" },
//   { name: "Himachal Pradesh", slug: "himachal-pradesh", code: "HP" },
//   { name: "Jammu and Kashmir", slug: "jammu-and-kashmir", code: "JK" },
//   { name: "Jharkhand", slug: "jharkhand", code: "JH" },
//   { name: "Karnataka", slug: "karnataka", popular: true, code: "KA" },
//   { name: "Kerala", slug: "kerala", popular: true, code: "KL" },
//   { name: "Ladakh", slug: "ladakh", code: "LA" },
//   { name: "Lakshadweep", slug: "lakshadweep", code: "LD" },
//   { name: "Madhya Pradesh", slug: "madhya-pradesh", code: "MP" },
//   { name: "Maharashtra", slug: "maharashtra", popular: true, code: "MH" },
//   { name: "Manipur", slug: "manipur", code: "MN" },
//   { name: "Meghalaya", slug: "meghalaya", code: "ML" },
//   { name: "Mizoram", slug: "mizoram", code: "MZ" },
//   { name: "Nagaland", slug: "nagaland", code: "NL" },
//   { name: "Odisha", slug: "odisha", code: "OD" },
//   { name: "Pondicherry", slug: "pondicherry", code: "PY" },
//   { name: "Punjab", slug: "punjab", code: "PB" },
//   { name: "Rajasthan", slug: "rajasthan", code: "RJ" },
//   { name: "Sikkim", slug: "sikkim", code: "SK" },
//   { name: "Tamil Nadu", slug: "tamil-nadu", popular: true, code: "TN" },
//   { name: "Telangana", slug: "telangana", popular: true, code: "TS" },
//   { name: "Tripura", slug: "tripura", code: "TR" },
//   { name: "Uttar Pradesh", slug: "uttar-pradesh", popular: true, code: "UP" },
//   { name: "Uttarakhand", slug: "uttarakhand", code: "UK" },
//   { name: "West Bengal", slug: "west-bengal", code: "WB" },
// ]

// const ALLOWED_PREDICTORS = ["NEET UG", "NEET PG", "NEET MDS", "AIAPGET (Ayurveda)",""]

// export default function ClosingRanks() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [activeTab, setActiveTab] = useState<"all" | "popular">("all")
//   const [selectedType, setSelectedType] = useState<IOption>()
//   const [selectedCourse, setSelectedCourse] = useState<IOption>()
//   const [predictorTypeList, setPredictorTypeList] = useState<IOption[]>([])
//   const [coursesList, setCoursesList] = useState<IOption[]>([])
//   const [isCourseLoading, setIsCourseLoading] = useState<boolean>(false)

//   const searchParams = useSearchParams()
//   const courseType = searchParams.get("courseType")
//   const course = searchParams.get("course")
//   const router = useRouter()
//   const { showToast } = useAppState()
//   const { setValue, setError, clearErrors, control, formState: { errors } } = useForm()


// const updateURL = useCallback((params: Record<string, string>, replace = true) => {
//   const query = new URLSearchParams(params).toString();
//   const url = `/closing-ranks?${query}`;
  
//   if (replace) {
//     router.replace(url, { scroll: false });
//   } else {
//     router.push(url);
//   }
// }, [router]);
//   // Fetch predictor types
//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await fetch("/api/get-courses-types")
//         const json = await res.json()
//         if (Array.isArray(json?.data)) {
//           setPredictorTypeList(json.data.map((q: IOption) => ({ id: q.id, text: q.type })))
//         }
//         //  const staticUGOptions = [
//         //   { id: "MBBS", text: "NEET UG-MBBS" },
//         //   { id: "BDS", text: "NEET UG-BDS" },
//         //   { id: "BAMS", text: "NEET UG-BAMS" },
//         //   { id: "BHMS", text: "NEET UG-BHMS" },
//         // ];

//         // const dynamicOptions = json.data.map((q: IOption) => ({
//         //   id: q.id,
//         //   text: q.type,
//         // }));
//         // const filterOp = dynamicOptions?.filter((d:IOption)=>d.type!=="NEET UG")

//         // setPredictorTypeList([...staticUGOptions, ...filterOp]);
//       } catch (err) {
//         console.error("Error fetching course types:", err)
//       }
//     })()
//   }, [])

//   // Fetch courses by type
//   const getCoursesByType = useCallback(async (type: string) => {
//     setIsCourseLoading(true)
//     try {
//       const res = await fetch(`/api/get-courses?type=${encodeURIComponent(type)}`)
//       const { data } = await res.json()
//       setCoursesList(Array.isArray(data) ? data.map((c: IOption) => ({ id: c.id, text: c.text })) : [])
//     } catch (err) {
//       console.error("Error fetching courses:", err)
//     }finally{
//         setIsCourseLoading(false)
//     }
//   }, [])

//   // Filtered states (memoized)
//   const filteredStates = useMemo(() => {
//     const base = ALLOWED_PREDICTORS.includes(selectedType?.text || "") ? STATES : [STATES[0]]
//     return base.filter(
//       s =>
//         s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         (activeTab === "all" || s.popular)
//     )
//   }, [selectedType, searchQuery, activeTab])

//   // Helpers
//   const buildRedirectURL = (state: { name: string; code: string }) => {
//     if (!selectedType?.text) return ""
//     const courseParam = selectedType.text === "NEET UG" ? selectedCourse?.text || "" : ""
//     const stateParam = state.code === "all" ? "All India" : state.name
//     return `/closing-ranks/${state.code}?state=${encodeURIComponent(stateParam)}&courseType=${encodeURIComponent(selectedType.text)}&course=${encodeURIComponent(courseParam)}`
//   }

//   const validateSelection = () => {
//     if (!selectedType?.text) {
//       setError("courseType", { type: "manual", message: "Please select a Course Type" })
//       showToast("error", "Please select a Course Type")
//       updateURL({ courseType: "", course: "" })
//       return false
//     }
//     if (selectedType.text === "NEET UG" && !selectedCourse?.text) {
//       setError("course", { type: "manual", message: "Please select a Course" })
//       showToast("error", "Please select a Course")
//       updateURL({ courseType: selectedType.text, course: "" })
//       return false
//     }
//     return true
//   }

//   return (
//     <FELayout>
//       <section className="w-full px-2 py-10 bg-gradient-to-r from-yellow-50 to-emerald-50">
//         {/* <Container className="pb-10 pt-1 pc:mt-10 px-3 text-center max-w-3xl mx-auto">
//           {selectedType?.text && (
//             <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 border border-yellow-200 mb-4">
//               {selectedType.text}
//             </div>
//           )}
//           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-color-table-header">
//             Medical College Closing Ranks
//           </h1>
//           <p className="text-gray-600 md:text-lg mb-8">
//             Explore NEET closing ranks for medical colleges across India.
//           </p>
//         </Container> */}
// <Container className="pt-6 md:pt-0 px-2 text-center mx-auto">
//   {selectedType?.text && (
//     <div className="inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-medium text-yellow-800 border border-yellow-200 mb-5">
//       {selectedType.text}
//     </div>
//   )}
// {/* 
//   <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#165dc4] leading-tight">
//     Closing Ranks for Medical, <br className="hidden md:block" />
//     Dental & Ayurveda
//   </h1> */}

// <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#165dc4]">
//   <span className="md:block inline mb-2 ">Closing Ranks for Medical,</span>
//   <span className="md:block inline">Dental & Ayurveda Courses</span>
// </h1>

// {/* <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#165dc4] leading-tight">
//   <span className="block mb-1">Closing Ranks for Medical,</span>
//   <span className="block">Dental & Ayurveda</span>
// </h1> */}

//   <p className="text-gray-600 md:text-lg max-w-5xl mx-auto leading-relaxed">
//     Explore college-wise cut-offs and closing ranks from All India and State
//     counselling for all rounds across UG, PG & Super-Specialization.
//   </p>
// </Container>


//       </section>

//       <section className="w-full px-2 pt-4 pb-10">
//         <Container>
//           {/* Tabs */}
//           <div className="flex justify-between items-center mb-4">
//             <div>
//               <h2 className="text-2xl font-bold">States & Union Territories</h2>
//               <p className="text-gray-500">Select a region to view detailed closing ranks</p>
//             </div>
//             {/* <div className="flex gap-3">
//               {["all", "popular"].map(tab => (
//                 <button
//                   key={tab}
//                   onClick={() => setActiveTab(tab as "all" | "popular")}
//                   className={`px-4 py-2 rounded-full text-sm font-medium ${
//                     activeTab === tab ? "bg-yellow-500 text-white" : "bg-gray-100 hover:bg-gray-200"
//                   }`}
//                 >
//                   {tab === "all" ? "All States" : "Popular States"}
//                 </button>
//               ))}
//             </div> */}
//           </div>

//           {/* Filters */}
//           <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
//             <div className="flex flex-col md:flex-row gap-4">
//               <SearchAndSelect
//                 name="courseType"
//                   setValue={setValue}
//                   placeholder="Select Course Type"
//                 label="Course Type"
//                 value={selectedType}
//                 onChange={({ selectedValue }) => {
//                   setSelectedType(selectedValue)
//                   setSelectedCourse(undefined)
//                   clearErrors("courseType")
//                   if (selectedValue.text === "NEET UG") getCoursesByType(selectedValue.text)
//                   updateURL({ courseType: selectedValue.text })
//                 }}
//                 control={control}
//                 defaultOption={{ id: courseType || "", text: courseType || "" }}
//                 options={predictorTypeList}
//                 searchAPI={(txt, set) => autoComplete(txt, predictorTypeList, set)}
//                 wrapperClass="md:max-w-[200px] w-full"
//                 errors={errors}
//               />
//               {selectedType?.text === "NEET UG" && (
//                 <SearchAndSelect
//                   setValue={setValue}
//                   name="course"
//                   label="Select Course"
//                    placeholder="Select Course"
//                   value={selectedCourse}
//                   onChange={({ selectedValue }) => {
//                     setSelectedCourse(selectedValue)
//                     clearErrors("course")
//                     updateURL({ courseType: selectedType?.text || "", course: selectedValue.text })
//                   }}
//                   control={control}
//                   defaultOption={{ id: course || "", text: course || "" }}
//                   options={coursesList}
//                   loading = {isCourseLoading}
//                   // disabled={isEmpty(coursesList)}
//                   searchAPI={(txt, set) => autoComplete(txt, coursesList, set)}
//                   errors={errors}
//                     wrapperClass="md:max-w-[200px] w-full"
//                 />
//               )}
//             </div>
//             <div className="relative md:max-w-[500px] w-full">
//               <div className="font-medium">Search State</div>
//               <Search className="absolute left-3 top-10 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="States or Union Territories..."
//                 className="pl-10 pr-4 py-3 rounded-lg outline-none border focus:ring-1 focus:ring-yellow-500 w-full"
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* States Grid */}
//           <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {filteredStates.map(state => (
//               <Link
//                 key={state.slug}
//                 href={buildRedirectURL(state)}
//                 onClick={e => !validateSelection() && e.preventDefault()}
//                 className="group bg-white rounded-xl border p-5 hover:shadow-md hover:border-yellow-300 flex flex-col"
//               >
//                 <div className="flex justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <MapPin className="h-4 w-4 text-yellow-500" />
//                     <h3 className="font-medium text-gray-900 group-hover:text-yellow-600">
//                       {state.name}
//                     </h3>
//                   </div>
//                   {state.popular && (
//                     <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">Popular</span>
//                   )}
//                 </div>
//                 <p className="text-sm text-gray-500 mb-3">{state.name} - {selectedType?.text} Colleges List</p>
//                 <div className="mt-auto flex items-center text-sm text-yellow-600 font-medium">
//                   View Closing Ranks <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition" />
//                 </div>
//               </Link>
//             ))}
//           </div>

//           {!filteredStates.length && (
//             <div className="text-center py-12">
//               <p className="text-gray-500 text-lg">No states found matching your search.</p>
//               <button onClick={() => setSearchQuery("")} className="mt-4 text-yellow-600 hover:text-yellow-700">
//                 Clear search
//               </button>
//             </div>
//           )}

//           {/* CTA */}
//           <div className="mt-16 border border-color-accent rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6">
//             <div>
//               <h3 className="text-xl font-bold mb-2">Need personalized guidance?</h3>
//               <p className="text-gray-600">Connect with our counselors for tailored college recommendations.</p>
//             </div>
//             <Link
//               href="https://wa.me/919028009835"
//               className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2"
//             >
//               <Users className="h-5 w-5" /> Book Counselling Session
//             </Link>
//           </div>
//         </Container>
//       </section>
//       <SignInPopup />
//     </FELayout>
//   )
// }


  "use client"

import SearchAndSelect from "@/components/common/SearchAndSelect"
import { SignInPopup } from "@/components/common/popups/SignInPopup"
import { Container } from "@/components/frontend/Container"
import { FELayout } from "@/components/frontend/FELayout"
import { useAppState } from "@/hooks/useAppState"
import { IOption } from "@/types/GlobalTypes"
import { autoComplete } from "@/utils/utils"
import { ArrowRight, MapPin, Search, Users, ChevronRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"

const STATES = [
  { name: "All India", slug: "all-india", code: "all" },
  { name: "Andaman and Nicobar Islands", slug: "andaman-and-nicobar-islands", code: "AN" },
  { name: "Andhra Pradesh", slug: "andhra-pradesh", popular: true, code: "AD" },
  { name: "Arunachal Pradesh", slug: "arunachal-pradesh", code: "AR" },
  { name: "Assam", slug: "assam", code: "AS" },
  { name: "Bihar", slug: "bihar", code: "BR" },
  { name: "Chandigarh", slug: "chandigarh", code: "CH" },
  { name: "Chhattisgarh", slug: "chhattisgarh", code: "CG" },
  { name: "Dadra and Nagar Haveli", slug: "dadra-and-nagar-haveli", code: "DN" },
  { name: "Delhi", slug: "delhi", code: "DL" },
  { name: "Daman and Diu", slug: "daman-and-diu", code: "DD" },
  { name: "Goa", slug: "goa", code: "GA" },
  { name: "Gujarat", slug: "gujarat", popular: true, code: "GJ" },
  { name: "Haryana", slug: "haryana", code: "HR" },
  { name: "Himachal Pradesh", slug: "himachal-pradesh", code: "HP" },
  { name: "Jammu and Kashmir", slug: "jammu-and-kashmir", code: "JK" },
  { name: "Jharkhand", slug: "jharkhand", code: "JH" },
  { name: "Karnataka", slug: "karnataka", popular: true, code: "KA" },
  { name: "Kerala", slug: "kerala", popular: true, code: "KL" },
  { name: "Ladakh", slug: "ladakh", code: "LA" },
  { name: "Lakshadweep", slug: "lakshadweep", code: "LD" },
  { name: "Madhya Pradesh", slug: "madhya-pradesh", code: "MP" },
  { name: "Maharashtra", slug: "maharashtra", popular: true, code: "MH" },
  { name: "Manipur", slug: "manipur", code: "MN" },
  { name: "Meghalaya", slug: "meghalaya", code: "ML" },
  { name: "Mizoram", slug: "mizoram", code: "MZ" },
  { name: "Nagaland", slug: "nagaland", code: "NL" },
  { name: "Odisha", slug: "odisha", code: "OD" },
  { name: "Pondicherry", slug: "pondicherry", code: "PY" },
  { name: "Punjab", slug: "punjab", code: "PB" },
  { name: "Rajasthan", slug: "rajasthan", code: "RJ" },
  { name: "Sikkim", slug: "sikkim", code: "SK" },
  { name: "Tamil Nadu", slug: "tamil-nadu", popular: true, code: "TN" },
  { name: "Telangana", slug: "telangana", popular: true, code: "TS" },
  { name: "Tripura", slug: "tripura", code: "TR" },
  { name: "Uttar Pradesh", slug: "uttar-pradesh", popular: true, code: "UP" },
  { name: "Uttarakhand", slug: "uttarakhand", code: "UK" },
  { name: "West Bengal", slug: "west-bengal", code: "WB" },
]

const ALLOWED_PREDICTORS = ["NEET UG", "NEET PG", "NEET MDS", "AIAPGET (Ayurveda)", ""]

export default function ClosingRanks() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<IOption>()
  const [selectedCourse, setSelectedCourse] = useState<IOption>()
  const [predictorTypeList, setPredictorTypeList] = useState<IOption[]>([])
  const [coursesList, setCoursesList] = useState<IOption[]>([])
  const [isCourseLoading, setIsCourseLoading] = useState<boolean>(false)

  const searchParams = useSearchParams()
  const courseType = searchParams.get("courseType")
  const course = searchParams.get("course")
  const router = useRouter()
  const { showToast } = useAppState()
  const { setValue, setError, clearErrors, control, formState: { errors } } = useForm()

  const updateURL = useCallback((params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    router.replace(`/closing-ranks?${query}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/get-courses-types")
        const json = await res.json()
        if (Array.isArray(json?.data)) {
          setPredictorTypeList(json.data.map((q: IOption) => ({ id: q.id, text: q.type })))
        }
      } catch (err) { console.error(err) }
    })()
  }, [])

  const getCoursesByType = useCallback(async (type: string) => {
    setIsCourseLoading(true)
    try {
      const res = await fetch(`/api/get-courses?type=${encodeURIComponent(type)}`)
      const { data } = await res.json()
      setCoursesList(Array.isArray(data) ? data.map((c: IOption) => ({ id: c.id, text: c.text })) : [])
    } finally { setIsCourseLoading(false) }
  }, [])

  const filteredStates = useMemo(() => {
    const base = ALLOWED_PREDICTORS.includes(selectedType?.text || "") ? STATES : [STATES[0]]
    return base.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [selectedType, searchQuery])

  const buildRedirectURL = (state: { name: string; code: string }) => {
    if (!selectedType?.text) return ""
    const courseParam = selectedType.text === "NEET UG" ? selectedCourse?.text || "" : ""
    const stateParam = state.code === "all" ? "All India" : state.name
    return `/closing-ranks/${state.code}?state=${encodeURIComponent(stateParam)}&courseType=${encodeURIComponent(selectedType.text)}&course=${encodeURIComponent(courseParam)}`
  }

  const validateSelection = () => {
    if (!selectedType?.text) {
      setError("courseType", { type: "manual", message: "Select Course Type" })
      showToast("error", "Select Course Type first")
      return false
    }
    if (selectedType.text === "NEET UG" && !selectedCourse?.text) {
      setError("course", { type: "manual", message: "Select Course" })
      showToast("error", "Select Course first")
      return false
    }
    return true
  }

  return (
    <FELayout>
      {/* --- HERO SECTION --- */}
      <section className="w-full pt-16 pb-12 bg-gradient-to-b from-yellow-50 via-white to-white border-b border-yellow-100">
        <Container className="text-center px-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 border border-yellow-200 text-yellow-800 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} className="animate-pulse" /> 2026 Data Updated
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[#E67817] mb-6 tracking-tight leading-[1.1]">
            Closing Ranks for <span className="text-[#0054A4]">Medical,</span> <br />
            <span className="text-emerald-600 font-medium italic">Dental & Ayurveda</span>
          </h1>
          <p className="text-gray-500 md:text-xl max-w-3xl mx-auto leading-relaxed">
            Instantly explore round-wise cut-offs for UG, PG, and Super-Specialization across all 36 States and Union Territories.
          </p>
        </Container>
      </section>

      {/* --- STICKY FILTER BAR --- */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-6 shadow-sm">
        <Container className="px-4 flex flex-col lg:flex-row gap-6 items-end">
          <div className="w-full grid md:grid-cols-3 gap-6 flex-grow">
            {/* Step 1: Course Type */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-black uppercase tracking-widest text-gray-400 ml-1">1. Choose Stream</label>
              <SearchAndSelect
                name="courseType"
                setValue={setValue}
                placeholder="Select Type (e.g. NEET UG)"
                value={selectedType}
                onChange={({ selectedValue }) => {
                  setSelectedType(selectedValue)
                  setSelectedCourse(undefined)
                  clearErrors("courseType")
                  if (selectedValue.text === "NEET UG") getCoursesByType(selectedValue.text)
                  updateURL({ courseType: selectedValue.text, course: "" })
                }}
                control={control}
                defaultOption={{ id: courseType || "", text: courseType || "" }}
                options={predictorTypeList}
                wrapperClass="w-full"
                errors={errors}
              />
            </div>

            {/* Step 2: Course (Conditional) */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-black uppercase tracking-widest text-gray-400 ml-1">2. Select Degree</label>
              <SearchAndSelect
                name="course"
                setValue={setValue}
                placeholder={selectedType?.text === "NEET UG" ? "Select Course" : "Not Required"}
                value={selectedCourse}
                disabled={selectedType?.text !== "NEET UG"}
                onChange={({ selectedValue }) => {
                  setSelectedCourse(selectedValue)
                  clearErrors("course")
                  updateURL({ courseType: selectedType?.text || "", course: selectedValue.text })
                }}
                control={control}
                defaultOption={{ id: course || "", text: course || "" }}
                options={coursesList}
                loading={isCourseLoading}
                wrapperClass="w-full"
                errors={errors}
              />
            </div>

            {/* Step 3: Search State */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-black uppercase tracking-widest text-gray-400 ml-1">3. Find Region</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Type State Name..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-400 transition-all font-semibold text-slate-700"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* --- STATES GRID --- */}
      <section className="w-full py-12 bg-white min-h-[500px]">
        <Container className="px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence>
              {filteredStates.map((state, index) => {
                const isLocked = !selectedType?.text;
                return (
                  <motion.div
                    key={state.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <Link
                      href={buildRedirectURL(state)}
                      onClick={e => !validateSelection() && e.preventDefault()}
                      className={`group relative flex flex-col p-6 rounded-[2rem] border transition-all duration-300 ${
                        isLocked 
                        ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' 
                        : 'bg-white border-gray-100 hover:border-yellow-300 hover:shadow-[0_20px_40px_rgba(234,179,8,0.1)]'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-2xl transition-colors ${
                          state.popular ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-50 text-slate-400 group-hover:bg-yellow-500 group-hover:text-white'
                        }`}>
                          <MapPin size={20} />
                        </div>
                        {state.popular && (
                          <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg">Popular</span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-yellow-600 transition-colors">
                        {state.name}
                      </h3>
                      <p className="text-xs font-bold text-gray-400 uppercase mt-1 tracking-wider">
                        {selectedType?.text || "Select Stream"} Data
                      </p>

                      <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="text-sm font-bold text-slate-600">View Ranks</span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-all">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {!filteredStates.length && (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <p className="text-gray-400 text-lg font-medium">No regions found matching your search.</p>
              <button onClick={() => setSearchQuery("")} className="mt-4 text-yellow-600 font-bold hover:underline">Clear Search</button>
            </div>
          )}

          {/* --- COUNSELING CTA --- */}
          <div className="mt-20 relative bg-slate-900 rounded-[3rem] p-10 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">Complex Cut-off Analytics? <br /><span className="text-yellow-400 font-medium">Talk to an Expert.</span></h3>
                <p className="text-slate-400 text-lg">Skip the guesswork. Get a personalized roadmap for your NEET score from our senior counselors.</p>
              </div>
              <Link
                href="https://wa.me/919028009835"
                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 transition-all transform hover:-translate-y-1 shadow-2xl shadow-yellow-500/20 whitespace-nowrap"
              >
                <Users size={22} /> Book Counseling Session
              </Link>
            </div>
          </div>
        </Container>
      </section>
      
      <SignInPopup />
    </FELayout>
  )
}